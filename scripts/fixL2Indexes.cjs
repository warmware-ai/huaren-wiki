// scripts/fixL2Indexes.cjs
const fs = require('fs');
const path = require('path');

const DOCS = path.join(process.cwd(), 'docs');

// 安全讀 JSON（UTF-8）
function readJsonSafe(p) {
  try {
    const raw = fs.readFileSync(p, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

// 生成 L2 index.md 的模板（用 category label 做標題）
function makeIndexMd(title, relDir) {
  // relDir 例如: life-and-settlement/housing-and-rent
  return `---
title: ${title}
slug: /docs/${relDir}/
---

本頁為 **${title}** 的目錄與導言。  
請從左側目錄選擇具體主題；若你正在編輯內容，建議在本頁補充 L3 導航或常見問題的索引。

> 提示：本目錄會隨目錄結構（_category_.json）自動生成與維護。
`;
}

function ensureL2Index(dirAbs, relDir) {
  const indexPath = path.join(dirAbs, 'index.md');
  const catPath = path.join(dirAbs, '_category_.json');

  // 只處理存在 category 的資料夾（L2/L3 都可覆蓋，但我們關心 L2）
  if (!fs.existsSync(catPath)) return;

  // 讀 label 用於標題
  const cat = readJsonSafe(catPath);
  const title = (cat && cat.label) ? cat.label : path.basename(dirAbs);

  // 生成 index.md（不存在才寫；若存在保留人工內容）
  if (!fs.existsSync(indexPath)) {
    const md = makeIndexMd(title, relDir);
    fs.writeFileSync(indexPath, md, 'utf8');
    console.log(`✔ Created index.md -> ${relDir}/index.md`);
  } else {
    console.log(`• Skip (exists) -> ${relDir}/index.md`);
  }

  // 確保 _category_.json 帶 link: {type:'doc', id:'<rel>/index'}
  const wantId = `${relDir}/index`;
  let changed = false;
  if (!cat) {
    console.warn(`! Invalid JSON -> ${relDir}/_category_.json (skip link fix)`);
    return;
  }
  if (!cat.link) {
    cat.link = { type: 'doc', id: wantId };
    changed = true;
  } else {
    if (cat.link.type !== 'doc') { cat.link.type = 'doc'; changed = true; }
    if (cat.link.id !== wantId) { cat.link.id = wantId; changed = true; }
  }
  if (changed) {
    fs.writeFileSync(catPath, JSON.stringify(cat, null, 2), 'utf8');
    console.log(`✔ Fixed link.id in _category_.json -> ${wantId}`);
  }
}

function walk(dirAbs, rel = '') {
  const entries = fs.readdirSync(dirAbs, { withFileTypes: true });
  for (const ent of entries) {
    if (!ent.isDirectory()) continue;
    const subAbs = path.join(dirAbs, ent.name);
    const subRel = rel ? path.join(rel, ent.name) : ent.name;
    // 對所有子資料夾執行（L2/L3 都會補 index + link，不破壞已有）
    ensureL2Index(subAbs, subRel.replaceAll(path.sep, '/'));
    walk(subAbs, subRel);
  }
}

// main
if (!fs.existsSync(DOCS)) {
  console.error('docs/ not found. Run from project root.');
  process.exit(1);
}

walk(DOCS);
console.log('\nDone. Now run: npm run start  (or build/serve)');
