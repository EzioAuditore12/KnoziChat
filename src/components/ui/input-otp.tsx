import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import { OTPInput, type OTPInputProps, type SlotProps } from "input-otp-native";
import type { OTPInputRef } from "input-otp-native";
import React from "react";
import { useEffect } from "react";
import { KeyboardType, Text, View } from "react-native";
import Animated, {
	useAnimatedStyle,
	withRepeat,
	withTiming,
	withSequence,
	useSharedValue,
} from "react-native-reanimated";

const inputOTPVariants = cva("items-center justify-center border rounded-lg", {
	variants: {
		variant: {
			default: "border-gray-200 bg-gray-50",
			outline: "border-input bg-background",
		},
		size: {
			sm: "w-10 h-10",
			md: "w-12 h-12",
			lg: "w-14 h-14",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

const textVariants = cva("font-medium", {
	variants: {
		size: {
			sm: "text-lg",
			md: "text-xl",
			lg: "text-2xl",
		},
	},
	defaultVariants: {
		size: "md",
	},
});

interface InputOTPProps extends VariantProps<typeof inputOTPVariants> {
	maxLength?: number;
	onComplete?: (code: string) => void;
	onChange?: (value: string) => void;
	className?: string;
	slotClassName?: string;
	showDash?: boolean;
	dashPosition?: number;
	ref?: React.Ref<OTPInputRef>;
	keyboardType?: KeyboardType;
	autofocus?: boolean;
}

function InputOTP({
	maxLength = 6,
	onComplete,
	onChange,
	className,
	slotClassName,
	variant,
	size,
	showDash = true,
	dashPosition = 2,
	ref,
	keyboardType,
	autofocus,
}: InputOTPProps) {
	return (
		<OTPInput
			ref={ref}
			onComplete={onComplete}
			autoFocus={autofocus}
			onChange={onChange}
			maxLength={maxLength}
			keyboardType={keyboardType}
			render={({ slots }) => (
				<View className={cn("flex-row gap-3 justify-center", className)}>
					{slots.map((slot, idx) => (
						<React.Fragment key={idx}>
							<InputOTPSlot
								{...slot}
								variant={variant}
								size={size}
								className={slotClassName}
							/>
							{showDash && idx === dashPosition && <InputOTPDash />}
						</React.Fragment>
					))}
				</View>
			)}
		/>
	);
}

interface InputOTPSlotProps
	extends SlotProps,
		VariantProps<typeof inputOTPVariants> {
	className?: string;
}

function InputOTPSlot({
	char,
	isActive,
	hasFakeCaret,
	variant,
	size,
	className,
}: InputOTPSlotProps) {
	return (
		<View
			className={cn(
				inputOTPVariants({ variant, size }),
				{
					"border-blue-600 border-2": isActive,
				},
				className,
			)}
		>
			{char !== null && (
				<Text
					className={cn(
						textVariants({ size }),
						variant === "default" ? "text-gray-900" : "text-foreground",
					)}
				>
					{char}
				</Text>
			)}
			{hasFakeCaret && <InputOTPCaret />}
		</View>
	);
}

function InputOTPDash() {
	return (
		<View className="w-2 items-center justify-center">
			<View className="w-2 h-0.5 bg-gray-200 rounded-sm" />
		</View>
	);
}

function InputOTPCaret() {
	const opacity = useSharedValue(1);

	useEffect(() => {
		opacity.value = withRepeat(
			withSequence(
				withTiming(0, { duration: 500 }),
				withTiming(1, { duration: 500 }),
			),
			-1,
			true,
		);
	}, [opacity]);

	const animatedStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
	}));

	const baseStyle = {
		width: 2,
		height: 24,
		backgroundColor: "#2563EB",
		borderRadius: 1,
	};

	return (
		<View className="absolute w-full h-full items-center justify-center">
			<Animated.View style={[baseStyle, animatedStyle]} />
		</View>
	);
}

export {
	InputOTP,
	InputOTPSlot,
	InputOTPDash,
	InputOTPCaret,
	type InputOTPProps,
};
