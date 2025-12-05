import type { Metadata } from 'next';

/**
 * JSON-LD structured data schema
 */
export interface SEOJsonLd {
	'@context': string;
	'@type': string;
	[key: string]: unknown;
}

/**
 * SEO configuration extending Next.js Metadata with additional fields
 *
 * - `name`: Site name (used as fallback for openGraph.siteName)
 * - `url`: Site URL (used as fallback for openGraph.url)
 * - `jsonld`: JSON-LD structured data schemas
 */
export interface SEOConfig extends Metadata {
	/** Site name, used as fallback for openGraph.siteName */
	name: string;
	/** Site URL, used as fallback for openGraph.url */
	url: string;
	/** JSON-LD structured data schemas */
	jsonld?: SEOJsonLd[];
}
