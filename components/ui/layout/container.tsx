import { cva, type VariantProps } from "class-variance-authority";
import { View, type ViewProps } from "react-native";
import { cn } from "@/lib/utils";

const containerStyles = cva("flex-1", {
	variants: {
		centered: {
			true: "justify-center items-center",
			false: "",
		},
		padded: {
			true: "p-4",
			false: "",
		},
	},
	defaultVariants: {
		centered: false,
		padded: false,
	},
});

type ContainerProps = ViewProps &
	VariantProps<typeof containerStyles> & {
		className?: string;
	};

function Container({
	className,
	centered,
	padded,
	children,
	...props
}: ContainerProps) {
	return (
		<View
			className={cn(containerStyles({ centered, padded }), className)}
			{...props}
		>
			{children}
		</View>
	);
}

export { Container, type ContainerProps };
