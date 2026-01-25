import { getPath, runDoctorChecks } from '@src/cli/utils';
import { PACKAGE_NAME, SEO_CONFIG_FILENAME } from '@src/constants';
import type { SEOConfig } from '@src/types';
import chalk from 'chalk';
import fs from 'fs-extra';
import { createJiti } from 'jiti';
import ora from 'ora';
import { program } from './program';

program
	.command('doctor')
	.description('Check the validity of your SEO configuration')
	.action(async () => {
		console.log(chalk.cyan.bold(`\n🩺 ${PACKAGE_NAME} - SEO Diagnostic \n`));

		const spinner = ora('Analyzing...').start();

		try {
			if (!(await fs.pathExists(getPath(SEO_CONFIG_FILENAME)))) {
				spinner.fail(`${SEO_CONFIG_FILENAME} file not found in ${getPath(SEO_CONFIG_FILENAME)}`);
				return;
			}

			const jiti = createJiti(import.meta.url, { interopDefault: true });
			const configModule = (await jiti.import(getPath(SEO_CONFIG_FILENAME))) as Record<string, unknown>;
			const seoInstance = configModule.seoConfig as { config: SEOConfig } | undefined;

			if (!seoInstance || !seoInstance.config) {
				spinner.fail('seoConfig not found in configuration file. Make sure you export "seoConfig".');
				return;
			}

			spinner.stop();

			const issues = runDoctorChecks(seoInstance.config);

			if (issues.errors.length === 0 && issues.warnings.length === 0) {
				console.log(chalk.green('✅ No issues detected ! Your SEO configuration is optimal.\n'));
				return;
			}

			if (issues.errors.length > 0) {
				console.log(chalk.red.bold('❌ ERRORS :\n'));
				issues.errors.map((err) => console.log(chalk.red(`   • ${err}`)));
				console.log();
			}

			if (issues.warnings.length > 0) {
				console.log(chalk.yellow.bold('⚠️  WARNINGS :\n'));
				issues.warnings.map((warn) => console.log(chalk.yellow(`   • ${warn}`)));
				console.log();
			}

			if (issues.suggestions.length > 0) {
				console.log(chalk.cyan.bold('💡 SUGGESTIONS :\n'));
				issues.suggestions.map((sugg) => console.log(chalk.cyan(`   • ${sugg}`)));
				console.log();
			}
		} catch (error) {
			spinner.fail('Error during diagnosis');
			console.error(chalk.red((error as Error).message));
		}
	});
