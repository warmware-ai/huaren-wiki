// scripts/fixStudyEducationCategoryLinks.cjs
// Fix _category_.json under docs/study-education:
// - If link.type === 'doc' and link.id lacks the 'study-education/' prefix,
//   prepend it so Docusaurus can resolve the doc ID.
// - Preserve pretty JSON and write with CRLF for Windows.

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const TARGET_DIR = path.join(ROOT, 'docs', 'study-education');
const CRLF = '\r\n';

function walk(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.isFile() && e.name === '_category_.json') out.push(p);
  }
  return out;
}

function fixFile(fp) {
  let raw = fs.readFileSync(fp, 'utf8');
  let json;
  try {
    json = JSON.parse(raw);
  } catch (e) {
    console.warn('! skip invalid JSON:', path.relative(ROOT, fp));
    return false;
  }

  let changed = false;
  if (
    json.link &&
    json.link.type === 'doc' &&
    typeof json.link.id === 'string' &&
    !json.link.id.startsWith('study-education/')
  ) {
    json.link.id = 'study-education/' + json.link.id.replace(/^\/+/, '');
    changed = true;
  }

  if (changed) {
    const pretty = JSON.stringify(json, null, 2).replace(/\n/g, CRLF) + CRLF;
    fs.writeFileSync(fp, pretty, 'utf8');
    console.log('FIX:', path.relative(ROOT, fp), '->', json.link.id);
  }
  return changed;
}

(function run() {
  if (!fs.existsSync(TARGET_DIR)) {
    console.error('Not found:', TARGET_DIR);
    process.exit(1);
  }
  const files = walk(TARGET_DIR);
  let count = 0;
  files.forEach((f) => (count += fixFile(f) ? 1 : 0));
  console.log(`✅ Done. Updated ${count} file(s).`);
})();
