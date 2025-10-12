// scripts/applySidebarOrder.cjs
// 统一侧栏默认收起 + 按既定顺序写入 position
// 运行：node scripts/applySidebarOrder.cjs

const fs = require('fs');
const path = require('path');

const DOCS = path.resolve('docs');

// 你的 L1 -> L2 顺序（文件夹名）
const L2_ORDER = {
  'life-and-settlement': [
    'permits-and-ids',
    'housing-and-rent',
    'digital-and-comms',
    'healthcare',
    'banking-and-payments',
  ],
  'work-and-business': [
    'employee-system',
    'self-employment',
    'company-system',
    'employment-entrepreneurship-support',
  ],
  'family-welfare': [
    'children-education-care',
    'family-subsidies',
    'marriage-family-docs',
    'social-services-elderly',
    'annual-bonus-updates',
  ],
  'study-education': [
    'formal-education',
    'language-adult-education',
    'skills-vocational-training',
    'degree-qualification-recognition',
    'career-development',
  ],
  'rules-and-rights': [
    'immigration-residence-law',
    'labor-law-rights',
    'consumer-protection',
    'tax-admin-law',
  ],
  'arrival-prep': [
    'visa-permit',
    'pre-departure-docs',
    'arrival-settlement',
    'universitaly-pre-enroll',
    'integration-culture',
  ],
};

// L2 -> L3 顺序（可按需补充/调整；缺省则不改该层 position）
const L3_ORDER = {
  // ── 生活與安居
  'life-and-settlement/permits-and-ids': [
    'residence-permit', 'codice-fiscale', 'carta-identita', 'tessera-sanitaria', 'spid-identita-digitale'
  ],
  'life-and-settlement/housing-and-rent': [
    'search-channels-and-lease-types', 'contract-registration-deposit', 'utilities-and-waste', 'residenza-and-move', 'buying-and-mortgage'
  ],
  'life-and-settlement/digital-and-comms': [
    'mobile-sim', 'home-broadband', 'digital-identity-pec', 'online-e-gov-apps', 'customer-service-complaints'
  ],
  'life-and-settlement/healthcare': [
    'medico-di-base', 'specialistica-pronto-soccorso', 'cup-ricetta', 'vaccines-checkups', 'privato-rimborso'
  ],
  'life-and-settlement/banking-and-payments': [
    'account-opening', 'cards-and-transfers', 'online-payments', 'international-remittance', 'taxes-f24-pagopa'
  ],

  // ── 工作與經營
  'work-and-business/employee-system': [
    'job-search-channels', 'contract-salary', 'tax-social-inps-irpef', 'worker-rights-holidays', 'part-time-flexible'
  ],
  'work-and-business/self-employment': [
    'piva-open', 'invoices-accounting', 'tax-declaration', 'piva-close-transform'
  ],
  'work-and-business/company-system': [
    'company-setup', 'accounting-bilancio', 'hr-management', 'licenses-operations', 'italy-china-commerce', 'company-modify-liquidation'
  ],
  'work-and-business/employment-entrepreneurship-support': [
    'hiring-incentives', 'startup-finance', 'training-reemployment', 'chamber-associations-support'
  ],

  // ── 家庭與福利
  'family-welfare/children-education-care': [
    'asilo-nido', 'infanzia', 'primaria-secondaria', 'mensa-trasporto-doposcuola'
  ],
  'family-welfare/family-subsidies': [
    'isee', 'assegno-unico', 'bonus-mamma-bebe', 'bonus-affitto-energia', 'family-tax-deduction'
  ],
  'family-welfare/marriage-family-docs': [
    'marriage', 'family-reunion', 'custody-divorce', 'intl-marriage-legalization'
  ],
  'family-welfare/social-services-elderly': [
    'casa-popolare', 'reddito-assegno-inclusione', 'home-care', 'disability-benefits', 'volunteering-community'
  ],
  'family-welfare/annual-bonus-updates': [
    'current-bonus', 'deductions-updated', 'regional-counters', 'sources-tracking'
  ],

  // ── 學習與發展
  'study-education/formal-education': [
    'edu-system-overview', 'high-school', 'university', 'postgraduate', 'art-design-schools', 'telematica-private'
  ],
  'study-education/language-adult-education': [
    'italian-learning-path', 'language-certifications', 'cpia-adult-edu', 'short-skill-training', 'online-self-learning'
  ],
  'study-education/skills-vocational-training': [
    'vfp-system-overview', 'sector-courses', 'professional-qualifications', 'apprenticeship-internship', 'requalification'
  ],
  'study-education/degree-qualification-recognition': [
    'recognition-overview', 'academic-recognition', 'professional-recognition', 'translation-legalization', 'international-recognition'
  ],
  'study-education/career-development': [
    'continuing-education', 'professional-orders', 'qualification-upgrade', 'soft-skills-language', 'career-change-branding'
  ],

  // ── 規則與權益
  'rules-and-rights/immigration-residence-law': [
    'immigration-framework', 'rights-obligations', 'appeal-remedy', 'sanatoria-regularization'
  ],
  'rules-and-rights/labor-law-rights': [
    'labor-contract-basics', 'dismissal-compensation', 'unions-arbitration', 'work-injury-inail'
  ],
  'rules-and-rights/consumer-protection': [
    'consumer-rights-returns', 'rental-contract-law', 'complaints', 'online-fraud'
  ],
  'rules-and-rights/tax-admin-law': [
    'tax-procedure', 'admin-sanctions-appeals', 'gdpr-privacy', 'citizenship-status'
  ],

  // ── 來意準備
  'arrival-prep/visa-permit': [
    'visa-types-requirements', 'booking-docs', 'refusal-appeal', 'post-arrival-permit', 'permit-renewal-timeline'
  ],
  'arrival-prep/pre-departure-docs': [
    'legalization-apostille', 'sworn-translation', 'medical-insurance', 'banking-funds', 'preflight-checklist'
  ],
  'arrival-prep/arrival-settlement': [
    'border-customs', 'hospitality-declaration', 'basic-services', 'temp-healthcard-gp', 'emergency-contacts'
  ],
  'arrival-prep/universitaly-pre-enroll': [
    'universitaly-guide', 'cimea-prescreen', 'tolc-arces', 'visa-enrollment', 'freshman-onboarding'
  ],
  'arrival-prep/integration-culture': [
    'etiquette-habits', 'cost-of-living', 'language-culture-gap', 'chinese-community', 'crossculture-wellbeing'
  ],
};

