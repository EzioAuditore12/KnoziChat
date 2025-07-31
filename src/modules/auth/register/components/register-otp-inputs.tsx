import { InputOTP, InputOTPProps } from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";

export interface RegisterOtpInputProps extends InputOTPProps {
	phoneNumber: string;
	registerationToken: string;
	triggerVerifyOTP: ({
		phoneNumber,
		otp,
		registerationToken,
	}: { phoneNumber: string; otp: string; registerationToken: string }) => void;
}

export function RegisterOtpInput({
	className,
	phoneNumber,
	registerationToken,
	triggerVerifyOTP,
	...props
}: RegisterOtpInputProps) {
	const handleOTPComplete = (code: string) => {
		triggerVerifyOTP({
			otp: code,
			registerationToken: registerationToken,
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
