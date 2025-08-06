import { KeyboardAwareScrollView } from "@/components/keyboard-aware-scrollView";
import { Text } from "@/components/ui/text";
import { useLocalSearchParams } from "expo-router";

// Verify Registeration Components
import { RegisterOTPBanner } from "@/modules/auth/register/components/register-banner-otp";
import { RegisterOtpInput } from "@/modules/auth/register/components/register-otp-inputs";

// Verify Registeration Hooks
import { useVerifyRegisteration } from "@/modules/auth/register/hooks/use-verify-register";

interface VerifyRegisterationScreenLocalParams {
	phoneNumber: string;
	otpDuration: number;
	registerationToken: string;
}

export default function VerifyRegisterationScreen() {
	const { otpDuration, phoneNumber, registerationToken } =
		useLocalSearchParams() as unknown as VerifyRegisterationScreenLocalParams;

	const { isPending, mutate } = useVerifyRegisteration();

	return (
		<KeyboardAwareScrollView className="justify-center items-center p-2 gap-y-2">
			<RegisterOTPBanner otpDuration={otpDuration} phoneNumber={phoneNumber} />
			<RegisterOtpInput
				registerationToken={registerationToken}
				phoneNumber={phoneNumber}
				triggerVerifyOTP={mutate}
			/>

			{isPending && <Text>Validating ....</Text>}
		</KeyboardAwareScrollView>
	);
}
