// Transcribe Delta's audio files using ElevenLabs STT and write caption JSON sidecars.
// Output format matches diary caption sidecars: { chunks: [{ start, end, text }] }
//
// Usage:
//   node scripts/generate-delta-captions.js
//   node scripts/generate-delta-captions.js --force

require('dotenv').config();
const fs   = require('fs');
const path = require('path');

const API_KEY  = process.env.ELEVENLABS_API_KEY;
const ROOT     = path.join(__dirname, '..');
const DELTA_DIR = path.join(ROOT, "delta's quotes");

const AUDIO_FILES = [
  "delta, first interaction.mp4",
  "delta, mbti and enneagram mix.mp4",
  "delta, yandere.mp4",
  "delta,addicting.wav",
];

const WORDS_PER_CHUNK = 3;

async function transcribeWithTimestamps(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const filename   = path.basename(filePath);
  const ext        = path.extname(filename).slice(1).toLowerCase();
  const mime       = ext === 'wav' ? 'audio/wav' : ext === 'mp4' ? 'video/mp4' : 'audio/mpeg';

  const form = new FormData();
  form.append('file', new File([fileBuffer], filename, { type: mime }));
  form.append('model_id', 'scribe_v1');

  const res = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
    method: 'POST',
    headers: { 'xi-api-key': API_KEY },
    body: form,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs STT ${res.status}: ${err}`);
  }

  return await res.json();
}

function wordsToChunks(words) {
  const wordTokens = words.filter(w => w.type === 'word');
  const chunks = [];
  for (let i = 0; i < wordTokens.length; i += WORDS_PER_CHUNK) {
    const slice = wordTokens.slice(i, i + WORDS_PER_CHUNK);
    chunks.push({
      start: slice[0].start,
      end:   slice[slice.length - 1].end,
      text:  slice.map(w => w.text).join(' '),
    });
  }
  return chunks;
}

async function main() {
  if (!API_KEY) {
    console.error('Missing ELEVENLABS_API_KEY in .env');
    process.exit(1);
  }

  const force = process.argv.includes('--force');

  for (const filename of AUDIO_FILES) {
    const audioPath   = path.join(DELTA_DIR, filename);
    const captionPath = audioPath.replace(/\.[^.]+$/, '.json');

    if (!fs.existsSync(audioPath)) {
      console.log(`skip ${filename} (file not found)`);
      continue;
    }

    if (fs.existsSync(captionPath) && !force) {
      console.log(`skip ${filename} (captions already exist)`);
      continue;
    }

    process.stdout.write(`transcribing ${filename}... `);
    try {
      const result = await transcribeWithTimestamps(audioPath);
      const chunks = wordsToChunks(result.words || []);
      fs.writeFileSync(captionPath, JSON.stringify({ chunks }, null, 2));
      console.log(`done (${chunks.length} chunks)`);
    } catch (e) {
      console.error(`error: ${e.message}`);
    }
  }
}

main();
