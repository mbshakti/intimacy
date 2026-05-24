// Generate ElevenLabs TTS audio for narrative diary entries.
// On-demand only. Will NOT regenerate an existing mp3 unless --force is passed.
//
// Usage:
//   node scripts/generate-diary-vo.js              # generate any missing
//   node scripts/generate-diary-vo.js --force      # regenerate all
//   node scripts/generate-diary-vo.js --only=2026-05-08,2026-04-09
//
// Reads diary/*.md, strips markdown, sends to ElevenLabs, writes diary vo/<slug>.mp3.

require('dotenv').config();
const fs = require('fs');
const path = require('path');

const VOICE_ID = process.env.ELEVENLABS_VOICE_ID;
const API_KEY  = process.env.ELEVENLABS_API_KEY;
const ROOT     = path.join(__dirname, '..');
const DIARY    = path.join(ROOT, 'diary');
const VO_DIR   = path.join(ROOT, 'diary vo');

// Slugs that should NOT get audio generated:
//  - Delta V.O. transcripts (her own voice, separate treatment)
//  - houellebecq (text quote, not narrative)
const SKIP = new Set(['2023-08-06', '2025-12-22-delta', 'houellebecq']);

function stripMarkdown(text) {
  return text
    .replace(/^#{1,6}\s+/gm, '')        // headings
    .replace(/\*\*(.*?)\*\*/g, '$1')    // bold
    .replace(/\*(.*?)\*/g, '$1')        // italic
    .replace(/^\s*[-*]\s+/gm, '')       // bullet markers
    .replace(/^\s*\d+\.\s+/gm, '')      // ordered list markers
    .trim();
}

async function ttsWithTimestamps(text) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/with-timestamps`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
      'accept': 'application/json',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.55, similarity_boost: 0.75, style: 0.0, use_speaker_boost: true },
    }),
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`ElevenLabs ${res.status}: ${errBody}`);
  }
  return await res.json();
}

function alignmentToChunks(alignment, wordsPerChunk = 3) {
  const chars = alignment.characters;
  const starts = alignment.character_start_times_seconds;
  const ends = alignment.character_end_times_seconds;

  const words = [];
  let buf = '', bufStart = null, bufEnd = null;
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (/\s/.test(c)) {
      if (buf) { words.push({ text: buf, start: bufStart, end: bufEnd }); buf = ''; bufStart = null; }
    } else {
      if (!buf) bufStart = starts[i];
      buf += c;
      bufEnd = ends[i];
    }
  }
  if (buf) words.push({ text: buf, start: bufStart, end: bufEnd });

  const chunks = [];
  for (let i = 0; i < words.length; i += wordsPerChunk) {
    const slice = words.slice(i, i + wordsPerChunk);
    chunks.push({
      start: slice[0].start,
      end: slice[slice.length - 1].end,
      text: slice.map(w => w.text).join(' '),
    });
  }
  return chunks;
}

async function main() {
  if (!API_KEY || !VOICE_ID) {
    console.error('Missing ELEVENLABS_API_KEY or ELEVENLABS_VOICE_ID in .env');
    process.exit(1);
  }

  const force   = process.argv.includes('--force');
  const onlyArg = process.argv.find(a => a.startsWith('--only='));
  const only    = onlyArg ? new Set(onlyArg.split('=')[1].split(',')) : null;

  fs.mkdirSync(VO_DIR, { recursive: true });

  const files = fs.readdirSync(DIARY).filter(f => f.endsWith('.md')).sort();
  let generated = 0, skipped = 0;

  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    if (SKIP.has(slug))            { console.log(`skip ${slug} (excluded)`);    skipped++; continue; }
    if (only && !only.has(slug))   { continue; }

    const out = path.join(VO_DIR, `${slug}.mp3`);
    const captionsOut = path.join(VO_DIR, `${slug}.json`);
    if (fs.existsSync(out) && fs.existsSync(captionsOut) && !force) {
      console.log(`skip ${slug} (already exists)`);
      skipped++;
      continue;
    }

    const md   = fs.readFileSync(path.join(DIARY, file), 'utf8');
    const text = stripMarkdown(md);
    if (!text) { console.log(`skip ${slug} (empty)`); skipped++; continue; }

    process.stdout.write(`generating ${slug} (${text.length} chars)... `);
    const result = await ttsWithTimestamps(text);
    const audio = Buffer.from(result.audio_base64, 'base64');
    fs.writeFileSync(out, audio);
    const chunks = alignmentToChunks(result.alignment, 3);
    fs.writeFileSync(captionsOut, JSON.stringify({ chunks }));
    console.log(`${audio.length} bytes, ${chunks.length} caption chunks`);
    generated++;
  }

  console.log(`\ndone. generated ${generated}, skipped ${skipped}`);
}

main().catch(e => { console.error(e); process.exit(1); });
