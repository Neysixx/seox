import type { Metadata } from 'next';
import type { SEOConfig, SEOJsonLd } from '../../types';

export class Seox {
	public config: SEOConfig;

	constructor(config: SEOConfig) {
		this.config = config;
	}

	configToMetadata(overrides?: Partial<SEOConfig>): Metadata {
		// Destructure SEOConfig-only fields, keep the rest as Metadata
		const { name, url, jsonld, ...baseMetadata } = this.config;
		const { name: _, url: __, jsonld: ___, ...overrideMetadata } = overrides ?? {};

		// Merge base and override metadata
		const metadata: Metadata = {
			...baseMetadata,
			...overrideMetadata,
		};

		// Apply openGraph defaults for url and siteName
		if (baseMetadata.openGraph || overrideMetadata.openGraph) {
			metadata.openGraph = {
				...baseMetadata.openGraph,
				...overrideMetadata.openGraph,
				url: overrideMetadata.openGraph?.url ?? baseMetadata.openGraph?.url ?? url,
				siteName: overrideMetadata.openGraph?.siteName ?? baseMetadata.openGraph?.siteName ?? name,
			};
		}

		return metadata;
	}

	generatePageMetadata(overrides?: Partial<SEOConfig>): Metadata {
		return this.configToMetadata(overrides);
	}

	/**
	 * Returns the JSON-LD schemas configured for this SEO config
	 * @param overrides - Optional additional JSON-LD schemas to include
	 * @returns Array of JSON-LD schema objects
	 */
	getJsonLd(overrides?: SEOJsonLd[]): SEOJsonLd[] {
		const baseJsonLd = this.config.jsonld ?? [];
		const additionalJsonLd = overrides ?? [];
		return [...baseJsonLd, ...additionalJsonLd];
	}

	/**
	 * Returns the JSON-LD schemas as stringified JSON strings ready for injection
	 * @param overrides - Optional additional JSON-LD schemas to include
	 * @returns Array of stringified JSON-LD schemas
	 */
	getJsonLdStrings(overrides?: SEOJsonLd[]): string[] {
		return this.getJsonLd(overrides).map((schema) => JSON.stringify(schema));
	}
}
