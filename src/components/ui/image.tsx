import { cva, type VariantProps } from "class-variance-authority";
import { Image as ExpoImage, ImageProps as ExpoImageProps } from "expo-image";
import { cssInterop } from "nativewind";
import { cn } from "@/lib/utils";

cssInterop(ExpoImage, {
	className: {
		target: "style",
	},
});

const imageVariants = cva("", {
	variants: {
		shape: {
			rounded: "rounded-xl",
			circle: "rounded-full",
			square: "rounded-none",
		},
		size: {
			sm: "w-12 h-12",
			md: "w-20 h-20",
			lg: "w-32 h-32",
			xl: "w-48 h-48",
		},
		shadow: {
			none: "",
			sm: "shadow-sm",
			md: "shadow-md",
			lg: "shadow-lg",
		},
	},
	defaultVariants: {
		shape: "rounded",
		size: "md",
		shadow: "none",
	},
});

export interface ImageProps
	extends ExpoImageProps,
		VariantProps<typeof imageVariants> {
	className?: string;
}

export function Image({
	className,
	shape,
	size,
	shadow,
	...props
}: ImageProps) {
	return (
		<ExpoImage
			className={cn(imageVariants({ shape, size, shadow }), className)}
			{...props}
		/>
	);
}
