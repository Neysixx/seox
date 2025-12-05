import path from 'node:path';
import chalk from 'chalk';
import fs from 'fs-extra';
import ora from 'ora';
import prompts from 'prompts';
import { PACKAGE_NAME, SEO_CONFIG_FILENAME } from '../../constants';
import { TEMPLATES } from '../constants';
import { getPath } from '../utils';
import { program } from './program';

program
	.command('init')
	.description('Initialize the SEOX SEO configuration')
	//   .option('-t, --template <type>', 'Template to use (blog, ecommerce, corporate)', 'default') // TODO: Add template option
	.action(async (_options) => {
		console.log(chalk.cyan.bold(`\n🧠 ${PACKAGE_NAME} - Initialization\n`));

		// Check if the file already exists
		if (await fs.pathExists(getPath(SEO_CONFIG_FILENAME))) {
			const { overwrite } = await prompts({
				type: 'confirm',
				name: 'overwrite',
				message: `The ${getPath(SEO_CONFIG_FILENAME)} file already exists. Do you want to overwrite it?`,
				initial: false,
			});

			if (!overwrite) {
				console.log(chalk.yellow('⚠️  Initialization canceled'));
				return;
			}
		}

		// Interactive questions
		const answers = await prompts([
			{
				type: 'text',
				name: 'siteName',
				message: 'Name of your site :',
				initial: 'My Site',
			},
			{
				type: 'text',
				name: 'baseUrl',
				message: 'Base URL (without trailing slash) :',
				initial: 'https://mysite.com',
				validate: (value) => value.startsWith('http') || 'Invalid URL',
			},
			{
				type: 'text',
				name: 'siteDescription',
				message: 'Default description :',
				initial: 'A modern site built with Next.js',
			},
		]);

		if (!answers.siteName) {
			console.log(chalk.red('❌ Initialization canceled'));
			return;
		}

		const spinner = ora('Creating files...').start();

		try {
			// Create the lib directory if it doesn't exist
			await fs.ensureDir(path.join(process.cwd(), 'lib'));

			// Generate the config file
			let configContent = TEMPLATES.config;
			Object.entries(answers).forEach(([key, value]) => {
				configContent = configContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
			});

			await fs.writeFile(getPath(SEO_CONFIG_FILENAME), configContent, 'utf8');

			spinner.succeed('Configuration created successfully!');

			console.log(chalk.green('\n✅ File created : ') + chalk.gray(getPath(SEO_CONFIG_FILENAME)));
			console.log(chalk.cyan('\n📝 Next step :'));
			console.log(chalk.white('   bunx seox configure'));
			console.log();
		} catch (error) {
			spinner.fail('Error creating the configuration');
			console.error(chalk.red((error as Error).message));
			process.exit(1);
		}
	});
