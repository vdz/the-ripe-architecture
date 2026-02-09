import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'MCE Architecture Onboarding',
  tagline: 'The Ripe Method - Front-end Architecture',
  favicon: 'images/logo.png',

  // Set production URL
  url: 'https://your-internal-domain.com',
  baseUrl: '/',

  // Geist fonts are loaded via @font-face in custom.css from npm package

  organizationName: 'mce',
  projectName: 'app-architecture-onboarding',

  onBrokenLinks: 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/', // Docs at root, not /docs
          editUrl: undefined, // No edit links for internal docs
          showLastUpdateAuthor: false,
          showLastUpdateTime: false,
        },
        blog: false, // Disable blog
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      require.resolve('docusaurus-plugin-search-local'),
      {
        hashed: true, // Enable caching
        indexDocs: true,
        indexBlog: false,
        indexPages: false,
      },
    ],
    [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 70,
        max: 1030,
        min: 640,
        steps: 2,
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'images/logo.png',
    navbar: {
      title: 'The Ripe Method',
      logo: {
        alt: 'MCE Logo',
        src: 'images/logo.png',
      },
      items: [
        {
          type: 'search',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} MCE. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['typescript', 'tsx', 'bash'],
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
