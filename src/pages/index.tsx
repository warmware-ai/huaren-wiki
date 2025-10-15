import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useAllDocsData} from '@docusaurus/plugin-content-docs/client';

type Card = { title: string; to: string; emoji: string; desc: string };

const sections: Card[] = [
  { title: '生活與安居', emoji: '🏠', to: '/docs/life-and-settlement/', desc: '居留、租房、醫療、通訊、支付' },
  { title: '工作與經營', emoji: '💼', to: '/docs/work-and-business/',   desc: '雇員、自雇、創業、補貼' },
  { title: '家庭與福利', emoji: '👨‍👩‍👧', to: '/docs/family-welfare/',     desc: '子女教育、補助、婚姻文件、長照' },
  { title: '學習與發展', emoji: '🎓', to: '/docs/study-education/',       desc: '正規教育、語言、職培、資格認證' },
  { title: '規則與權益', emoji: '⚖️', to: '/docs/rules-and-rights/',      desc: '移民法、勞動法、消費者保護、稅務' },
  { title: '來意準備', emoji: '✈️', to: '/docs/arrival-prep/',           desc: '簽證、行前清單、抵達落地、留學' },
];

const shortcuts: Card[] = [
  { title: '居留申請/續期', emoji: '🪪', to: '/docs/life-and-settlement/permits-and-ids/residence-permit/', desc: '郵局 kit、指紋、時限' },
  { title: '稅號 Codice fiscale', emoji: '🧾', to: '/docs/life-and-settlement/permits-and-ids/codice-fiscale/', desc: '申請與補辦' },
  { title: '家庭醫生 Medico di base', emoji: '🏥', to: '/docs/life-and-settlement/healthcare/medico-di-base/', desc: '註冊與更換' },
  { title: '手機卡/寬帶', emoji: '📱', to: '/docs/life-and-settlement/digital-and-comms/mobile-sim/', desc: '套餐對比與開通' },
  { title: '銀行開戶', emoji: '💳', to: '/docs/life-and-settlement/banking-and-payments/account-opening/', desc: '文件與流程' },
  { title: 'ISEE 申報', emoji: '💶', to: '/docs/family-welfare/allowances-benefits/isee/', desc: '流程與用途' },
  { title: 'Universitaly 指南', emoji: '🧭', to: '/docs/arrival-prep/universitaly-preiscrizione/universitaly-guide/', desc: '註冊與上傳' },
  { title: '消費維權', emoji: '🛡️', to: '/docs/rules-and-rights/consumer-protection/complaints/', desc: '申訴與協會' },
];

function useLatestDocs(limit: number = 6) {
  // 收集全部 docs 的元数据（不区分版本，因为只启用了 current）
  const data = useAllDocsData();
  const current = data?.default?.versions?.[0]; // current
  const docs = current?.docs || [];
  // 过滤掉 L1/L2 索引页，突出“内容页”
  const filtered = docs.filter(d =>
    !d.id.endsWith('/index') && !d.id.endsWith('index')
  );
  const sorted = filtered
    .slice()
    .sort((a, b) => {
      const aTime = a.lastUpdatedAt ?? 0;
      const bTime = b.lastUpdatedAt ?? 0;
      return bTime - aTime;
    })
    .slice(0, limit);
  return sorted;
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  const latest = useLatestDocs(6);

  return (
    <Layout
      title="Huaren Wiki｜意大利華人百科"
      description="生活·教育·醫療·工作·福利·法律，一站式實用指南。"
    >
      <Head>
        <meta property="og:title" content="Huaren Wiki｜意大利華人百科" />
        <meta property="og:description" content="生活·教育·醫療·工作·福利·法律，一站式實用指南。" />
        <meta property="og:image" content="/img/social-card.png" />
      </Head>

      {/* Hero */}
      <header className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.title}>意大利華人百科 · Huaren Wiki</h1>
          <p className={styles.subtitle}>生活 · 教育 · 醫療 · 工作 · 福利 · 法律 — 一站式實用指南</p>
          <div className={styles.search}>
            <Link className={styles.searchBtn} to="/search">🔎 站內搜尋</Link>
          </div>
        </div>
      </header>

      <main>
        {/* 六大板块 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>快速進入板塊</h2>
          </div>
          <div className={styles.grid}>
            {sections.map((s) => (
              <Link key={s.to} className={styles.card} to={s.to}>
                <div className={styles.cardEmoji}>{s.emoji}</div>
                <div className={styles.cardTitle}>{s.title}</div>
                <div className={styles.cardDesc}>{s.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* 常用直达 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>常用辦事直達</h2>
          </div>
          <div className={styles.gridSm}>
            {shortcuts.map((s) => (
              <Link key={s.to} className={styles.cardSm} to={s.to}>
                <span className={styles.cardEmoji}>{s.emoji}</span>
                <span className={styles.cardTitleSm}>{s.title}</span>
                <span className={styles.cardDescSm}>{s.desc}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 最近更新（自动） */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>最近更新</h2>
          </div>
          <ul className={styles.updates}>
            {latest.map((d) => (
              <li key={d.id} className={styles.updateItem}>
                <Link to={d.permalink}>{d.title || d.id}</Link>
                {d.lastUpdatedAt && (
                  <time dateTime={new Date(d.lastUpdatedAt * 1000).toISOString()}>
                    {new Date(d.lastUpdatedAt * 1000).toLocaleDateString()}
                  </time>
                )}
              </li>
            ))}
            {latest.length === 0 && <li>目前還沒有更新記錄。</li>}
          </ul>
        </section>

        {/* 贡献 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>參與與反饋</h2>
          </div>
          <div className={styles.contrib}>
            <p>本項目社群協作維護，歡迎提交錯誤、補充內容或新增條目。</p>
            <div className={styles.contribBtns}>
              <Link className={styles.ghostBtn} to="https://github.com/warmware-ai/huaren-wiki/issues">提交 Issue</Link>
              <Link className={styles.ghostBtn} to="https://github.com/warmware-ai/huaren-wiki">在 GitHub 編輯</Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
