// scripts/generateFamilyWelfareL4.cjs
// 生成 docs/family-welfare 下各 L3 的 L4 骨架（英文目录名、中文标题）
// - 为每个 L4 创建 目录/ index.md / _category_.json
// - 将 L4 链接以一个新小节附加到父级 L3 的 index.md 末尾（不覆盖原有内容）
// 运行：node scripts/generateFamilyWelfareL4.cjs

const fs = require('fs');
const path = require('path');

// 项目内 docs 根
const DOCS_ROOT = path.join(process.cwd(), 'docs');
const FW_ROOT = path.join(DOCS_ROOT, 'family-welfare');

// 小工具
function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function writeFileSafe(filepath, content) {
  ensureDir(path.dirname(filepath));
  fs.writeFileSync(filepath, content, { encoding: 'utf8' });
  console.log('WRITE:', filepath.replace(process.cwd() + path.sep, ''));
}

function addL4LinksToParentIndex(parentIndexPath, sectionTitle, items) {
  // items: [{ slug, title }]
  const relLines = items.map(it => `- [${it.title}](./${it.slug}/)`).join('\n');

  const block =
`\n\n## ${sectionTitle}\n\n${relLines}\n`;

  let existing = '';
  try {
    existing = fs.readFileSync(parentIndexPath, 'utf8');
  } catch {
    existing = '';
  }
  // 简单判断是否已追加过（避免重复）
  const markerLine = `## ${sectionTitle}`;
  if (existing.includes(markerLine)) {
    // 已经有这个小节；简单地跳过重复添加
    console.log('SKIP (section exists):', parentIndexPath.replace(process.cwd() + path.sep, ''));
    return;
  }
  writeFileSafe(parentIndexPath, existing + block);
}

function makeCategoryJson(label, linkDocId) {
  return JSON.stringify(
    {
      label,
      collapsed: true,
      link: { type: 'doc', id: linkDocId },
    },
    null,
    2
  );
}

function makeIndexMdFrontMatter({ title, description }) {
  // 所有前言字段用双引号，避免 YAML 解析问题
  return `---
id: index
title: "${title}"
description: "${description}"
---
`;
}

function makeL4IndexMd({ title, description }) {
  const fm = makeIndexMdFrontMatter({ title, description });
  return `${fm}
> 本頁為 **Level-4 區內容占位**（後續將擴展至實務步驟）。

**概要**  
${description}
`;
}

