import type { Seox } from '../classes/seox';
import type { SEOJsonLd } from '../../types';

interface JsonLdProps {
    seo: Seox;
    additionalSchemas?: SEOJsonLd[];
}

/**
 * React component to inject JSON-LD structured data into the page
 * Use this component in your layout.tsx inside the <head> tag
 *
 * @example
 * ```tsx
 * import { seoConfig } from '@/lib/seo';
 * import { JsonLd } from 'seox/next';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html lang="fr">
 *       <head>
 *         <JsonLd seo={seoConfig} />
 *       </head>
 *       <body>{children}</body>
 *     </html>
 *   );
 * }
 * ```
 */
export function JsonLd({ seo, additionalSchemas }: JsonLdProps) {
    const schemas = seo.getJsonLd(additionalSchemas);

    if (!schemas || schemas.length === 0) {
        return null;
    }

    return (
        <>
            {schemas.map((schema, index) => (
                <script
                    key={`jsonld-${index}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}
        </>
    );
}

