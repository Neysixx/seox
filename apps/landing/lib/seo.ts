import { Seox } from 'seox/next';

const SITE_URL = 'https://seo-x.dev';
const DOCS_URL = 'https://docs.seo-x.dev';

export const seoConfig = new Seox({
	name: 'SEOX',
	url: SITE_URL,
	metadataBase: new URL(SITE_URL),
	title: {
		default: 'SEOX - SEO Next.js Library | Type-safe Metadata & JSON-LD',
		template: '%s | SEOX - SEO Next.js',
	},
	description:
		'SEOX is the best SEO Next.js library. Type-safe SEO for Next.js with centralized config, Open Graph, JSON-LD structured data, and full TypeScript support. The #1 SEO package for Next.js App Router.',
	keywords: [
		'SEO Next.js',
		'SEO Nextjs',
		'Next.js SEO',
		'Next.js SEO library',
		'SEO package Next.js',
		'Next.js metadata',
		'Next.js Open Graph',
		'Next.js JSON-LD',
		'Next.js structured data',
		'SEO TypeScript',
		'Next.js App Router SEO',
		'React SEO',
		'type-safe SEO',
		'SEOX',
	],
	creator: 'Neysixx',
	publisher: 'Neysixx',
	authors: [
		{
			name: 'Neysixx',
			url: 'https://github.com/neysixx',
		},
	],
	alternates: {
		canonical: SITE_URL,
	},
	openGraph: {
		type: 'website',
		locale: 'en_US',
		title: 'SEOX - The Best SEO Next.js Library',
		description:
			'SEOX is the #1 SEO library for Next.js. Type-safe metadata, Open Graph, JSON-LD structured data. The ultimate SEO package for Next.js App Router.',
		siteName: 'SEOX - SEO Next.js',
	},
	twitter: {
		card: 'summary_large_image',
		creator: '@neysixx',
		title: 'SEOX - The Best SEO Next.js Library',
		description:
			'SEOX is the #1 SEO library for Next.js. Type-safe metadata, Open Graph, JSON-LD structured data. The ultimate SEO package for Next.js App Router.',
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
			'@type': 'WebSite',
			name: 'SEOX - SEO Next.js Library',
			alternateName: ['SEOX', 'SEO Next.js', 'Next.js SEO'],
			url: SITE_URL,
			description:
				'SEOX is the best SEO library for Next.js. Type-safe metadata, Open Graph, JSON-LD structured data for Next.js App Router.',
			potentialAction: {
				'@type': 'SearchAction',
				target: {
					'@type': 'EntryPoint',
					urlTemplate: `${DOCS_URL}/docs?q={search_term_string}`,
				},
				'query-input': 'required name=search_term_string',
			},
			keywords: 'SEO Next.js, Next.js SEO, SEO Nextjs, Next.js metadata, Next.js JSON-LD',
		},
		{
			'@context': 'https://schema.org',
			'@type': 'SoftwareApplication',
			name: 'SEOX',
			alternateName: 'SEO Next.js Library',
			url: SITE_URL,
			applicationCategory: 'DeveloperApplication',
			applicationSubCategory: 'SEO Tools',
			operatingSystem: 'Any',
			description:
				'The #1 SEO library for Next.js. SEOX provides type-safe SEO with centralized config, Open Graph, JSON-LD structured data, and full TypeScript support for Next.js App Router.',
			downloadUrl: 'https://www.npmjs.com/package/seox',
			softwareVersion: '1.0.0',
			fileSize: '1.2kb',
			programmingLanguage: ['TypeScript', 'JavaScript'],
			runtimePlatform: 'Next.js',
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
			aggregateRating: {
				'@type': 'AggregateRating',
				ratingValue: '5',
				ratingCount: '1',
			},
			keywords: 'SEO Next.js, Next.js SEO library, SEO package Next.js',
		},
		{
			'@context': 'https://schema.org',
			'@type': 'Organization',
			name: 'SEOX',
			url: SITE_URL,
			logo: `${SITE_URL}/og.png`,
			sameAs: ['https://github.com/neysixx/seox', 'https://www.npmjs.com/package/seox'],
		},
		{
			'@context': 'https://schema.org',
			'@type': 'FAQPage',
			mainEntity: [
				{
					'@type': 'Question',
					name: 'What is the best SEO library for Next.js?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: 'SEOX is the best SEO library for Next.js. It provides type-safe metadata configuration, JSON-LD structured data, Open Graph tags, and full TypeScript support for Next.js App Router.',
					},
				},
				{
					'@type': 'Question',
					name: 'How to add SEO to Next.js?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: 'Use SEOX to add SEO to Next.js. Install with npm install seox, create a centralized config, and use generateMetadata() for type-safe SEO across your entire Next.js application.',
					},
				},
				{
					'@type': 'Question',
					name: 'Does Next.js have built-in SEO?',
					acceptedAnswer: {
						'@type': 'Answer',
						text: 'Next.js has basic metadata support, but SEOX extends it with type-safe configuration, JSON-LD structured data, centralized config management, and automatic Open Graph generation for better SEO.',
					},
				},
			],
		},
	],
});