// ===== L4 计划（英文目录名 slug -> 中文标题 + 简述） =====
// 每个对象一组：父级 L3 相对 family-welfare 的路径、要生成的 L4 子项
const PLAN = [
  // 子女教育與托育
  {
    parent: 'child-education-and-care/nursery',
    l4: [
      { slug: 'check-eligibility-and-timeline', title: '確認報名資格與時程', desc: '核對 0–3 歲托育名額、年齡與地區時程。' },
      { slug: 'prepare-and-submit-application',  title: '準備與提交入托材料', desc: '整理身份、居住、疫苗等文件並完成提交。' },
      { slug: 'apply-isee-discount',            title: '申請費用減免與 ISEE', desc: '使用 ISEE 進行學費減免與地方補助申請。' },
      { slug: 'choose-public-or-private',        title: '選擇公立或私立機構', desc: '比較收費、排隊與服務，做出入托選擇。' },
      { slug: 'manage-waitlist-and-allocation',  title: '管理候補名單與調劑', desc: '跟進候補進度、調劑與最終錄取。' },
    ],
  },
  {
    parent: 'child-education-and-care/kindergarten',
    l4: [
      { slug: 'review-enrolment-calendar',       title: '查閱招生時間與名額', desc: '確認 3–6 歲學前入學開放期與名額。' },
      { slug: 'prepare-documents',               title: '準備報名材料與表格', desc: '身份、居住、疫苗與監護文件備齊與填寫。' },
      { slug: 'submit-online-or-in-person',      title: '線上或到校提交申請', desc: '完成申請遞交並獲取回執。' },
      { slug: 'apply-services-meal-bus',         title: '申請校餐校車與減免', desc: '申請校餐/校車與 ISEE 費用減免。' },
      { slug: 'complete-registration-checkin',   title: '完成入學註冊與報到', desc: '確定分班、繳費與開學報到流程。' },
    ],
  },
  {
    parent: 'child-education-and-care/primary-and-middle-school',
    l4: [
      { slug: 'choose-school-and-catchment',     title: '選擇學校與學區', desc: '根據學區、交通與學校特色做出選擇。' },
      { slug: 'complete-online-enrolment',       title: '完成線上入學報名', desc: '在官方入口完成報名與志願填報。' },
      { slug: 'prepare-enrolment-docs',          title: '提交入學所需文件', desc: '學籍轉銜、疫苗與身份文件提交。' },
      { slug: 'apply-school-services',           title: '申請課後與陪育服務', desc: '辦理課後托管、補習與特需支持。' },
      { slug: 'confirm-start-and-supplies',      title: '確認開學資訊與用品', desc: '開學日程、教材與校內守則確認。' },
    ],
  },
  {
    parent: 'child-education-and-care/school-meals-transport',
    l4: [
      { slug: 'apply-school-meals',              title: '申請校餐服務與菜單', desc: '申請校餐、查看菜單與過敏申報。' },
      { slug: 'request-fee-reduction',           title: '申請費用減免', desc: '使用 ISEE 申請校餐/交通費減免。' },
      { slug: 'apply-school-transport',          title: '辦理校車與交通月票', desc: '申請校車或城市交通學生票。' },
      { slug: 'manage-payments-and-invoices',    title: '管理繳費與帳單', desc: '查看繳費單、追繳與對帳。' },
      { slug: 'handle-service-issues',           title: '處理服務中斷與投訴', desc: '停課、缺餐或服務異常的申訴途徑。' },
    ],
  },

  // 家庭補貼與津貼
  {
    parent: 'family-subsidies/isee-declaration',
    l4: [
      { slug: 'collect-household-data',          title: '收集家庭與收入資料', desc: '整理家庭成員、收入與資產資料。' },
      { slug: 'compute-simulator',               title: '使用模擬器試算 ISEE', desc: '通過官方或 CAF 工具試算指數。' },
      { slug: 'submit-isee-online-or-caf',       title: '線上或 CAF 申報 ISEE', desc: '選擇途徑提交並獲得 DSU 回執。' },
      { slug: 'link-isee-to-benefits',           title: '關聯 ISEE 以申請補助', desc: '將 ISEE 關聯至校餐、托育與津貼。' },
      { slug: 'update-isee-when-changed',        title: '狀況變更時更新 ISEE', desc: '收入/家庭變動後及時更新。' },
    ],
  },
  {
    parent: 'family-subsidies/child-allowance',
    l4: [
      { slug: 'check-eligibility',               title: '核對兒童津貼資格', desc: '核對年齡、居住與 ISEE 門檻。' },
      { slug: 'prepare-and-submit-application',  title: '準備並提交申請', desc: '填寫申請、選擇收款賬戶與周期。' },
      { slug: 'track-payment-status',            title: '追蹤發放與變更', desc: '查詢款項、申請調整與追加。' },
      { slug: 'handle-changes',                  title: '處理家庭狀況變更', desc: '出生、搬家、監護變更的更新。' },
      { slug: 'resolve-denials-or-errors',       title: '處理拒批與錯誤', desc: '糾錯、補交與申訴。' },
    ],
  },
  {
    parent: 'family-subsidies/maternity-bonus',
    l4: [
      { slug: 'confirm-bonus-type',              title: '確認可申請的生育補助', desc: '根據地區與年份確定適用補助。' },
      { slug: 'gather-documents',                title: '準備並上傳所需材料', desc: '醫學證明、身份、居住與銀行資料。' },
      { slug: 'apply-online-or-municipality',    title: '線上或 Comune 申請', desc: '選擇途徑、提交並獲取回執。' },
      { slug: 'link-with-isee',                  title: '結合 ISEE 申請加成', desc: '用 ISEE 爭取更高補助級距。' },
      { slug: 'check-payment-and-appeal',        title: '查款與必要時申訴', desc: '核對到帳、缺漏與上訴。' },
    ],
  },
  {
    parent: 'family-subsidies/housing-energy-bonus',
    l4: [
      { slug: 'check-regional-programs',         title: '查詢地區租房/能源補貼', desc: '核對當期開放與條件。' },
      { slug: 'prepare-application',             title: '準備申請材料與表格', desc: '租約、繳費證明與住址文件。' },
      { slug: 'submit-and-track',                title: '提交申請並追蹤進度', desc: '線上提交與回執追蹤。' },
      { slug: 'manage-approval-and-payment',     title: '管理核准與發放', desc: '核准後的撥付與補件。' },
      { slug: 'renew-or-reapply',                title: '到期續申或重新申請', desc: '把握窗口期與更新要求。' },
    ],
  },
  {
    parent: 'family-subsidies/tax-deductions',
    l4: [
      { slug: 'collect-deductible-receipts',     title: '收集可抵扣票據', desc: '教育、醫療、托育等支出憑證。' },
      { slug: 'match-deduction-rules',           title: '比對當年抵扣規則', desc: '對照稅法與比例上限。' },
      { slug: 'declare-in-tax-return',           title: '在報稅中申報抵扣', desc: '730/Unico 中正確申報。' },
      { slug: 'save-proof-and-audit',            title: '保存證明並應對稽核', desc: '妥善保存 5–10 年。' },
      { slug: 'fix-declaration-errors',          title: '更正錯誤並追補', desc: '遞交整更與補報。' },
    ],
  },

  // 婚姻與家庭文件
  {
    parent: 'marriage-and-family-documents/marriage-registration',
    l4: [
      { slug: 'choose-civil-or-religious',       title: '選擇民事或宗教婚禮', desc: '比較流程、時間與文件差異。' },
      { slug: 'prepare-required-docs',           title: '準備結婚登記文件', desc: '出生、單身/無婚姻、無阻卻證明等。' },
      { slug: 'book-appointment',                title: '預約 Comune 登記', desc: '選擇日期、場地與儀式形式。' },
      { slug: 'register-and-collect-certificate',title: '完成登記並領取證明', desc: '登記當天與領證事宜。' },
      { slug: 'legalize-for-consular',           title: '辦理認證與領事手續', desc: '涉外使用的合法化/Apostille。' },
    ],
  },
  {
    parent: 'marriage-and-family-documents/family-reunion',
    l4: [
      { slug: 'verify-requirements',             title: '核對家庭團聚條件', desc: '收入、居住與保險等要求。' },
      { slug: 'prepare-visa-docs',               title: '準備簽證與居留材料', desc: '遞交所需完整清單。' },
      { slug: 'submit-and-track-questura',       title: '提交並跟進 Questura', desc: '辦理預約、指紋與審核。' },
      { slug: 'register-residence',              title: '完成到達後登記', desc: '居住、醫療與學校註冊。' },
      { slug: 'renew-permit',                    title: '後續續期與更新', desc: '期限提醒與材料更新。' },
    ],
  },
  {
    parent: 'marriage-and-family-documents/custody-and-divorce',
    l4: [
      { slug: 'understand-legal-paths',          title: '了解監護與離婚路徑', desc: '協議/訴訟等程序選擇。' },
      { slug: 'gather-legal-docs',               title: '準備法律文件與證據', desc: '監護、財務與居住證明。' },
      { slug: 'file-at-court',                   title: '向法院遞交申請', desc: '提交起訴或協議文件。' },
      { slug: 'mediation-and-negotiation',       title: '參與調解與協商', desc: '確立探視、撫養與財務安排。' },
      { slug: 'update-records-and-rights',       title: '更新戶籍與權益', desc: '更新居留、福利與學籍。' },
    ],
  },
  {
    parent: 'marriage-and-family-documents/international-marriage',
    l4: [
      { slug: 'confirm-doc-legalization',        title: '確認涉外文件合法化', desc: '公證、認證與譯本規範。' },
      { slug: 'book-and-register',               title: '預約並完成婚姻登記', desc: '涉外婚姻登記步驟與時程。' },
      { slug: 'consular-procedures',             title: '辦理領事備案與轉錄', desc: '雙邊登記與文件轉錄。' },
      { slug: 'update-status-post-marriage',     title: '婚後身份與居留更新', desc: '居留、戶籍與稅務變更。' },
      { slug: 'handle-name-change',              title: '處理姓氏變更事宜', desc: '姓名變更與證件同步。' },
    ],
  },

  // 社會服務與老年支持
  {
    parent: 'social-services-and-elderly-support/public-housing',
    l4: [
      { slug: 'check-eligibility-and-bands',     title: '核對申請資格與分組', desc: '收入、居住年限與家庭條件。' },
      { slug: 'prepare-documents',               title: '準備並提交申請文件', desc: '身份、ISEE、租住與家庭文件。' },
      { slug: 'follow-ranking-and-allocation',   title: '跟進排名與分配', desc: '結果公布與分配流程。' },
      { slug: 'sign-contract-and-move-in',       title: '簽約入住房屋', desc: '簽約、驗屋與入住。' },
      { slug: 'maintain-tenancy-rights',         title: '維護租住與權益', desc: '續租、維修與投訴管道。' },
    ],
  },
  {
    parent: 'social-services-and-elderly-support/income-support',
    l4: [
      { slug: 'check-allowance-eligibility',     title: '核對救助金申領資格', desc: '收入、就業與居住條件。' },
      { slug: 'submit-application',              title: '提交申請與回執', desc: '線上/窗口遞交與回執保存。' },
      { slug: 'meet-activation-requirements',    title: '完成就業或培訓義務', desc: '滿足項目的配套義務。' },
      { slug: 'track-payments',                  title: '追蹤發放與款項', desc: '查詢發放與異常處理。' },
      { slug: 'renew-or-appeal',                 title: '續領或申訴', desc: '期滿續申或針對拒批上訴。' },
    ],
  },
  {
    parent: 'social-services-and-elderly-support/home-care',
    l4: [
      { slug: 'assess-needs',                    title: '評估照護需求', desc: '申請評估與照護計畫。' },
      { slug: 'hire-caregiver-legally',          title: '合法聘用居家護理員', desc: '合同、保險與申報。' },
      { slug: 'apply-home-care-services',        title: '申請居家服務與補助', desc: '市政或地區提供之照護支持。' },
      { slug: 'manage-payroll-and-leave',        title: '管理薪資與休假', desc: '工時、休假與繳費合規。' },
      { slug: 'ensure-safety-and-quality',       title: '確保照護品質與安全', desc: '家居安全與服務監督。' },
    ],
  },
  {
    parent: 'social-services-and-elderly-support/disability-benefits',
    l4: [
      { slug: 'book-medical-assessment',         title: '預約殘障醫療鑑定', desc: '提交鑑定申請與排程。' },
      { slug: 'prepare-dossier',                 title: '準備鑑定材料', desc: '病歷、影像與醫囑彙整。' },
      { slug: 'attend-evaluation',               title: '參與評估面談與檢查', desc: '按時出席並完成檢查。' },
      { slug: 'apply-benefits',                  title: '申請相關福利', desc: '津貼、設備與交通補助。' },
      { slug: 'renew-or-review',                 title: '進行復審或續期', desc: '期限前提交復審資料。' },
    ],
  },
  {
    parent: 'social-services-and-elderly-support/volunteering',
    l4: [
      { slug: 'find-organizations',              title: '尋找志願者組織', desc: '教會、慈善與社區團體名錄。' },
      { slug: 'sign-up-and-train',               title: '報名並完成培訓', desc: '入會流程與上崗培訓。' },
      { slug: 'choose-service-schedule',         title: '安排服務與排班', desc: '時間管理與保險覆蓋。' },
      { slug: 'record-hours-and-impact',         title: '記錄時數與成效', desc: '形成志願者檔案與證明。' },
      { slug: 'join-community-networks',         title: '加入社區互助網絡', desc: '擴展人脈與合作項目。' },
    ],
  },

  // 年度福利與政策更新
  {
    parent: 'annual-benefits-and-updates/current-bonus',
    l4: [
      { slug: 'scan-annual-bonus-list',          title: '掃描當年度補助清單', desc: '彙整中央與地區最新 Bonus。' },
      { slug: 'check-eligibility-and-deadlines', title: '核對資格與申請截止', desc: '逐項核對條件與時程。' },
      { slug: 'prepare-forms-and-attachments',   title: '準備表格與附件', desc: '下載官方表格並填寫。' },
      { slug: 'submit-and-monitor',              title: '提交申請並監控進度', desc: '追蹤審核與補件。' },
      { slug: 'update-status-database',          title: '更新狀態與資料庫', desc: '維護名錄與提醒。' },
    ],
  },
  {
    parent: 'annual-benefits-and-updates/tax-deduction-updates',
    l4: [
      { slug: 'collect-legal-changes',           title: '收集當年稅務變更', desc: '彙整法規更新與公告。' },
      { slug: 'compare-deduction-items',         title: '比對可抵扣項目', desc: '對照新舊清單與比例。' },
      { slug: 'publish-summary',                 title: '發布摘要與操作指引', desc: '面向家庭的實務指引。' },
      { slug: 'update-examples-and-forms',       title: '更新範例與表單', desc: '同步範例與下載。' },
      { slug: 'sync-with-tax-season',            title: '配合報稅季節推送', desc: '節點提醒與 FAQ。' },
    ],
  },
  {
    parent: 'annual-benefits-and-updates/regional-welfare-offices',
    l4: [
      { slug: 'compile-regional-directory',      title: '整理各大區辦理窗口', desc: '統計網址、地址與工單入口。' },
      { slug: 'map-service-scope',               title: '標註服務範圍與人群', desc: '按人群/事項分層。' },
      { slug: 'verify-contacts',                 title: '核對聯絡方式與時段', desc: '電話、郵箱與辦公時間。' },
      { slug: 'add-appointment-instructions',    title: '補充預約與到訪指引', desc: '線上預約/現場取號。' },
      { slug: 'maintain-availability',           title: '維護可用性與更新', desc: '定期巡檢與失效修正。' },
    ],
  },
  {
    parent: 'annual-benefits-and-updates/official-sources',
    l4: [
      { slug: 'subscribe-official-rss',          title: '訂閱官方公告與 RSS', desc: 'INPS、G.U. 等源頭資訊。' },
      { slug: 'curate-newsletters',              title: '整理通訊與週報', desc: '形成定期通訊。' },
      { slug: 'tag-and-archive',                 title: '標籤與歸檔政策', desc: '建立可搜尋的索引。' },
      { slug: 'publish-change-logs',             title: '發布變更日誌', desc: '公告重要更新與解讀。' },
      { slug: 'cross-link-to-articles',          title: '交叉鏈接至百科條目', desc: '與相關條目互鏈。' },
    ],
  },
];

