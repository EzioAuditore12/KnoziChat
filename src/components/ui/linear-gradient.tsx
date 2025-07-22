import { useColorScheme } from "@/lib/useColorScheme";
import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import {
	LinearGradient as ExpoLinearGradient,
	type LinearGradientProps as ExpoLinearGradientProps,
} from "expo-linear-gradient";

const linearGradientStyles = cva(
	"", // base styles
	{
		variants: {
			position: {
				absolute: "absolute left-0 top-0 right-0",
				relative: "relative",
			},
			size: {
				default: "h-72",
				full: "h-full",
				screen: "h-screen",
			},
			theme: {
				light: "",
				dark: "",
				auto: "",
			},
		},
		defaultVariants: {
			size: "default",
			position: "absolute",
			theme: "auto",
		},
	},
);

// Default color schemes
const DEFAULT_COLORS = {
	light: ["rgba(134, 239, 172, 0.6)", "transparent"] as const,
	dark: ["rgba(107, 114, 128, 0.5)", "transparent"] as const,
} as const;

interface LinearGradientProps
	extends Omit<ExpoLinearGradientProps, "colors">,
		VariantProps<typeof linearGradientStyles> {
	className?: string;
	colors?: ExpoLinearGradientProps["colors"];
	lightColors?: ExpoLinearGradientProps["colors"];
	darkColors?: ExpoLinearGradientProps["colors"];
}

function LinearGradient({
	className,
	size,
	position,
	theme = "auto",
	colors,
	lightColors = DEFAULT_COLORS.light,
	darkColors = DEFAULT_COLORS.dark,
	...props
}: LinearGradientProps) {
	const { isDarkColorScheme } = useColorScheme();

	// Determine which colors to use
	const getColors = () => {
		// If colors prop is provided, use it regardless of theme
		if (colors) return colors;

		// Handle theme-based colors
		switch (theme) {
			case "light":
				return lightColors;
			case "dark":
				return darkColors;
			case "auto":
			default:
				return isDarkColorScheme ? darkColors : lightColors;
		}
	};

	return (
		<ExpoLinearGradient
			className={cn(linearGradientStyles({ size, position, theme }), className)}
			colors={getColors()}
			{...props}
		/>
	);
}

export { LinearGradient, type LinearGradientProps };
