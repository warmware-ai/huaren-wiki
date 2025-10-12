// scripts/generateDocs-arrival-v1.cjs
// 生成「✈️ 來意準備（Prepararsi all’Italia）」L1→L3 骨架（繁體）
// CommonJS：直接 `node` 執行

const fs = require("fs");
const path = require("path");

const docsRoot = path.resolve("docs");

// ===== 結構定義（嚴格對齊你提供的 v1.0-pre）=====
const arrival = {
  key: "arrival-prep",
  label: "✈️ 來意準備（Prepararsi all’Italia）",
  intro:
    "行前簽證與文件、抵達後居留與落地實務、留學申請與預科，以及文化融入等一站式指南，幫助新到義大利的華人快速安頓。",
  children: [
    {
      key: "visti-permesso",
      label: "🗂️ 簽證與居留申請（Visti e Permesso）",
      items: [
        [
          "tipi-visto-requisiti",
          "簽證類型與申請條件（Tipi di visto e requisiti）",
          "學習、工作、家庭團聚、自雇與投資等主要簽證類型概覽與適用人群。\n\n*（建議展開至 L4：各類簽證流程 + 申請文件範例）*",
        ],
        [
          "prenotazione-documenti",
          "預約與材料清單（Prenotazione e documenti）",
          "VFS、領事館預約系統操作；材料準備、翻譯與格式要求。\n\n*（建議展開至 L4：表格樣例 + 常見錯誤）*",
        ],
        [
          "rifiuto-ricorso",
          "常見拒簽原因與補救流程（Rifiuto e ricorso）",
          "拒簽情形分類與上訴途徑，補交文件及時間線。\n\n*（建議展開至 L5：具體案例與實務建議）*",
        ],
        [
          "permesso-post-arrivo",
          "抵達後居留申請（Richiesta del permesso）",
          "郵局 kit 填寫、Questura 預約與指紋流程；不同城市差異。\n\n*（建議展開至 L4：流程圖 + 所需文件清單）*",
        ],
        [
          "rinnovo-permesso",
          "居留更新與延期時間表（Rinnovo del permesso）",
          "更新期限、文件清單、INPS 與稅務記錄要求。\n\n*（建議展開至 L4：續期流程與錯誤補救）*",
        ],
      ],
    },
    {
      key: "documenti-preparazione",
      label: "📑 行前文件與準備（Documenti e Preparazione）",
      items: [
        [
          "legalizzazione-apostille",
          "文件認證與 Apostille 流程（Legalizzazione e Apostille）",
          "涵蓋民事文件、學歷文件、公證順序與使用範圍。\n\n*（建議展開至 L4：各省外辦與認證樣例）*",
        ],
        [
          "traduzione-giurata",
          "翻譯與宣誓程序（Traduzione giurata）",
          "法定譯者要求、法院宣誓與格式規範。\n\n*（建議展開至 L4：翻譯樣式與公證格式）*",
        ],
        [
          "visita-assicurazione-farmaci",
          "體檢、保險與藥品準備（Visita medica e assicurazione）",
          "體檢類別、疫苗證明、海外醫療保險選擇與常用藥清單。\n\n*（建議展開至 L5：保險公司比較與理賠方式）*",
        ],
        [
          "conto-bancario-valuta",
          "錢款與銀行開戶預備（Conto bancario e valuta）",
          "攜帶現金限額、開戶需求、留學生與家庭帳戶差異。\n\n*（建議展開至 L4：開戶文件與流程）*",
        ],
        [
          "pre-departure-checklist",
          "行前 Check list（Lista di controllo prima della partenza）",
          "文件、財務、住宿、保險、電子設備等行前核對清單。\n\n*（建議展開至 L5：可下載表格模板）*",
        ],
      ],
    },
    {
      key: "arrivo-sistemazione",
      label: "🧳 抵達與落地實務（Arrivo e sistemazione）",
      items: [
        [
          "dogana-frontiera",
          "入境與海關流程（Controllo doganale e frontiera）",
          "入境檢查、隨身物品申報、常見問答。\n\n*（建議展開至 L4：入境常見 Q&A）*",
        ],
        [
          "dichiarazione-ospitalita",
          "暫住登記（Dichiarazione di ospitalità）",
          "房東與租戶責任、辦理時限、罰則說明。\n\n*（建議展開至 L4：範本與地方法規差異）*",
        ],
        [
          "servizi-di-base",
          "手機卡 / 網路 / 交通卡辦理總覽（Servizi di base）",
          "手機 SIM、寬帶與交通月票快速指南。\n\n*（建議展開至 L4：服務商與價格比較）*",
        ],
        [
          "tessera-sanitaria-temporanea",
          "醫療卡與家庭醫生臨時註冊（Tessera sanitaria temporanea）",
          "SSN 暫時註冊、醫生選擇與更新。\n\n*（建議展開至 L4：醫療卡申請表下載）*",
        ],
        [
          "emergenze-sicurezza",
          "緊急聯絡與報警電話清單（Emergenze e sicurezza）",
          "急救、報警、領事館、消防等聯絡方式彙整。\n\n*（建議展開至 L4：城市分區電話表）*",
        ],
      ],
    },
    {
      key: "universitaly-preiscrizione",
      label: "🎓 留學申請與預科（Universitaly e Pre-iscrizione）",
      items: [
        [
          "guida-universitaly",
          "Universitaly 平台操作指南（Guida alla piattaforma Universitaly）",
          "註冊、文件上傳與面試管理流程。\n\n*（建議展開至 L4：圖示步驟）*",
        ],
        [
          "traduzione-cimea",
          "學歷翻譯與 CIMEA 預審（Traduzione e CIMEA）",
          "CIMEA 流程、文件要求、官方網站與時間線。\n\n*（建議展開至 L4：中意對應表與案例）*",
        ],
        [
          "tolc-arces",
          "面試與入學考（TOLC / ARCES）",
          "考試類型、報名時間與備考要點。\n\n*（建議展開至 L5：試題示例）*",
        ],
        [
          "iscrizione-universitaria",
          "簽證銜接與學籍註冊（Iscrizione universitaria）",
          "銜接簽證與居留、入學文件提交。\n\n*（建議展開至 L4：時間軸與校內手續）*",
        ],
        [
          "accoglienza-orientamento",
          "新生入學報到流程（Accoglienza e orientamento）",
          "新生註冊、學校報到與住宿登記。\n\n*（建議展開至 L5：留學生 Check-in 指南）*",
        ],
      ],
    },
    {
      key: "integrazione-cultura",
      label: "🌍 文化與生活融入（Integrazione e cultura）",
      items: [
        [
          "galateo-abitudini",
          "意大利生活常識與禮儀（Galateo e abitudini）",
          "日常社交、餐桌文化與禁忌。\n\n*（建議展開至 L4：生活細節案例）*",
        ],
        [
          "costo-della-vita",
          "城市選擇與生活成本比較（Costo della vita）",
          "各地租金、交通、餐飲、教育等指標。\n\n*（建議展開至 L5：城市對比圖表）*",
        ],
        [
          "lingua-cultura",
          "語言與文化差異（Lingua e cultura）",
          "常見文化誤區與跨文化溝通策略。\n\n*（建議展開至 L4：文化案例 + 對話示例）*",
        ],
        [
          "comunita-associazioni",
          "華人社群與互助組織（Comunità cinese e associazioni）",
          "主要城市華人協會、學生會與互助社群。\n\n*（建議展開至 L4：城市名錄與聯絡方式）*",
        ],
        [
          "adattamento-benessere",
          "跨文化溝通與心理調適（Adattamento e benessere）",
          "文化衝擊階段與心理支援資源。\n\n*（建議展開至 L5：輔導中心與求助資源清單）*",
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
  const l1Dir = path.join(docsRoot, arrival.key);
  ensureDir(l1Dir);
  catFor(l1Dir, arrival.key, arrival.label);
  createIfMissing(path.join(l1Dir, "index.md"), () =>
    writeMD(
      path.join(l1Dir, "index.md"),
      arrival.label,
      `> 本章為 **${arrival.label}** 的入口頁（L1）。\n\n${arrival.intro}\n\n> 下列為子分類（L2）：簽證與居留申請 / 行前文件與準備 / 抵達與落地實務 / 留學申請與預科 / 文化與生活融入。`
    )
  );

  for (const l2 of arrival.children){
    const l2Dir = path.join(l1Dir, l2.key);
    ensureDir(l2Dir);
    catFor(l2Dir, `${arrival.key}/${l2.key}`, l2.label);
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
      catFor(l3Dir, `${arrival.key}/${l2.key}/${slug}`, title);
      createIfMissing(path.join(l3Dir, "index.md"), () =>
        writeMD(
          path.join(l3Dir, "index.md"),
          title,
          `> **${title}**（L3）。\n\n${hint}\n\n> 🔧 後續在此展開 L4/L5（流程、材料清單、注意事項、FAQ、模板等）。`
        )
      );
    }
  }
  console.log("✅ 已生成：docs/arrival-prep（L1→L3）骨架，對齊修正版 v1.0-pre。");
})();
