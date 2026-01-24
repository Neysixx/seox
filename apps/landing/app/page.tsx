// ABOUTME: SEOX landing page with hero, features, quick start, and footer sections
// ABOUTME: Single page marketing site for the seox npm package

import { ArrowRight, CheckCircle, Code2, FileJson, Settings, Terminal } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function Hero() {
	return (
		<section className='flex flex-col items-center gap-8 py-24 px-6 text-center'>
			<Badge variant='secondary' className='px-4 py-1'>
				v1.2.0 — Now with doctor command
			</Badge>
			<h1 className='text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl'>
				SEO for Next.js
				<br />
				<span className='text-muted-foreground'>made simple</span>
			</h1>
			<p className='max-w-2xl text-xl text-muted-foreground'>
				Type-safe metadata management, JSON-LD structured data, and CLI tools for seamless SEO configuration in your
				Next.js applications.
			</p>
			<div className='flex flex-col gap-4 sm:flex-row'>
				<Button size='lg' asChild>
					<Link href='https://docs.seox.dev'>
						Get Started <ArrowRight className='ml-2 h-4 w-4' />
					</Link>
				</Button>
				<Button size='lg' variant='outline' asChild>
					<Link href='https://github.com/neysixx/seox'>View on GitHub</Link>
				</Button>
			</div>
		</section>
	);
}

const features = [
	{
		icon: Code2,
		title: 'Type-Safe Metadata',
		description:
			'Full TypeScript support with autocomplete for all Next.js metadata fields. Catch errors at build time.',
	},
	{
		icon: FileJson,
		title: 'JSON-LD Components',
		description:
			'Ready-to-use React components for structured data. Support for Article, Product, Organization, and more.',
	},
	{
		icon: Terminal,
		title: 'CLI Tools',
		description:
			'Initialize projects quickly with seox init, configure metadata with seox configure, and diagnose issues with seox doctor.',
	},
	{
		icon: Settings,
		title: 'Centralized Config',
		description: 'Define your SEO configuration once in seox.config.ts. Reuse it across all your pages effortlessly.',
	},
];

function Features() {
	return (
		<section className='py-24 px-6 bg-muted/50'>
			<div className='mx-auto max-w-6xl'>
				<div className='mb-16 text-center'>
					<h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>Everything you need for SEO</h2>
					<p className='mt-4 text-lg text-muted-foreground'>
						Built for modern Next.js applications with TypeScript at its core.
					</p>
				</div>
				<div className='grid gap-8 md:grid-cols-2'>
					{features.map((feature) => (
						<Card key={feature.title} className='border-0 shadow-sm'>
							<CardHeader>
								<feature.icon className='h-10 w-10 text-primary' />
								<CardTitle className='mt-4'>{feature.title}</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className='text-base'>{feature.description}</CardDescription>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}

function QuickStart() {
	const steps = [
		{ text: 'Install the package', code: 'bun add seox' },
		{ text: 'Initialize your project', code: 'bunx seox init' },
		{ text: 'Configure your metadata', code: 'bunx seox configure' },
	];

	return (
		<section className='py-24 px-6'>
			<div className='mx-auto max-w-4xl'>
				<div className='mb-16 text-center'>
					<h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>Get started in minutes</h2>
					<p className='mt-4 text-lg text-muted-foreground'>Three simple commands to add SEO to your Next.js app.</p>
				</div>
				<div className='space-y-6'>
					{steps.map((step, index) => (
						<div key={step.code} className='flex items-center gap-6'>
							<div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold'>
								{index + 1}
							</div>
							<div className='flex-1'>
								<p className='font-medium'>{step.text}</p>
								<code className='mt-1 block rounded bg-muted px-4 py-3 font-mono text-sm'>{step.code}</code>
							</div>
						</div>
					))}
				</div>
				<div className='mt-12 rounded-lg border bg-card p-6'>
					<h3 className='font-semibold mb-4'>Then use it in your pages:</h3>
					<pre className='overflow-x-auto rounded bg-muted p-4 font-mono text-sm'>
						{`import { SEOX } from 'seox/next';
import { config } from './seox.config';

export async function generateMetadata() {
  return new SEOX(config).metadata({
    title: 'My Page',
    description: 'Page description',
  });
}`}
					</pre>
				</div>
			</div>
		</section>
	);
}

function Highlights() {
	const items = [
		'Full Next.js 14+ App Router support',
		'Zero runtime dependencies for metadata',
		'Tree-shakeable exports',
		'Comprehensive CLI diagnostics',
	];

	return (
		<section className='py-24 px-6 bg-muted/50'>
			<div className='mx-auto max-w-4xl'>
				<div className='mb-12 text-center'>
					<h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>Built for production</h2>
				</div>
				<div className='grid gap-4 sm:grid-cols-2'>
					{items.map((item) => (
						<div key={item} className='flex items-center gap-3'>
							<CheckCircle className='h-5 w-5 text-green-500 shrink-0' />
							<span>{item}</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function Footer() {
	return (
		<footer className='py-12 px-6 border-t'>
			<div className='mx-auto max-w-6xl flex flex-col items-center gap-6 sm:flex-row sm:justify-between'>
				<div className='flex items-center gap-2'>
					<span className='font-bold text-xl'>SEOX</span>
					<span className='text-muted-foreground'>— SEO for Next.js</span>
				</div>
				<nav className='flex gap-6 text-muted-foreground'>
					<Link href='https://docs.seox.dev' className='hover:text-foreground transition-colors'>
						Documentation
					</Link>
					<Link href='https://github.com/neysixx/seox' className='hover:text-foreground transition-colors'>
						GitHub
					</Link>
					<Link href='https://www.npmjs.com/package/seox' className='hover:text-foreground transition-colors'>
						npm
					</Link>
				</nav>
			</div>
		</footer>
	);
}

export default function Home() {
	return (
		<div className='min-h-screen'>
			<Hero />
			<Features />
			<QuickStart />
			<Highlights />
			<Footer />
		</div>
	);
}
