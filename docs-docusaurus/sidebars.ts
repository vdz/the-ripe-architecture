import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'index', // Homepage
    'onboarding', // The complete onboarding guide
    {
      type: 'category',
      label: 'Client Architecture',
      items: [
        'client-architecture/00-introduction',
        'client-architecture/01-elements',
        'client-architecture/02-global-state',
        'client-architecture/03-information-flow',
        'client-architecture/04-app-structure',
        'client-architecture/05-functional-layers',
        'client-architecture/06-quick-reference',
        'client-architecture/07-best-practices-2026',
      ],
    },
    {
      type: 'category',
      label: 'Code Examples',
      items: [
        'examples/reducer',
        'examples/actions',
        'examples/listeners',
        'examples/component',
      ],
    },
  ],
};

export default sidebars;
