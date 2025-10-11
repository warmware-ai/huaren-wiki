const fs = require('fs');
const path = require('path');

const DOCS = path.resolve(__dirname, '..', 'docs');

function walk(dir) {
  const ents = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of ents) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.isFile() && e.name === '_category_.json') fixCategory(full);
  }
}

function fixCategory(catPath) {
  const dir = path.dirname(catPath);
  const indexMd = path.join(dir, 'index.md');
  if (!fs.existsSync(indexMd)) return;

  // 计算 docs 相对 id
  const rel = path.posix.join(...path.relative(DOCS, dir).split(path.sep));
  const id = rel === '' ? 'index' : `${rel}/index`;

  let json;
  try {
    const raw = fs.readFileSync(catPath, 'utf8');
    json = JSON.parse(raw);
  } catch (e) {
    console.error('JSON parse failed:', catPath, e.message);
    return;
  }
  if (!json.link) json.link = { type: 'doc', id };
  else { json.link.type = 'doc'; json.link.id = id; }

  fs.writeFileSync(catPath, JSON.stringify(json, null, 2), 'utf8');
  console.log('OK  ->', id, ' [', catPath, ']');
}

function removeSlugLines() {
  const files = [];
  (function walkMd(dir) {
    const ents = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of ents) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walkMd(full);
      else if (e.isFile() && e.name.endsWith('.md')) files.push(full);
    }
  })(DOCS);

  const re = /^[ \t]*slug:\s*\/\s*$/m;
  for (const f of files) {
    const raw = fs.readFileSync(f, 'utf8');
    if (re.test(raw)) {
      const out = raw.replace(/^[ \t]*slug:\s*\/\s*\r?\n/mg, '');
      fs.writeFileSync(f, out, 'utf8');
      console.log('Clean slug:', f);
    }
  }
}

removeSlugLines();
walk(DOCS);
console.log('Done.');
