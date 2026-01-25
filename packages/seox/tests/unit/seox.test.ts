// ABOUTME: Unit tests for the Seox class
// ABOUTME: Tests config storage, metadata generation, and JSON-LD handling

import { describe, expect, it } from 'bun:test';
import { Seox } from '../../src/next/classes/seox';
import type { SEOConfig, SEOJsonLd } from '../../src/types';

describe('Seox', () => {
	const baseConfig: SEOConfig = {
		name: 'Test Site',
		url: 'https://test.com',
		title: 'Test Title',
		description: 'Test Description',
	};

	describe('constructor', () => {
		it('stores config correctly', () => {
			const seo = new Seox(baseConfig);
			expect(seo.config).toEqual(baseConfig);
		});
	});

	describe('configToMetadata', () => {
		it('returns base metadata without overrides', () => {
			const seo = new Seox(baseConfig);
			const metadata = seo.configToMetadata();

			expect(metadata.title).toBe('Test Title');
			expect(metadata.description).toBe('Test Description');
		});

		it('merges overrides correctly', () => {
			const seo = new Seox(baseConfig);
			const metadata = seo.configToMetadata({
				title: 'Override Title',
				keywords: ['test', 'seo'],
			});

			expect(metadata.title).toBe('Override Title');
			expect(metadata.description).toBe('Test Description');
			expect(metadata.keywords).toEqual(['test', 'seo']);
		});

		it('applies openGraph.url default from config.url', () => {
			const configWithOg: SEOConfig = {
				...baseConfig,
				openGraph: {
					title: 'OG Title',
				},
			};
			const seo = new Seox(configWithOg);
			const metadata = seo.configToMetadata();

			expect(metadata.openGraph?.url).toBe('https://test.com');
		});

		it('applies openGraph.siteName default from config.name', () => {
			const configWithOg: SEOConfig = {
				...baseConfig,
				openGraph: {
					title: 'OG Title',
				},
			};
			const seo = new Seox(configWithOg);
			const metadata = seo.configToMetadata();

			expect(metadata.openGraph?.siteName).toBe('Test Site');
		});

		it('preserves explicit openGraph values', () => {
			const configWithOg: SEOConfig = {
				...baseConfig,
				openGraph: {
					url: 'https://explicit.com',
					siteName: 'Explicit Site',
				},
			};
			const seo = new Seox(configWithOg);
			const metadata = seo.configToMetadata();

			expect(metadata.openGraph?.url).toBe('https://explicit.com');
			expect(metadata.openGraph?.siteName).toBe('Explicit Site');
		});

		it('excludes SEOConfig-only fields (name, url, jsonld)', () => {
			const configWithJsonLd: SEOConfig = {
				...baseConfig,
				jsonld: [{ '@context': 'https://schema.org', '@type': 'Organization' }],
			};
			const seo = new Seox(configWithJsonLd);
			const metadata = seo.configToMetadata();

			expect((metadata as any).name).toBeUndefined();
			expect((metadata as any).url).toBeUndefined();
			expect((metadata as any).jsonld).toBeUndefined();
		});

		it('excludes SEOConfig-only fields from overrides', () => {
			const seo = new Seox(baseConfig);
			const metadata = seo.configToMetadata({
				name: 'Override Name',
				url: 'https://override.com',
				jsonld: [{ '@context': 'https://schema.org', '@type': 'WebSite' }],
			} as Partial<SEOConfig>);

			expect((metadata as any).name).toBeUndefined();
			expect((metadata as any).url).toBeUndefined();
			expect((metadata as any).jsonld).toBeUndefined();
		});
	});

	describe('generatePageMetadata', () => {
		it('is alias for configToMetadata', () => {
			const seo = new Seox(baseConfig);
			const metadata1 = seo.configToMetadata({ title: 'Alias Test' });
			const metadata2 = seo.generatePageMetadata({ title: 'Alias Test' });

			expect(metadata1).toEqual(metadata2);
		});
	});

	describe('getJsonLd', () => {
		const jsonldSchema: SEOJsonLd = {
			'@context': 'https://schema.org',
			'@type': 'Organization',
			name: 'Test Org',
		};

		it('returns base schemas when no overrides', () => {
			const configWithJsonLd: SEOConfig = {
				...baseConfig,
				jsonld: [jsonldSchema],
			};
			const seo = new Seox(configWithJsonLd);
			const schemas = seo.getJsonLd();

			expect(schemas).toHaveLength(1);
			expect(schemas[0]).toEqual(jsonldSchema);
		});

		it('merges base and override schemas', () => {
			const additionalSchema: SEOJsonLd = {
				'@context': 'https://schema.org',
				'@type': 'WebSite',
				name: 'Test Site',
			};
			const configWithJsonLd: SEOConfig = {
				...baseConfig,
				jsonld: [jsonldSchema],
			};
			const seo = new Seox(configWithJsonLd);
			const schemas = seo.getJsonLd([additionalSchema]);

			expect(schemas).toHaveLength(2);
			expect(schemas[0]).toEqual(jsonldSchema);
			expect(schemas[1]).toEqual(additionalSchema);
		});

		it('returns empty array when no schemas', () => {
			const seo = new Seox(baseConfig);
			const schemas = seo.getJsonLd();

			expect(schemas).toEqual([]);
		});

		it('handles undefined overrides', () => {
			const configWithJsonLd: SEOConfig = {
				...baseConfig,
				jsonld: [jsonldSchema],
			};
			const seo = new Seox(configWithJsonLd);
			const schemas = seo.getJsonLd(undefined);

			expect(schemas).toHaveLength(1);
		});
	});

	describe('getJsonLdStrings', () => {
		it('returns stringified schemas', () => {
			const jsonldSchema: SEOJsonLd = {
				'@context': 'https://schema.org',
				'@type': 'Organization',
				name: 'Test',
			};
			const configWithJsonLd: SEOConfig = {
				...baseConfig,
				jsonld: [jsonldSchema],
			};
			const seo = new Seox(configWithJsonLd);
			const strings = seo.getJsonLdStrings();

			expect(strings).toHaveLength(1);
			expect(strings[0]).toBe(JSON.stringify(jsonldSchema));
		});

		it('returns empty array when no schemas', () => {
			const seo = new Seox(baseConfig);
			const strings = seo.getJsonLdStrings();

			expect(strings).toEqual([]);
		});

		it('merges and stringifies override schemas', () => {
			const baseSchema: SEOJsonLd = {
				'@context': 'https://schema.org',
				'@type': 'Organization',
			};
			const overrideSchema: SEOJsonLd = {
				'@context': 'https://schema.org',
				'@type': 'WebSite',
			};
			const configWithJsonLd: SEOConfig = {
				...baseConfig,
				jsonld: [baseSchema],
			};
			const seo = new Seox(configWithJsonLd);
			const strings = seo.getJsonLdStrings([overrideSchema]);

			expect(strings).toHaveLength(2);
			expect(strings[0]).toBe(JSON.stringify(baseSchema));
			expect(strings[1]).toBe(JSON.stringify(overrideSchema));
		});
	});
});
