import { InputOTP } from "@/components/ui/input-otp";
import { RegisterUserResponse } from "@/modules/auth/register/api/registerUserForm";
import { useVerifyRegisteration } from "@/modules/auth/register/hooks/useVerifyOtpRegister";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native";

export default function VerifyRegisterationOTP() {
	const { mutate, error, isPending } = useVerifyRegisteration();

	const { email, otpDuration } =
		useLocalSearchParams() as unknown as RegisterUserResponse;

	const handleOTPChange = (value: string) => {
		console.log("OTP value:", value);
	};

	const handleOTPComplete = (code: string) => {
		console.log("OTP completed:", code);
		mutate({ email, otp: Number(code) });
	};

	if (error) {
		console.log(error);
	}

	return (
		<View className="flex-1 justify-center items-center">
			<InputOTP
				maxLength={6}
				onChange={handleOTPChange}
				onComplete={handleOTPComplete}
				variant="outline"
				autofocus={true}
				keyboardType="number-pad"
				className="mt-4"
			/>

			{isPending && <ActivityIndicator size={50} />}
		</View>
	);
}
