import { defineConfig } from 'tsup';

export default defineConfig({
	entry: {
		index: 'src/index.ts',
		next: 'src/next/index.ts',
		cli: 'src/cli/index.ts',
	},
	format: ['cjs', 'esm'],
	dts: true,
	clean: true,
	sourcemap: process.env.NODE_ENV === 'development',
	minify: process.env.NODE_ENV === 'production',
	target: 'es2022',
	external: [
		'next',
		'react',
		// CLI dependencies
		'commander',
		'chalk',
		'fs-extra',
		'ora',
		'prompts',
		'path',
		'fs',
		'util',
		'os',
		'child_process',
	],
	// Optimizations
	treeshake: true,
	splitting: false, // Disable code splitting for smaller bundles
	platform: 'node',
	// Bundle analysis
	metafile: process.env.ANALYZE === 'true',
});
