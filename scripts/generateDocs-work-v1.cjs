// scripts/generateDocs-work-v1.cjs
// 生成「💼 工作與經營（Lavoro e Impresa）」L1→L3 骨架，繁體標題 + L3 占位
const fs = require("fs");
const path = require("path");

const docsRoot = path.resolve("docs");

// ===== 結構定義（嚴格對齊你確認的修正版 v1.0-pre）=====
const work = {
  key: "work-and-business",
  label: "💼 工作與經營（Lavoro e Impresa）",
  // L2
  children: [
    {
      key: "employee-system",
      label: "👔 雇員體系（Lavoro dipendente）",
      items: [
        ["job-search-channels", "找工作與招聘渠道（Ricerca di lavoro e canali di assunzione）",
          "主要招聘網站、人才機構、以及地方就業中心（Centro per l’Impiego）。\n\n*（建議展開至 L4：各渠道比較與註冊教學）*"],
        ["contracts-salary", "合同與薪資（Contratto e retribuzione）",
          "正職、兼職、實習合同類型，及工資構成（淨薪/稅前）。\n\n*（建議展開至 L4：合同樣例與薪資單解析）*"],
        ["tax-inps-irpef", "稅務與社保（INPS / IRPEF）",
          "雇員個人所得稅（IRPEF）與社保繳費體系。\n\n*（建議展開至 L4：月度扣繳示例）*"],
        ["rights-holidays", "勞工權益與假期（Diritti del lavoratore e ferie）",
          "病假、帶薪假、工會權利與加班規範。\n\n*（建議展開至 L4：法定假期清單 + 合同條文）*"],
        ["parttime-flex", "兼職與靈活用工（Part-time e lavoro flessibile）",
          "短期合同、季節工與零工經濟的法律定位。\n\n*（建議展開至 L4：常見工種與權益差異）*"],
      ],
    },
    {
      key: "self-employed",
      label: "🧾 自雇體系（Lavoro autonomo / Partita IVA）",
      items: [
        ["partita-iva-setup", "Partita IVA 開設流程（Apertura della Partita IVA）",
          "適用人群、所需文件與開設步驟。\n\n*（建議展開至 L4：Agenzia delle Entrate 操作步驟）*"],
        ["invoicing-accounting", "發票與收入管理（Fatturazione e contabilità）",
          "電子發票（Fattura elettronica）與簡化記帳規則。\n\n*（建議展開至 L4：開票範例與稅務軟體介紹）*"],
        ["tax-declaration", "繳稅與申報（Dichiarazione e versamento imposte）",
          "IRPEF、INPS、IVA 等稅種與季度報稅節點。\n\n*（建議展開至 L4：繳稅時間表與報稅方式）*"],
        ["closure-or-transform", "結束與轉換（Chiusura o trasformazione della P.IVA）",
          "停業、註銷、轉型為公司或雇員的流程。\n\n*（建議展開至 L4：遞交方式與表格示例）*"],
      ],
    },
    {
      key: "enterprise-system",
      label: "🏢 企業體系（Impresa e commercio）",
      items: [
        ["company-setup", "公司設立（Ditta individuale / SRL / SNC）",
          "不同企業類型的設立要求與註冊程序。\n\n*（建議展開至 L4：商會登記步驟與稅務代碼）*"],
        ["finance-tax", "財務與稅務管理（Contabilità e bilancio）",
          "年度財報、會計師角色與企業報稅義務。\n\n*（建議展開至 L4：Bilancio 範例 + 提交流程）*"],
        ["hr-management", "雇員聘用與管理（Gestione del personale）",
          "招聘、合同註冊與薪資發放規範。\n\n*（建議展開至 L4：INPS與INAIL流程）*"],
        ["ops-licenses", "商業運營與執照（Licenze e attività commerciali）",
          "各類商業執照、開業通報（SCIA）與食品相關認證。\n\n*（建議展開至 L4：商業登記表樣本）*"],
        ["italy-china-commerce", "中意商務與跨境業務（Commercio italo-cinese）",
          "進出口貿易、報關與中意稅務協定。\n\n*（建議展開至 L4：關鍵法規與實例分析）*"],
        ["company-changes-liquidation", "公司變更與解散（Modifiche e liquidazione）",
          "公司變更章程、清算與結業流程。\n\n*（建議展開至 L4：官方文件與時限）*"],
      ],
    },
    {
      key: "incentives-opportunities",
      label: "📈 就業與創業支援（Incentivi e opportunità）",
      items: [
        ["employment-incentives", "就業補貼與實習計畫（Incentivi all’assunzione）",
          "政府提供的青年、女性、長期失業者僱用獎勵。\n\n*（建議展開至 L4：現行補貼名錄與申請條件）*"],
        ["startup-financing", "創業資助（Finanziamenti e start-up）",
          "義大利與歐盟創業基金、女性創業支持計畫。\n\n*（建議展開至 L4：申請平臺與案例）*"],
        ["training-reemployment", "培訓與再就業（Formazione e reinserimento）",
          "對轉職或失業人員的專項課程與支援項目。\n\n*（建議展開至 L4：地區課程名單）*"],
        ["chambers-associations", "商會與協會支援（Camere di commercio e associazioni）",
          "商會服務、行業協會與稅務顧問網絡。\n\n*（建議展開至 L4：主要城市名錄）*"],
      ],
    },
  ],
};

