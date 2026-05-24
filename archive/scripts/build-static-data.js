// Generates static JSON files at api/*.json for endpoints that exist on the dev server
// but need to work on static hosting (Netlify). Re-run this whenever the data changes:
//   node scripts/build-static-data.js
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const apiDir = path.join(root, 'api');
fs.mkdirSync(apiDir, { recursive: true });

// --- diary ---
const diaryDir = path.join(root, 'diary');
const diaryEntries = fs.readdirSync(diaryDir)
  .filter(f => f.endsWith('.md'))
  .sort()
  .reverse()
  .map(filename => {
    const slug = filename.replace('.md', '');
    const content = fs.readFileSync(path.join(diaryDir, filename), 'utf8');
    const m = slug.match(/^(\d{4})-(\d{2})-(\d{2})/);
    let displayDate = '';
    if (m) {
      const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
      displayDate = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    return { slug, displayDate, content };
  });
fs.writeFileSync(path.join(apiDir, 'diary.json'), JSON.stringify(diaryEntries));
console.log(`wrote api/diary.json (${diaryEntries.length} entries)`);

// --- bot requests ---
const botBaseDir = path.join(root, 'bot-requests', 'img');
const imgExts = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);
const botResults = [];
function walkBots(dir) {
  for (const entry of fs.readdirSync(dir)) {
    if (entry.startsWith('.')) continue;
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walkBots(full);
    else if (imgExts.has(path.extname(entry).toLowerCase())) {
      botResults.push('bot-requests/img/' + path.relative(botBaseDir, full));
    }
  }
}
walkBots(botBaseDir);
fs.writeFileSync(path.join(apiDir, 'bot-requests.json'), JSON.stringify(botResults));
console.log(`wrote api/bot-requests.json (${botResults.length} images)`);

// --- found images ---
const foundDir = path.join(root, 'img', 'found images');
const foundFiles = fs.existsSync(foundDir)
  ? fs.readdirSync(foundDir)
      .filter(f => !f.startsWith('.') && imgExts.has(path.extname(f).toLowerCase()))
      .map(f => 'img/found images/' + f)
  : [];
fs.writeFileSync(path.join(apiDir, 'found-images.json'), JSON.stringify(foundFiles));
console.log(`wrote api/found-images.json (${foundFiles.length} images)`);
