// ABOUTME: Root layout for the SEOX landing page
// ABOUTME: Configures fonts, global styles, and metadata

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'SEOX - SEO for Next.js made simple',
	description:
		'Elegant SEO management for Next.js applications. Type-safe metadata, JSON-LD structured data, and CLI tools for seamless SEO configuration.',
	keywords: ['seo', 'nextjs', 'typescript', 'metadata', 'json-ld', 'structured-data'],
	authors: [{ name: 'Kyllian SENRENS' }],
	openGraph: {
		title: 'SEOX - SEO for Next.js made simple',
		description: 'Elegant SEO management for Next.js applications',
		type: 'website',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
		</html>
	);
}
