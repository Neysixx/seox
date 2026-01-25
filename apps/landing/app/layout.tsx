// ABOUTME: Root layout for the SEOX landing page
// ABOUTME: Configures monospace font and dark theme for cyber-minimalist aesthetic

import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
	title: 'SEOX — Control Your SEO',
	description:
		'Type-safe SEO management for Next.js. Centralized metadata, JSON-LD structured data, and CLI tools. 1.2kb gzipped.',
	keywords: ['seo', 'nextjs', 'typescript', 'metadata', 'json-ld', 'structured-data', 'developer-tools'],
	authors: [{ name: 'Kyllian SENRENS' }],
	openGraph: {
		title: 'SEOX — Control Your SEO',
		description: 'Type-safe SEO management for Next.js',
		type: 'website',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' className='dark'>
			<body className={`${jetbrainsMono.variable} antialiased`}>
				{children}
				<Toaster position='bottom-center' />
			</body>
		</html>
	);
}
