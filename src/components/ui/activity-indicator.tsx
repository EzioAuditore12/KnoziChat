import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import { cssInterop } from "nativewind";
import {
	ActivityIndicator as NativeActivityIndicator,
	ActivityIndicatorProps as NativeActivityIndicatorProps,
} from "react-native";

cssInterop(NativeActivityIndicator, {
	className: {
		target: "color",
		nativeStyleToProp: {
			fontSize: "size",
			color: "color",
		},
	},
});

const activityIndicatorVariants = cva("", {
	variants: {
		intent: {
			primary: "text-blue-500",
			secondary: "text-gray-600",
			destructive: "text-red-500",
		},
		size: {
			sm: "text-sm",
			md: "text-md",
			lg: "text-lg",
			xl: "text-xl",
			xxl: "text-4xl",
			xxxl: "text-[80px]",
		},
	},
	defaultVariants: {
		intent: "primary",
		size: "xxl",
	},
});

interface ActivityIndicatorProps
	extends Omit<NativeActivityIndicatorProps, "size">,
		VariantProps<typeof activityIndicatorVariants> {}

export function ActivityIndicator({
	className,
	intent,
	size,
	...props
}: ActivityIndicatorProps) {
	return (
		<NativeActivityIndicator
			className={cn(activityIndicatorVariants({ intent, size }), className)}
			{...props}
		/>
	);
}
