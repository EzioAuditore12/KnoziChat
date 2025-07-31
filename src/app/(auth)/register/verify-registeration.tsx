import { ErrorDialog } from "@/components/error-dialog";
import { Text } from "@/components/ui/text";
import { RegisterOTPBanner } from "@/modules/auth/register/components/register-banner-otp";
import { RegisterOtpInput } from "@/modules/auth/register/components/register-otp-inputs";
import { useVerifyRegisteration } from "@/modules/auth/register/hooks/use-verify-register";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

interface VerifyRegisterationScreenLocalParams {
	phoneNumber: string;
	otpDuration: number;
	registerationToken: string;
}

export default function VerifyRegisterationScreen() {
	const { otpDuration, phoneNumber, registerationToken } =
		useLocalSearchParams() as unknown as VerifyRegisterationScreenLocalParams;

	const { error, isPending, mutate } = useVerifyRegisteration();

	const [dialogOpen, setDialogOpen] = useState(false);

	useEffect(() => {
		if (error) setDialogOpen(true);
	}, [error]);

	return (
		<View className="flex-1 justify-center items-center gap-y-2">
			<RegisterOTPBanner otpDuration={otpDuration} phoneNumber={phoneNumber} />
			<RegisterOtpInput
				registerationToken={registerationToken}
				phoneNumber={phoneNumber}
				triggerVerifyOTP={mutate}
			/>

			{/* Error Component */}
			<ErrorDialog
				error={error}
				open={dialogOpen}
				onOpenChange={setDialogOpen}
			/>

			{isPending && <Text>Validating ....</Text>}
		</View>
	);
}
