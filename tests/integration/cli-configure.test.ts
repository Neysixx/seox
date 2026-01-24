import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import fs from 'fs-extra';
import { join } from 'path';
import { tmpdir } from 'os';
import { findNextFiles, addMetadataToFile } from '@src/cli/utils';

describe('CLI configure', () => {
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

	describe('findNextFiles', () => {
		it('finds page.tsx files in app directory', async () => {
			await fs.ensureDir(join(tempDir, 'app'));
			await fs.writeFile(join(tempDir, 'app', 'page.tsx'), 'export default function Home() {}');

			const files = await findNextFiles();

			expect(files).toHaveLength(1);
			expect(files[0].path).toContain('page.tsx');
		});

		it('finds layout.tsx files in app directory', async () => {
			await fs.ensureDir(join(tempDir, 'app'));
			await fs.writeFile(join(tempDir, 'app', 'layout.tsx'), 'export default function Layout() {}');

			const files = await findNextFiles();

			expect(files).toHaveLength(1);
			expect(files[0].path).toContain('layout.tsx');
		});

		it('finds files in nested app directory', async () => {
			await fs.ensureDir(join(tempDir, 'app', 'about'));
			await fs.writeFile(join(tempDir, 'app', 'about', 'page.tsx'), 'export default function About() {}');

			const files = await findNextFiles();

			expect(files).toHaveLength(1);
			expect(files[0].path).toContain('about');
		});

		it('detects files with existing metadata export', async () => {
			await fs.ensureDir(join(tempDir, 'app'));
			await fs.writeFile(
				join(tempDir, 'app', 'page.tsx'),
				`export const metadata = { title: 'Test' };
export default function Home() {}`,
			);

			const files = await findNextFiles();

			expect(files[0].hasMetadata).toBe(true);
		});

		it('detects files without metadata export', async () => {
			await fs.ensureDir(join(tempDir, 'app'));
			await fs.writeFile(join(tempDir, 'app', 'page.tsx'), 'export default function Home() {}');

			const files = await findNextFiles();

			expect(files[0].hasMetadata).toBe(false);
		});

		it('finds files in src/app directory', async () => {
			await fs.ensureDir(join(tempDir, 'src', 'app'));
			await fs.writeFile(join(tempDir, 'src', 'app', 'page.tsx'), 'export default function Home() {}');

			const files = await findNextFiles();

			expect(files).toHaveLength(1);
			expect(files[0].path).toContain('src/app');
		});

		it('returns empty array when no Next.js files exist', async () => {
			const files = await findNextFiles();

			expect(files).toHaveLength(0);
		});

		it('finds both layout and page files', async () => {
			await fs.ensureDir(join(tempDir, 'app'));
			await fs.writeFile(join(tempDir, 'app', 'layout.tsx'), 'export default function Layout() {}');
			await fs.writeFile(join(tempDir, 'app', 'page.tsx'), 'export default function Page() {}');

			const files = await findNextFiles();

			expect(files).toHaveLength(2);
		});
	});

	describe('addMetadataToFile', () => {
		it('adds metadata export to page without metadata', async () => {
			await fs.ensureDir(join(tempDir, 'app'));
			const filePath = join(tempDir, 'app', 'page.tsx');
			await fs.writeFile(filePath, `export default function Home() {
  return <div>Hello</div>;
}`);

			const result = await addMetadataToFile(filePath, false);

			expect(result).toBe(true);

			const content = await fs.readFile(filePath, 'utf8');
			expect(content).toContain("import { seoConfig } from '@/lib/seo'");
			expect(content).toContain('export const metadata = seoConfig.configToMetadata()');
		});

		it('adds metadata and JsonLd import to layout', async () => {
			await fs.ensureDir(join(tempDir, 'app'));
			const filePath = join(tempDir, 'app', 'layout.tsx');
			await fs.writeFile(filePath, `import { seoConfig } from '@/lib/seo';

export default function RootLayout({ children }) {
  return (
    <html>
      <head></head>
      <body>{children}</body>
    </html>
  );
}`);

			const result = await addMetadataToFile(filePath, false);

			expect(result).toBe(true);

			const content = await fs.readFile(filePath, 'utf8');
			expect(content).toContain("import { JsonLd } from 'seox/next'");
		});

		it('injects JsonLd component into head tag', async () => {
			await fs.ensureDir(join(tempDir, 'app'));
			const filePath = join(tempDir, 'app', 'layout.tsx');
			await fs.writeFile(filePath, `import { seoConfig } from '@/lib/seo';

export default function RootLayout({ children }) {
  return (
    <html>
      <head></head>
      <body>{children}</body>
    </html>
  );
}`);

			await addMetadataToFile(filePath, false);

			const content = await fs.readFile(filePath, 'utf8');
			expect(content).toContain('<JsonLd seo={seoConfig} />');
		});

		it('skips files with existing metadata when overwrite is false', async () => {
			await fs.ensureDir(join(tempDir, 'app'));
			const filePath = join(tempDir, 'app', 'page.tsx');
			const originalContent = `export const metadata = { title: 'Original' };
export default function Home() {}`;
			await fs.writeFile(filePath, originalContent);

			const result = await addMetadataToFile(filePath, false);

			expect(result).toBe(false);

			const content = await fs.readFile(filePath, 'utf8');
			expect(content).toContain("title: 'Original'");
		});

		it('overwrites metadata when force is true', async () => {
			await fs.ensureDir(join(tempDir, 'app'));
			const filePath = join(tempDir, 'app', 'page.tsx');
			await fs.writeFile(filePath, `export const metadata = { title: 'Original' };
export default function Home() {}`);

			const result = await addMetadataToFile(filePath, true);

			expect(result).toBe(true);

			const content = await fs.readFile(filePath, 'utf8');
			expect(content).toContain('seoConfig.configToMetadata()');
			expect(content).not.toContain("title: 'Original'");
		});

		it('handles nested app directory structure', async () => {
			await fs.ensureDir(join(tempDir, 'app', 'blog', '[slug]'));
			const filePath = join(tempDir, 'app', 'blog', '[slug]', 'page.tsx');
			await fs.writeFile(filePath, `export default function BlogPost({ params }) {
  return <div>Blog Post</div>;
}`);

			const result = await addMetadataToFile(filePath, false);

			expect(result).toBe(true);

			const content = await fs.readFile(filePath, 'utf8');
			expect(content).toContain("import { seoConfig } from '@/lib/seo'");
			expect(content).toContain('export const metadata = seoConfig.configToMetadata()');
		});

		it('preserves existing imports when adding seoConfig import', async () => {
			await fs.ensureDir(join(tempDir, 'app'));
			const filePath = join(tempDir, 'app', 'page.tsx');
			await fs.writeFile(filePath, `import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return <div>Hello</div>;
}`);

			await addMetadataToFile(filePath, false);

			const content = await fs.readFile(filePath, 'utf8');
			expect(content).toContain("import Link from 'next/link'");
			expect(content).toContain("import Image from 'next/image'");
			expect(content).toContain("import { seoConfig } from '@/lib/seo'");
		});

		it('does not duplicate seoConfig import if already present', async () => {
			await fs.ensureDir(join(tempDir, 'app'));
			const filePath = join(tempDir, 'app', 'page.tsx');
			await fs.writeFile(filePath, `import { seoConfig } from '@/lib/seo';

export default function Home() {
  return <div>Hello</div>;
}`);

			await addMetadataToFile(filePath, false);

			const content = await fs.readFile(filePath, 'utf8');
			const matches = content.match(/import { seoConfig } from '@\/lib\/seo'/g);
			expect(matches?.length).toBe(1);
		});
	});
});
