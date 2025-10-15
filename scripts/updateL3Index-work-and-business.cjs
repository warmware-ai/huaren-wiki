/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const DOCS_ROOT = path.resolve(process.cwd(), 'docs', 'work-and-business');

// 需要处理的 L3 目录（与你现有结构一致）
const L3_DIRS = [
  'employee-system',
  'self-employment',
  'enterprise-system',
  'employment-and-startup-support',
];

function readJsonSafe(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return null;
  }
}

function getL3Meta(dir) {
  const p = path.join(dir, '_category_.json');
  const data = readJsonSafe(p) || {};
  return {
    label: data.label || path.basename(dir),
    description:
      data.description ||
      '（自動生成）本頁列出此主題下的操作指南（L4）。',
  };
}

function getL4Items(l3Dir) {
  if (!fs.existsSync(l3Dir)) return [];
  const children = fs
    .readdirSync(l3Dir, { withFileTypes: true })
    .filter(
      (d) =>
        d.isDirectory() &&
        d.name !== '.git' &&
        d.name !== 'node_modules' &&
        !d.name.startsWith('.')
    )
    .map((d) => d.name);

  // 仅保留包含 _category_.json 的子目录（确认为 L4）
  const items = [];
  for (const name of children) {
    const cat = path.join(l3Dir, name, '_category_.json');
    const idx = path.join(l3Dir, name, 'index.md');
    if (fs.existsSync(cat) && fs.existsSync(idx)) {
      const meta = readJsonSafe(cat) || {};
      items.push({
        slug: name,
        label: meta.label || name,
        position: typeof meta.position === 'number' ? meta.position : 9999,
        // 可选：也可以把 meta.description 填入行内描述
        description: meta.description || '',
      });
    }
  }

  // 按 position 再按 label 排序
  items.sort((a, b) => {
    if (a.position !== b.position) return a.position - b.position;
    return a.label.localeCompare(b.label, 'zh-Hant');
  });

  return items;
}

function buildIndexMd({ title, description, items }) {
  // 生成安全的 YAML front matter（全部双引号）
  const fmTitle = title.replace(/"/g, '\\"');
  const fmDesc = description.replace(/"/g, '\\"');

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

  // 目录列表（每项一个链接；如需追加简述可在后面加“— 描述”）
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
  for (const l3 of L3_DIRS) {
    const l3Dir = path.join(DOCS_ROOT, l3);
    if (!fs.existsSync(l3Dir)) {
      console.warn('SKIP (not found):', l3Dir);
      continue;
    }
    const meta = getL3Meta(l3Dir);
    const items = getL4Items(l3Dir);
    const md = buildIndexMd({
      title: meta.label,
      description: meta.description,
      items,
    });
    const indexPath = path.join(l3Dir, 'index.md');
    writeFile(indexPath, md);
  }
  console.log('\n✅ L3 index pages updated.');
}

run();
