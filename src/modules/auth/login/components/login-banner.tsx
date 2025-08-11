import LottieView from "lottie-react-native";
import { useRef } from "react";
import loginBannerAnimation from "../assets/lottie/login-banner.json";

export function LoginBanner() {
	const animation = useRef<LottieView>(null);
	return (
		<LottieView
			autoPlay={true}
			ref={animation}
			style={{
				width: 250,
				height: 250,
			}}
			source={loginBannerAnimation}
			loop={false}
		/>
	);
}
