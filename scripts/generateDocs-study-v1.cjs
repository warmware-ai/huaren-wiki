// scripts/generateDocs-study-v1.cjs
// 生成「🎓 學習與發展（Studio e Formazione）」L1→L3 骨架（繁體）
// CommonJS，可直接 `node` 執行

const fs = require("fs");
const path = require("path");

const docsRoot = path.resolve("docs");

// ===== 結構定義（嚴格對齊你提供的 v1.0-pre）=====
const study = {
  key: "study-education",
  label: "🎓 學習與發展（Studio e Formazione）",
  intro:
    "涵蓋義大利正規教育、語言與成人教育、技能與職業培訓、學歷與資格認證，以及職業發展等主題，為在義求學與進修者提供系統導航。",
  children: [
    {
      key: "istruzione-formale",
      label: "🏫 正規教育（Istruzione formale）",
      items: [
        [
          "struttura-sistema-educativo",
          "義大利教育體系概覽（Struttura del sistema educativo）",
          "義大利中學、大學、研究生體系與評分制度總覽。\n\n*（建議展開至 L4：學制結構圖 + 入學年齡）*",
        ],
        [
          "scuola-superiore",
          "高中教育（Scuola superiore）",
          "Liceo、Istituto tecnico、Istituto professionale 各類高中差異。\n\n*（建議展開至 L4：各類學校課程與畢業證書）*",
        ],
        [
          "universita",
          "大學（Università）",
          "學士課程（Laurea triennale）結構、錄取條件、學分制度（CFU）。\n\n*（建議展開至 L4：入學申請與學籍維護）*",
        ],
        [
          "laurea-magistrale-master",
          "研究生教育（Laurea magistrale / Master）",
          "碩士與專業碩士（Master universitario）之異同。\n\n*（建議展開至 L4：國際學生申請與獎學金）*",
        ],
        [
          "accademia-conservatorio",
          "藝術與設計院校（Accademia / Conservatorio）",
          "藝術、音樂與設計專業的獨立高等教育體系。\n\n*（建議展開至 L4：入試制度與學歷承認）*",
        ],
        [
          "universita-telematica-istituti-privati",
          "遠程與私立教育（Università telematica / Istituti privati）",
          "線上大學、私立機構之認證標準與學位承認問題。\n\n*（建議展開至 L4：認可清單與防假文憑提示）*",
        ],
      ],
    },
    {
      key: "lingua-formazione-generale",
      label: "💬 語言與成人教育（Lingua e formazione generale）",
      items: [
        [
          "apprendimento-italiano",
          "義大利語學習路徑（Apprendimento dell’italiano）",
          "從零基礎到 B2 水平的課程與資源。\n\n*（建議展開至 L4：CILS / CELI / PLIDA 考試比較）*",
        ],
        [
          "certificazioni-linguistiche",
          "語言考試與認證（Certificazioni linguistiche）",
          "各類考試結構、報名方式與用途。\n\n*（建議展開至 L4：考試樣題與官方機構）*",
        ],
        [
          "cpia-istruzione-adulti",
          "成人教育與 CPIA（Istruzione per adulti / CPIA）",
          "義大利公立成人教育中心介紹與報名流程。\n\n*（建議展開至 L4：課程時間與地區清單）*",
        ],
        [
          "corsi-brevi-formazione-pratica",
          "職業技能與短期培訓（Corsi brevi e formazione pratica）",
          "專業技能提升課程與地區培訓機構。\n\n*（建議展開至 L4：熱門課程分類與網站）*",
        ],
        [
          "autoformazione-online",
          "線上與自主學習（Autoformazione online）",
          "可免費使用的教育平台（edX、Coursera、FutureLearn 等）。\n\n*（建議展開至 L4：推薦課程與學習策略）*",
        ],
      ],
    },
    {
      key: "formazione-professionale",
      label: "🧰 技能與職業培訓（Formazione professionale）",
      items: [
        [
          "sistema-formazione-professionale",
          "職業培訓體系概覽（Sistema della formazione professionale）",
          "公立與私立培訓結構、資助與認證方式。\n\n*（建議展開至 L4：地區與歐盟資助課程）*",
        ],
        [
          "settori-di-formazione",
          "行業培訓課程（Settori di formazione）",
          "餐飲、建築、美容、數位等熱門領域。\n\n*（建議展開至 L4：職業學校與入學條件）*",
        ],
        [
          "qualifiche-professionali",
          "職業資格與認證（Qualifiche professionali）",
          "EQF 架構下的資格等級與官方認證流程。\n\n*（建議展開至 L4：資格轉換與續期）*",
        ],
        [
          "apprendistato-tirocinio",
          "學徒制與企業培訓（Apprendistato e tirocinio）",
          "學徒合同類型、保險與勞工保障。\n\n*（建議展開至 L4：合同樣式與申請路徑）*",
        ],
        [
          "riqualificazione-professionale",
          "再就業與轉型培訓（Riqualificazione professionale）",
          "政府與地區再就業支援計畫。\n\n*（建議展開至 L4：地區計畫清單）*",
        ],
      ],
    },
    {
      key: "riconoscimento-titoli-qualifiche",
      label: "🪪 學歷與資格認證（Riconoscimento titoli e qualifiche）",
      items: [
        [
          "panoramica-riconoscimento-titoli",
          "學歷認證總覽（Panoramica sul riconoscimento dei titoli）",
          "官方機構（CIMEA、MIUR）與流程概述。\n\n*（建議展開至 L4：官方申請入口與時間線）*",
        ],
        [
          "riconoscimento-accademico",
          "學術類認證（Riconoscimento accademico）",
          "用於升學的學位等值與學分承認。\n\n*（建議展開至 L4：大學內部程序）*",
        ],
        [
          "riconoscimento-professionale",
          "職業資格認證（Riconoscimento professionale）",
          "醫師、建築師、律師等受管制職業之承認機制。\n\n*（建議展開至 L4：各職業主管機關清單）*",
        ],
        [
          "traduzione-legalizzazione",
          "翻譯與公證（Traduzione e legalizzazione）",
          "官方譯文、公證與 Apostille 要求。\n\n*（建議展開至 L4：文件格式範例）*",
        ],
        [
          "accordi-internazionali",
          "國際與跨國認證（Accordi internazionali）",
          "中意教育協議與歐盟內互認框架。\n\n*（建議展開至 L4：協議摘要 + 參考文件）*",
        ],
      ],
    },
    {
      key: "sviluppo-professionale",
      label: "🚀 職業發展（Sviluppo professionale）",
      items: [
        [
          "formazione-continua",
          "持續教育與再培訓（Formazione continua）",
          "專業人士的學分制培訓（CFP）。\n\n*（建議展開至 L4：行業要求對照表）*",
        ],
        [
          "ordini-professionali",
          "專業協會與註冊（Ordini professionali）",
          "義大利各行業協會及註冊流程。\n\n*（建議展開至 L4：官方名錄與報名費用）*",
        ],
        [
          "aggiornamento-qualifiche",
          "資格更新與升級課程（Aggiornamento delle qualifiche）",
          "專業證照續期與進修規定。\n\n*（建議展開至 L4：續期申請材料）*",
        ],
        [
          "competenze-trasversali",
          "職場軟技能與語言提升（Competenze trasversali）",
          "溝通、團隊、談判、跨文化協作等核心技能。\n\n*（建議展開至 L4：課程推薦與企業內訓）*",
        ],
        [
          "career-change-personal-branding",
          "職業轉型與個人品牌（Career change e personal branding）",
          "自我定位、LinkedIn 優化、自由職業策略。\n\n*（建議展開至 L4：案例分析 + 模板）*",
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
  const l1Dir = path.join(docsRoot, study.key);
  ensureDir(l1Dir);
  catFor(l1Dir, study.key, study.label);
  createIfMissing(path.join(l1Dir, "index.md"), () =>
    writeMD(
      path.join(l1Dir, "index.md"),
      study.label,
      `> 本章為 **${study.label}** 的入口頁（L1）。\n\n${study.intro}\n\n> 下列為子分類（L2）：正規教育 / 語言與成人教育 / 技能與職業培訓 / 學歷與資格認證 / 職業發展。`
    )
  );

  for (const l2 of study.children){
    const l2Dir = path.join(l1Dir, l2.key);
    ensureDir(l2Dir);
    catFor(l2Dir, `${study.key}/${l2.key}`, l2.label);
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
      catFor(l3Dir, `${study.key}/${l2.key}/${slug}`, title);
      createIfMissing(path.join(l3Dir, "index.md"), () =>
        writeMD(
          path.join(l3Dir, "index.md"),
          title,
          `> **${title}**（L3）。\n\n${hint}\n\n> 🔧 後續在此展開 L4/L5（流程、材料清單、注意事項、FAQ、模板等）。`
        )
      );
    }
  }
  console.log("✅ 已生成：docs/study-education（L1→L3）骨架，對齊修正版 v1.0-pre。");
})();
