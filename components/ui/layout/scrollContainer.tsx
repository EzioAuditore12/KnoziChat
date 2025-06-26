import { cva, type VariantProps } from "class-variance-authority";
import { ScrollView, type ScrollViewProps } from "react-native";
import { cn } from "@/lib/utils";

const scrollContainerStyles = cva("flex-1", {
	variants: {
		padded: {
			true: "p-4",
			false: "",
		},
	},
	defaultVariants: {
		padded: false,
	},
});

type ScrollContainerProps = ScrollViewProps &
	VariantProps<typeof scrollContainerStyles> & {
		className?: string;
	};

function ScrollContainer({
	className,
	padded,
	children,
	...props
}: ScrollContainerProps) {
	return (
		<ScrollView
			className={cn(scrollContainerStyles({ padded }), className)}
			{...props}
		>
			{children}
		</ScrollView>
	);
}

export { ScrollContainer, type ScrollContainerProps };
