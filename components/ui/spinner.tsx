import { cva, type VariantProps } from "class-variance-authority";
import { cssInterop } from "nativewind";
import {
	ActivityIndicatorProps,
	ActivityIndicator as NativeActivityIndicator,
} from "react-native";
import { cn } from "@/lib/utils";

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

// Omit the conflicting 'size' prop from ActivityIndicatorProps
type SpinnerProps = Omit<ActivityIndicatorProps, "size"> &
	VariantProps<typeof activityIndicatorVariants>;

export function Spinner({ className, intent, size, ...props }: SpinnerProps) {
	return (
		<NativeActivityIndicator
			className={cn(activityIndicatorVariants({ intent, size }), className)}
			{...props}
		/>
	);
}
