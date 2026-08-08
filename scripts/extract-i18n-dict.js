// One-time extraction of the legacy I18N EN->ES flat dictionary from
// ollin html.html into a plain JSON file we can programmatically look up
// against while building next-intl message files, so every Spanish string
// we ship is the already-approved translation, never a fresh one.
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', '..', '..', 'Ollin.bio', 'ollin html.html');
const html = fs.readFileSync(SRC, 'utf8');

const marker = 'var I18N = ';
const start = html.indexOf(marker);
if (start === -1) throw new Error('I18N marker not found');
const objStart = start + marker.length;
// find matching end: the declaration ends with `};\nvar I18N_REV`
const endMarker = '};\nvar I18N_REV';
const end = html.indexOf(endMarker, objStart);
if (end === -1) throw new Error('I18N end marker not found');
const objText = html.slice(objStart, end + 1); // include closing }

const dict = JSON.parse(objText);
const keys = Object.keys(dict);
console.log(`Parsed ${keys.length} I18N pairs.`);

fs.writeFileSync(
  path.join(__dirname, 'i18n-source-dict.json'),
  JSON.stringify(dict, null, 2)
);
console.log('Written to scripts/i18n-source-dict.json');
