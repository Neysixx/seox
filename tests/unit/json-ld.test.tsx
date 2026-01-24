import * as React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';
import { JsonLd } from '@src/next/components/json-ld';
import { Seox } from '@src/next/classes/seox';
import type { SEOConfig, SEOJsonLd } from '@src/types';

describe('JsonLd', () => {
	const baseConfig: SEOConfig = {
		name: 'Test Site',
		url: 'https://test.com',
		title: 'Test Title',
		description: 'Test Description',
	};

	const orgSchema: SEOJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'Test Org',
	};

	describe('rendering', () => {
		it('returns null when no schemas exist', () => {
			const seo = new Seox(baseConfig);
			const { container } = render(<JsonLd seo={seo} />);

			expect(container.firstChild).toBeNull();
		});

		it('renders script tag with correct type', () => {
			const configWithSchema: SEOConfig = {
				...baseConfig,
				jsonld: [orgSchema],
			};
			const seo = new Seox(configWithSchema);
			const { container } = render(<JsonLd seo={seo} />);

			const scripts = container.querySelectorAll('script[type="application/ld+json"]');
			expect(scripts.length).toBe(1);
		});

		it('renders one script per schema', () => {
			const websiteSchema: SEOJsonLd = {
				'@context': 'https://schema.org',
				'@type': 'WebSite',
				name: 'Test Site',
			};
			const configWithSchemas: SEOConfig = {
				...baseConfig,
				jsonld: [orgSchema, websiteSchema],
			};
			const seo = new Seox(configWithSchemas);
			const { container } = render(<JsonLd seo={seo} />);

			const scripts = container.querySelectorAll('script[type="application/ld+json"]');
			expect(scripts.length).toBe(2);
		});

		it('properly stringifies JSON content', () => {
			const configWithSchema: SEOConfig = {
				...baseConfig,
				jsonld: [orgSchema],
			};
			const seo = new Seox(configWithSchema);
			const { container } = render(<JsonLd seo={seo} />);

			const script = container.querySelector('script[type="application/ld+json"]');
			expect(script).not.toBeNull();

			const content = script?.innerHTML;
			const parsed = JSON.parse(content || '{}');

			expect(parsed['@context']).toBe('https://schema.org');
			expect(parsed['@type']).toBe('Organization');
			expect(parsed.name).toBe('Test Org');
		});

		it('handles additionalSchemas parameter', () => {
			const configWithSchema: SEOConfig = {
				...baseConfig,
				jsonld: [orgSchema],
			};
			const additionalSchema: SEOJsonLd = {
				'@context': 'https://schema.org',
				'@type': 'BreadcrumbList',
				itemListElement: [],
			};
			const seo = new Seox(configWithSchema);
			const { container } = render(<JsonLd seo={seo} additionalSchemas={[additionalSchema]} />);

			const scripts = container.querySelectorAll('script[type="application/ld+json"]');
			expect(scripts.length).toBe(2);

			// Verify the second script contains the additional schema
			const secondScript = scripts[1];
			const parsed = JSON.parse(secondScript?.innerHTML || '{}');
			expect(parsed['@type']).toBe('BreadcrumbList');
		});

		it('renders only additional schemas when base has none', () => {
			const seo = new Seox(baseConfig);
			const additionalSchema: SEOJsonLd = {
				'@context': 'https://schema.org',
				'@type': 'WebPage',
				name: 'Test Page',
			};
			const { container } = render(<JsonLd seo={seo} additionalSchemas={[additionalSchema]} />);

			const scripts = container.querySelectorAll('script[type="application/ld+json"]');
			expect(scripts.length).toBe(1);

			const parsed = JSON.parse(scripts[0]?.innerHTML || '{}');
			expect(parsed['@type']).toBe('WebPage');
		});
	});
});
