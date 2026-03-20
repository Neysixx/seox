# seox

> Simplified SEO management for Next.js App Router

seox is an open-source library that centralizes SEO (meta tags, Open Graph, Twitter Cards, JSON-LD) in Next.js App Router projects via a single TypeScript configuration.

## Package exports

| Import path | Exports | Purpose |
|-------------|---------|---------|
| `seox` | `SEOConfig`, `SEOJsonLd` (types only) | Type definitions for configuration |
| `seox/next` | `Seox`, `JsonLd`, `SEOConfig`, `SEOJsonLd` | Runtime class + React component for Next.js |

## Documentation files

| File | Contents |
|------|----------|
| [getting-started.md](./getting-started.md) | Installation, setup, basic usage |
| [api-reference.md](./api-reference.md) | Complete API: types, `Seox` class, `JsonLd` component |
| [cli.md](./cli.md) | CLI commands: `init`, `configure`, `doctor` |
| [examples.md](./examples.md) | Common patterns and recipes |

## Requirements

- Node.js >= 18.0.0
- Next.js >= 14.0.0
- React >= 18.0.0
- TypeScript >= 5.0.0
