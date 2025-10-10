// @ts-check

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Huaren Wiki',
  tagline: '意大利華人百科 · 生活 · 教育 · 醫療 · 工作 · 福利 · 法律',
  url: 'https://wiki.warmware.ai',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  markdown: {
  hooks: {
    onBrokenMarkdownLinks: 'warn',
  },
},

  favicon: 'img/favicon.ico',

  // 仅开启繁体（主语言）
  i18n: {
    defaultLocale: 'zh-Hant',
    locales: ['zh-Hant'],
  },

  // ✅ 启用 docs 插件（classic preset）
  presets: [
    [
      'classic',
      ({
        docs: {
          routeBasePath: 'docs',
          sidebarPath: require.resolve('./sidebars.js'),
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
        },
      }),
    ],
  ],

  // 本地搜索插件
  plugins: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['zh', 'en', 'it'],
        indexDocs: true,
        indexPages: true,
        docsRouteBasePath: '/docs',
      },
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    navbar: {
      title: 'Huaren Wiki',
      logo: { alt: 'Huaren Wiki', src: 'img/logo.svg' },
      items: [
        { type: 'doc', docId: 'life-and-settlement/index', label: '🏠 生活與安居', position: 'left' },
        { type: 'doc', docId: 'work-and-business/index',   label: '💼 工作與經營', position: 'left' },
        { type: 'doc', docId: 'family-welfare/index',       label: '👨‍👩‍👧 家庭與福利', position: 'left' },
        { type: 'doc', docId: 'study-education/index',      label: '🎓 學習與發展', position: 'left' },
        { type: 'doc', docId: 'rules-and-rights/index',     label: '⚖️ 規則與權益', position: 'left' },
        { type: 'doc', docId: 'arrival-prep/index',         label: '✈️ 來意準備', position: 'left' },
        { href: 'https://github.com/warmware-ai/huaren-wiki', label: 'GitHub', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '目錄',
          items: [
            { label: '生活與安居', to: '/docs/life-and-settlement/' },
            { label: '工作與經營', to: '/docs/work-and-business/' },
            { label: '家庭與福利', to: '/docs/family-welfare/' },
            { label: '學習與發展', to: '/docs/study-education/' },
            { label: '規則與權益', to: '/docs/rules-and-rights/' },
            { label: '來意準備',   to: '/docs/arrival-prep/' },
          ],
        },
        {
          title: '社區',
          items: [
            { label: 'GitHub Issues', href: 'https://github.com/warmware-ai/huaren-wiki/issues' },
            { label: '反饋表單', href: '#' },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Huaren Wiki · wiki.warmware.ai`,
    },
  },
};

module.exports = config;
