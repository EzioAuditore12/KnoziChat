import { InputOTP, InputOTPProps } from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface ForgetPasswordOtpInputProps extends InputOTPProps {
	phoneNumber: string;
	requestToken: string;
	triggerVerifyOTP: ({
		phoneNumber,
		otp,
		requestToken,
	}: { phoneNumber: string; otp: string; requestToken: string }) => void;
}

export function ForgetPasswordOtpInput({
	className,
	phoneNumber,
	requestToken,
	triggerVerifyOTP,
	...props
}: ForgetPasswordOtpInputProps) {
	const handleOTPComplete = (code: string) => {
		triggerVerifyOTP({
			otp: code,
			requestToken: requestToken,
			phoneNumber: phoneNumber,
		});
	};
	return (
		<InputOTP
			className={cn(className)}
			maxLength={6}
			onComplete={handleOTPComplete}
			variant="outline"
			autofocus={true}
			keyboardType="number-pad"
			size={"lg"}
			{...props}
		/>
	);
}