// ────────── 工具函数 ──────────
function loadJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return {};
  }
}
function saveJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}
function ensureCollapsed(file) {
  const json = loadJSON(file);
  if (json.collapsed !== true) json.collapsed = true;
  if (typeof json.collapsible === 'undefined') json.collapsible = true;
  saveJSON(file, json);
}
function setPosition(file, pos) {
  const json = loadJSON(file);
  json.position = pos;
  saveJSON(file, json);
}

// ────────── 主流程：L1 / L2 / L3 ──────────
function applyForL1(l1) {
  const l1Dir = path.join(DOCS, l1);
  const l1Cat = path.join(l1Dir, '_category_.json');
  if (fs.existsSync(l1Cat)) ensureCollapsed(l1Cat);

  // L2 顺序
  const l2List = L2_ORDER[l1] || [];
  l2List.forEach((l2, idx) => {
    const l2Dir = path.join(l1Dir, l2);
    const l2Cat = path.join(l2Dir, '_category_.json');
    if (fs.existsSync(l2Cat)) {
      ensureCollapsed(l2Cat);
      setPosition(l2Cat, idx + 1);
    }
    // L3 顺序
    const key = `${l1}/${l2}`;
    const l3List = L3_ORDER[key] || [];
    l3List.forEach((l3, j) => {
      const l3Dir = path.join(l2Dir, l3);
      const l3Cat = path.join(l3Dir, '_category_.json');
      if (fs.existsSync(l3Cat)) {
        ensureCollapsed(l3Cat);
        setPosition(l3Cat, j + 1);
      }
    });
  });
}

function main() {
  const l1List = Object.keys(L2_ORDER);
  l1List.forEach(applyForL1);

  // 同时把 docs 下所有 _category_.json 都设为 collapsed:true（兜底）
  (function collapseAll(dir) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) collapseAll(full);
      else if (ent.isFile() && ent.name === '_category_.json') ensureCollapsed(full);
    }
  })(DOCS);

  console.log('✅ Sidebar: 默认收起 + 顺序已写入 position。');
}

main();
