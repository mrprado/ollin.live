// One-time extraction of the base64 images embedded in the legacy ollin html.html
// single-file site into real files under public/images/. Run with:
//   node scripts/extract-images.js
//
// Order of appearance in the source file (confirmed by audit) maps 1:1 to these
// names. MIME type is verified from the actual decoded bytes, not trusted from
// the data: URI header, because two of the ten (texture, shell) are mislabeled
// image/png in the source while actually containing JPEG bytes.

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', '..', '..', 'Ollin.bio', 'ollin html.html');
const OUT_DIR = path.join(__dirname, '..', 'public', 'images');

const NAMES = [
  'hero-pyramid',
  'texture',
  'serpent-divider',
  'calendar',
  'shell',
  'alan-portrait',
  'teacher-tonawaka-kwauhtlinxan',
  'teacher-sri-yuganandanatha',
  'teacher-tjok-gde-kerthyasa',
  'teacher-ashan-vipin-das'
];

function sniffExt(buf) {
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg';
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'png';
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return 'gif';
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46) return 'webp';
  return 'bin';
}

function main() {
  const html = fs.readFileSync(SRC, 'utf8');
  const re = /data:image\/[a-zA-Z0-9.+-]+;base64,([A-Za-z0-9+/=]+)/g;
  const matches = [...html.matchAll(re)];

  console.log(`Found ${matches.length} base64 image data URIs (expected 10).`);
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const manifest = [];
  matches.forEach((m, i) => {
    const declared = m[0].slice(5, m[0].indexOf(';'));
    const buf = Buffer.from(m[1], 'base64');
    const ext = sniffExt(buf);
    const name = NAMES[i] || `image-${i + 1}`;
    const filename = `${name}.${ext}`;
    fs.writeFileSync(path.join(OUT_DIR, filename), buf);
    const mismatch = !declared.includes(ext === 'jpg' ? 'jpeg' : ext);
    manifest.push({ index: i, name, declared, actualExt: ext, bytes: buf.length, mismatch });
    console.log(
      `[${i}] ${filename} — declared ${declared}, actual ${ext}, ${buf.length} bytes` +
        (mismatch ? '  <-- MIME MISMATCH FIXED' : '')
    );
  });

  fs.writeFileSync(
    path.join(OUT_DIR, '_extraction-manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  console.log(`\nDone. Files written to ${OUT_DIR}`);
}

main();
