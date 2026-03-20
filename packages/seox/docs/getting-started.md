# Getting started

## Installation

```bash
bun add seox
# or: npm install seox / pnpm add seox / yarn add seox
```

## Step 1: Create your SEO config

Create a file `lib/seo.ts` (or run `bunx seox init` for interactive setup):

```ts
import { Seox } from "seox/next";

export const seoConfig = new Seox({
  name: "My Site",
  url: "https://mysite.com",
  metadataBase: new URL("https://mysite.com"),
  title: {
    default: "My Site - Tagline",
    template: "%s | My Site",
  },
  description: "A description of my site",
  keywords: ["nextjs", "seo"],
  creator: "Author Name",
  publisher: "Author Name",
  authors: [{ name: "Author Name", url: "https://mysite.com" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "My Site",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@handle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  jsonld: [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "My Site",
      url: "https://mysite.com",
    },
  ],
});
```

`SEOConfig` extends Next.js `Metadata`, so all standard metadata fields are supported. The additional fields are `name`, `url`, and `jsonld`.

## Step 2: Apply metadata to your root layout

```tsx
// app/layout.tsx
import { seoConfig } from "@/lib/seo";
import { JsonLd } from "seox/next";

export const metadata = seoConfig.configToMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
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

This single call generates all `<title>`, `<meta>`, Open Graph, and Twitter Card tags through Next.js built-in metadata system.

## Step 3: Override per page

```tsx
// app/about/page.tsx
import { seoConfig } from "@/lib/seo";

export const metadata = seoConfig.configToMetadata({
  title: "About Us",
  description: "Learn more about our team",
  openGraph: {
    title: "About Us - My Site",
  },
});

export default function AboutPage() {
  return <main>About content</main>;
}
```

Overrides are deep-merged with the base configuration. The `title` value uses the template defined in your config (e.g. `"About Us | My Site"`).

## Step 4: Verify with doctor

```bash
bunx seox doctor
```

This validates your config file exists and checks for common SEO issues (missing title, description, invalid URL, etc.).
