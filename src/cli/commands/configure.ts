import chalk from 'chalk';
import fs from 'fs-extra';
import ora from 'ora';
import prompts from 'prompts';
import { PACKAGE_NAME, SEO_CONFIG_FILENAME } from '../../constants';
import { addMetadataToFile, findNextFiles, getPath } from '../utils';
import { program } from './program';

program
	.command('configure')
	.description('Apply SEO configuration to all Next.js pages and layouts')
	.option('--validate', 'Validate only without generating', false)
	.option('--force', 'Force overwrite existing metadata without asking', false)
	.action(async (options) => {
		console.log(chalk.cyan.bold(`\n⚙️  ${PACKAGE_NAME} - Configuration\n`));

		const spinner = ora('Reading configuration...').start();

		try {
			// Check if the file exists
			if (!(await fs.pathExists(getPath(SEO_CONFIG_FILENAME)))) {
				spinner.fail(SEO_CONFIG_FILENAME + ' file not found');
				console.log(chalk.yellow('\n💡 Run first: ') + chalk.white('bunx seox init'));
				return;
			}

			spinner.text = 'Scanning Next.js files...';

			// Find all layout and page files
			const files = await findNextFiles();

			if (files.length === 0) {
				spinner.fail('No Next.js layout or page files found');
				console.log(chalk.yellow('\n💡 Make sure you have an app/ or pages/ directory with layout.tsx/page.tsx files'));
				return;
			}

			spinner.succeed(`Found ${files.length} file(s) to process`);

			// Show files found
			console.log(chalk.cyan('\n📁 Files found:'));
			files.forEach((file) => {
				const status = file.hasMetadata ? chalk.yellow('(has metadata)') : chalk.green('(no metadata)');
				console.log(chalk.gray(`   • ${file.path} ${status}`));
			});

			// Process each file
			const results = {
				added: 0,
				overwritten: 0,
				skipped: 0,
				errors: [] as string[],
			};

			// Handle files with existing metadata
			const filesWithMetadata = files.filter((f) => f.hasMetadata);
			const filesWithoutMetadata = files.filter((f) => !f.hasMetadata);

			// Auto-add metadata to files without existing metadata
			console.log(chalk.cyan('\n🔄 Processing files without metadata...'));
			for (const file of filesWithoutMetadata) {
				try {
					const success = await addMetadataToFile(file.path, false);
					if (success) {
						results.added++;
						console.log(chalk.green(`   ✓ Added metadata to ${file.path}`));
					}
				} catch (error) {
					results.errors.push(`${file.path}: ${(error as Error).message}`);
					console.log(chalk.red(`   ✗ Error in ${file.path}`));
				}
			}

			// Handle files with existing metadata
			if (filesWithMetadata.length > 0) {
				console.log(chalk.yellow(`\n⚠️  ${filesWithMetadata.length} file(s) already have metadata exports`));

				if (options.force) {
					// Force overwrite all
					console.log(chalk.cyan('\n🔄 Overwriting all existing metadata (--force)...'));
					for (const file of filesWithMetadata) {
						try {
							const success = await addMetadataToFile(file.path, true);
							if (success) {
								results.overwritten++;
								console.log(chalk.yellow(`   ✓ Overwritten ${file.path}`));
							}
						} catch (error) {
							results.errors.push(`${file.path}: ${(error as Error).message}`);
							console.log(chalk.red(`   ✗ Error in ${file.path}`));
						}
					}
				} else {
					// Ask for each file individually
					console.log(chalk.cyan('\n🔄 Processing files with existing metadata...'));
					for (const file of filesWithMetadata) {
						const response = await prompts({
							type: 'confirm',
							name: 'overwrite',
							message: `Overwrite metadata in ${file.path}?`,
							initial: false,
						});

						if (response.overwrite === undefined) {
							console.log(chalk.yellow('\n❌ Operation cancelled'));
							break;
						}

						if (response.overwrite) {
							try {
								const success = await addMetadataToFile(file.path, true);
								if (success) {
									results.overwritten++;
									console.log(chalk.yellow(`   ✓ Overwritten ${file.path}`));
								}
							} catch (error) {
								results.errors.push(`${file.path}: ${(error as Error).message}`);
								console.log(chalk.red(`   ✗ Error in ${file.path}`));
							}
						} else {
							results.skipped++;
							console.log(chalk.gray(`   ○ Skipped ${file.path}`));
						}
					}
				}
			}

			// Show summary
			console.log(chalk.green.bold('\n✅ Configuration Summary:\n'));
			console.log(chalk.gray(`   • ${results.added} file(s) with metadata added`));
			if (results.overwritten > 0) {
				console.log(chalk.yellow(`   • ${results.overwritten} file(s) overwritten`));
			}
			if (results.skipped > 0) {
				console.log(chalk.gray(`   • ${results.skipped} file(s) skipped`));
			}
			if (results.errors.length > 0) {
				console.log(chalk.red(`   • ${results.errors.length} error(s):`));
				results.errors.forEach((error) => {
					console.log(chalk.red(`     - ${error}`));
				});
			}

			// Information about overrides
			if (results.added > 0 || results.overwritten > 0) {
				console.log(chalk.cyan.bold('\n📝 Next Steps:\n'));
				console.log(chalk.white('   The following has been added to your files:'));
				console.log(chalk.gray("   import { seoConfig } from '@/lib/seo';"));
				console.log(chalk.gray("   import { JsonLd } from 'seox/next';"));
				console.log(chalk.gray('   export const metadata = seoConfig.configToMetadata();\n'));

				console.log(chalk.white('   For layout files, the <JsonLd /> component was also added:'));
				console.log(chalk.gray('   <head>'));
				console.log(chalk.gray('     <JsonLd seo={seoConfig} />'));
				console.log(chalk.gray('   </head>\n'));

				console.log(chalk.white('   To customize metadata for specific pages, you can:'));
				console.log(chalk.gray('   1. Pass overrides to configToMetadata():'));
				console.log(chalk.gray('      export const metadata = seoConfig.configToMetadata({'));
				console.log(chalk.gray('        title: "Custom Page Title",'));
				console.log(chalk.gray('        description: "Custom description"'));
				console.log(chalk.gray('      });\n'));
				console.log(chalk.gray('   2. Add JSON-LD schemas in your seo.ts config'));
				console.log();
			}
		} catch (error) {
			spinner.fail(
				`Error during configuration. You may have to check your configuration file in ${getPath(SEO_CONFIG_FILENAME)}.`,
			);
			console.error(chalk.red((error as Error).message));
			process.exit(1);
		}
	});
