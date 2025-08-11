import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "@/components/keyboard-aware-scroll-view";
import { ActivityIndicator } from "@/components/ui/activity-indicator";
import { VerifyRegisterationOTPBanner } from "@/modules/auth/register/components/verify-registeration/verify-register-banner";
import { VerifyRegisterationOtpInput } from "@/modules/auth/register/components/verify-registeration/verify-register-input";
import { useVerifyRegisteration } from "@/modules/auth/register/hooks/use-verify-registeration";

interface VerifyRegisterationScreenLocalParams {
	phoneNumber: string;
	otpDuration: number;
	registerationToken: string;
}

export default function VerifyRegisteration() {
	const { otpDuration, phoneNumber, registerationToken } =
		useLocalSearchParams() as unknown as VerifyRegisterationScreenLocalParams;

	const { isPending, mutate, isError } = useVerifyRegisteration();

	if (isPending) {
		return (
			<View className="flex-1 justify-center items-center">
				<ActivityIndicator size={"xl"} />
			</View>
		);
	}

	return (
		<KeyboardAwareScrollView className="flex-1 bg-red-500">
			<VerifyRegisterationOTPBanner
				otpDuration={otpDuration}
				phoneNumber={phoneNumber}
			/>
			<VerifyRegisterationOtpInput
				phoneNumber={phoneNumber}
				registerationToken={registerationToken}
				triggerVerifyOTP={mutate}
				isError={isError}
			/>
		</KeyboardAwareScrollView>
	);
}
