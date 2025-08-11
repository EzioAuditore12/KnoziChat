import {
	KeyboardAwareScrollView as RNKeyboardAwareScrollView,
	type KeyboardAwareScrollViewProps as RNKeyboardAwareScrollViewProps,
} from "react-native-keyboard-controller";

type KeyboardAwareScrollViewProps = RNKeyboardAwareScrollViewProps;

export const KeyboardAwareScrollView = ({
	className,
	children,
	bottomOffset = 50,
	...props
}: KeyboardAwareScrollViewProps) => {
	return (
		<RNKeyboardAwareScrollView
			bottomOffset={bottomOffset}
			contentContainerClassName={className}
			{...props}
		>
			{children}
		</RNKeyboardAwareScrollView>
	);
};
