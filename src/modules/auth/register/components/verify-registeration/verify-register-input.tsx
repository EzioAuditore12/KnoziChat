import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
	useOTPInput,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";

export interface VerifyRegisterationOtpInputProp {
	className?: string;
	phoneNumber: string;
	registerationToken: string;
	isError: boolean;
	triggerVerifyOTP: ({
		phoneNumber,
		otp,
		registerationToken,
	}: {
		phoneNumber: string;
		otp: string;
		registerationToken: string;
	}) => void;
}

export function VerifyRegisterationOtpInput({
	className,
	phoneNumber,
	registerationToken,
	isError,
	triggerVerifyOTP,
}: VerifyRegisterationOtpInputProp) {
	const verificationOtp = useOTPInput(6);

	if (verificationOtp.isComplete) {
		triggerVerifyOTP({
			otp: verificationOtp.value,
			phoneNumber: phoneNumber,
			registerationToken: registerationToken,
		});
	}

	if (isError) {
		verificationOtp.clear;
	}

	return (
		<InputOTP
			value={verificationOtp.value}
			onChange={verificationOtp.setValue}
			maxLength={6}
			containerClassName={cn("justify-center", className)}
		>
			<InputOTPGroup>
				{Array.from({ length: 6 }).map((_, idx) => (
					<InputOTPSlot key={idx} index={idx} />
				))}
			</InputOTPGroup>
		</InputOTP>
	);
}
