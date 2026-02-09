# App Architecture Onboarding

We at MCE would like to step into the new era of application development with a new architecture and best practices, to both guide us and safe-guard our code from becoming unfamiliar & unwieldy.

The scope of our project is mainly Application engineering (Front-end), because it's where the combination and formation of our various products really happen.

---

## Documentation Structure

```
docs/
├── 01-client-architecture/     # The Ripe Method - our FE architecture
│   ├── 00-introduction.md      # What & why
│   ├── 01-elements.md          # The 16 principles
│   ├── 02-global-state.md      # Commandment I
│   ├── 03-information-flow.md  # Commandment II
│   ├── 04-app-structure.md     # Commandment III
│   ├── 05-functional-layers.md # Commandment IV
│   └── 06-quick-reference.md   # Cheat sheet
├── images/                     # Visual references from slides
└── examples/                   # Code examples
    ├── reducer.example.ts
    ├── actions.example.ts
    ├── listeners.example.ts
    └── component.example.tsx
```

---

## The Ripe Method

Our front-end architecture is called **The Ripe Method**. Start here:

| Document | Description |
|----------|-------------|
| [Introduction](./docs/01-client-architecture/00-introduction.md) | What is the Ripe Method and why we use it |
| [Elements](./docs/01-client-architecture/01-elements.md) | The 16 guiding principles |
| [Global State](./docs/01-client-architecture/02-global-state.md) | Commandment I: One Global State |
| [Information Flow](./docs/01-client-architecture/03-information-flow.md) | Commandment II: Unidirectional Flow |
| [App Structure](./docs/01-client-architecture/04-app-structure.md) | Commandment III: Fixed File Structure |
| [Functional Layers](./docs/01-client-architecture/05-functional-layers.md) | Commandment IV: Store, Logic, View |
| [Quick Reference](./docs/01-client-architecture/06-quick-reference.md) | Cheat sheet for daily use |
| [Best Practices 2026](./docs/01-client-architecture/07-best-practices-2026.md) | Modern React/TS style guide |

---

## Code Examples

Working code examples demonstrating the patterns:

| Example | Description |
|---------|-------------|
| [reducer.example.ts](./docs/examples/reducer.example.ts) | Simple reducer patterns with RTK |
| [actions.example.ts](./docs/examples/actions.example.ts) | Action creators and payload types |
| [listeners.example.ts](./docs/examples/listeners.example.ts) | Listener middleware patterns |
| [component.example.tsx](./docs/examples/component.example.tsx) | React component anatomy |

---

## Full Table of Contents

### 1. Client Architecture (The Ripe Method)
- 1.1. [Introduction](./docs/01-client-architecture/00-introduction.md)
- 1.2. [The Elements](./docs/01-client-architecture/01-elements.md)
- 1.3. [Global State](./docs/01-client-architecture/02-global-state.md)
- 1.4. [Information Flow](./docs/01-client-architecture/03-information-flow.md)
- 1.5. [App Structure](./docs/01-client-architecture/04-app-structure.md)
- 1.6. [Functional Layers](./docs/01-client-architecture/05-functional-layers.md)
- 1.7. [Quick Reference](./docs/01-client-architecture/06-quick-reference.md)
- 1.8. [Best Practices 2026](./docs/01-client-architecture/07-best-practices-2026.md)

### 2. New Software Delivery Cycle
*(Coming soon)*

### 3. Eliminating the Configuration Backoffice Reliance
*(Coming soon)*

### 4. MCE Framework: How to Interface with The Framework
*(Coming soon)*

### 5. Agentic Workflows
*(Coming soon)*

---

## Quick Start

1. Read the [Introduction](./docs/01-client-architecture/00-introduction.md) to understand the philosophy
2. Study the [Four Commandments](./docs/01-client-architecture/00-introduction.md#the-four-commandments)
3. Review the [Code Examples](./docs/examples/)
4. Keep the [Quick Reference](./docs/01-client-architecture/06-quick-reference.md) handy while coding

## Source Material

The documentation is based on "The Ripe Method" presentation slides located in `context/the ripe method 2026/`. Visual diagrams from the slides are included in `docs/images/`.
