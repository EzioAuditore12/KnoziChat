import { KeyboardAwareScrollView } from "@/components/keyboard-aware-scrollView";
import { P } from "@/components/ui/typography";
import { useLocalSearchParams } from "expo-router";

import { ForgotPasswordOTPBanner } from "@/modules/auth/forget-password/components/forgotPassword/forgot-password-banner";
// Forget Password Otp Input Screen Components
import { ForgetPasswordOtpInput } from "@/modules/auth/forget-password/components/forgotPassword/forgot-password-otp";

// Forget Password Otp Input Screen Hooks
import { useVerifyOTP } from "@/modules/auth/forget-password/hooks/useVeriftyOTP";

interface LocalSearchParams {
	otpDuration: number;
	phoneNumber: string;
	requestToken: string;
}

export default function ForgetPasswordOTPScreen() {
	const { phoneNumber, otpDuration, requestToken } =
		useLocalSearchParams() as unknown as LocalSearchParams;
	const { mutate, isPending } = useVerifyOTP();

	return (
		<KeyboardAwareScrollView className="justify-center items-center p-2 gap-y-8">
			{/* Forgot Password OTP Banner */}
			<ForgotPasswordOTPBanner
				phoneNumber={phoneNumber}
				otpDuration={otpDuration}
			/>

			{/* Forgot Password OTP Input */}
			<ForgetPasswordOtpInput
				phoneNumber={phoneNumber}
				requestToken={requestToken}
				triggerVerifyOTP={mutate}
			/>

			{/* Loading State */}
			{isPending && (
				<P className=" mt-2 text-blue-500 animate-pulse">Validating...</P>
			)}
		</KeyboardAwareScrollView>
	);
}
