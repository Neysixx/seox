import { JetBrains_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';
import { JsonLd } from 'seox/next';
import { seoConfig } from '@/lib/seo';

const jetbrainsMono = JetBrains_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
});

export const metadata = seoConfig.configToMetadata();

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<head>
				<JsonLd seo={seoConfig} />
			</head>
			<body className={`${jetbrainsMono.variable} antialiased`}>
				{children}
				<Toaster position='bottom-center' />
			</body>
		</html>
	);
}
