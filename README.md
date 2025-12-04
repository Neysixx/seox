# 🧠 Seox

> **Simplified SEO management for Next.js App Router**

Seox is an **open source tool** that centralizes and automates **SEO management** (meta tags, Open Graph, JSON-LD...) in **Next.js** projects using the **App Router**.  
It combines **TypeScript-typed configuration**, **automatic metadata injection**, and an **intuitive CLI** to guide developers.

[![npm version](https://img.shields.io/npm/v/metanext.svg)](https://www.npmjs.com/package/@neysixx/metanext)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## 🎯 Project Goal

In a typical Next.js project, each page manually repeats its `<Head>` tags, metadata, and JSON-LD.  
👉 This creates **duplication**, **inconsistencies**, and complicates maintenance.

Seox provides:
- **TypeScript-typed configuration** (`lib/seo.ts`)
- **Automatic metadata injection** into your Next.js files
- **Simple API**: `seoConfig.configToMetadata()`
- **Complete CLI** to initialize and configure your project

---

## 🚀 Quick Start

### 1. Installation

```bash
# Using Bun (recommended)
bun i seox

# Using npm
npm i seox

# Using pnpm
pnpm i seox
```

### 2. Initialize Configuration

```bash
# Using Bun (recommended)
bunx seox init

# Using npx
npx seox init
```

This creates a `lib/seo.ts` file with interactive setup.

### 3. Configure Your Project

```bash
# Scan and inject metadata into your Next.js files
bunx seox configure
```

### 4. Verify Configuration (In progress)

```bash
# Check your SEO configuration
bunx seox doctor
```

---

## ⚙️ How It Works

### 1. Configuration File: `lib/seo.ts`

Created via the `init` command:

```ts
import { Seox } from "seox/next";

export const seoConfig = new Seox({
  name: "My Awesome Site",
  url: "https://mysite.com",
  title: {
    default: "My Awesome Site",
    template: "%s | My Awesome Site",
  },
  description: "Welcome to my modern Next.js site",
  keywords: ["nextjs", "seo", "typescript"],
  creator: "Your Name",
  publisher: "Your Company",
  authors: [
    {
      name: "Your Name",
      url: "https://mysite.com/about",
    },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mysite.com",
    siteName: "My Awesome Site",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@yourhandle",
  },
});
```

🧠 TypeScript typing guides you through field completion.  
Configuration is **centralized** and **reusable**.

### 2. Automatic Configuration & Injection

Once the file is completed:

```bash
bunx seox configure
```

This command:
- **Scans** your Next.js files (`app/` and `pages/`)
- **Injects** metadata into your `layout.tsx` and `page.tsx`
- **Handles** conflicts with existing metadata
- **Validates** SEO consistency of your configuration

### 3. Usage in Your Pages

After running `bunx seox configure`, your files are automatically updated:

```tsx
// app/layout.tsx (automatically generated)
import { seoConfig } from "@/lib/seo";
import { JsonLd } from "seox/next";

export const metadata = seoConfig.configToMetadata();

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <JsonLd seo={seoConfig} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

> 💡 The `<JsonLd />` component automatically injects all JSON-LD structured data configured in your `seoConfig`.

#### Page-specific Customization

```tsx
// app/page.tsx
import { seoConfig } from "@/lib/seo";

export const metadata = seoConfig.configToMetadata({
  title: "Home | My Awesome Site",
  description: "Welcome to our homepage",
  openGraph: {
    title: "Home - My Awesome Site",
    description: "Discover our modern website",
  },
});
```

💡 **Why this approach?**
- ✅ **Compatible** with all environments (AWS Amplify, Vercel, etc.)
- ✅ **Predictable** and explicit
- ✅ **Performant** (direct injection into Next.js metadata)
- ✅ **Type-safe** with TypeScript
- ✅ **Automatic** (no need to manually manage each page)

💡 The `configToMetadata()` method:
- Automatically generates:
  - `<title>` and title templates
  - `<meta name="description">`
  - **OpenGraph** tags
  - **Twitter Card** tags
  - **robots** metadata
  - **JSON-LD** (if configured)
- Server-side rendering (SSR/SSG) for optimal performance

### 4. Local Overrides

Need to modify certain values on the fly?

```tsx
// app/page.tsx
import { seoConfig } from "@/lib/seo";

export const metadata = seoConfig.configToMetadata({
  title: "Home | Promo 2025",
  description: "New offer available!",
  openGraph: {
    title: "Promo 2025 - My Awesome Site",
    description: "Discover our exceptional offers",
  },
});
```

Seox merges these fields with the global configuration.

---

## 🏗️ JSON-LD Structured Data

Seox provides full support for **JSON-LD structured data** to improve your SEO with rich snippets in Google search results.

### Configuration

Add your JSON-LD schemas in your `seo.ts` configuration:

```ts
import { Seox } from "seox/next";

export const seoConfig = new Seox({
  name: "My Site",
  url: "https://mysite.com",
  // ... other config
  jsonld: [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "My Company",
      url: "https://mysite.com",
      logo: "https://mysite.com/logo.png",
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "My Business",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Paris",
        addressCountry: "FR",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is your service?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We provide amazing services...",
          },
        },
      ],
    },
  ],
});
```

### Usage with `<JsonLd />` Component

The `<JsonLd />` component automatically renders all your JSON-LD schemas as `<script type="application/ld+json">` tags:

```tsx
// app/layout.tsx
import { seoConfig } from "@/lib/seo";
import { JsonLd } from "seox/next";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <JsonLd seo={seoConfig} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Adding Page-specific Schemas

