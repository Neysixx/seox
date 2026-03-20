# CLI Reference

All commands are available via `bunx seox` or `npx seox`.

## `seox init`

Creates a `lib/seo.ts` configuration file with interactive prompts.

```bash
bunx seox init
```

Prompts for:
- **Site name** — used for `name` and `title.default`
- **Base URL** — used for `url`
- **Description** — used for `description`

If a `src/` directory exists, the file is created at `src/lib/seo.ts` instead.

The generated file imports `Seox` from `seox/next` and exports a configured `seoConfig` instance with a scaffolded JSON-LD Organization schema.

## `seox configure`

Scans your Next.js project and injects SEO metadata into layout and page files.

```bash
bunx seox configure [options]
```

### Options

| Flag | Description |
|------|-------------|
| `--force` | Overwrite existing metadata exports |
| `--validate` | Only validate, do not modify files |

### What it does

1. Verifies `lib/seo.ts` (or `src/lib/seo.ts`) exists.
2. Scans `app/` directory for `layout.tsx` and `page.tsx` files.
3. For each layout file: adds `export const metadata = seoConfig.configToMetadata()` and the `<JsonLd />` component.
4. For each page file: adds `export const metadata = seoConfig.configToMetadata()`.
5. Skips files that already have metadata exports (unless `--force`).

## `seox doctor`

Validates your SEO configuration for common issues.

```bash
bunx seox doctor
```

### Checks performed

- Configuration file exists at expected path
- `name` is defined and non-empty
- `url` is a valid URL
- `title` is configured
- `description` is configured and reasonable length
- JSON-LD schemas have valid `@context` and `@type`

Reports a summary of passed checks, warnings, and errors.
