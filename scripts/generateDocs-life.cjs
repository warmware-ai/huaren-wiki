// scripts/generateDocs-life.cjs
const fs = require("fs");
const path = require("path");

const docsRoot = path.resolve("docs");

// --------- 站点结构：生活與安居（L1→L3） ----------
const structure = {
  "life-and-settlement": {
    label: "🏠 生活與安居",
    children: {
      "permits-and-ids": {
        label: "🪪 居留與證件",
        children: [
          ["residence-permit", "居留（Permesso di soggiorno）"],
          ["codice-fiscale", "稅號（Codice fiscale）"],
          ["carta-identita", "身份證與居民登記（Carta d’identità / Residenza）"],
          ["tessera-sanitaria", "醫療卡與 SSN 註冊（Tessera sanitaria）"],
          ["spid-identita-digitale", "電子身份與 SPID（Identità digitale）"],
        ],
      },
      "housing-and-rent": {
        label: "🏡 居住與租房",
        children: [
          ["search-channels-and-lease-types", "找房渠道與租約類型"],
          ["contract-registration-deposit", "合同註冊與押金"],
          ["utilities-and-waste", "水電煤與垃圾費"],
          ["residenza-and-move", "戶籍登記與遷移"],
          ["buying-and-mortgage", "買房與貸款流程"],
        ],
      },
      "digital-and-comms": {
        label: "📱 數字與通信服務",
        children: [
          ["mobile-sim", "手機卡（Iliad / TIM / WindTre / Poste）"],
          ["home-broadband", "家庭寬帶與光纖"],
          ["digital-identity-pec", "數字身份與 PEC 郵箱"],
          ["online-e-gov-apps", "線上政務與 App 使用"],
          ["customer-service-complaints", "客服申訴與合同解約"],
        ],
      },
      "healthcare": {
        label: "🏥 醫療與健康",
        children: [
          ["medico-di-base", "家庭醫生註冊（Medico di base）"],
          ["specialistica-pronto-soccorso", "專科與急診流程"],
          ["cup-ricetta", "掛號與處方（CUP / Ricetta）"],
          ["vaccini-visite", "疫苗與體檢"],
          ["privato-rimborso", "私立診所與醫保報銷"],
        ],
      },
      "banking-and-payments": {
        label: "💳 銀行與支付",
        children: [
          ["account-opening", "開戶流程與文件"],
          ["cards-and-transfers", "銀行卡與轉帳"],
          ["online-payments", "在線支付（PagoPA / 電商 / 移動支付）"],
          ["international-remittance", "海外匯款與費率"],
          ["taxes-f24-pagopa", "稅務繳款與公共支付（F24 / PagoPA）"],
        ],
      },
    },
  },
};

// ---------- 基础工具 ----------
function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function writeJSON(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2), { encoding: "utf8" });
}

function writeMD(file, title, body) {
  const text = `---\ntitle: ${title}\n---\n\n${body}\n`;
  fs.writeFileSync(file, text, { encoding: "utf8" });
}

function createCategory(dir, idPath, label) {
  const json = {
    label,
    collapsed: false,
    link: { type: "doc", id: `${idPath}/index` },
  };
  writeJSON(path.join(dir, "_category_.json"), json);
}

function createIfMissing(filePath, generator) {
  if (!fs.existsSync(filePath)) {
    generator();
  }
}

// ---------- 生成骨架 ----------
(function build() {
  const [l1Key, l1Node] = Object.entries(structure)[0];
  const l1Dir = path.join(docsRoot, l1Key);
  ensureDir(l1Dir);

  createCategory(l1Dir, l1Key, l1Node.label);
  createIfMissing(path.join(l1Dir, "index.md"), () =>
    writeMD(
      path.join(l1Dir, "index.md"),
      l1Node.label,
      `> 本章涵蓋 **${l1Node.label}** 相關主題。以下為子分類入口（L2 層）：\n`
    )
  );

  // L2
  for (const [l2Key, l2Node] of Object.entries(l1Node.children)) {
    const l2Dir = path.join(l1Dir, l2Key);
    ensureDir(l2Dir);
    createCategory(l2Dir, `${l1Key}/${l2Key}`, l2Node.label);
    createIfMissing(path.join(l2Dir, "index.md"), () =>
      writeMD(
        path.join(l2Dir, "index.md"),
        l2Node.label,
        `> 本章介紹 **${l2Node.label}**。以下為對應的 L3 條目：\n`
      )
    );

    // L3
    for (const [slug, title] of l2Node.children) {
      const l3Dir = path.join(l2Dir, slug);
      ensureDir(l3Dir);
      createCategory(l3Dir, `${l1Key}/${l2Key}/${slug}`, title);
      createIfMissing(path.join(l3Dir, "index.md"), () =>
        writeMD(
          path.join(l3Dir, "index.md"),
          title,
          `> L3 條目 **${title}**。\n\n> 🔧 提示：後續在此補充 L4/L5 內容落地（流程、材料清單、注意事項、FAQ 等）。`
        )
      );
    }
  }

  console.log("✅ 已生成：docs/life-and-settlement (L1→L3) 目錄骨架。");
})();
