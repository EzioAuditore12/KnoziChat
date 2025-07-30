import { P } from "@/components/ui/typography";
import LottieView from "lottie-react-native";
import { useRef } from "react";
import { View } from "react-native";

export function ChangePasswordBanner() {
	const animation = useRef<LottieView>(null);
	return (
		<View className="max-w-md justify-center items-center gap-y-1">
			<LottieView
				autoPlay={true}
				ref={animation}
				style={{
					width: 200,
					height: 200,
				}}
				source={require("../../assets/security.json")}
				loop={true}
			/>
			<P className="text-center">
				You have successfully verified your identity. Please create a new
				password to secure your account.
			</P>
		</View>
	);
}
