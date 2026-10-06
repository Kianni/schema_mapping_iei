// Run after editing report assets, before committing/publishing docs/.
// Relative URLs work both locally and under a GitHub Pages project path.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const docs = path.resolve(__dirname, '../docs');
const assets = ['styles.css', 'data.js', 'comparison.js', 'i18n.js', 'data.en.js', 'app.js'];
const indexPath = path.join(docs, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

for (const asset of assets) {
  // Normalise line endings so Git's CRLF/LF conversion does not change versions.
  const content = fs.readFileSync(path.join(docs, asset), 'utf8').replace(/\r\n/g, '\n');
  const version = crypto.createHash('sha256').update(content).digest('hex').slice(0, 12);
  const escapedName = asset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const reference = new RegExp(`((?:src|href)=")${escapedName}(?:\\?[^"\\s]*)?("\\s*[^>]*>)`, 'g');
  let references = 0;
  html = html.replace(reference, (_, prefix, suffix) => {
    references += 1;
    return `${prefix}${asset}?v=${version}${suffix}`;
  });
  if (references !== 1) throw new Error(`Expected one reference to ${asset}, found ${references}`);
}

if (html !== fs.readFileSync(indexPath, 'utf8')) {
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('Updated content versions for all six report assets.');
} else {
  console.log('Report asset versions are already current.');
}
