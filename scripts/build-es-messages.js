// Builds messages/es.json from messages/en.json by looking up every leaf
// string against the already-approved EN->ES dictionary extracted from the
// legacy site (scripts/i18n-source-dict.json). Never invents a translation;
// any leaf string with no exact match is reported and left in English so it
// is easy to spot and fix by hand rather than silently mistranslated.
const fs = require('fs');
const path = require('path');

const dict = JSON.parse(fs.readFileSync(path.join(__dirname, 'i18n-source-dict.json'), 'utf8'));
const en = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'messages', 'en.json'), 'utf8'));

const misses = [];

function translate(node, keyPath) {
  if (typeof node === 'string') {
    if (Object.prototype.hasOwnProperty.call(dict, node)) {
      return dict[node];
    }
    misses.push({ path: keyPath, text: node });
    return node; // fallback: leave English in place, flagged above
  }
  if (Array.isArray(node)) {
    return node.map((item, i) => translate(item, `${keyPath}[${i}]`));
  }
  if (node && typeof node === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      out[k] = translate(v, keyPath ? `${keyPath}.${k}` : k);
    }
    return out;
  }
  return node;
}

const es = translate(en, '');

fs.writeFileSync(
  path.join(__dirname, '..', 'messages', 'es.json'),
  JSON.stringify(es, null, 2) + '\n'
);

console.log(`Built messages/es.json. ${misses.length} unmatched strings:`);
misses.forEach((m) => console.log(`  [${m.path}] "${m.text}"`));
