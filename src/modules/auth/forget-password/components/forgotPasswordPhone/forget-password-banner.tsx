import { H2, P } from "@/components/ui/typography";
import LottieView from "lottie-react-native";
import { useRef } from "react";
import { View } from "react-native";

export function ForgotPasswordPhoneBanner() {
	const animation = useRef<LottieView>(null);
	return (
		<View className="justify-center items-center gap-y-2 max-w-md">
			<LottieView
				autoPlay={true}
				ref={animation}
				style={{
					width: 200,
					height: 200,
				}}
				source={require("../../assets/mobile_phone.json")}
				loop={true}
			/>
			<H2>Enter Phone Number</H2>
			<P className="text-center">
				Please enter your registered mobile number. We'll send you a One-Time
				Password (OTP) to help you securely reset your password.
			</P>
		</View>
	);
}
