/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const BASE = path.join(process.cwd(), 'docs', 'life-and-settlement');

/** 规范 L3 目录映射（仅使用你给出的树中已存在的目录名） */
const SPEC = {
  // ──────────────── Permits & IDs ────────────────
  'permits-and-ids': {
    'residence-permit': [
      { dir: 'apply-first-permit', title: '申請首次/轉換居留（Permesso）', desc: '簽證銜接、郵局 Kit、Questura 預約與指紋流程。' },
      { dir: 'renew-permit',       title: '續期居留',                     desc: '評估類型、準備材料、時間線與常見錯誤。' },
      { dir: 'track-and-integration', title: '追蹤辦理與補正',           desc: '郵件追蹤、補交材料（Integrazione）與延遲處理。' },
      { dir: 'convert-permit',     title: '轉換居留類型',                  desc: '學習/家庭/工作等類型轉換與條件。' },
      { dir: 'replace-lost-stolen',title: '補辦遺失/被竊居留',            desc: '報案、補證與臨時文件處理。' },
    ],
    'codice-fiscale': [
      { dir: 'apply-codice-fiscale',  title: '申請稅號（Codice Fiscale）', desc: '申請途徑（Agenzia Entrate / 使領館）、用途與注意事項。' },
      { dir: 'replace-codice-fiscale',title: '補辦/更正稅號',              desc: '資料更正、遺失補辦與常見問題。' },
      { dir: 'use-codice-fiscale',    title: '使用稅號辦理事項',           desc: '報稅、開戶、醫療卡等場景。' },
    ],
    'carta-identita': [
      { dir: 'register-residenza', title: '登記居住（Residenza）',        desc: 'Comune 申請、居住查驗與辦理時限。' },
      { dir: 'apply-id-card',      title: '申請身份證（Carta d’Identità）',desc: '預約、到場材料與 CIE 領取。' },
      { dir: 'change-address',     title: '變更住址',                      desc: '搬家後的地址更新與關聯服務同步。' },
      { dir: 'replace-id-card',    title: '補辦遺失/過期身份證',          desc: '報失、補發流程與費用。' },
    ],
    'tessera-sanitaria': [
      { dir: 'register-ssn',       title: '註冊 SSN 公共醫療',             desc: 'ASL 註冊、資格審查與有效期。' },
      { dir: 'get-tessera',        title: '領取/補辦醫療卡',               desc: '卡片寄送、臨時證明與補辦。' },
      { dir: 'link-prescription',  title: '連結處方與電子健康檔案',        desc: '電子處方、FSE 與 App 綁定。' },
    ],
    'spid-identita-digitale': [
      { dir: 'get-spid',  title: '開通 SPID 數位身份',                    desc: '供應商比較、註冊方式與遠端驗證。' },
      { dir: 'use-spid',  title: '使用 SPID 辦理服務',                    desc: 'IO/INPS/Entrate 等平臺登入與操作。' },
      { dir: 'reset-spid',title: '重置/變更 SPID',                        desc: '遺失憑證、變更手機/郵箱的處理。' },
    ],
  },

  // ──────────────── Housing & Rent ────────────────
  'housing-and-rent': {
    'search-channels-and-lease-types': [
      { dir: 'search-rentals',       title: '尋找房源與比價',         desc: '平台、房仲、社群與避坑策略。' },
      { dir: 'choose-lease-type',    title: '選擇與理解租約類型',     desc: '4+4、Transitorio、Studentesco 等。' },
    ],
    'contract-registration-deposit': [
      { dir: 'register-lease',            title: '註冊租約（Agenzia Entrate）', desc: '註冊時限、表格與費用。' },
      { dir: 'manage-deposit',            title: '管理押金與退還',             desc: '押金收取、保管與退租結算。' },
      { dir: 'calculate-registration-tax',title: '計算註冊稅與印花稅',         desc: 'F24/PagoPA 範例與優惠。' },
    ],
    'utilities-and-waste': [
      { dir: 'activate-utilities', title: '開通/更名水電氣',      desc: '供應商選擇、合約與抄表。' },
      { dir: 'register-tari',      title: '註冊 TARI 垃圾費',     desc: '申報人口、面積與減免。' },
      { dir: 'sort-waste',         title: '垃圾分類與投放',       desc: '地區規則、回收點與罰則。' },
    ],
    'residenza-and-move': [
      { dir: 'declare-residence', title: '申報居住與戶籍登記', desc: '入住後的必辦步驟與查驗。' },
      { dir: 'request-move',      title: '辦理遷移（Cambio Residenza）', desc: '跨市/區遷移文件與流程。' },
      { dir: 'sync-services',     title: '同步學校/醫療/郵政地址',       desc: '常見服務的地址更新清單。' },
    ],
    'buying-and-mortgage': [
      { dir: 'find-property',        title: '找房與初步盡調',                 desc: '實價、產權、地籍與社區費。' },
      { dir: 'make-offer',           title: '提交要約與定金（Proposta/Caparra）', desc: '條款與風險控制。' },
      { dir: 'mortgage-application', title: '申請房貸並獲批',                 desc: '利率、成本明細與時程。' },
      { dir: 'complete-rogito',      title: '完成過戶與公證（Rogito）',        desc: '費用結算與產權登記。' },
    ],
  },

  // ──────────────── Digital & Comms ────────────────
  'digital-and-comms': {
    'mobile-sim': [
      { dir: 'choose-operator',     title: '選擇運營商與套餐',       desc: 'Iliad/TIM/WindTre/Poste 比較。' },
      { dir: 'buy-and-activate-sim',title: '購買並開通 SIM',         desc: '身份驗證、開卡與 eSIM。' },
      { dir: 'number-portability',  title: '辦理號碼攜轉（MNP）',   desc: '流程、時限與常見問題。' },
      { dir: 'topup-and-manage',    title: '充值與帳號管理',         desc: '自動充值、App 管理與解約。' },
    ],
    'home-broadband': [
      { dir: 'check-coverage',     title: '查詢光纖覆蓋與速率', desc: '地址可裝查詢與方案比較。' },
      { dir: 'subscribe-broadband',title: '申裝家庭寬帶',       desc: '合約條款、安裝與測速。' },
      { dir: 'cancel-contract',    title: '解約與設備歸還',     desc: '違約金、寄回與證明。' },
    ],
    'digital-identity-pec': [
      { dir: 'open-pec',   title: '開通 PEC 電子認證郵箱',   desc: '供應商、費用與申請。' },
      { dir: 'send-pec',   title: '使用 PEC 發送法律效郵件', desc: '收據、保存與證據力。' },
      { dir: 'cancel-pec', title: '取消或轉移 PEC',          desc: '到期、解約與資料導出。' },
    ],
    'online-e-gov-apps': [
      { dir: 'use-io-app',          title: '安裝並使用 IO App',           desc: '通知、PagoPA 與實名綁定。' },
      { dir: 'access-inps-entrate', title: '登入 INPS/Entrate 等平臺',    desc: 'SPID/CIE 登入與常見錯誤。' },
      { dir: 'use-fse',             title: '使用 Fascicolo Sanitario',     desc: '看檢查結果、處方與預約。' },
    ],
    'customer-service-complaints': [
      { dir: 'file-complaint',       title: '提交客服投訴',               desc: '官方表單、時限與跟進。' },
      { dir: 'send-disdetta',        title: '發送解約通知（Disdetta）',    desc: '郵寄/PEC 模板與收據。' },
      { dir: 'resolve-billing-dispute', title: '處理帳單爭議',             desc: '舉證、調解與仲裁入口。' },
    ],
  },

  // ──────────────── Healthcare ────────────────
  // 说明：你的目录中存在重复/别名目录，以下仅对“规范目录”写入：
  //   ✅ medico-di-base / specialistica-pronto-soccorso / cup-ricetta / vaccini-visite / privato-rimborso
  //   ❌ 跳过：private-clinics-reimburse、vaccines-checkups、specialisti-pronto-soccorso（保留原样）
  'healthcare': {
    'medico-di-base': [
      { dir: 'register-gp', title: '註冊家庭醫生', desc: '資格、所屬 ASL 與材料。' },
      { dir: 'change-gp',   title: '更換家庭醫生', desc: '更換時點、限制與流程。' },
    ],
    'specialistica-pronto-soccorso': [
      { dir: 'book-specialist', title: '預約專科門診', desc: 'CUP 通道、票據與等待。' },
      { dir: 'use-emergency',   title: '使用急診服務', desc: '分級、費用與出院文件。' },
    ],
    'cup-ricetta': [
      { dir: 'use-cup',            title: '使用 CUP 掛號',       desc: '線上/電話/藥房通道。' },
      { dir: 'get-e-prescription', title: '獲取/使用電子處方',   desc: 'NRP、QR Code 與領藥。' },
    ],
    'vaccini-visite': [
      { dir: 'book-vaccination',  title: '預約疫苗接種', desc: '兒童/成人接種規劃。' },
      { dir: 'pediatric-checkup', title: '安排兒童體檢', desc: '常規檢查與日程表。' },
    ],
    'privato-rimborso': [
      { dir: 'claim-reimbursement',   title: '申請私立報銷/退費', desc: '項目範圍、表單與時限。' },
      { dir: 'choose-private-clinic', title: '選擇私立診所',     desc: '費用、口碑與轉診。' },
    ],
  },

  // ──────────────── Banking & Payments ────────────────
  'banking-and-payments': {
    'account-opening': [
      { dir: 'open-account',  title: '開立銀行帳戶',      desc: '外國人要求、文件與步驟。' },
      { dir: 'close-account', title: '關閉或轉移帳戶',    desc: '解約、資金轉出與關戶證明。' },
    ],
    'cards-and-transfers': [
      { dir: 'get-debit-card',      title: '申請/啟用借記卡', desc: 'PIN、網購與限額。' },
      { dir: 'make-sepa-transfer',  title: '進行 SEPA 轉帳',  desc: 'IBAN、時效與費用。' },
      { dir: 'activate-credit-card',title: '申請/啟用信用卡', desc: '信用評分、年費與風險。' },
    ],
    'online-payments': [
      { dir: 'use-pagopa',          title: '使用 PagoPA 線上繳費', desc: '繳費識別碼、渠道與回執。' },
      { dir: 'use-digital-wallets', title: '使用數位錢包/APP',     desc: 'Satispay、Apple Pay 等。' },
    ],
    'international-remittance': [
      { dir: 'compare-remittance',  title: '比較跨境匯款渠道', desc: '銀行/第三方 平台比較。' },
      { dir: 'send-international',  title: '辦理國際匯款',     desc: '手續、合規與限額。' },
      { dir: 'meet-compliance',     title: '滿足反洗錢合規',   desc: 'KYC、來源說明與稅務。' },
    ],
    'taxes-f24-pagopa': [
      { dir: 'fill-f24',        title: '填寫 F24 表格',        desc: '欄位、稅碼與示例。' },
      { dir: 'pay-local-taxes', title: '繳納地方稅與費用',    desc: 'IMU/TARI 等繳納路徑。' },
    ],
  },
};

