import {
	Indicator as PrimitiveIndicator,
	Root,
	type RootProps,
	type RootRef,
} from "@rn-primitives/progress";
import { RefObject } from "react";
import Animated, {
	Extrapolation,
	interpolate,
	useAnimatedStyle,
	useDerivedValue,
	withSpring,
} from "react-native-reanimated";
import { cn } from "@/lib/utils";

function Progress({
	className,
	value,
	indicatorClassName,
	...props
}: RootProps & {
	ref?: RefObject<RootRef>;
	indicatorClassName?: string;
}) {
	return (
		<Root
			className={cn(
				"relative h-4 w-full overflow-hidden rounded-full bg-secondary",
				className,
			)}
			{...props}
		>
			<Indicator value={value} className={indicatorClassName} />
		</Root>
	);
}

export { Progress };

function Indicator({
	value,
	className,
}: {
	value: number | undefined | null;
	className?: string;
}) {
	const progress = useDerivedValue(() => value ?? 0);

	const indicator = useAnimatedStyle(() => {
		return {
			width: withSpring(
				`${interpolate(progress.value, [0, 100], [1, 100], Extrapolation.CLAMP)}%`,
				{ overshootClamping: true },
			),
		};
	});
	return (
		<PrimitiveIndicator asChild>
			<Animated.View
				style={indicator}
				className={cn("h-full bg-foreground", className)}
			/>
		</PrimitiveIndicator>
	);
}
