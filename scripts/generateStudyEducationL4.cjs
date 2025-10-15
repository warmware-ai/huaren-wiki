// scripts/generateStudyEducationL4.cjs
// Generate L4 scaffold for "study-education" (index.md + _category_.json)
// - Uses CRLF line endings for Windows/PowerShell friendliness
// - Quotes front matter to avoid YAML parsing issues
// - Appends "進一步主題（L4）" list to each L3 index.md (idempotent)

const fs = require('fs');
const path = require('path');

const CRLF = '\r\n';
const DOCS_ROOT = path.join(process.cwd(), 'docs', 'study-education');

const plan = {
  // ───────── Formal Education ─────────
  'formal-education/system-overview': [
    { slug: 'understand-education-structure', title: '理解義大利教育體系結構', pos: 1 },
    { slug: 'check-entry-ages',               title: '查詢各學段入學年齡與銜接', pos: 2 },
    { slug: 'credit-system-cfu-basics',       title: '掌握大學學分制度（CFU）', pos: 3 },
    { slug: 'grading-scale',                  title: '了解評分等級與合格標準', pos: 4 },
    { slug: 'calendar-and-enrollment',        title: '查看學年日曆與註冊時間', pos: 5 },
  ],
  'formal-education/high-school': [
    { slug: 'compare-tracks-liceo-tecnico-professionale', title: '比較高中路徑（Liceo/技術/職高）', pos: 1 },
    { slug: 'choose-track-and-school',                     title: '選擇合適的學科方向與學校', pos: 2 },
    { slug: 'apply-high-school',                           title: '辦理高中入學申請與註冊', pos: 3 },
    { slug: 'understand-esame-di-stato',                   title: '了解畢業考試（Esame di Stato）', pos: 4 },
    { slug: 'transfer-between-schools',                    title: '辦理校際轉學與年級銜接', pos: 5 },
  ],
  'formal-education/university': [
    { slug: 'laurea-triennale-structure',  title: '理解學士課程（Laurea triennale）架構', pos: 1 },
    { slug: 'admission-requirements',      title: '準備入學要求與材料', pos: 2 },
    { slug: 'immatricolazione-steps',      title: '完成入學註冊（Immatricolazione）', pos: 3 },
    { slug: 'manage-credits-exams',        title: '管理學分、課程與考試', pos: 4 },
    { slug: 'fees-and-scholarships',       title: '學費減免與獎學金申請', pos: 5 },
  ],
  'formal-education/graduate': [
    { slug: 'choose-magistrale-vs-master', title: '選擇 Magistrale 與 Master 路徑', pos: 1 },
    { slug: 'apply-magistrale',            title: '申請 Magistrale（研究型碩士）', pos: 2 },
    { slug: 'apply-master-universitario',  title: '申請 Master Universitario（專業型）', pos: 3 },
    { slug: 'thesis-and-graduation',       title: '論文準備與畢業流程', pos: 4 },
    { slug: 'graduate-scholarships',       title: '研究生獎助與專項資助', pos: 5 },
  ],
  'formal-education/art-design': [
    { slug: 'admission-exams-accademia',   title: '藝術/音樂院校入學考試與甄選', pos: 1 },
    { slug: 'build-portfolio',             title: '製作作品集與面試準備', pos: 2 },
    { slug: 'apply-accademia-conservatorio', title: '遞交申請與學籍註冊', pos: 3 },
    { slug: 'degree-recognition',          title: '學位承認與學分轉換', pos: 4 },
    { slug: 'tuition-scholarships',        title: '學費、獎學金與資助', pos: 5 },
  ],
  'formal-education/distance-private': [
    { slug: 'evaluate-telematic-universities', title: '評估遠程大學（Telematica）', pos: 1 },
    { slug: 'verify-accreditation',            title: '核對認證與合法性', pos: 2 },
    { slug: 'enroll-online',                   title: '線上註冊與課程選擇', pos: 3 },
    { slug: 'exam-proctoring',                 title: '考試監考與學術誠信', pos: 4 },
    { slug: 'avoid-degree-scams',              title: '警惕學歷陷阱與不實廣告', pos: 5 },
  ],

  // ───────── Language & Adult ─────────
  'language-and-adult/italian-learning-path': [
    { slug: 'plan-a0-to-b2',            title: '規劃從 A0 到 B2 的學習路徑', pos: 1 },
    { slug: 'choose-courses-by-level',  title: '按級別選課與教材', pos: 2 },
    { slug: 'self-study-resources',     title: '自學資源與學習策略', pos: 3 },
    { slug: 'language-exchange',        title: '語伴/語言交換與線下社群', pos: 4 },
    { slug: 'track-progress',           title: '進度追蹤與測評', pos: 5 },
  ],
  'language-and-adult/language-exams': [
    { slug: 'compare-cils-celi-plida',  title: '比較 CILS / CELI / PLIDA', pos: 1 },
    { slug: 'register-exam',            title: '報名與繳費（考點與日期）', pos: 2 },
    { slug: 'prepare-exam',             title: '備考資料與模擬試題', pos: 3 },
    { slug: 'use-certification',        title: '在居留/入學中的使用', pos: 4 },
    { slug: 'results-and-validity',     title: '成績查詢與有效期', pos: 5 },
  ],
  'language-and-adult/adult-education-cpia': [
    { slug: 'find-cpia',         title: '查找並聯絡當地 CPIA', pos: 1 },
    { slug: 'enroll-cpia',       title: '註冊與選課（課表/學費）', pos: 2 },
    { slug: 'attend-courses',    title: '上課出勤與學習管理', pos: 3 },
    { slug: 'obtain-certificates', title: '獲取證書與學歷銜接', pos: 4 },
    { slug: 'use-cpia-services', title: 'CPIA 支援與外部資源', pos: 5 },
  ],
  'language-and-adult/short-courses': [
    { slug: 'find-funded-courses',   title: '尋找公費/補貼短期課程', pos: 1 },
    { slug: 'enroll-short-course',   title: '報名與上課安排', pos: 2 },
    { slug: 'get-certificates',      title: '結業證書與技能證明', pos: 3 },
    { slug: 'link-to-employment',    title: '將學習成果銜接就業', pos: 4 },
    { slug: 'popular-providers',     title: '常見培訓機構與平台', pos: 5 },
  ],
  'language-and-adult/online-self-learning': [
    { slug: 'choose-platforms',      title: '選擇 edX/Coursera 等平台', pos: 1 },
    { slug: 'plan-learning',         title: '制定線上學習計畫', pos: 2 },
    { slug: 'complete-for-credit',   title: '完成課程並申請學分/證書', pos: 3 },
    { slug: 'build-portfolio',       title: '整理作品集與學習成果', pos: 4 },
    { slug: 'recommended-tracks',    title: '推薦學習路線（語言/IT/商科）', pos: 5 },
  ],

  // ───────── Vocational Training ─────────
  'vocational-training/vocation-system-overview': [
    { slug: 'understand-vet-system',  title: '理解職培體系與路徑', pos: 1 },
    { slug: 'funding-and-eu',         title: '地區/歐盟資助課程', pos: 2 },
    { slug: 'recognition-of-quals',   title: '資格認可與轉換', pos: 3 },
    { slug: 'apprenticeship-paths',   title: '學徒/實習的進路', pos: 4 },
    { slug: 'find-courses',           title: '在哪裡找課程與報名', pos: 5 },
  ],
  'vocational-training/sector-courses': [
    { slug: 'hospitality', title: '餐飲與酒店業課程', pos: 1 },
    { slug: 'construction', title: '建築與安全課程', pos: 2 },
    { slug: 'beauty-wellness', title: '美容與健康課程', pos: 3 },
    { slug: 'digital-it', title: '數位與 IT 課程', pos: 4 },
    { slug: 'logistics', title: '物流與倉儲課程', pos: 5 },
  ],
  'vocational-training/professional-qualifications': [
    { slug: 'eqf-levels', title: 'EQF 等級與對應資格', pos: 1 },
    { slug: 'apply-qualification', title: '申請職業資格與評估', pos: 2 },
    { slug: 'renewals-upgrades', title: '續期與升級', pos: 3 },
    { slug: 'conversion-recognition', title: '跨地區/跨國轉換', pos: 4 },
    { slug: 'maintain-cpd', title: '持續進修（CPD）要求', pos: 5 },
  ],
  'vocational-training/apprenticeship-internship': [
    { slug: 'contract-types', title: '學徒/實習合同類型', pos: 1 },
    { slug: 'find-internships', title: '尋找實習與學徒機會', pos: 2 },
    { slug: 'rights-insurance', title: '權益與保險（INAIL）', pos: 3 },
    { slug: 'activation-procedures', title: '簽署與啟動手續', pos: 4 },
    { slug: 'conversion-to-job', title: '實習轉正與後續發展', pos: 5 },
  ],
  'vocational-training/requalification': [
    { slug: 'identify-programs', title: '甄別再就業培訓計畫', pos: 1 },
    { slug: 'apply-courses', title: '申請與錄取', pos: 2 },
    { slug: 'allowances-during-training', title: '培訓期間補貼', pos: 3 },
    { slug: 'complete-and-certify', title: '完成與取證', pos: 4 },
    { slug: 'placement-links', title: '與就業服務銜接', pos: 5 },
  ],

  // ───────── Recognition ─────────
  'recognition/overview': [
    { slug: 'choose-recognition-path', title: '選擇正確的認證路徑', pos: 1 },
    { slug: 'collect-docs', title: '收集與準備所需文件', pos: 2 },
    { slug: 'apply-online', title: '線上遞交（CIMEA/MIUR）', pos: 3 },
    { slug: 'timeline-tracking', title: '掌握時間線與狀態追蹤', pos: 4 },
    { slug: 'avoid-mistakes', title: '常見錯誤與補救', pos: 5 },
  ],
  'recognition/academic-recognition': [
    { slug: 'apply-equivalency', title: '申請學位等值與學分承認', pos: 1 },
    { slug: 'credit-transfer', title: '辦理學分轉換程序', pos: 2 },
    { slug: 'university-rules', title: '了解高校內部規章', pos: 3 },
    { slug: 'doc-translation', title: '文件翻譯與格式', pos: 4 },
    { slug: 'appeals', title: '異議與上訴', pos: 5 },
  ],
  'recognition/professional-recognition': [
    { slug: 'regulated-professions', title: '受管制職業清單', pos: 1 },
    { slug: 'apply-competent-authorities', title: '向主管機關遞交申請', pos: 2 },
    { slug: 'compensation-measures', title: '補救性措施與考試', pos: 3 },
    { slug: 'post-recognition-registration', title: '獲認可後的註冊與執業', pos: 4 },
    { slug: 'maintenance-cpd', title: '後續執業與持續進修', pos: 5 },
  ],
  'recognition/translation-legalization': [
    { slug: 'choose-sworn-translator', title: '選擇合格譯者', pos: 1 },
    { slug: 'asseverazione', title: '辦理法院宣誓（Asseverazione）', pos: 2 },
    { slug: 'apostille', title: '申請 Apostille', pos: 3 },
    { slug: 'consular-legalization', title: '領事認證與合法化', pos: 4 },
    { slug: 'doc-templates', title: '常用文件模板與排版', pos: 5 },
  ],
  'recognition/international-agreements': [
    { slug: 'eu-mutual-recognition', title: '歐盟互認框架概覽', pos: 1 },
    { slug: 'italy-china-agreements', title: '中意教育協議要點', pos: 2 },
    { slug: 'erasmus-programmes', title: 'Erasmus 等交換計畫', pos: 3 },
    { slug: 'mobility-recognition', title: '跨國流動中的學歷承認', pos: 4 },
    { slug: 'references-links', title: '參考文件與官方連結', pos: 5 },
  ],

  // ───────── Career Development ─────────
  'career-development/continuing-education': [
    { slug: 'understand-cfp', title: '理解各行業 CFP/學分制', pos: 1 },
    { slug: 'find-industry-courses', title: '查找行業持續教育課程', pos: 2 },
    { slug: 'register-and-track', title: '註冊帳號並追蹤學分', pos: 3 },
    { slug: 'employer-reimbursement', title: '申請公司學費補助', pos: 4 },
    { slug: 'renew-certifications', title: '證照續期與年審', pos: 5 },
  ],
  'career-development/professional-associations': [
    { slug: 'find-ordine', title: '查找並確認所屬行業協會', pos: 1 },
    { slug: 'register-membership', title: '會員註冊與年費', pos: 2 },
    { slug: 'use-association-services', title: '使用協會服務（保險/培訓）', pos: 3 },
    { slug: 'ethics-complaints', title: '職業倫理與申訴機制', pos: 4 },
    { slug: 'events-networking', title: '參加活動與擴展人脈', pos: 5 },
  ],
  'career-development/qualification-upgrade': [
    { slug: 'choose-upgrade-path', title: '選擇升級/進階路徑', pos: 1 },
    { slug: 'apply-for-exams', title: '申請考試與入學', pos: 2 },
    { slug: 'course-selection', title: '選課與時間規劃', pos: 3 },
    { slug: 'submit-docs', title: '提交材料與費用', pos: 4 },
    { slug: 'get-new-certification', title: '獲取新資格與更新記錄', pos: 5 },
  ],
  'career-development/soft-skills-language': [
    { slug: 'improve-communication', title: '提升溝通與演示能力', pos: 1 },
    { slug: 'teamwork-leadership', title: '強化團隊與領導力', pos: 2 },
    { slug: 'negotiation-crosscultural', title: '談判與跨文化協作', pos: 3 },
    { slug: 'business-italian', title: '提升商務義大利語', pos: 4 },
    { slug: 'learning-resources', title: '工具與資源清單', pos: 5 },
  ],
  'career-development/career-change-branding': [
    { slug: 'self-assessment', title: '職涯自我評估與定位', pos: 1 },
    { slug: 'optimize-linkedin', title: '優化 LinkedIn 與履歷', pos: 2 },
    { slug: 'build-portfolio', title: '建立作品集與案例', pos: 3 },
    { slug: 'job-market-strategy', title: '求職市場策略與投遞', pos: 4 },
    { slug: 'freelance-branding', title: '自由職業與個人品牌', pos: 5 },
  ],
};

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function writeFile(p, content) {
  const data = content.replace(/\n/g, CRLF);
  fs.writeFileSync(p, data, 'utf8');
  console.log('WRITE:', path.relative(process.cwd(), p));
}

