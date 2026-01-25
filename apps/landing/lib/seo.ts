import { Seox } from 'seox/next';

export const seoConfig = new Seox({
	name: 'SEOX',
	url: 'https://seo-x.dev',
	metadataBase: new URL('https://seo-x.dev'),
	title: {
		default: 'SEOX - Type-safe SEO for Next.js',
		template: '%s | SEOX',
	},
	description:
		'Type-safe SEO for Next.js. Centralized config, full TypeScript support, and zero fluff. Define once, use everywhere.',
	keywords: [
		'SEO',
		'Next.js',
		'TypeScript',
		'React',
		'metadata',
		'Open Graph',
		'JSON-LD',
		'structured data',
		'App Router',
		'type-safe',
	],
	creator: 'Neysixx',
	publisher: 'Neysixx',
	authors: [
		{
			name: 'Neysixx',
			url: 'https://github.com/neysixx',
		},
	],
	openGraph: {
		type: 'website',
		locale: 'en_US',
	},
	twitter: {
		card: 'summary_large_image',
		creator: '@neysixx',
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	jsonld: [
		{
			'@context': 'https://schema.org',
			'@type': 'SoftwareApplication',
			name: 'SEOX',
			url: 'https://seo-x.dev',
			applicationCategory: 'DeveloperApplication',
			operatingSystem: 'Any',
			description: 'Type-safe SEO for Next.js. Centralized config, full TypeScript support, and zero fluff.',
			offers: {
				'@type': 'Offer',
				price: '0',
				priceCurrency: 'USD',
			},
			author: {
				'@type': 'Person',
				name: 'Neysixx',
				url: 'https://github.com/neysixx',
			},
		},
	],
});
