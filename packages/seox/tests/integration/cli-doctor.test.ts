// ABOUTME: Integration tests for the CLI doctor command
// ABOUTME: Tests end-to-end SEO validation with real config files

import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { getPath, runDoctorChecks } from '@src/cli/utils';
import { SEO_CONFIG_FILENAME } from '@src/constants';
import fs from 'fs-extra';
import { tmpdir } from 'os';
import { join } from 'path';

describe('CLI doctor', () => {
	let tempDir: string;
	let originalCwd: string;

	beforeEach(async () => {
		originalCwd = process.cwd();
		tempDir = await fs.mkdtemp(join(tmpdir(), 'seox-test-'));
		process.chdir(tempDir);
	});

	afterEach(async () => {
		process.chdir(originalCwd);
		await fs.rm(tempDir, { recursive: true, force: true });
	});

	describe('config file detection', () => {
		it('detects missing config file', async () => {
			const configPath = getPath(SEO_CONFIG_FILENAME);
			const exists = await fs.pathExists(configPath);

			expect(exists).toBe(false);
		});

		it('detects existing config file', async () => {
			await fs.ensureDir(join(tempDir, 'lib'));
			const configPath = getPath(SEO_CONFIG_FILENAME);
			await fs.writeFile(configPath, 'export const seoConfig = {}');

			const exists = await fs.pathExists(configPath);

			expect(exists).toBe(true);
		});
	});

	describe('validation with SEOConfig', () => {
		it('outputs errors for invalid config', () => {
			const config = {
				name: 'Test Site',
				url: 'https://test.com',
				// Missing title and description
			};

			const issues = runDoctorChecks(config);

			expect(issues.errors.length).toBeGreaterThan(0);
			expect(issues.errors.some((e) => e.includes('title'))).toBe(true);
			expect(issues.errors.some((e) => e.includes('description'))).toBe(true);
		});

		it('outputs warnings for suboptimal config', () => {
			const config = {
				name: 'Test Site',
				url: 'https://test.com',
				title: 'A'.repeat(70), // Too long
				description: 'B'.repeat(170), // Too long
				jsonld: [{ '@context': 'https://schema.org', '@type': 'WebPage' }],
			};

			const issues = runDoctorChecks(config);

			expect(issues.warnings.length).toBeGreaterThan(0);
			expect(issues.warnings.some((w) => w.includes('title') && w.includes('too long'))).toBe(true);
			expect(issues.warnings.some((w) => w.includes('description') && w.includes('too long'))).toBe(true);
		});

		it('outputs success for valid config', () => {
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
		});

		it('outputs suggestions for missing JSON-LD', () => {
			const config = {
				name: 'Test Site',
				url: 'https://test.com',
				title: 'Valid Title',
				description: 'A valid description',
				// No jsonld
			};

			const issues = runDoctorChecks(config);

			expect(issues.suggestions.length).toBeGreaterThan(0);
			expect(issues.suggestions.some((s) => s.includes('JSON-LD'))).toBe(true);
		});
	});

	describe('title format variations', () => {
		it('validates config with string title', () => {
			const config = {
				name: 'Test Site',
				url: 'https://test.com',
				title: 'My Site Title',
				description: 'A valid description',
				jsonld: [{ '@context': 'https://schema.org', '@type': 'WebPage' }],
			};

			const issues = runDoctorChecks(config);

			expect(issues.errors).toHaveLength(0);
		});

		it('validates config with title object', () => {
			const config = {
				name: 'Test Site',
				url: 'https://test.com',
				title: {
					default: 'My Site',
					template: '%s | My Site',
				},
				description: 'A valid description',
				jsonld: [{ '@context': 'https://schema.org', '@type': 'WebPage' }],
			};

			const issues = runDoctorChecks(config);

			expect(issues.errors).toHaveLength(0);
		});

		it('warns when title.default is too long', () => {
			const config = {
				name: 'Test Site',
				url: 'https://test.com',
				title: {
					default: 'A'.repeat(65),
					template: '%s | Site',
				},
				description: 'A valid description',
				jsonld: [{ '@context': 'https://schema.org', '@type': 'WebPage' }],
			};

			const issues = runDoctorChecks(config);

			expect(issues.warnings.some((w) => w.includes('title') && w.includes('too long'))).toBe(true);
		});
	});

	describe('combined issues', () => {
		it('reports all issues for a problematic config', () => {
			const config = {
				name: 'Test Site',
				url: 'https://test.com',
				title: 'A'.repeat(100), // Too long
				description: 'B'.repeat(200), // Too long
				// No jsonld
			};

			const issues = runDoctorChecks(config);

			// Should have warnings for title and description
			expect(issues.warnings).toHaveLength(2);

			// Should have suggestion for missing jsonld
			expect(issues.suggestions).toHaveLength(1);
		});

		it('reports errors and suggestions together', () => {
			const config = {
				name: 'Test Site',
				url: 'https://test.com',
				// Missing title
				description: 'Valid description',
				// No jsonld
			};

			const issues = runDoctorChecks(config);

			expect(issues.errors).toHaveLength(1);
			expect(issues.suggestions).toHaveLength(1);
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

			expect(issues.errors.some((e) => e.includes('title'))).toBe(true);
		});

		it('handles empty description string', () => {
			const config = {
				name: 'Test Site',
				url: 'https://test.com',
				title: 'Valid Title',
				description: '',
			};

			const issues = runDoctorChecks(config);

			expect(issues.errors.some((e) => e.includes('description'))).toBe(true);
		});

		it('handles title at exactly 60 chars', () => {
			const config = {
				name: 'Test Site',
				url: 'https://test.com',
				title: 'A'.repeat(60),
				description: 'Valid description',
				jsonld: [{ '@context': 'https://schema.org', '@type': 'WebPage' }],
			};

			const issues = runDoctorChecks(config);

			expect(issues.warnings).toHaveLength(0);
		});

		it('handles description at exactly 160 chars', () => {
			const config = {
				name: 'Test Site',
				url: 'https://test.com',
				title: 'Valid Title',
				description: 'A'.repeat(160),
				jsonld: [{ '@context': 'https://schema.org', '@type': 'WebPage' }],
			};

			const issues = runDoctorChecks(config);

			expect(issues.warnings).toHaveLength(0);
		});
	});
});
