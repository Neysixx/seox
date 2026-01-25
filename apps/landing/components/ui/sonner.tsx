// ABOUTME: Custom toast notifications with neon green styling
// ABOUTME: Uses Sonner library with cyber-minimalist theme

'use client';

import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from 'lucide-react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

function Toaster({ ...props }: ToasterProps) {
	return (
		<Sonner
			theme='dark'
			className='toaster group'
			icons={{
				success: <CircleCheckIcon className='size-4 text-neon' />,
				info: <InfoIcon className='size-4' />,
				warning: <TriangleAlertIcon className='size-4' />,
				error: <OctagonXIcon className='size-4' />,
				loading: <Loader2Icon className='size-4 animate-spin' />,
			}}
			toastOptions={{
				className: 'font-mono border border-neon/30 bg-black/90 backdrop-blur-sm',
			}}
			style={
				{
					'--normal-bg': '#000000',
					'--normal-text': '#fafafa',
					'--normal-border': 'rgba(34, 197, 94, 0.3)',
					'--border-radius': '0.25rem',
				} as React.CSSProperties
			}
			{...props}
		/>
	);
}

export { Toaster };
