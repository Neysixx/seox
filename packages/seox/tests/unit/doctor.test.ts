// ABOUTME: Unit tests for the runDoctorChecks function
// ABOUTME: Tests validation logic for SEOConfig structure

import { describe, expect, it } from 'bun:test';
import { runDoctorChecks } from '@src/cli/utils';
import type { SEOConfig } from '@src/types';

describe('runDoctorChecks', () => {
	describe('errors', () => {
		it('returns error for missing title', () => {
			const config = {
				name: 'Test Site',
				url: 'https://test.com',
				description: 'A valid description',
			};

			const issues = runDoctorChecks(config);

			expect(issues.errors).toContainEqual('title is missing');
		});

		it('returns error for missing description', () => {
			const config = {
				name: 'Test Site',
				url: 'https://test.com',
				title: 'Valid Title',
			};

			const issues = runDoctorChecks(config);

			expect(issues.errors).toContainEqual('description is missing');
		});

		it('returns errors for both missing title and description', () => {
			const config = {
				name: 'Test Site',
				url: 'https://test.com',
			};

			const issues = runDoctorChecks(config);

			expect(issues.errors).toHaveLength(2);
			expect(issues.errors).toContainEqual('title is missing');
			expect(issues.errors).toContainEqual('description is missing');
		});
	});

	describe('warnings', () => {
		it('returns warning for title > 60 chars', () => {
			const longTitle = 'A'.repeat(61);
			const config = {
				name: 'Test Site',
				url: 'https://test.com',
				title: longTitle,
				description: 'Valid description',
			};

			const issues = runDoctorChecks(config);

			expect(issues.warnings).toContainEqual('title is too long (61 > 60 characters)');
		});

		it('returns warning for description > 160 chars', () => {
			const longDescription = 'A'.repeat(161);
			const config = {
				name: 'Test Site',
				url: 'https://test.com',
				title: 'Valid Title',
				description: longDescription,
			};

			const issues = runDoctorChecks(config);

			expect(issues.warnings).toContainEqual('description is too long (161 > 160 characters)');
		});

		it('does not warn for title at exactly 60 chars', () => {
			const title = 'A'.repeat(60);
			const config = {
				name: 'Test Site',
				url: 'https://test.com',
				title,
				description: 'Valid description',
				jsonld: [{ '@context': 'https://schema.org', '@type': 'WebPage' }],
			};

			const issues = runDoctorChecks(config);

			expect(issues.warnings).toHaveLength(0);
		});

		it('does not warn for description at exactly 160 chars', () => {
			const description = 'A'.repeat(160);
			const config = {
				name: 'Test Site',
				url: 'https://test.com',
				title: 'Valid Title',
				description,
				jsonld: [{ '@context': 'https://schema.org', '@type': 'WebPage' }],
			};

			const issues = runDoctorChecks(config);

			expect(issues.warnings).toHaveLength(0);
		});
	});

	describe('title object format', () => {
		it('extracts title from object with default property', () => {
			const config = {
				name: 'Test Site',
				url: 'https://test.com',
				title: {
					default: 'Default Title',
					template: '%s | Site',
				},
				description: 'Valid description',
				jsonld: [{ '@context': 'https://schema.org', '@type': 'WebPage' }],
			};

			const issues = runDoctorChecks(config);

			expect(issues.errors).toHaveLength(0);
		});

		it('warns when title.default is too long', () => {
			const longTitle = 'A'.repeat(61);
			const config = {
				name: 'Test Site',
				url: 'https://test.com',
				title: {
					default: longTitle,
					template: '%s | Site',
				},
				description: 'Valid description',
			};

			const issues = runDoctorChecks(config);

			expect(issues.warnings).toContainEqual('title is too long (61 > 60 characters)');
		});

		it('returns error when title object has no default', () => {
			const config = {
				name: 'Test Site',
				url: 'https://test.com',
				title: {
					template: '%s | Site',
				},
				description: 'Valid description',
			};

			const issues = runDoctorChecks(config as SEOConfig);

			expect(issues.errors).toContainEqual('title is missing');
		});
	});

	describe('suggestions', () => {
		it('returns suggestion when no jsonld schemas', () => {
			const config = {
				name: 'Test Site',
				url: 'https://test.com',
				title: 'Valid Title',
				description: 'Valid description',
			};

			const issues = runDoctorChecks(config);

			expect(issues.suggestions).toContainEqual('add JSON-LD structured data to improve search engine indexing');
		});

		it('returns suggestion when jsonld is empty array', () => {
			const config = {
				name: 'Test Site',
				url: 'https://test.com',
				title: 'Valid Title',
				description: 'Valid description',
				jsonld: [],
			};

			const issues = runDoctorChecks(config);

			expect(issues.suggestions).toContainEqual('add JSON-LD structured data to improve search engine indexing');
		});

		it('does not suggest when jsonld has schemas', () => {
			const config = {
				name: 'Test Site',
				url: 'https://test.com',
				title: 'Valid Title',
				description: 'Valid description',
				jsonld: [{ '@context': 'https://schema.org', '@type': 'WebPage' }],
			};

			const issues = runDoctorChecks(config);

			expect(issues.suggestions).toHaveLength(0);
		});
	});

	describe('valid config', () => {
		it('returns clean result for valid config', () => {
			const config = {
				name: 'Test Site',
				url: 'https://test.com',
				title: 'Valid Title',
				description: 'A valid description for the page',
				jsonld: [{ '@context': 'https://schema.org', '@type': 'WebPage' }],
			};

			const issues = runDoctorChecks(config);

			expect(issues.errors).toHaveLength(0);
			expect(issues.warnings).toHaveLength(0);
			expect(issues.suggestions).toHaveLength(0);
		});

		it('returns clean result for config with title object', () => {
			const config = {
				name: 'Test Site',
				url: 'https://test.com',
				title: {
					default: 'Test Site',
					template: '%s | Test Site',
				},
				description: 'A valid description for the site',
				jsonld: [{ '@context': 'https://schema.org', '@type': 'Organization' }],
			};

			const issues = runDoctorChecks(config);

			expect(issues.errors).toHaveLength(0);
			expect(issues.warnings).toHaveLength(0);
			expect(issues.suggestions).toHaveLength(0);
		});
	});

	describe('edge cases', () => {
		it('handles empty title string', () => {
			const config = {
				name: 'Test Site',
				url: 'https://test.com',
				title: '',
				description: 'Valid description',
			};

			const issues = runDoctorChecks(config);

			expect(issues.errors).toContainEqual('title is missing');
		});

		it('handles empty description string', () => {
			const config = {
				name: 'Test Site',
				url: 'https://test.com',
				title: 'Valid Title',
				description: '',
			};

			const issues = runDoctorChecks(config);

			expect(issues.errors).toContainEqual('description is missing');
		});

		it('handles null values', () => {
			const config = {
				name: 'Test Site',
				url: 'https://test.com',
				title: null,
				description: null,
			};

			const issues = runDoctorChecks(config);

			expect(issues.errors).toContainEqual('title is missing');
			expect(issues.errors).toContainEqual('description is missing');
		});
	});
});
