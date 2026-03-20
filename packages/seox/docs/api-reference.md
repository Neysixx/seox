# API Reference

## Types

### `SEOConfig`

```ts
import type { SEOConfig } from "seox";
```

Extends Next.js `Metadata` with three additional fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | Yes | Site name. Used as fallback for `openGraph.siteName`. |
| `url` | `string` | Yes | Site URL. Used as fallback for `openGraph.url`. |
| `jsonld` | `SEOJsonLd[]` | No | Array of JSON-LD structured data schemas. |

All standard Next.js `Metadata` fields are also accepted: `title`, `description`, `keywords`, `authors`, `creator`, `publisher`, `openGraph`, `twitter`, `robots`, `alternates`, `metadataBase`, `icons`, `manifest`, etc.

### `SEOJsonLd`

```ts
import type { SEOJsonLd } from "seox";
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `@context` | `string` | Yes | Schema context, typically `"https://schema.org"`. |
| `@type` | `string` | Yes | Schema.org type (e.g. `"Organization"`, `"WebSite"`, `"FAQPage"`). |
| `[key: string]` | `unknown` | No | Any additional Schema.org properties. |

---

## `Seox` class

```ts
import { Seox } from "seox/next";
```

### Constructor

```ts
const seo = new Seox(config: SEOConfig);
```

Creates a new Seox instance. The `config` object is stored and used as the base for all metadata generation.

### `seo.config`

```ts
seo.config: SEOConfig
```

Public property. Direct access to the underlying configuration object.

### `seo.configToMetadata(overrides?)`

```ts
seo.configToMetadata(overrides?: Partial<SEOConfig>): Metadata
```

Returns a Next.js `Metadata` object by merging the base config with optional overrides.

Behavior:
- Strips `name`, `url`, and `jsonld` from the output (these are not valid Next.js Metadata fields).
- Spreads base metadata, then override metadata on top.
- If `openGraph` exists in either base or overrides, applies fallbacks: `openGraph.url` defaults to `config.url`, `openGraph.siteName` defaults to `config.name`.

Use this as the value of `export const metadata` or return it from `generateMetadata()` in any Next.js page or layout.

### `seo.generatePageMetadata(overrides?)`

```ts
seo.generatePageMetadata(overrides?: Partial<SEOConfig>): Metadata
```

Alias for `configToMetadata()`. Identical behavior.

### `seo.getJsonLd(overrides?)`

```ts
seo.getJsonLd(overrides?: SEOJsonLd[]): SEOJsonLd[]
```

Returns the combined array of JSON-LD schemas: base schemas from `config.jsonld` concatenated with `overrides`.

### `seo.getJsonLdStrings(overrides?)`

```ts
seo.getJsonLdStrings(overrides?: SEOJsonLd[]): string[]
```

Same as `getJsonLd()` but returns each schema as a `JSON.stringify()`-ed string, ready for injection into `<script>` tags.

---

## `JsonLd` component

```tsx
import { JsonLd } from "seox/next";
```

React server component that renders `<script type="application/ld+json">` tags.

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `seo` | `Seox` | Yes | Your Seox instance. Schemas are read from `seo.getJsonLd()`. |
| `additionalSchemas` | `SEOJsonLd[]` | No | Extra schemas to append (page-specific structured data). |

### Usage

```tsx
// In layout.tsx <head> — renders all global schemas
<JsonLd seo={seoConfig} />

// In a specific page — adds page-specific schemas alongside global ones
<JsonLd seo={seoConfig} additionalSchemas={[productSchema]} />
```

Returns `null` if no schemas are configured.