function categoryJson(label, position = 1, collapsed = true, linkId = null) {
  const json = {
    label,
    position,
    collapsed,
  };
  if (linkId) json.link = { type: 'doc', id: linkId };
  return JSON.stringify(json, null, 2);
}

function l4IndexMd(titleZh, l3IdPath) {
  return [
    '---',
    `id: index`,
    `title: "${titleZh}"`,
    `description: ""`,
    '---',
    '',
    '> 本頁為 **Level-4 區內容占位**（後續將展開為 L5 條目）。',
    '',
    '**概要**',
    '（待補充）',
    '',
    '**接下來可展開**',
    '- （留空，後續統一補充）',
    '',
  ].join('\n');
}

function appendL4ListToL3Index(l3Dir, l3IndexPath, l4Items) {
  let content = fs.readFileSync(l3IndexPath, 'utf8');

  const marker = '## 進一步主題（L4）';
  if (content.includes(marker)) {
    // 覆蓋「進一步主題」區塊（從 marker 到文末）
    content = content.split(marker)[0].trimEnd() + '\n\n';
  } else {
    content = content.trimEnd() + '\n\n';
  }

  const lines = [];
  lines.push(marker);
  lines.push('');
  for (const it of l4Items.sort((a,b)=>a.pos-b.pos)) {
    const rel = `./${it.slug}/`;
    lines.push(`- [${it.title}](${rel})`);
  }
  lines.push('');
  writeFile(l3IndexPath, content + lines.join('\n'));
}