You can add additional schemas for specific pages:

```tsx
// app/product/[id]/page.tsx
import { seoConfig } from "@/lib/seo";
import { JsonLd } from "seox/next";

export default function ProductPage() {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Amazing Product",
    price: "99.99",
  };

  return (
    <>
      <JsonLd seo={seoConfig} additionalSchemas={[productSchema]} />
      {/* Page content */}
    </>
  );
}
```

### Programmatic Access

You can also access JSON-LD data programmatically:

```ts
// Get JSON-LD as objects
const schemas = seoConfig.getJsonLd();

// Get JSON-LD as stringified JSON (ready for injection)
const jsonStrings = seoConfig.getJsonLdStrings();
```

### Supported Schema Types

Seox supports all [Schema.org](https://schema.org) types:

| Schema Type | Use Case |
|-------------|----------|
| `Organization` | Company information |
| `LocalBusiness` | Local business with address, hours |
| `FAQPage` | FAQ sections for rich snippets |
| `Product` | E-commerce products |
| `Article` | Blog posts and articles |
| `BreadcrumbList` | Navigation breadcrumbs |
| `WebSite` | Site-wide search box |
| `Person` | Author profiles |
| `Review` / `AggregateRating` | Reviews and ratings |

---

## 🧰 Built-in CLI

Seox provides an intuitive CLI:

| Command | Description |
|---------|-------------|
| `seox init` | Creates `lib/seo.ts` with interactive setup |
| `seox configure` | Scans and injects metadata into your Next.js files |
| `seox doctor` (soon)  | Validates your SEO configuration | 

### Advanced Options

```bash
# Force overwrite existing metadata
bunx seox configure --force

# Validation only (no generation)
bunx seox configure --validate
```

---

## 🧠 Technical Architecture

```
[ lib/seo.ts ]  ← TypeScript-typed configuration
       ↓ (configure)
[ Scan Next.js files ] ← automatic detection
       ↓
[ Inject metadata ] ← into layout.tsx/page.tsx
       ↓
[ Server-side rendering ] ← Next.js App Router
```

✅ **Centralized configuration** in TypeScript  
✅ **Automatic injection** into your files  
✅ **Type-safe** with autocompletion  
✅ **Optimized SEO** server-side  
✅ **Simplified maintenance**

---

## 📘 API & Helpers

### `Seox` (main class)
Centralized SEO configuration with complete TypeScript typing.

### `configToMetadata(overrides?)`
Method that generates Next.js metadata from your configuration.  
Accepts optional overrides to customize per page.

### `getJsonLd(additionalSchemas?)`
Returns the JSON-LD schemas as an array of objects.  
Accepts optional additional schemas to merge with config.

### `getJsonLdStrings(additionalSchemas?)`
Returns the JSON-LD schemas as stringified JSON strings, ready for injection.

### `<JsonLd />` Component
React component to inject JSON-LD structured data into the page `<head>`.

```tsx
import { JsonLd } from "seox/next";

<JsonLd seo={seoConfig} additionalSchemas={[...]} />
```

| Prop | Type | Description |
|------|------|-------------|
| `seo` | `Seox` | Your Seox configuration instance |
| `additionalSchemas` | `SEOJsonLd[]` | Optional additional schemas to include |

---

## 🧭 Roadmap

| Feature | Status |
|---------|--------|
| TypeScript-typed configuration | ✅ |
| CLI `init` / `configure` | ✅ |
| Automatic metadata injection | ✅ |
| OpenGraph and Twitter Cards support | ✅ |
| Local overrides per page | ✅ |
| SEO validation with `doctor` | ✅ |
| CLI `doctor` | 🔜 |
| Multilingual support (`hreflang`) | 🔜 |
| Automatic OG image generation | 🔜 |
| Predefined templates (`--template blog`) | 🔜 |
| JSON-LD structured data | ✅ |
| `<JsonLd />` React component | ✅ |

---

## 📦 Installation

### Requirements

- **Node.js** >= 18.0.0
- **Next.js** >= 14.0.0
- **React** >= 18.0.0
- **TypeScript** >= 5.9.3

### Package Managers

```bash
# Bun (recommended)
bun add seox

# npm
npm install seox

# pnpm
pnpm add seox

# yarn
yarn add seox
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/neysixx/seox.git
cd seox

# Install dependencies
bun install

# Build the project
bun run build
```

---

## 📜 License

MIT © 2025 — Designed for modern Next.js developers 🧑‍💻

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [TypeScript](https://www.typescriptlang.org/)
- CLI built with [Commander.js](https://github.com/tj/commander.js)
- Styling with [Chalk](https://github.com/chalk/chalk)

---

## 📞 Support

- 📖 [Documentation](https://github.com/neysixx/seox#readme)
- 🐛 [Report Issues](https://github.com/neysixx/seox/issues)
- 💬 [Discussions](https://github.com/neysixx/seox/discussions)
- 📧 [Email](mailto:kylliansenrens3004@gmail.com)

---

<div align="center">

**Made with ❤️ for the Next.js community**

[⭐ Star us on GitHub](https://github.com/neysixx/seox) • [🐦 Follow on X](https://x.com/ks_nsx) • [📧 Contact](mailto:kylliansenrens3004@gmail.com)

</div>