import { Seox } from "seox/next";

const SITE_URL = "https://docs.seo-x.dev";
const MAIN_SITE_URL = "https://seo-x.dev";

export const seoConfig = new Seox({
  name: "SEOX Documentation",
  url: SITE_URL,
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SEOX Docs - SEO Next.js Guide | Metadata, JSON-LD, Open Graph",
    template: "%s | SEOX - SEO Next.js Docs",
  },
  description:
    "Complete SEO Next.js documentation for SEOX. Learn how to implement SEO in Next.js with type-safe metadata, JSON-LD structured data, Open Graph tags. The ultimate SEO guide for Next.js App Router.",
  keywords: [
    "SEO Next.js",
    "SEO Nextjs",
    "Next.js SEO guide",
    "Next.js SEO tutorial",
    "Next.js metadata guide",
    "Next.js JSON-LD",
    "Next.js Open Graph",
    "Next.js structured data",
    "SEO Next.js App Router",
    "SEOX documentation",
    "Next.js SEO library docs",
    "SEO TypeScript Next.js",
  ],
  creator: "Neysixx",
  publisher: "Neysixx",
  authors: [
    {
      name: "Neysixx",
      url: "https://github.com/neysixx",
    },
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "SEOX Docs - SEO Next.js Guide",
    description:
      "Complete SEO Next.js documentation. Learn how to add SEO to Next.js with SEOX: type-safe metadata, JSON-LD, Open Graph for Next.js App Router.",
    siteName: "SEOX - SEO Next.js",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@neysixx",
    title: "SEOX Docs - SEO Next.js Guide",
    description:
      "Complete SEO Next.js documentation. Learn how to add SEO to Next.js with SEOX: type-safe metadata, JSON-LD, Open Graph for Next.js App Router.",
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
      "@type": "WebSite",
      name: "SEOX Documentation - SEO Next.js Guide",
      alternateName: [
        "SEOX Docs",
        "SEO Next.js Documentation",
        "Next.js SEO Guide",
      ],
      url: SITE_URL,
      description:
        "Complete SEO Next.js documentation. Learn how to implement SEO in Next.js with SEOX: type-safe metadata, JSON-LD, Open Graph for Next.js App Router.",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/docs?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
      isPartOf: {
        "@type": "WebSite",
        name: "SEOX - SEO Next.js Library",
        url: MAIN_SITE_URL,
      },
      keywords: "SEO Next.js, Next.js SEO guide, SEO Nextjs tutorial",
    },
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: "SEO Next.js Guide - How to Add SEO to Next.js with SEOX",
      alternativeHeadline: "Complete SEO Next.js Tutorial",
      description:
        "Learn how to implement SEO in Next.js applications with SEOX. This guide covers type-safe metadata, JSON-LD structured data, Open Graph tags, and best practices for Next.js App Router SEO.",
      author: {
        "@type": "Person",
        name: "Neysixx",
        url: "https://github.com/neysixx",
      },
      publisher: {
        "@type": "Organization",
        name: "SEOX",
        url: MAIN_SITE_URL,
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": SITE_URL,
      },
      keywords:
        "SEO Next.js, Next.js SEO, SEO Nextjs, Next.js metadata, Next.js JSON-LD",
      about: {
        "@type": "Thing",
        name: "SEO for Next.js",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to Add SEO to Next.js",
      description:
        "Step-by-step guide to implement SEO in Next.js using SEOX library",
      step: [
        {
          "@type": "HowToStep",
          name: "Install SEOX",
          text: "Install the SEOX package with npm install seox or bun add seox",
        },
        {
          "@type": "HowToStep",
          name: "Create SEO Config",
          text: "Create a centralized SEO configuration file with your site metadata",
        },
        {
          "@type": "HowToStep",
          name: "Add to Layout",
          text: "Export metadata from your root layout using seoConfig.configToMetadata()",
        },
        {
          "@type": "HowToStep",
          name: "Add JSON-LD",
          text: "Add the JsonLd component to your layout for structured data",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "SEOX - SEO Next.js",
          item: MAIN_SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "SEO Next.js Documentation",
          item: SITE_URL,
        },
      ],
    },
  ],
});
