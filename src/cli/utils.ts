import fs from 'fs-extra';
import path from 'path';
import { SEO_CONFIG_DIR } from '../constants';
import type { FileInfo } from './types';

/**
 * Get the path to the configuration file
 * @param filename - The name of the configuration file
 * @returns The path to the configuration file
 */
export function getPath(filename: string): string {
	// Check if we are in a src based codebase
	if (fs.existsSync(process.cwd() + '/src')) {
		return path.join(process.cwd(), 'src', SEO_CONFIG_DIR, filename);
	}
	return path.join(process.cwd(), SEO_CONFIG_DIR, filename);
}

/**
 * Run the doctor checks
 * @param config - The configuration object
 * @returns The issues object
 */
export function runDoctorChecks(config: any) {
	const issues = { errors: [] as string[], warnings: [] as string[], suggestions: [] as string[] };

	// Check the titles
	Object.entries(config.pages || {}).forEach(([name, page]: [string, any]) => {
		if (!page.title) {
			(issues.errors as string[]).push(`Page "${name}" : title missing`);
		} else if (page.title.length > 60) {
			(issues.warnings as string[]).push(`Page "${name}" : title too long (${page.title.length} > 60)`);
		}
		if (!page.description) {
			(issues.errors as string[]).push(`Page "${name}" : description missing`);
		} else if (page.description.length > 160) {
			(issues.warnings as string[]).push(`Page "${name}" : description too long (${page.description.length} > 160)`);
		}

		if (!page.jsonld || page.jsonld.length === 0) {
			(issues.suggestions as string[]).push(`Page "${name}" : add JSON-LD to improve indexing`);
		}
	});

	return issues;
}

/**
 * Find all Next.js files in the project
 * @returns A list of FileInfo objects
 */
export async function findNextFiles(): Promise<FileInfo[]> {
	const files: FileInfo[] = [];

	// Check if we're in a src-based project
	const baseDir = fs.existsSync(process.cwd() + '/src') ? 'src' : '';
	const appDir = path.join(process.cwd(), baseDir, 'app');
	const pagesDir = path.join(process.cwd(), baseDir, 'pages');

	// Check App Router structure
	if (await fs.pathExists(appDir)) {
		await scanDirectory(appDir, files, 'app');
	}

	// Check Pages Router structure
	if (await fs.pathExists(pagesDir)) {
		await scanDirectory(pagesDir, files, 'pages');
	}

	return files;
}

/**
 * Scan a directory for Next.js files
 * @param dir - The directory to scan
 * @param files - The list of FileInfo objects
 * @param type - The type of directory ('app' or 'pages')
 */
async function scanDirectory(dir: string, files: FileInfo[], type: 'app' | 'pages'): Promise<void> {
	const entries = await fs.readdir(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			await scanDirectory(fullPath, files, type);
		} else if (
			entry.isFile() &&
			(entry.name === 'layout.tsx' ||
				entry.name === 'page.tsx' ||
				entry.name === 'layout.ts' ||
				entry.name === 'page.ts')
		) {
			const content = await fs.readFile(fullPath, 'utf8');
			const hasMetadata = content.includes('export const metadata');
			const metadataContent = hasMetadata ? extractMetadataContent(content) : undefined;

			files.push({
				path: fullPath,
				hasMetadata,
				metadataContent,
			});
		}
	}
}

/**
 * Extract the metadata content from the file
 * @param content - The content of the file
 * @returns The metadata content
 */
