import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps } from "react";
import { Pressable } from "react-native";
import { TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";

const buttonVariants = cva("flex items-center justify-center rounded-md", {
	variants: {
		variant: {
			default: "bg-primary active:opacity-90 web:hover:opacity-90",
			destructive: "bg-destructive active:opacity-90 web:hover:opacity-90",
			outline:
				"border border-input bg-background active:bg-accent web:hover:bg-accent",
			secondary: "bg-secondary active:opacity-80 web:hover:opacity-80",
			ghost: "active:bg-accent web:hover:bg-accent",
			link: "web:hover:underline",
		},
		size: {
			default: "py-3 px-5 min-h-[48px]",
			sm: "py-2 px-3 min-h-[36px]",
			lg: "py-4 px-8 min-h-[56px]",
			icon: "p-3 w-12 h-12",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
});

const buttonTextVariants = cva("text-base font-medium text-center", {
	variants: {
		variant: {
			default: "text-primary-foreground",
			destructive: "text-destructive-foreground",
			outline: "text-foreground",
			secondary: "text-secondary-foreground",
			ghost: "text-foreground",
			link: "text-primary",
		},
		size: {
			default: "text-base leading-5",
			sm: "text-sm leading-4",
			lg: "text-lg leading-6",
			icon: "text-base leading-5",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
});

type ButtonProps = ComponentProps<typeof Pressable> &
	VariantProps<typeof buttonVariants>;

function Button({ ref, className, variant, size, ...props }: ButtonProps) {
	return (
		<TextClassContext.Provider
			value={buttonTextVariants({
				variant,
				size,
			})}
		>
			<Pressable
				className={cn(
					props.disabled && "opacity-50",
					buttonVariants({ variant, size, className }),
				)}
				ref={ref}
				role="button"
				{...props}
			/>
		</TextClassContext.Provider>
	);
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
