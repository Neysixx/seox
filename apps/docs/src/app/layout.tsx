import { RootProvider } from "fumadocs-ui/provider/next";
import { Inter } from "next/font/google";
import { JsonLd } from "seox/next";
import { seoConfig } from "@/lib/seo";
import "./global.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = seoConfig.configToMetadata();

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <JsonLd seo={seoConfig} />
      </head>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