function extractMetadataContent(content: string): string {
	const lines = content.split('\n');
	const metadataLines: string[] = [];
	let inMetadata = false;
	let braceCount = 0;

	for (const line of lines) {
		if (line.includes('export const metadata')) {
			inMetadata = true;
			metadataLines.push(line);
			braceCount = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
			continue;
		}

		if (inMetadata) {
			metadataLines.push(line);
			braceCount += (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;

			if (braceCount === 0) {
				break;
			}
		}
	}

	return metadataLines.join('\n');
}

/**
 * Check if a file is a layout file
 * @param filePath - The path to the file
 * @returns Whether the file is a layout file
 */
function isLayoutFile(filePath: string): boolean {
	return filePath.endsWith('layout.tsx') || filePath.endsWith('layout.ts');
}

/**
 * Add JsonLd component to the layout file
 * @param content - The content of the file
 * @returns The updated content with JsonLd component
 */
function addJsonLdToLayout(content: string): string {
	// Check if JsonLd is already imported
	if (content.includes('JsonLd')) {
		return content;
	}

	let newContent = content;

	// Update import to include JsonLd
	if (newContent.includes("import { seoConfig } from '@/lib/seo'")) {
		// Add JsonLd import from seox/next
		const lines = newContent.split('\n');
		let insertIndex = 0;

		// Find the seoConfig import line to add JsonLd import after it
		for (let i = 0; i < lines.length; i++) {
			if (lines[i].includes("import { seoConfig } from '@/lib/seo'")) {
				insertIndex = i + 1;
				break;
			}
		}

		lines.splice(insertIndex, 0, "import { JsonLd } from 'seox/next';");
		newContent = lines.join('\n');
	}

	// Add <JsonLd seo={seoConfig} /> inside <head> tag
	if (newContent.includes('<head>') && !newContent.includes('<JsonLd')) {
		newContent = newContent.replace(/<head>(\s*)/, '<head>$1<JsonLd seo={seoConfig} />$1');
	} else if (newContent.includes('<head') && !newContent.includes('<JsonLd')) {
		// Handle <head ...> with attributes
		newContent = newContent.replace(/(<head[^>]*>)(\s*)/, '$1$2<JsonLd seo={seoConfig} />$2');
	}

	return newContent;
}

/**
 * Add metadata to the file
 * @param filePath - The path to the file
 * @param overwrite - Whether to overwrite the existing metadata
 * @returns Whether the metadata was added
 */
export async function addMetadataToFile(filePath: string, overwrite: boolean = false): Promise<boolean> {
	const content = await fs.readFile(filePath, 'utf8');

	if (content.includes('export const metadata') && !overwrite) {
		return false; // Skip if metadata exists and not overwriting
	}

	let newContent = content;

	// Remove existing metadata if overwriting
	if (overwrite && content.includes('export const metadata')) {
		newContent = content.replace(/export const metadata[^;]+;?\s*/gs, '');
	}

	// Add import if not present
	if (!newContent.includes("import { seoConfig } from '@/lib/seo'")) {
		const importLine = "import { seoConfig } from '@/lib/seo';\n";

		// Find the best place to add the import
		const lines = newContent.split('\n');
		let insertIndex = 0;

		// Look for existing imports
		for (let i = 0; i < lines.length; i++) {
			if (lines[i].startsWith('import ')) {
				insertIndex = i + 1;
			} else if (lines[i].trim() === '' && insertIndex > 0) {
				break;
			}
		}

		lines.splice(insertIndex, 0, importLine);
		newContent = lines.join('\n');
	}

	// Add metadata export
	const metadataExport = '\nexport const metadata = seoConfig.configToMetadata();\n';

	// Find the best place to add metadata (after imports, before component)
	const lines = newContent.split('\n');
	let insertIndex = lines.length;

	for (let i = 0; i < lines.length; i++) {
		if (
			lines[i].startsWith('export default') ||
			lines[i].startsWith('export function') ||
			(lines[i].startsWith('export const') && !lines[i].includes('metadata'))
		) {
			insertIndex = i;
			break;
		}
	}

	lines.splice(insertIndex, 0, metadataExport);
	newContent = lines.join('\n');

	// For layout files, also add JsonLd component
	if (isLayoutFile(filePath)) {
		newContent = addJsonLdToLayout(newContent);
	}

	await fs.writeFile(filePath, newContent, 'utf8');
	return true;
}
