import { ErrorDialog } from "@/components/error-dialog";
import { P } from "@/components/ui/typography";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";

// Forget Password Otp Input Screen Components
import { ForgetPasswordOtpInput } from "@/modules/auth/forget-password/components/forgotPassword/forgot-password-otp";
import { ForgotPasswordOTPBanner } from "@/modules/auth/forget-password/components/forgotPassword/forgot-password-banner";

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
	const { mutate, isPending, error } = useVerifyOTP();

	const [dialogOpen, setDialogOpen] = useState(false);

	useEffect(() => {
		if (error) setDialogOpen(true);
	}, [error]);
	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
			style={{ flex: 1 }}
		>
			<ScrollView
				contentContainerStyle={{
					flexGrow: 1,
					padding: 8,
					justifyContent: "center",
					alignItems: "center",
					rowGap: 32,
				}}
			>
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

				{/* Error Component */}
				<ErrorDialog
					error={error}
					open={dialogOpen}
					onOpenChange={setDialogOpen}
				/>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
