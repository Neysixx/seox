'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, ExternalLink, Terminal, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function Navbar() {
	return (
		<nav className='fixed top-0 left-0 right-0 z-50 px-6 py-4'>
			<div className='max-w-7xl mx-auto flex items-center justify-between'>
				<Link href='/' className='text-lg font-bold tracking-tight'>
					SEOX
				</Link>
				<div className='flex items-center gap-4'>
					<Button asChild variant='ghost' size='sm' className='text-muted-foreground hover:text-foreground'>
						<Link href='https://docs.seo-x.dev' target='_blank' rel='noopener noreferrer'>
							Docs
							<ExternalLink className='size-3 ml-1' />
						</Link>
					</Button>
					<Button asChild variant='ghost' size='icon-sm' className='text-muted-foreground hover:text-foreground'>
						<Link href='https://github.com/neysixx/seox' target='_blank' rel='noopener noreferrer'>
							<svg viewBox='0 0 24 24' className='size-5' fill='currentColor' aria-hidden='true'>
								<path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
							</svg>
							<span className='sr-only'>GitHub</span>
						</Link>
					</Button>
				</div>
			</div>
		</nav>
	);
}

type PackageManager = 'npm' | 'pnpm' | 'bun';

const packageManagers: PackageManager[] = ['npm', 'pnpm', 'bun'];

const installCommands: Record<PackageManager, string> = {
	npm: 'npm install seox',
	pnpm: 'pnpm add seox',
	bun: 'bun add seox',
};

function Hero() {
	const [copied, setCopied] = useState(false);
	const [pmIndex, setPmIndex] = useState(0);

	const pm = packageManagers[pmIndex];

	useEffect(() => {
		const interval = setInterval(() => {
			setPmIndex((prev) => (prev + 1) % packageManagers.length);
		}, 2500);
		return () => clearInterval(interval);
	}, []);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(installCommands[pm]);
		setCopied(true);
		toast.success('Ready to ship.');
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<section className='relative min-h-screen flex flex-col items-center justify-center px-6'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				className='text-center'
			>
				<h1 className='text-[20vw] md:text-[15vw] lg:text-[12vw] font-bold leading-none tracking-tighter'>
					<span className='text-transparent bg-clip-text [-webkit-text-stroke:2px_rgba(255,255,255,0.8)]'>SEOX</span>
					<span className='text-neon cursor-blink'>_</span>
				</h1>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.3 }}
				className='mt-12'
			>
				<Card className='border-neon/30 hover:border-neon/60 transition-colors'>
					<div className='flex items-center gap-4'>
						<div className='w-[145px] overflow-hidden relative h-5'>
							<AnimatePresence mode='popLayout'>
								<motion.code
									key={pm}
									initial={{ y: 16, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									exit={{ y: -16, opacity: 0 }}
									transition={{ duration: 0.25, ease: 'easeOut' }}
									className='text-neon text-sm md:text-base block'
								>
									{installCommands[pm]}
								</motion.code>
							</AnimatePresence>
						</div>
						<Button variant='ghost' size='icon-sm' onClick={handleCopy} className='hover:text-neon hover:bg-neon/10'>
							{copied ? <Check className='text-neon' /> : <Copy />}
						</Button>
					</div>
				</Card>
			</motion.div>

			<motion.p
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.8, delay: 0.5 }}
				className='mt-8 text-muted-foreground text-center max-w-md'
			>
				Type-safe SEO for Next.js. Centralized config. Zero fluff.
			</motion.p>
		</section>
	);
}

const configCode = `// lib/seo.ts
import { Seox } from 'seox/next';


export const metadata = seoConfig.configToMetadata();

export const seoConfig = new Seox({
  name: 'My App',
  url: 'https://myapp.com',
  title: {
    default: 'My App',
    template: '%s | My App',
  },
  description: 'Build something great',
});`;

const pageCode = `// app/about/page.tsx
import { seoConfig } from '@/lib/seo';

export function generateMetadata() {
  return seoConfig.generatePageMetadata({
    title: 'About',
    description: 'Learn more about us',
  });
}`;

const outputCode = `<!-- Generated HTML -->
<title>About | My App</title>
<meta name="description" content="Learn more about us" />
<meta property="og:title" content="About | My App" />
<meta property="og:description" content="Learn more about us" />
<meta property="og:site_name" content="My App" />
<meta property="og:url" content="https://myapp.com" />`;

