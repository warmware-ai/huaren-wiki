import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function Home() {
  const cards = [
    { title: '🏠 生活與安居', desc: '居留與證件 / 租房 / 醫療與銀行', href: '/docs/life-and-settlement/' },
    { title: '💼 工作與經營', desc: '雇員 / 自雇 / 公司 / 稅務合規', href: '/docs/work-and-business/' },
    { title: '👨‍👩‍👧 家庭與福利', desc: '教育 / 津貼 / 社會服務與住房', href: '/docs/family-welfare/' },
    { title: '🎓 學習與發展', desc: '學前到大學 / 留學與資格認證', href: '/docs/study-education/' },
    { title: '⚖️ 規則與權益', desc: '法律 / 勞動法 / 隱私 / 交通', href: '/docs/rules-and-rights/' },
    { title: '✈️ 來意準備', desc: '簽證 / 文件 / 公證 / 行前與落地', href: '/docs/arrival-prep/' },
  ];


  return (
    <Layout
      title="Huaren Wiki | 意大利華人百科"
      description="在意大利的生活、教育、醫療、工作、福利與法律指南">
      <main className="container mx-auto px-4 py-12">
        <section className="hero">
          <h1>Huaren Wiki · 意大利華人百科</h1>
          <p className="subtitle">居留 · 生活 · 教育 · 醫療 · 工作 · 福利 · 法律 —— 一站式中文指引</p>
          <div className="cta">
            <Link className="button button--primary" to="/docs">進入百科</Link>
            <Link className="button button--secondary margin-left--md" to="/docs">來意準備</Link>
          </div>
        </section>

        <section className="grid">
          {cards.map((c) => (
            <a className="card" key={c.title} href={c.href}>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </a>
          ))}
        </section>
      </main>
    </Layout>
  );
}
