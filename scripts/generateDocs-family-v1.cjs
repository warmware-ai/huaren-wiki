// scripts/generateDocs-family-v1.cjs
// 生成「👨‍👩‍👧 家庭與福利（Famiglia e Welfare）」L1→L3 骨架（繁體）
// 與既有工作板塊腳本風格一致，CommonJS 可直接 node 執行

const fs = require("fs");
const path = require("path");

const docsRoot = path.resolve("docs");

// ===== 結構定義（嚴格對齊你確認的 v1.0-pre）=====
const family = {
  key: "family-welfare",
  label: "👨‍👩‍👧 家庭與福利（Famiglia e Welfare）",
  intro:
    "這一板塊是整個 Huaren Wiki 最生活化、與民眾政策密切相關的部分，涵蓋從兒童教育、補助金、婚姻文件到老年與殘障福利，是家庭在意大利安居的重要支撐層。",
  children: [
    {
      key: "educazione-cura-figli",
      label: "🧒 子女教育與托育（Educazione e cura dei figli）",
      items: [
        [
          "asilo-nido",
          "托兒所（Asilo nido）",
          "0–3 歲幼兒托育機構，公立與私立之差異與申請方式。\n\n*（建議展開至 L4：報名流程、ISEE 申請、地區補貼）*",
        ],
        [
          "scuola-dell-infanzia",
          "幼兒園（Scuola dell’infanzia）",
          "3–6 歲學前教育制度與報名規範。\n\n*（建議展開至 L4：開放日期、文件清單）*",
        ],
        [
          "scuola-primaria-secondaria-primo-grado",
          "小學與初中（Scuola primaria e secondaria di primo grado）",
          "義務教育階段的入學流程、分區原則與課程設置。\n\n*（建議展開至 L4：報名步驟與在校服務）*",
        ],
        [
          "mensa-trasporto-doposcuola",
          "校餐、校車與課後服務（Mensa, trasporto e doposcuola）",
          "家長最常涉及的學校服務與費用補助。\n\n*（建議展開至 L4：收費標準與減免政策）*",
        ],
      ],
    },
    {
      key: "sussidi-agevolazioni-familiari",
      label: "💶 家庭補貼與津貼（Sussidi e agevolazioni familiari）",
      items: [
        [
          "isee",
          "ISEE 申報與核算（Indicatore della Situazione Economica Equivalente）",
          "義大利家庭經濟指數的申報流程與應用場景。\n\n*（建議展開至 L4：模擬計算與申報平臺）*",
        ],
        [
          "assegno-unico",
          "兒童津貼（Assegno unico universale）",
          "每名子女每月可領取的補助金，與 ISEE 掛鉤。\n\n*（建議展開至 L4：金額對照表與申請步驟）*",
        ],
        [
          "bonus-mamma-bebe",
          "生育補助（Bonus mamma domani / Bonus bebè）",
          "懷孕與生產階段的補助政策。\n\n*（建議展開至 L4：所需文件與線上申請）*",
        ],
        [
          "bonus-affitto-energia",
          "租房補助與能源補貼（Bonus affitto e luce/gas）",
          "地區性補助與全國性能源補貼介紹。\n\n*（建議展開至 L4：地區名錄與線上連結）*",
        ],
        [
          "detrazioni-fiscali-famiglia",
          "稅收抵扣與家庭支出減免（Detrazioni fiscali per la famiglia）",
          "教育、醫療、育兒支出的報稅抵扣方式。\n\n*（建議展開至 L4：稅表實例與申報教學）*",
        ],
      ],
    },
    {
      key: "matrimonio-documenti-familiari",
      label: "💍 婚姻與家庭文件（Matrimonio e documenti familiari）",
      items: [
        [
          "matrimonio-civile-religioso",
          "結婚登記與文件（Matrimonio civile / religioso）",
          "義民事婚與宗教婚登記的文件要求與流程。\n\n*（建議展開至 L4：Comune 辦理範例）*",
        ],
        [
          "ricongiungimento-familiare",
          "配偶居留與家庭團聚（Ricongiungimento familiare）",
          "家屬簽證與居留續期條件。\n\n*（建議展開至 L4：材料清單 + 流程圖）*",
        ],
        [
          "tutela-minori-divorzio",
          "監護與離婚手續（Tutela dei minori / Divorzio）",
          "子女監護權與離婚相關法律流程。\n\n*（建議展開至 L4：法院與律師介入步驟）*",
        ],
        [
          "matrimonio-misto-legalizzazioni",
          "國際婚姻與領事認證（Matrimonio misto / legalizzazioni consolari）",
          "涉外婚姻的文件合法化程序。\n\n*（建議展開至 L4：中意文書對應表）*",
        ],
      ],
    },
    {
      key: "servizi-sociali-assistenza-anziani",
      label: "🧓 社會服務與老年支持（Servizi sociali e assistenza anziani）",
      items: [
        [
          "casa-popolare",
          "社會住宅（Casa popolare）",
          "低收入家庭可申請的公共住房制度。\n\n*（建議展開至 L4：申請條件與分配流程）*",
        ],
        [
          "reddito-cittadinanza-assegno-inclusione",
          "救助金（Reddito di cittadinanza / Assegno di inclusione）",
          "基本生活支援計畫與就業條件。\n\n*（建議展開至 L4：金額計算與地區差異）*",
        ],
        [
          "assistenza-domiciliare",
          "老人護理與家庭服務（Assistenza domiciliare）",
          "長照居家服務、居家護理員聘用規範。\n\n*（建議展開至 L4：合同樣例與僱傭申報）*",
        ],
        [
          "invalidita-civile-disabilita",
          "殘障認定與福利（Invalidità civile e disabilità）",
          "醫療鑑定、補貼項目與復審流程。\n\n*（建議展開至 L4：官方申請表與評估標準）*",
        ],
        [
          "volontariato-rete-comunita",
          "志願者與社區資源（Volontariato e rete di comunità）",
          "義工協會、宗教團體與地方支援網絡。\n\n*（建議展開至 L4：主要協會名錄）*",
        ],
      ],
    },
    {
      key: "aggiornamenti-bonus-correnti",
      label: "📅 年度福利與政策更新（Aggiornamenti annuali e bonus correnti）",
      items: [
        [
          "bonus-attuali",
          "最新 Bonus 與補助政策（Bonus attuali）",
          "每年度中央與地區新發布的補助項目彙總。\n\n*（建議展開至 L4：可持續更新清單）*",
        ],
        [
          "detrazioni-aggiornate",
          "稅務減免年度變更（Detrazioni aggiornate）",
          "年度報稅規則與扣抵項目的變動。\n\n*（建議展開至 L4：官方公告整理）*",
        ],
        [
          "sportelli-regionali",
          "地區福利申請窗口（Sportelli regionali）",
          "各大區福利辦理網站與線下窗口。\n\n*（建議展開至 L4：對照表 + 官方鏈接）*",
        ],
        [
          "fonti-aggiornamenti",
          "動態追蹤與官方來源（Fonti e aggiornamenti）",
          "追蹤政府公報、INPS 公告、Gazzetta Ufficiale。\n\n*（建議展開至 L4：官方 RSS 與訂閱入口）*",
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
  const l1Dir = path.join(docsRoot, family.key);
  ensureDir(l1Dir);
  catFor(l1Dir, family.key, family.label);
  createIfMissing(path.join(l1Dir, "index.md"), () =>
    writeMD(
      path.join(l1Dir, "index.md"),
      family.label,
      `> 本章為 **${family.label}** 的入口頁（L1）。\n\n${family.intro}\n\n> 下列為子分類（L2）：子女教育與托育 / 家庭補貼與津貼 / 婚姻與家庭文件 / 社會服務與老年支持 / 年度福利與政策更新。`
    )
  );

  for (const l2 of family.children){
    const l2Dir = path.join(l1Dir, l2.key);
    ensureDir(l2Dir);
    catFor(l2Dir, `${family.key}/${l2.key}`, l2.label);
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
      catFor(l3Dir, `${family.key}/${l2.key}/${slug}`, title);
      createIfMissing(path.join(l3Dir, "index.md"), () =>
        writeMD(
          path.join(l3Dir, "index.md"),
          title,
          `> **${title}**（L3）。\n\n${hint}\n\n> 🔧 後續在此展開 L4/L5（流程、材料清單、注意事項、FAQ、模板等）。`
        )
      );
    }
  }
  console.log("✅ 已生成：docs/family-welfare（L1→L3）骨架，對齊修正版 v1.0-pre。");
})();