function LogicSection() {
	const [activeTab, setActiveTab] = useState('config');
	const [glitching, setGlitching] = useState(false);

	const handleTabChange = (value: string) => {
		setGlitching(true);
		setTimeout(() => {
			setActiveTab(value);
			setGlitching(false);
		}, 150);
	};

	return (
		<section className='py-24 px-6 border-t border-white/10'>
			<div className='max-w-7xl mx-auto'>
				<div className='grid lg:grid-cols-2 gap-12 lg:gap-16 items-start'>
					<div>
						<h2 className='text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-none'>
							CONTROL
							<br />
							<span className='text-muted-foreground'>CENTER</span>
						</h2>
						<p className='mt-6 text-muted-foreground max-w-md'>
							Define once, use everywhere. Your SEO config lives in one place and flows through your entire app.
						</p>
					</div>

					<div>
						<Tabs value={activeTab} onValueChange={handleTabChange} className='w-full'>
							<TabsList className='bg-transparent border-b border-white/10 w-full justify-start gap-0 h-auto p-0 rounded-none'>
								<TabsTrigger
									value='config'
									className='rounded-none border-b-2 border-transparent data-[state=active]:border-neon data-[state=active]:text-neon bg-transparent data-[state=active]:bg-transparent px-4 py-3'
								>
									Config
								</TabsTrigger>
								<TabsTrigger
									value='page'
									className='rounded-none border-b-2 border-transparent data-[state=active]:border-neon data-[state=active]:text-neon bg-transparent data-[state=active]:bg-transparent px-4 py-3'
								>
									Page
								</TabsTrigger>
								<TabsTrigger
									value='output'
									className='rounded-none border-b-2 border-transparent data-[state=active]:border-neon data-[state=active]:text-neon bg-transparent data-[state=active]:bg-transparent px-4 py-3'
								>
									Output
								</TabsTrigger>
							</TabsList>

							<div className={`mt-4 ${glitching ? 'glitch' : ''}`}>
								<TabsContent value='config' className='mt-0'>
									<pre className='p-4 bg-white/[0.02] border border-white/10 overflow-x-auto text-sm leading-relaxed'>
										<code className='text-foreground/90'>{configCode}</code>
									</pre>
								</TabsContent>
								<TabsContent value='page' className='mt-0'>
									<pre className='p-4 bg-white/[0.02] border border-white/10 overflow-x-auto text-sm leading-relaxed'>
										<code className='text-foreground/90'>{pageCode}</code>
									</pre>
								</TabsContent>
								<TabsContent value='output' className='mt-0'>
									<pre className='p-4 bg-white/[0.02] border border-white/10 overflow-x-auto text-sm leading-relaxed'>
										<code className='text-foreground/90'>{outputCode}</code>
									</pre>
								</TabsContent>
							</div>
						</Tabs>
					</div>
				</div>
			</div>
		</section>
	);
}

function SpeedGrid() {
	return (
		<section className='border-t border-white/10'>
			<div className='grid md:grid-cols-3'>
				<div className='p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/10 group hover:bg-white/[0.02] transition-colors'>
					<div className='flex items-center gap-3 text-muted-foreground mb-4'>
						<Zap className='size-5' />
						<span className='text-xs uppercase tracking-wider'>Performance</span>
					</div>
					<p className='text-5xl md:text-6xl font-bold'>1.2kb</p>
					<p className='text-muted-foreground mt-2'>gzipped</p>
				</div>

				<div className='p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/10 group hover:bg-white/[0.02] transition-colors'>
					<div className='flex items-center gap-3 text-muted-foreground mb-4'>
						<span className='text-neon font-bold'>TS</span>
						<span className='text-xs uppercase tracking-wider'>Type-Safe</span>
					</div>
					<p className='text-2xl md:text-3xl font-bold'>Full TypeScript</p>
					<p className='text-muted-foreground mt-2'>Autocomplete for every field</p>
				</div>

				<div className='p-8 md:p-12 group hover:bg-white/[0.02] transition-colors'>
					<div className='flex items-center gap-3 text-muted-foreground mb-4'>
						<Terminal className='size-5' />
						<span className='text-xs uppercase tracking-wider'>CLI</span>
					</div>
					<p className='text-2xl md:text-3xl font-bold'>CLI Powered</p>
					<p className='text-muted-foreground mt-2'>init, configure, doctor</p>
				</div>
			</div>
		</section>
	);
}

const frameworks = ['Next.js', 'React', 'TypeScript', 'App Router', 'Pages Router'];

function Footer() {
	return (
		<footer className='border-t border-white/10'>
			<div className='overflow-hidden py-6 border-b border-white/10'>
				<div className='animate-marquee whitespace-nowrap flex'>
					{[...frameworks, ...frameworks, ...frameworks, ...frameworks].map((framework, i) => (
						<span key={i} className='mx-8 text-muted-foreground text-sm'>
							{framework}
						</span>
					))}
				</div>
			</div>

			<div className='p-6'>
				<Button asChild variant='outline' className='w-full h-16 text-lg hover:border-neon hover:text-neon'>
					<Link href='https://github.com/neysixx/seox' target='_blank' rel='noopener noreferrer'>
						<svg viewBox='0 0 24 24' className='size-5 mr-2' fill='currentColor' aria-hidden='true'>
							<path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
						</svg>
						STAR ON GITHUB
					</Link>
				</Button>
			</div>

			<div className='px-6 pb-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground'>
				<div className='flex items-center gap-2'>
					<span className='font-bold text-foreground'>SEOX</span>
					<span>— SEO for Next.js</span>
				</div>
				<nav className='flex gap-6'>
					<Link href='https://docs.seo-x.dev' className='hover:text-neon transition-colors'>
						Docs
					</Link>
					<Link href='https://www.npmjs.com/package/seox' className='hover:text-neon transition-colors'>
						npm
					</Link>
				</nav>
			</div>
		</footer>
	);
}

export default function Home() {
	return (
		<div className='min-h-screen grid-pattern'>
			<Navbar />
			<Hero />
			<LogicSection />
			<SpeedGrid />
			<Footer />
		</div>
	);
}