/** 这些 healthcare L3 目录存在“别名/重复”；脚本里仅提示不写入 */
const HEALTHCARE_ALIASES = new Set([
  'private-clinics-reimburse',
  'vaccines-checkups',
  'specialisti-pronto-soccorso',
]);

// ───────────── helpers ─────────────
function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }

function writeFile(p, content) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, content, 'utf8');
  console.log('WRITE:', path.relative(process.cwd(), p));
}

function mdFrontMatter({ id = 'index', title, description }) {
  return [
    '---',
    `id: ${id}`,
    `title: ${title}`,
    `description: "${(description || '').replace(/"/g, '\\"')}"`,
    '---',
    '',
  ].join('\n');
}

function l4IndexMd({ cnTitle, desc }) {
  return [
    mdFrontMatter({ title: cnTitle, description: desc || '' }),
    '> 本頁為 **Level-4 骨架占位**（未來將展開 L5 條目與辦理詳情）。',
    '',
    '**概要**',
    desc ? `${desc}` : '本頁包含該辦事項的條件、流程、材料與常見錯誤占位。',
    '',
  ].join('\n');
}

function l4CategoryJson(label, idPath) {
  return JSON.stringify(
    { label, collapsed: true, link: { type: 'doc', id: idPath } },
    null, 2
  );
}

