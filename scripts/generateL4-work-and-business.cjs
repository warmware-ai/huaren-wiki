/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

// 根目录（按你本地结构，如需调整请改这里）
const DOCS_ROOT = path.resolve(process.cwd(), 'docs', 'work-and-business');

// 工具函数
const kebab = (s) =>
  s
    .normalize('NFKC')
    .replace(/[–—―]/g, '-') // 长横线归一化
    .replace(/[’'“”"()（）【】[\]]/g, '') // 清理括号/引号
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5\s-]/g, '') // 去掉其它符号（保留中英数字和空格/短横）
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');

// 写文件（若已存在则跳过）
function writeIfMissing(filePath, content) {
  if (fs.existsSync(filePath)) {
    console.log('SKIP (exists):', path.relative(process.cwd(), filePath));
    return;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('WRITE:', path.relative(process.cwd(), filePath));
}

// 生成 _category_.json
function categoryJson({ label, position = undefined, collapsed = true, linkDocId = 'index' }) {
  const obj = { label, collapsed };
  if (typeof position === 'number') obj.position = position;
  obj.link = { type: 'doc', id: linkDocId };
  return JSON.stringify(obj, null, 2) + '\n';
}

// 生成 L4 index.md（占位）
function l4IndexMd({ title, description }) {
  // 全部值用双引号包裹，避免 YAML 前言解析问题
  return `---
id: "index"
title: "${title}"
description: "${description}"
---

> 本頁為 **Level-4 區內容占位**。後續將補充具體步驟、範例、下載表與常見問題。
`;
}

// ========== 配置映射（按你提供的动作导向 L4） ==========

// 1) 雇員體系 employee-system
const employeeSystem = {
  'job-search-and-recruitment': [
    ['瀏覽與比較求職管道', '匯總並比較主要求職平台（Portali）、中介機構（Agenzie）、地方就業中心（CPI）。', 'compare-job-channels'],
    ['註冊主流網站並上傳履歷', '在主流求職網站註冊帳號、完善履歷並開啟職缺提醒。', 'register-job-sites'],
    ['登記 Centro per l’Impiego 並使用服務', '完成 CPI 登記，使用就業服務與支援計畫。', 'register-centro-impiego'],
    ['參加招聘會與校園招募', '線上/線下招聘會與校園招募的報名與參與要點。', 'join-job-fairs'],
    ['辨識與防範非法招聘詐騙', '識別常見詐騙徵兆，保護個資與錢款安全。', 'avoid-job-scams'],
  ],
  'contracts-and-salary': [
    ['選擇適合的合同類型', 'Tempo indeterminato / determinato / apprendistato / stage 等。', 'choose-contract-type'],
    ['解析合同關鍵條款', '試用期、工作時數、CCNL、解約條件與保密條款。', 'analyze-contract-clauses'],
    ['解讀工資單與薪資構成', '讀懂 busta paga 的稅前、扣繳、淨薪等欄位。', 'read-pay-slip'],
    ['計算加班、夜班與假期工資', '依合同/CCNL 計算加班、夜班、節假日薪資。', 'calculate-overtime-and-holiday-pay'],
    ['辦理試用期結束與續約流程', '確認試用期結果、續約或轉正的流程與材料。', 'handle-probation-and-renewal'],
  ],
  'tax-and-social-security': [
    ['理解薪資稅前稅後與扣繳項目', '了解稅前/稅後、扣繳稅費與社保組成。', 'understand-gross-net-and-withholdings'],
    ['啟用並查詢 INPS 個人帳戶', '啟用 SPID / CIE 後登入 INPS，查繳紀錄與身份狀態。', 'activate-check-inps-account'],
    ['提交年度報稅', 'CU / 730 / Redditi 的提交節點、方式與注意事項。', 'file-annual-tax-return'],
    ['申請稅務減免與家庭扣除', '申請 detrazioni、家庭扣除與其他可用減免。', 'apply-tax-deductions-family'],
    ['處理稅務或社保錯誤與申訴', '更正錯誤、遞交申訴與與機構溝通。', 'fix-tax-or-inps-errors'],
  ],
  'labor-rights-and-leave': [
    ['申請病假與年假', 'Malattia / Ferie 的申請條件、流程與工資影響。', 'apply-sick-and-annual-leave'],
    ['申請產假、陪產假與家庭假', 'Maternità / Paternità / Congedi familiari 的條件與步驟。', 'apply-maternity-paternity-family-leave'],
    ['向工會尋求支援或諮詢', '尋找並聯繫工會，獲得談判與法律協助。', 'get-union-support'],
    ['確認職場安全與工時規範', 'DVR、工時與安全培訓的合規檢查。', 'ensure-safety-and-working-hours'],
    ['提交勞資爭議調解申請', '如何蒐證、申請調解與後續程序。', 'file-labor-mediation'],
  ],
  'part-time-and-flexible-work': [
    ['簽訂兼職與臨時合同', '兼職、臨時、零工合同的要點與風險。', 'sign-part-time-and-temp-contracts'],
    ['申請季節工與短期工崗位', '季節性與短期崗位的應聘渠道與注意事項。', 'apply-seasonal-and-short-term-jobs'],
    ['分析自僱與兼職的差異', '雇傭、兼職與自僱的法律與稅務差異。', 'compare-self-employment-vs-part-time'],
    ['報稅與繳納兼職社保', '兼職情境下的報稅與社保繳納處理。', 'declare-tax-and-social-security-for-part-time'],
    ['管理多重雇主或合同關係', '同時管理多個合同的排班、工資與合規。', 'manage-multiple-employers-contracts'],
  ],
};

// 2) 自雇體系 self-employment
const selfEmployment = {
  'partita-iva-opening': [
    ['評估是否適合開立 Partita IVA', '評估客群、成本、預期收入與合規風險。', 'assess-open-partita-iva'],
    ['選擇稅務制度（Forfettario / Ordinario）', '對比制度稅負、門檻、記帳與成本。', 'choose-tax-regime-forfettario-ordinario'],
    ['選定業務類別與 ATECO 編碼', '選擇正確 ATECO 以匹配業務與稅務。', 'choose-ateco-code'],
    ['辦理開設手續（線上 / Agenzia Entrate）', '線上與臨櫃流程、表格與時限。', 'open-partita-iva-online-or-agency'],
    ['計算開業成本與預期時間', '預估諮詢、記帳、設備與稅費等成本。', 'estimate-opening-costs-and-timeline'],
  ],
  'invoicing-and-accounting': [
    ['建立電子發票並理解格式', 'XML 格式、必填欄位與發送通道。', 'create-e-invoice-format'],
    ['選擇合適的發票系統或軟體', '對比軟體功能、成本與雲端/本地差異。', 'choose-invoicing-software'],
    ['管理支出報銷與憑證', '保存發票與收據，確保稅前列支合規。', 'manage-expenses-and-receipts'],
    ['規劃現金流與預繳策略', '預估稅負、預繳、留存與現金流。', 'plan-cashflow-and-advance-payments'],
    ['追蹤逾期客戶並處理催款', '設定信用條款、催款流程與法律途徑。', 'chase-overdue-invoices'],
  ],
  'taxes-and-declaration': [
    ['了解主要稅種（IRPEF / IVA / INPS）', '自僱涉及的稅種與社保構成。', 'understand-main-taxes'],
    ['準備季度或年度報稅文件', '收支整理、發票匯總與必要附表。', 'prepare-quarterly-annual-tax-returns'],
    ['使用 F24 或 PagoPA 完成繳稅', 'F24 欄位與 PagoPA 支付步驟。', 'pay-taxes-with-f24-or-pagopa'],
    ['合作會計師 / CAF 進行代理申報', '選擇合作方、授權與交付節點。', 'file-via-accountant-or-caf'],
    ['更正報稅錯誤並處理罰款', '補報、更正與減免申請流程。', 'correct-tax-return-and-penalties'],
  ],
  'closure-and-transformation': [
    ['申請暫停或註銷 Partita IVA', '暫停與註銷的條件、流程與文件。', 'suspend-or-close-partita-iva'],
    ['將自雇轉為公司或雇員身分', '轉型路徑、稅務影響與合同處理。', 'convert-self-employed-to-company-or-employee'],
    ['結清稅務與社保繳費', '關閉前的稅務結算與 INPS 收尾。', 'settle-tax-and-inps'],
    ['保存會計與報稅檔案', '保存年限、數位化與查核配合。', 'archive-accounting-and-tax-files'],
    ['避免常見關閉流程陷阱', '時限、欠費、通知與合約的風險點。', 'avoid-closure-pitfalls'],
  ],
};

// 3) 企業體系 enterprise-system
const enterpriseSystem = {
  'company-formation': [
    ['選擇公司形式', 'Ditta、SRL、SNC 等形式的適用場景。', 'choose-company-type'],
    ['完成商會註冊手續', 'CCIAA 註冊與必要附檔。', 'register-with-cciaa'],
    ['申請稅號、VAT、PEC 與 SPID', '稅務識別、電子信箱與數位身份配置。', 'apply-tax-vat-pec-spid'],
    ['撰寫公司章程並進行公證', '章程要點、公證流程與費用。', 'draft-statute-and-notary'],
    ['準備啟業前合規清單', '營運前的許可、保險與內控清單。', 'pre-opening-compliance-checklist'],
  ],
  'accounting-and-finance': [
    ['建立帳簿與會計系統', '選擇會計軟體、科目與流程。', 'set-up-bookkeeping-system'],
    ['準備年度財報與稅務申報', '年度結帳、財報與報稅責任。', 'prepare-annual-financials-and-tax'],
    ['管理現金、發票與收據', '現金管理、開票與收據流轉。', 'manage-cash-invoices-receipts'],
    ['應對稅務稽核與審查', '稽核通知、應對材料與流程。', 'handle-tax-audit'],
    ['委託會計師並管理顧問合約', '選擇會計師、合約範圍與KPI。', 'hire-accountant-and-contract'],
  ],
  'employee-management': [
    ['招聘並註冊員工（UNILAV）', '招聘流程、UNILAV 申報與入職。', 'hire-and-register-employee-unilav'],
    ['管理薪酬、工時與假期', '排班、考勤、請假與薪資發放。', 'manage-payroll-hours-and-leave'],
    ['辦理 INPS / INAIL 保險與申報', '社保、保險與事故申報流程。', 'handle-inps-inail-insurance'],
    ['實施紀律處理與解雇程序', '紀律處分、證據與解雇風險。', 'manage-disciplinary-and-dismissal'],
    ['確保隱私與職場安全（DVR / GDPR）', '編制 DVR、隱私合規與安全培訓。', 'ensure-privacy-and-safety-dvr-gdpr'],
  ],
  'business-licenses': [
    ['提交 SCIA 並申請相關許可', 'SCIA 流程、費用與常見補件。', 'file-scia-and-apply-permits'],
    ['通過消防與衛生檢查', '消防與衛檢的標準、整改與複查。', 'pass-fire-and-health-inspections'],
    ['管理價格與電子收據', '價格標示、電子收據與POS。', 'manage-pricing-and-e-receipts'],
    ['維護線上商店與遠程銷售合規', '電商法規、退貨與GDPR。', 'run-ecommerce-and-distance-selling-compliance'],
    ['制定與管理供應商合同', '供應商選擇、談判與合同監管。', 'manage-supplier-contracts'],
  ],
  'italo-chinese-trade': [
    ['辦理進出口報關與貨物流通', '報關、原產地證與物流協同。', 'handle-import-export-customs'],
    ['管理跨國付款與外匯稅務', '收付匯、合規與稅務處理。', 'manage-crossborder-payments-and-fx'],
    ['應用中意稅務協定', '避免雙重徵稅協定的要點與應用。', 'apply-italy-china-tax-treaty'],
    ['安排國際物流與退稅', '物流模式、保險與VAT 退稅。', 'arrange-logistics-and-vat-refund'],
    ['撰寫合同並理解 Incoterms 條款', 'Incoterms 風險與權責界面。', 'draft-contracts-and-incoterms'],
  ],
  'company-changes': [
    ['申報公司地址或代表人變更', '變更章程、登記與公告。', 'change-registered-office-or-legal-rep'],
    ['辦理股權轉讓與增資減資', '估值、文件與登記流程。', 'handle-share-transfer-and-capital-changes'],
    ['執行暫停、清算或解散流程', '停業、清算與解散的步驟與時點。', 'suspend-liquidate-or-dissolve-company'],
    ['完成稅務結算與員工安置', '最終稅務結算與用工處置。', 'finalize-tax-settlement-and-staff'],
    ['保存公司文件與法定紀錄', '保存年限、數位化與查核配合。', 'archive-company-records'],
  ],
};

// 4) 就業與創業支援 employment-and-startup-support
const employmentSupport = {
  'hiring-incentives': [
    ['查詢年度可用補貼項目', '匯總當年可用僱用補貼與條件。', 'list-available-incentives'],
    ['核對資格與申請條件', '比對年齡、身分、地區與崗位。', 'check-eligibility'],
    ['準備補貼申請材料', '收集表格、證明與企業文件。', 'prepare-application-docs'],
    ['提交與追蹤申請進度', '平台提交、回覆與狀態追蹤。', 'submit-and-track-application'],
    ['處理補貼審核與發放問題', '補件、異議與發放延遲處理。', 'resolve-incentive-issues'],
  ],
  'startup-funding': [
    ['瀏覽可申請的創業基金', '義大利/歐盟的補助與貸款渠道。', 'browse-grants-loans'],
    ['註冊申請平台並建立帳號', '平台註冊、身份驗證與企業綁定。', 'register-funding-platform'],
    ['撰寫商業計畫書', '市場、財務、里程碑與風險。', 'write-business-plan'],
    ['準備財務與預算文件', '現金流、成本預算與融資用途。', 'prepare-financials-and-budget'],
    ['追蹤申請結果與拒批原因', '查詢進度、復議與下一輪機會。', 'track-results-and-appeals'],
  ],
  'training-and-reemployment': [
    ['搜尋可報名的公費培訓', '地區/歐盟資助課程與報名入口。', 'search-public-training'],
    ['填寫申請表與上傳材料', '線上表單、文件上傳與時限。', 'fill-application-and-upload'],
    ['參加課程並獲得結業證書', '出勤、考核與結訓證明。', 'attend-courses-and-get-certificate'],
    ['將培訓成果連結至就業服務', '與 CPI/就業服務銜接，提升就業機會。', 'link-training-to-employment-services'],
    ['評估培訓效果與再就業成效', '衡量成效、調整路徑與後續計畫。', 'evaluate-training-outcomes'],
  ],
  'chambers-and-associations': [
    ['查找地區商會與協會資源', '查詢 CCIAA 與行業協會資源。', 'find-chambers-and-associations'],
    ['聯繫顧問或導師諮詢服務', '約談顧問/導師並訂定議題。', 'contact-advisors-or-mentors'],
    ['參加行業活動與培訓', '活動日曆、報名與參與要點。', 'join-industry-events'],
    ['使用商會線上工具與資料庫', '企業名錄、統計資料與表單下載。', 'use-chamber-tools-and-databases'],
    ['加入協會網絡並建立合作', '加入社群、建立聯絡與合作。', 'join-association-network'],
  ],
};

// 统一生成函数
function generateForL3Group(groupBaseDir, mapping) {
  const l3Keys = Object.keys(mapping);
  l3Keys.forEach((l3DirName) => {
    const l3Dir = path.join(groupBaseDir, l3DirName);
    if (!fs.existsSync(l3Dir)) {
      console.warn('WARN: L3 directory not found, skip:', path.relative(process.cwd(), l3Dir));
      return;
    }
    const items = mapping[l3DirName];

    items.forEach(([title, description, slug], idx) => {
      const l4Dir = path.join(l3Dir, slug || kebab(title));
      const catPath = path.join(l4Dir, '_category_.json');
      const mdPath = path.join(l4Dir, 'index.md');

      writeIfMissing(
        catPath,
        categoryJson({ label: title, position: idx + 1, collapsed: true, linkDocId: 'index' })
      );

      writeIfMissing(
        mdPath,
        l4IndexMd({ title, description })
      );
    });
  });
}

// 主执行
(function main() {
  // 1) employee-system
  generateForL3Group(path.join(DOCS_ROOT, 'employee-system'), employeeSystem);

  // 2) self-employment
  generateForL3Group(path.join(DOCS_ROOT, 'self-employment'), selfEmployment);

  // 3) enterprise-system
  generateForL3Group(path.join(DOCS_ROOT, 'enterprise-system'), enterpriseSystem);

  // 4) employment-and-startup-support
  generateForL3Group(path.join(DOCS_ROOT, 'employment-and-startup-support'), employmentSupport);

  console.log('\n✅ L4 skeleton generation finished.');
})();
