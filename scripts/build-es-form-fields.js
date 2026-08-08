const fs = require('fs');
const path = require('path');

const dict = JSON.parse(fs.readFileSync(path.join(__dirname, 'i18n-source-dict.json'), 'utf8'));
const en = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'lib', 'inquiryFormFields.en.json'), 'utf8'));

const misses = [];
function lookup(text, keyPath) {
  if (Object.prototype.hasOwnProperty.call(dict, text)) return dict[text];
  misses.push({ path: keyPath, text });
  return text;
}

const es = {};
for (const [formKey, fields] of Object.entries(en)) {
  es[formKey] = fields.map((f, i) => {
    const out = { ...f };
    out.label = lookup(f.label, `${formKey}[${i}].label`);
    if (f.placeholder) out.placeholder = lookup(f.placeholder, `${formKey}[${i}].placeholder`);
    if (f.options) out.options = f.options.map((o, j) => lookup(o, `${formKey}[${i}].options[${j}]`));
    return out;
  });
}

fs.writeFileSync(
  path.join(__dirname, '..', 'lib', 'inquiryFormFields.es.json'),
  JSON.stringify(es, null, 2) + '\n'
);

console.log(`Built inquiryFormFields.es.json. ${misses.length} unmatched strings:`);
misses.forEach((m) => console.log(`  [${m.path}] "${m.text}"`));