// ==== 主过程 ====
function run() {
  if (!fs.existsSync(FW_ROOT)) {
    console.error('Not found:', FW_ROOT);
    process.exit(1);
  }

  PLAN.forEach(group => {
    const parentAbs = path.join(FW_ROOT, group.parent);
    const parentIndex = path.join(parentAbs, 'index.md');
    if (!fs.existsSync(parentAbs)) {
      console.warn('PARENT NOT FOUND (skip):', parentAbs.replace(process.cwd() + path.sep, ''));
      return;
    }

    const l4Links = [];

    group.l4.forEach((item, i) => {
      const l4Dir = path.join(parentAbs, item.slug);
      const l4Index = path.join(l4Dir, 'index.md');
      const l4Cat = path.join(l4Dir, '_category_.json');

      // 1) 目录
      ensureDir(l4Dir);

      // 2) _category_.json （指向本目录 index）
      const linkDocId = path
        .join('family-welfare', group.parent, item.slug, 'index')
        .split(path.sep)
        .join('/');

      const catJson = makeCategoryJson(item.title, linkDocId);
      writeFileSafe(l4Cat, catJson);

      // 3) index.md
      const md = makeL4IndexMd({ title: item.title, description: item.desc });
      writeFileSafe(l4Index, md);

      // 4) 记下用于父 index.md 的链接
      l4Links.push({ slug: item.slug, title: item.title });
    });

    // 5) 将 L4 链接追加到父 L3 index.md
    addL4LinksToParentIndex(parentIndex, '進一步主題（L4）', l4Links);
  });

  console.log('\n✅ Done generating Family & Welfare L4 scaffold.');
}

run();
