/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const DOCS_ROOT = path.resolve(process.cwd(), 'docs', 'work-and-business');

// 已有的 L2 目录（不改动它们的 index.md）
const L2_DIRS = [
  'employee-system',
  'self-employment',
  'enterprise-system',
  'employment-and-startup-support',
];

function readJsonSafe(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

function listSubDirs(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.') && d.name !== 'node_modules')
    .map((d) => path.join(dir, d.name));
}

// 读取某目录自身的分类元信息（用作 L3 index 的标题/描述）
function getCategoryMeta(dir) {
  const cat = path.join(dir, '_category_.json');
  const data = readJsonSafe(cat) || {};
  return {
    label: data.label || path.basename(dir),
    description: data.description || '（自動生成）本頁列出此主題下的操作指南（L4）。',
  };
}

// 读取该 L3 目录下的 L4 子项（有 _category_.json + index.md 的子目录）
function getL4Items(l3Dir) {
  const subDirs = listSubDirs(l3Dir);
  const items = [];

  for (const d of subDirs) {
    const cat = path.join(d, '_category_.json');
    const idx = path.join(d, 'index.md');
    if (fs.existsSync(cat) && fs.existsSync(idx)) {
      const meta = readJsonSafe(cat) || {};
      items.push({
        slug: path.basename(d),
        label: meta.label || path.basename(d),
        position: typeof meta.position === 'number' ? meta.position : 9999,
        description: meta.description || '',
      });
    }
  }

  // 排序：position 优先，其次按标题
  items.sort((a, b) => {
    if (a.position !== b.position) return a.position - b.position;
    return a.label.localeCompare(b.label, 'zh-Hant');
  });

  return items;
}

function buildIndexMd({ title, description, items }) {
  const fmTitle = String(title).replace(/"/g, '\\"');
  const fmDesc = String(description).replace(/"/g, '\\"');

  const lines = [];
  lines.push('---');
  lines.push('id: "index"');
  lines.push(`title: "${fmTitle}"`);
  lines.push(`description: "${fmDesc}"`);
  lines.push('---');
  lines.push('');
  lines.push('> 本頁為 **Level-3 目錄**。點擊進入具體操作指南（L4）。');
  lines.push('');

  if (items.length === 0) {
    lines.push('_（尚無子條目，後續將補充）_');
    lines.push('');
    return lines.join('\n');
  }

  for (const it of items) {
    lines.push(`- [${it.label}](./${it.slug}/)`);
  }
  lines.push('');
  return lines.join('\n');
}

function writeFile(fp, content) {
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, content, 'utf8');
  console.log('WRITE:', path.relative(process.cwd(), fp));
}

function run() {
  for (const l2 of L2_DIRS) {
    const l2Dir = path.join(DOCS_ROOT, l2);
    if (!fs.existsSync(l2Dir)) {
      console.warn('SKIP L2 (not found):', l2Dir);
      continue;
    }

    // 扫描 L3：L2 下的子目录（要求其内有 _category_.json + index.md）
    const l3Dirs = listSubDirs(l2Dir).filter((d) =>
      fs.existsSync(path.join(d, '_category_.json')) &&
      fs.existsSync(path.join(d, 'index.md'))
    );

    for (const l3Dir of l3Dirs) {
      const meta = getCategoryMeta(l3Dir);
      const items = getL4Items(l3Dir);
      const md = buildIndexMd({
        title: meta.label,
        description: meta.description,
        items,
      });
      writeFile(path.join(l3Dir, 'index.md'), md);
    }
  }

  console.log('\n✅ L3 index pages updated (L2 untouched).');
}

run();
