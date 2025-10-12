// scripts/fixFrontMatter.cjs
// 修复 Docusaurus Markdown front matter（专治 “Error while parsing Markdown front matter” ）
// 用法：node scripts/fixFrontMatter.cjs [--eol=crlf|lf] [--root=docs]

const fs = require('fs');
const path = require('path');
const os = require('os');

const args = Object.fromEntries(
  process.argv.slice(2).map(s => {
    const m = s.match(/^--([^=]+)=(.*)$/);
    return m ? [m[1], m[2]] : [s.replace(/^--/, ''), true];
  })
);

const DOCS_ROOT = path.resolve(args.root || 'docs');
const EOL =
  args.eol === 'crlf' ? '\r\n' :
  args.eol === 'lf'   ? '\n'    :
  (os.platform() === 'win32' ? '\r\n' : '\n');

const TARGET_BASENAME = 'index.md';
const HEAD_SCAN_LINES = 30;

// 递归获取 docs 下所有 index.md
function getAllIndexFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...getAllIndexFiles(full));
    else if (entry.isFile() && entry.name.toLowerCase() === TARGET_BASENAME) out.push(full);
  }
  return out;
}

function ensureQuoted(val) {
  if (val == null) return '""';
  const trimmed = String(val).trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) return trimmed; // 已带引号
  // 转义内部双引号
  const escaped = trimmed.replace(/"/g, '\\"');
  return `"${escaped}"`;
}

function extractFrontMatter(raw) {
  // 仅当文件开头就是 ---\n 才视为已有 front matter
  const fmStart = raw.indexOf('---');
  if (fmStart !== 0) return { fmText: null, body: raw };

  // 找到第二个分隔线
  const rest = raw.slice(3);
  const second = rest.indexOf('\n---');
  if (second === -1) {
    // 兼容 \r\n
    const secondCRLF = rest.indexOf('\r\n---');
    if (secondCRLF === -1) return { fmText: null, body: raw };
    const fmText = rest.slice(0, secondCRLF);
    const body = rest.slice(secondCRLF + 5); // \r\n---
    return { fmText, body: body.replace(/^\r?\n/, '') };
  } else {
    const fmText = rest.slice(0, second);
    const body = rest.slice(second + 4); // \n---
    return { fmText, body: body.replace(/^\r?\n/, '') };
  }
}

function parseFmLines(fmText) {
  // 非严格 YAML，只做 key: value 行的简单解析，保留原行顺序
  // 返回：{ entries: Array<{ key, rawLine, value, idx }>, lines: string[] }
  const lines = (fmText || '').split(/\r?\n/);
  const entries = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(/^\s*([A-Za-z0-9_-]+)\s*:\s*(.*)\s*$/);
    if (m) {
      entries.push({ key: m[1], value: m[2], rawLine: line, idx: i });
    }
  }
  return { entries, lines };
}

function setOrAddKey(parsed, key, value) {
  const { entries, lines } = parsed;
  const found = entries.find(e => e.key === key);
  const safe = `${key}: ${value}`;
  if (found) {
    lines[found.idx] = safe;
  } else {
    lines.push(safe);
  }
}

function buildFrontMatterBlock(lines) {
  // 去除首尾空行
  while (lines.length && /^\s*$/.test(lines[0])) lines.shift();
  while (lines.length && /^\s*$/.test(lines[lines.length - 1])) lines.pop();
  return ['---', ...lines, '---'].join(EOL) + EOL + EOL;
}

function tryExtractLooseHeadFields(raw) {
  // 在文件前 N 行里尝试抓取孤立的 id/title/description 行
  const lines = raw.split(/\r?\n/);
  const head = lines.slice(0, Math.min(HEAD_SCAN_LINES, lines.length)).join('\n');
  const pick = (k) => {
    const m = head.match(new RegExp(`^\\s*${k}\\s*:\\s*(.+)\\s*$`, 'm'));
    return m ? m[1] : null;
  };
  const id = pick('id');
  const title = pick('title');
  const description = pick('description');

  // 从 head 中移除这些行
  let newHead = head;
  for (const k of ['id', 'title', 'description']) {
    newHead = newHead.replace(new RegExp(`^\\s*${k}\\s*:\\s*.+\\s*\\r?\\n`, 'm'), '');
  }
  const rest = lines.slice(Math.min(HEAD_SCAN_LINES, lines.length)).join('\n');
  const newRaw = newHead + (newHead.endsWith('\n') ? '' : '\n') + rest;
  return { id, title, description, newRaw };
}

function guessTitleFromBody(body, fallback) {
  const m = body.match(/^\s*#\s+(.+)\s*$/m);
  if (m) return m[1].trim();
  if (fallback) return fallback;
  return '占位頁';
}

function fixOneFile(file) {
  let raw = fs.readFileSync(file, 'utf8');

  // 规范换行为 \n 进行处理
  raw = raw.replace(/\r\n/g, '\n');

  let fm = extractFrontMatter(raw);

  let fmLines;
  let parsed;

  if (fm.fmText != null) {
    // 已有 front matter：解析并修补
    parsed = parseFmLines(fm.fmText);

    // 强制 id: index
    setOrAddKey(parsed, 'id', 'index');

    // title/description 取原值并强制加引号
    const getVal = (k) => {
      const it = parsed.entries.find(e => e.key === k);
      return it ? it.value : null;
    };

    const titleVal = ensureQuoted(getVal('title') ?? guessTitleFromBody(fm.body, path.basename(path.dirname(file))));
    const descVal  = ensureQuoted(getVal('description') ?? '');

    setOrAddKey(parsed, 'title', titleVal);
    setOrAddKey(parsed, 'description', descVal);

    fmLines = parsed.lines;
  } else {
    // 没有 front matter：尝试从前 30 行搜集 loose 字段并包起来
    const loose = tryExtractLooseHeadFields(raw);
    let id = 'index';
    let title = loose.title ? loose.title : guessTitleFromBody(loose.newRaw, path.basename(path.dirname(file)));
    let description = loose.description ? loose.description : '';

    const fmArr = [
      `id: ${id}`,
      `title: ${ensureQuoted(title)}`,
      `description: ${ensureQuoted(description)}`
    ];
    fmLines = fmArr;
    fm.body = loose.newRaw;
  }

  const fmBlock = buildFrontMatterBlock(fmLines);
  const fixed = fmBlock + fm.body.replace(/^\s+$/g, '');

  // 写回（按平台或 --eol 指定的换行）
  const out = fixed.replace(/\n/g, EOL);
  fs.writeFileSync(file, out, 'utf8');
  console.log(`✅ Fixed: ${path.relative(process.cwd(), file)}`);
}

function main() {
  if (!fs.existsSync(DOCS_ROOT)) {
    console.error(`✗ docs root not found: ${DOCS_ROOT}`);
    process.exit(1);
  }
  const files = getAllIndexFiles(DOCS_ROOT);
  if (!files.length) {
    console.warn('⚠️  No index.md found under docs.');
    return;
  }
  files.forEach(fixOneFile);
  console.log(`\n🎉 Done. Processed ${files.length} files with EOL=${args.eol || (os.platform()==='win32'?'crlf':'lf')}.`);
}

main();