function appendL3Links(l3IndexPath, newItems) {
  try {
    let md = fs.readFileSync(l3IndexPath, 'utf8');
    const sectionTitle = '## 子頁面';
    const list = newItems.map(({ relLink, linkText }) => `- [${linkText}](${relLink})`).join('\n');

    if (md.includes(sectionTitle)) {
      // 简单地在文末再追加一次列表，避免复杂 AST 处理
      md += '\n' + list + '\n';
    } else {
      md += `\n${sectionTitle}\n\n${list}\n`;
    }
    writeFile(l3IndexPath, md);
  } catch (e) {
    console.warn('WARN: L3 index.md not found or unreadable ->', l3IndexPath);
  }
}

// ───────────── main ─────────────
(function main() {
  Object.entries(SPEC).forEach(([l2, l3Groups]) => {
    const l2Dir = path.join(BASE, l2);
    if (!fs.existsSync(l2Dir)) {
      console.warn(`WARN: L2 not found, skip -> ${l2Dir}`);
      return;
    }

    Object.entries(l3Groups).forEach(([l3, l4Items]) => {
      if (l2 === 'healthcare' && HEALTHCARE_ALIASES.has(l3)) {
        console.warn(`SKIP alias/duplicate healthcare L3 -> ${l3}`);
        return;
      }

      const l3Dir = path.join(l2Dir, l3);
      if (!fs.existsSync(l3Dir)) {
        console.warn(`WARN: L3 not found, skip -> ${l3Dir}`);
        return;
      }

      const l3Index = path.join(l3Dir, 'index.md');
      const newLinks = [];

      l4Items.forEach((item) => {
        const l4Dir = path.join(l3Dir, item.dir);
        const indexPath = path.join(l4Dir, 'index.md');
        const catPath = path.join(l4Dir, '_category_.json');

        // L4 index.md
        const md = l4IndexMd({ cnTitle: item.title, desc: item.desc || '' });
        writeFile(indexPath, md);

        // L4 _category_.json 绑定到自身 index
        const idPath = `life-and-settlement/${l2}/${l3}/${item.dir}/index`.replace(/\\/g, '/');
        writeFile(catPath, l4CategoryJson(item.title, idPath));

        // L3 index.md 追加链接
        newLinks.push({ relLink: `./${item.dir}/`, linkText: item.title });
      });

      appendL3Links(l3Index, newLinks);
    });
  });

  console.log('\nAll L4 skeletons generated under life-and-settlement ✅');
})();
