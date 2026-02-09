# MCE Architecture Documentation

Built with Docusaurus, featuring a Tailwind CSS + GitBook hybrid design system.

## Setup

### Prerequisites

- Node.js v20.0+
- npm/yarn/pnpm

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

This starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Serve Build Locally

```bash
npm run serve
```

## Project Structure

```
docs-docusaurus/
├── docs/
│   ├── 01-client-architecture/  # Main documentation
│   └── examples/                # Code examples
├── src/
│   ├── components/              # (Optional) Custom React components for MDX
│   ├── css/
│   │   └── custom.css          # Design system styles
│   └── pages/                   # (Optional) Custom pages
├── static/
│   └── images/                  # Static assets
├── docusaurus.config.ts         # Main configuration
└── sidebars.ts                  # Navigation structure
```

## Design System

This site uses a **Tailwind CSS + GitBook hybrid design**:

- **Typography:** Geist/Inter system stack, generous line-height (1.65)
- **Colors:** Neutral palette with Tailwind cyan (#06b6d4) accents
- **Layout:** 3-column grid (Sidebar 20% + Content 60% + TOC 20%)
- **Spacing:** Generous white space for readability
- **Animations:** Subtle transitions (0.2s ease)

See `src/css/custom.css` for complete design tokens.

## Next Steps

1. **Install plugins** (when network available):
   ```bash
   npm install --save docusaurus-plugin-search-local
   npm install --save @docusaurus/plugin-ideal-image
   ```

2. **Update `docusaurus.config.ts`** to add plugins:
   ```typescript
   plugins: [
     [
       require.resolve('docusaurus-plugin-search-local'),
       {
         hashed: true,
         indexDocs: true,
         language: ['en'],
       },
     ],
   ],
   ```

3. **Add logo** to `static/img/logo.svg`

4. **Update image references** in markdown files:
   - Change `../images/` to `/images/` or `@site/static/images/`

5. **Test locally**: `npm start`

6. **Build for production**: `npm run build`

## Resources

- [Docusaurus Documentation](https://docusaurus.io/docs)
- [Design System Guidelines](./docs/01-client-architecture/07-best-practices-2026.md)
