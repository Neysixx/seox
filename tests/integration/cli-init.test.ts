// ABOUTME: Integration tests for the CLI init command
// ABOUTME: Tests file creation and template interpolation

import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import fs from 'fs-extra';
import { join } from 'path';
import { tmpdir } from 'os';
import { getPath } from '@src/cli/utils';
import { TEMPLATES } from '@src/cli/constants';
import { SEO_CONFIG_FILENAME } from '@src/constants';

describe('CLI init', () => {
	let tempDir: string;
	let originalCwd: string;

	beforeEach(async () => {
		// Save original cwd
		originalCwd = process.cwd();
		// Create a unique temp directory
		tempDir = await fs.mkdtemp(join(tmpdir(), 'seox-test-'));
		// Change to temp directory
		process.chdir(tempDir);
	});

	afterEach(async () => {
		// Restore original cwd
		process.chdir(originalCwd);
		// Clean up temp directory
		await fs.rm(tempDir, { recursive: true, force: true });
	});

	describe('getPath', () => {
		it('returns lib/seo.ts when no src folder exists', () => {
			const path = getPath(SEO_CONFIG_FILENAME);

			expect(path).toBe(join(tempDir, 'lib', SEO_CONFIG_FILENAME));
		});

		it('returns src/lib/seo.ts when src folder exists', async () => {
			// Create src directory
			await fs.mkdir(join(tempDir, 'src'));

			const path = getPath(SEO_CONFIG_FILENAME);

			expect(path).toBe(join(tempDir, 'src', 'lib', SEO_CONFIG_FILENAME));
		});
	});

	describe('template', () => {
		it('contains all required placeholders', () => {
			expect(TEMPLATES.config).toContain('{{siteName}}');
			expect(TEMPLATES.config).toContain('{{baseUrl}}');
			expect(TEMPLATES.config).toContain('{{siteDescription}}');
		});

		it('replaces placeholders correctly', () => {
			const answers = {
				siteName: 'My Awesome Site',
				baseUrl: 'https://awesome.com',
				siteDescription: 'An awesome site description',
			};

			let configContent = TEMPLATES.config;
			Object.entries(answers).forEach(([key, value]) => {
				configContent = configContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
			});

			expect(configContent).toContain('name: "My Awesome Site"');
			expect(configContent).toContain('url: "https://awesome.com"');
			expect(configContent).toContain('description: "An awesome site description"');
			expect(configContent).not.toContain('{{');
		});

		it('imports Seox from seox/next', () => {
			expect(TEMPLATES.config).toContain('import { Seox } from "seox/next"');
		});

		it('exports seoConfig as Seox instance', () => {
			expect(TEMPLATES.config).toContain('export const seoConfig = new Seox({');
		});
	});

	describe('file creation', () => {
		it('creates lib/seo.ts with correct content', async () => {
			const answers = {
				siteName: 'Test Site',
				baseUrl: 'https://test.com',
				siteDescription: 'Test description',
			};

			let configContent = TEMPLATES.config;
			Object.entries(answers).forEach(([key, value]) => {
				configContent = configContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
			});

			const filePath = getPath(SEO_CONFIG_FILENAME);
			await fs.ensureDir(join(tempDir, 'lib'));
			await fs.writeFile(filePath, configContent, 'utf8');

			const fileExists = await fs.pathExists(filePath);
			expect(fileExists).toBe(true);

			const content = await fs.readFile(filePath, 'utf8');
			expect(content).toContain('name: "Test Site"');
			expect(content).toContain('url: "https://test.com"');
		});

		it('creates src/lib/seo.ts when src folder exists', async () => {
			// Create src directory
			await fs.mkdir(join(tempDir, 'src'));

			const answers = {
				siteName: 'Test Site',
				baseUrl: 'https://test.com',
				siteDescription: 'Test description',
			};

			let configContent = TEMPLATES.config;
			Object.entries(answers).forEach(([key, value]) => {
				configContent = configContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
			});

			const filePath = getPath(SEO_CONFIG_FILENAME);
			await fs.ensureDir(join(tempDir, 'src', 'lib'));
			await fs.writeFile(filePath, configContent, 'utf8');

			const fileExists = await fs.pathExists(filePath);
			expect(fileExists).toBe(true);

			// Verify it's in the src directory
			expect(filePath).toContain('src/lib');
		});

		it('file exists check works correctly', async () => {
			const filePath = getPath(SEO_CONFIG_FILENAME);

			// File should not exist initially
			const existsBefore = await fs.pathExists(filePath);
			expect(existsBefore).toBe(false);

			// Create the file
			await fs.ensureDir(join(tempDir, 'lib'));
			await fs.writeFile(filePath, 'test content', 'utf8');

			// File should exist now
			const existsAfter = await fs.pathExists(filePath);
			expect(existsAfter).toBe(true);
		});
	});
});
