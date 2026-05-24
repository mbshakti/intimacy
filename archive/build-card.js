// Builds character-data/judgemental_priest.card.png — a real V2 character card.
// Pure-Node PNG generation. The character JSON is base64-encoded into a tEXt chunk
// with keyword "chara" (chara_card_v2 spec, readable by SillyTavern / Chub / Risu).

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xFF];
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

const W = 360, H = 540;

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8;
ihdr[9] = 2;
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;

const BG     = [0x11, 0x0B, 0x11];
const SURF   = [0x1B, 0x13, 0x1C];
const PINK   = [0xFF, 0x8A, 0xF7];
const FRAME  = [0x2A, 0x21, 0x2D];

const stride = 1 + W * 3;
const raw = Buffer.alloc(stride * H);

for (let y = 0; y < H; y++) {
  raw[y * stride] = 0;
  for (let x = 0; x < W; x++) {
    let c = BG;

    if (x < 1 || x >= W - 1 || y < 1 || y >= H - 1) c = FRAME;

    const padX = 24, padY = 24;
    if (x === padX || x === W - padX - 1 || y === padY || y === H - padY - 1) {
      if (x >= padX && x <= W - padX - 1 && y >= padY && y <= H - padY - 1) c = FRAME;
    }

    const cx = W / 2, cy = H / 2;
    const armW = 6, armLen = 36;
    const inVert = Math.abs(x - cx) < armW / 2 && Math.abs(y - cy + 4) < armLen;
    const inHorz = Math.abs(y - (cy - 14)) < armW / 2 && Math.abs(x - cx) < armLen / 2;
    if (inVert || inHorz) c = PINK;

    const off = y * stride + 1 + x * 3;
    raw[off]     = c[0];
    raw[off + 1] = c[1];
    raw[off + 2] = c[2];
  }
}

const compressed = zlib.deflateSync(raw);

const src = JSON.parse(fs.readFileSync(path.join(__dirname, 'character-data/judgemental_priest.json'), 'utf8'));

const description = [
  src.appearance,
  '',
  src.description,
  '',
  `[Likes: ${src.likes.join(', ')}]`,
  `[Dislikes: ${src.dislikes.join(', ')}]`,
  `[Fears: ${src.fears.join(', ')}]`,
  `[MBTI: ${src.mbti} | Enneagram: ${src.enneagram} | Dere: ${src.dereType}]`
].join('\n');

const personality = src.personality.map(p => `- ${p}`).join('\n');
const mes_example = src.exampleDialogue.map(d => `<START>\n${d}`).join('\n');

const v2 = {
  spec: 'chara_card_v2',
  spec_version: '2.0',
  data: {
    name: src.name,
    description,
    personality,
    scenario: 'A confessional booth. Dim, incense-heavy. Father Michael waits for {{user}} on the other side of the screen.',
    first_mes: src.firstMessage,
    mes_example,
    creator_notes: 'OC. From the desktop-voyeur archive.',
    system_prompt: '',
    post_history_instructions: '',
    alternate_greetings: [],
    tags: ['OC', 'priest', 'himedere', 'ISTJ', '1w2', 'religious', 'moralistic', 'judgemental', 'SFW'],
    creator: 'shakti',
    character_version: '1.0',
    extensions: {
      talkativeness: '0.5',
      fav: false,
      world: '',
      depth_prompt: { prompt: '', depth: 4 }
    }
  }
};

const v2Json = JSON.stringify(v2, null, 2);
const charaB64 = Buffer.from(v2Json, 'utf8').toString('base64');

const textData = Buffer.concat([
  Buffer.from('chara', 'ascii'),
  Buffer.from([0x00]),
  Buffer.from(charaB64, 'ascii')
]);

const sig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

const png = Buffer.concat([
  sig,
  chunk('IHDR', ihdr),
  chunk('tEXt', textData),
  chunk('IDAT', compressed),
  chunk('IEND', Buffer.alloc(0))
]);

const outPath = path.join(__dirname, 'character-data/judgemental_priest.card.png');
fs.writeFileSync(outPath, png);

console.log(`wrote ${outPath}`);
console.log(`png size: ${png.length} bytes  •  embedded JSON: ${v2Json.length} chars  •  base64: ${charaB64.length} chars`);