function run() {
  const l3Keys = Object.keys(plan);

  for (const key of l3Keys) {
    const l3Abs = path.join(DOCS_ROOT, key);
    if (!fs.existsSync(l3Abs)) {
      console.warn('SKIP (L3 not found):', key);
      continue;
    }

    const l4List = plan[key];

    // 生成每個 L4
    for (const item of l4List) {
      const l4Dir = path.join(l3Abs, item.slug);
      ensureDir(l4Dir);

      // _category_.json
      const catPath = path.join(l4Dir, '_category_.json');
      if (!fs.existsSync(catPath)) {
        const catJson = categoryJson(item.title, item.pos, true, `${key}/${item.slug}/index`.replace(/\\/g,'/'));
        writeFile(catPath, catJson + '\n');
      }

      // index.md
      const idxPath = path.join(l4Dir, 'index.md');
      if (!fs.existsSync(idxPath)) {
        const md = l4IndexMd(item.title, `${key}/${item.slug}/index`);
        writeFile(idxPath, md + '\n');
      }
    }

    // 更新 L3 index.md 的 L4 列表
    const l3Index = path.join(l3Abs, 'index.md');
    if (fs.existsSync(l3Index)) {
      appendL4ListToL3Index(l3Abs, l3Index, l4List);
    } else {
      console.warn('WARN: missing L3 index.md ->', key);
    }
  }

  console.log('✅ Done generating Study & Education L4 scaffold.');
}

run();
