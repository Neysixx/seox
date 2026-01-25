import { Command } from 'commander';
import { PACKAGE_NAME } from '../../constants';

export const program = new Command()
	.name('seox')
	.description(`🧠 ${PACKAGE_NAME} - Simplified SEO management for Next.js App Router`)
	.version('1.0.0');
