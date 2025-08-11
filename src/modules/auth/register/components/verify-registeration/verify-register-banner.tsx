import LottieView from "lottie-react-native";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { H2, P } from "@/components/ui/typography";
import VerifyRegisterOTPImage from "../../assets/lottie/register_otp_verification.json";

interface VerifyRegisterationOTPBannerProps {
	phoneNumber: string;
	otpDuration: number;
}

function maskPhoneNumber(phoneNumber: string) {
	if (phoneNumber.length < 2) return "**";
	const visible = phoneNumber.slice(-2);
	return `*******${visible}`;
}

export function VerifyRegisterationOTPBanner({
	phoneNumber,
	otpDuration,
}: VerifyRegisterationOTPBannerProps) {
	const animation = useRef<LottieView>(null);
	const [secondsLeft, setSecondsLeft] = useState(otpDuration);

	useEffect(() => {
		if (secondsLeft <= 0) return;
		const timer = setInterval(() => {
			setSecondsLeft((prev) => prev - 1);
		}, 1000);
		return () => clearInterval(timer);
	}, [secondsLeft]);

	const minutes = Math.floor(secondsLeft / 60);
	const seconds = secondsLeft % 60;
	const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

	return (
		<View className="justify-center items-center max-w-md">
			<View className="w-52 h-52 rounded-full bg-zinc-800 justify-center items-center elevation-md mx-auto mt-4 mb-4">
				<LottieView
					autoPlay={true}
					ref={animation}
					style={{ width: 180, height: 180 }}
					source={VerifyRegisterOTPImage}
					loop={false}
				/>
			</View>

			<H2 className="font-bold">Secure OTP Verification</H2>
			<P className="text-center mt-2">
				We have sent a One-Time Password (OTP) in order to register your device
				ending with {maskPhoneNumber(phoneNumber)}.
			</P>

			<P className="text-center font-bold text-lg mt-2">
				OTP expires in: {formattedTime}
			</P>
		</View>
	);
}
