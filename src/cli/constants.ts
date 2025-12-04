export const TEMPLATES = {
  config: `import { Seox } from "seox/next";

export const seoConfig = new Seox({
  name: "{{siteName}}",
  url: "{{baseUrl}}",
  title: {
    default: "{{siteName}}",
    template: "%s | {{siteName}}",
  },
  description: "{{siteDescription}}",
  keywords: [],
  creator: "",
  publisher: "",
  authors: [
    {
      name: "",
      url: "",
    },
  ],
  manifest: "",
  // JSON-LD structured data for rich snippets
  jsonld: [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "{{siteName}}",
      url: "{{baseUrl}}",
      // Add more fields: logo, address, contactPoint, sameAs...
    },
  ],
})`,
};
