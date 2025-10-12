// scripts/generateDocs-rules-v1.cjs
// 生成「⚖️ 規則與權益（Norme e Diritti）」L1→L3 骨架（繁體）
// CommonJS，直接用 `node` 執行

const fs = require("fs");
const path = require("path");

const docsRoot = path.resolve("docs");

// ===== 結構定義（嚴格對齊你提供的 v1.0-pre）=====
const rules = {
  key: "rules-and-rights",
  label: "⚖️ 規則與權益（Norme e Diritti）",
  intro:
    "涵蓋移民與居留、勞動法與勞工權益、消費者保護與租房法，以及稅務與行政法等主題，提供在義華人日常合規與維權的實用指引。",
  children: [
    {
      key: "immigrazione-soggiorno",
      label: "🛂 居留與移民法（Leggi su immigrazione e soggiorno）",
      items: [
        [
          "testo-unico-immigrazione",
          "移民法框架（Testo unico sull’immigrazione）",
          "義大利移民法核心結構、主要條款與行政實施機構。\n\n*（建議展開至 L4：關鍵條文 + 變更歷史）*",
        ],
        [
          "diritti-doveri-soggiornante",
          "居留權利與義務（Diritti e doveri del soggiornante）",
          "居留持有者的工作、教育、醫療與家庭權益。\n\n*（建議展開至 L4：各類居留對應權益表）*",
        ],
        [
          "ricorso-appello",
          "上訴與申訴流程（Ricorso e appello）",
          "拒簽、拒居留及遣返等情形的行政上訴途徑。\n\n*（建議展開至 L4：遞交程序與時限）*",
        ],
        [
          "sanatoria-regolarizzazione",
          "無證狀態與規範化（Sanatoria e regolarizzazione）",
          "無證居民合法化政策、條件與辦理窗口。\n\n*（建議展開至 L4：歷史案例與當前開放期）*",
        ],
      ],
    },
    {
      key: "diritto-lavoro-tutela",
      label: "⚙️ 勞動法與勞工權益（Diritto del lavoro e tutela dei lavoratori）",
      items: [
        [
          "contratto-di-lavoro",
          "勞動合同法基礎（Contratto di lavoro）",
          "正職、兼職、臨時合同分類與工資最低標準。\n\n*（建議展開至 L4：合同樣例與常見條款）*",
        ],
        [
          "licenziamento-indennita",
          "辭退與補償（Licenziamento e indennità）",
          "雇主解雇流程、補償金計算與申訴機制。\n\n*（建議展開至 L4：案例與工會支援）*",
        ],
        [
          "sindacati-arbitrato",
          "工會與仲裁（Sindacati e arbitrato）",
          "主要工會介紹與仲裁委員會流程。\n\n*（建議展開至 L5：常用工會聯絡方式）*",
        ],
        [
          "infortuni-inail",
          "工傷與 INAIL 保護（Infortuni e INAIL）",
          "工傷申報、保險覆蓋範圍與賠償程序。\n\n*（建議展開至 L4：申請表與報告樣式）*",
        ],
      ],
    },
    {
      key: "consumatore-locazione",
      label: "🛒 消費者保護與租房法（Tutela del consumatore e locazione）",
      items: [
        [
          "diritti-del-consumatore",
          "消費者權益與退換政策（Diritti del consumatore）",
          "網購、超市、電信與金融產品的退換保障。\n\n*（建議展開至 L4：法條摘要 + 投訴途徑）*",
        ],
        [
          "contratti-di-locazione",
          "租房合同法律要點（Contratti di locazione）",
          "定期與非定期租約、法律效力與註冊義務。\n\n*（建議展開至 L4：合同模板與稅務報告）*",
        ],
        [
          "reclami-ricorsi",
          "維權與申訴途徑（Reclami e ricorsi）",
          "消費糾紛的正式申訴管道與消費者協會。\n\n*（建議展開至 L5：各地協會聯絡方式）*",
        ],
        [
          "truffe-online-sicurezza",
          "網購詐騙與防範（Truffe online e sicurezza）",
          "常見詐騙手法、舉報機制與警方管道。\n\n*（建議展開至 L4：報警流程與舉報平台）*",
        ],
      ],
    },
    {
      key: "tributario-amministrativo",
      label: "💶 稅務與行政法（Diritto tributario e amministrativo）",
      items: [
        [
          "procedura-tributaria",
          "稅務程序與審查（Procedura tributaria）",
          "稅務通知、上訴與追繳程序。\n\n*（建議展開至 L4：Agenzia delle Entrate 流程圖）*",
        ],
        [
          "sanzioni-ricorsi-amministrativi",
          "行政上訴與罰款（Sanzioni e ricorsi amministrativi）",
          "行政罰款種類、減免途徑與申訴表格。\n\n*（建議展開至 L4：常見案例與模板）*",
        ],
        [
          "gdpr-privacy",
          "隱私與數據保護（GDPR e privacy）",
          "GDPR 核心概念、數據保存期限與用戶權利。\n\n*（建議展開至 L4：隱私權利申請示例）*",
        ],
        [
          "cittadinanza-status",
          "公民與居留身份變更（Cittadinanza e status amministrativo）",
          "永居、歸化、雙重國籍與放棄國籍流程。\n\n*（建議展開至 L4：年限對應表與材料清單）*",
        ],
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
  const l1Dir = path.join(docsRoot, rules.key);
  ensureDir(l1Dir);
  catFor(l1Dir, rules.key, rules.label);
  createIfMissing(path.join(l1Dir, "index.md"), () =>
    writeMD(
      path.join(l1Dir, "index.md"),
      rules.label,
      `> 本章為 **${rules.label}** 的入口頁（L1）。\n\n${rules.intro}\n\n> 下列為子分類（L2）：居留與移民法 / 勞動法與勞工權益 / 消費者保護與租房法 / 稅務與行政法。`
    )
  );

  for (const l2 of rules.children){
    const l2Dir = path.join(l1Dir, l2.key);
    ensureDir(l2Dir);
    catFor(l2Dir, `${rules.key}/${l2.key}`, l2.label);
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
      catFor(l3Dir, `${rules.key}/${l2.key}/${slug}`, title);
      createIfMissing(path.join(l3Dir, "index.md"), () =>
        writeMD(
          path.join(l3Dir, "index.md"),
          title,
          `> **${title}**（L3）。\n\n${hint}\n\n> 🔧 後續在此展開 L4/L5（流程、材料清單、注意事項、FAQ、模板等）。`
        )
      );
    }
  }
  console.log("✅ 已生成：docs/rules-and-rights（L1→L3）骨架，對齊修正版 v1.0-pre。");
})();
