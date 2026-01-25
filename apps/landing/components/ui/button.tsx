// ABOUTME: Custom button component with aggressive hover states
// ABOUTME: Rectangular design with inverted colors on hover for cyber-minimalist aesthetic

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-neon/50 border",
	{
		variants: {
			variant: {
				default:
					'bg-foreground text-background border-foreground hover:bg-transparent hover:text-foreground',
				destructive: 'bg-destructive text-white border-destructive hover:bg-transparent hover:text-destructive',
				outline:
					'border-foreground/20 bg-transparent text-foreground hover:border-neon hover:text-neon hover:border-glow-neon',
				secondary: 'bg-secondary text-secondary-foreground border-secondary hover:bg-transparent',
				ghost: 'border-transparent hover:bg-foreground/5 hover:text-foreground',
				link: 'border-transparent text-foreground underline-offset-4 hover:underline hover:text-neon',
				neon: 'bg-neon text-black border-neon hover:bg-transparent hover:text-neon hover:border-glow-neon',
			},
			size: {
				default: 'h-10 px-5 py-2',
				xs: "h-7 gap-1 px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3",
				sm: 'h-9 gap-1.5 px-4',
				lg: 'h-12 px-8 text-base',
				xl: 'h-14 px-10 text-lg',
				icon: 'size-10',
				'icon-xs': "size-7 [&_svg:not([class*='size-'])]:size-3",
				'icon-sm': 'size-9',
				'icon-lg': 'size-12',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
);

function Button({
	className,
	variant = 'default',
	size = 'default',
	asChild = false,
	...props
}: React.ComponentProps<'button'> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : 'button';

	return (
		<Comp
			data-slot='button'
			data-variant={variant}
			data-size={size}
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