// ===== 小工具 =====
function ensureDir(p){ if(!fs.existsSync(p)) fs.mkdirSync(p, {recursive:true}); }
function writeJSON(file, obj){ fs.writeFileSync(file, JSON.stringify(obj, null, 2), "utf8"); }
function writeMD(file, title, body){
  const content = `---\ntitle: ${title}\n---\n\n${body}\n`;
  fs.writeFileSync(file, content, "utf8");
}
function catFor(dir, idPath, label){
  writeJSON(path.join(dir, "_category_.json"), {
    label, collapsed: false, link: { type: "doc", id: `${idPath}/index` }
  });
}
function createIfMissing(file, cb){ if(!fs.existsSync(file)) cb(); }

// ===== 生成主流程 =====
(function run(){
  const l1Dir = path.join(docsRoot, work.key);
  ensureDir(l1Dir);
  catFor(l1Dir, work.key, work.label);
  createIfMissing(path.join(l1Dir, "index.md"), () =>
    writeMD(
      path.join(l1Dir, "index.md"),
      work.label,
      `> 本章為 **${work.label}** 的入口頁（L1）。\n> 下列為子分類（L2）：雇員體系 / 自雇體系 / 企業體系 / 就業與創業支援。`
    )
  );

  for (const l2 of work.children){
    const l2Dir = path.join(l1Dir, l2.key);
    ensureDir(l2Dir);
    catFor(l2Dir, `${work.key}/${l2.key}`, l2.label);
    createIfMissing(path.join(l2Dir, "index.md"), () =>
      writeMD(
        path.join(l2Dir, "index.md"),
        l2.label,
        `> 本章介紹 **${l2.label}**（L2）。以下為 L3 條目一覽。`
      )
    );

    for (const [slug, title, hint] of l2.items){
      const l3Dir = path.join(l2Dir, slug);
      ensureDir(l3Dir);
      catFor(l3Dir, `${work.key}/${l2.key}/${slug}`, title);
      createIfMissing(path.join(l3Dir, "index.md"), () =>
        writeMD(
          path.join(l3Dir, "index.md"),
          title,
          `> **${title}**（L3）。\n\n${hint}\n\n> 🔧 後續在此展開 L4/L5（流程、材料清單、注意事項、FAQ、模板等）。`
        )
      );
    }
  }
  console.log("✅ 已生成：docs/work-and-business（L1→L3）骨架，對齊修正版 v1.0-pre。");
})();
