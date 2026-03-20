# Examples

## Basic blog setup

```ts
// lib/seo.ts
import { Seox } from "seox/next";

export const seoConfig = new Seox({
  name: "My Blog",
  url: "https://myblog.com",
  metadataBase: new URL("https://myblog.com"),
  title: {
    default: "My Blog",
    template: "%s | My Blog",
  },
  description: "Thoughts on web development",
  keywords: ["blog", "web development", "javascript"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "My Blog",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@handle",
  },
  robots: {
    index: true,
    follow: true,
  },
  jsonld: [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "My Blog",
      url: "https://myblog.com",
    },
  ],
});
```

## Root layout with JSON-LD

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

## Static page metadata

```tsx
// app/about/page.tsx
import { seoConfig } from "@/lib/seo";

export const metadata = seoConfig.configToMetadata({
  title: "About",
  description: "About our team and mission",
});

export default function AboutPage() {
  return <main>About page content</main>;
}
```

## Dynamic metadata with `generateMetadata`

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { seoConfig } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  return seoConfig.configToMetadata({
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: [{ url: post.coverImage }],
    },
  });
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  return <article>{post.content}</article>;
}
```

## Page-specific JSON-LD

```tsx
// app/blog/[slug]/page.tsx
import { seoConfig } from "@/lib/seo";
import { JsonLd } from "seox/next";

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: post.author },
    datePublished: post.publishedAt,
    image: post.coverImage,
  };

  return (
    <>
      <JsonLd seo={seoConfig} additionalSchemas={[articleSchema]} />
      <article>{post.content}</article>
    </>
  );
}
```

## E-commerce product page

```tsx
// app/products/[id]/page.tsx
import type { Metadata } from "next";
import { seoConfig } from "@/lib/seo";
import { JsonLd } from "seox/next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  return seoConfig.configToMetadata({
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.map((url) => ({ url })),
    },
  });
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <JsonLd seo={seoConfig} additionalSchemas={[productSchema]} />
      <main>{/* product UI */}</main>
    </>
  );
}
```

## FAQ page with structured data

```tsx
// app/faq/page.tsx
import { seoConfig } from "@/lib/seo";
import { JsonLd } from "seox/next";

const faqs = [
  { question: "What is seox?", answer: "A SEO library for Next.js App Router." },
  { question: "Does it support JSON-LD?", answer: "Yes, via the JsonLd component and config." },
];

export const metadata = seoConfig.configToMetadata({
  title: "FAQ",
  description: "Frequently asked questions",
});

export default function FAQPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <JsonLd seo={seoConfig} additionalSchemas={[faqSchema]} />
      <main>
        {faqs.map((faq) => (
          <details key={faq.question}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </main>
    </>
  );
}
```

## Programmatic JSON-LD access

```ts
import { seoConfig } from "@/lib/seo";

// Get all JSON-LD as objects
const schemas = seoConfig.getJsonLd();

// Get with additional schemas merged in
const allSchemas = seoConfig.getJsonLd([extraSchema]);

// Get as stringified JSON (for manual <script> injection)
const jsonStrings = seoConfig.getJsonLdStrings();
```
