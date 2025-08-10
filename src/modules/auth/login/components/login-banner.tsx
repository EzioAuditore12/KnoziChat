import LottieView from "lottie-react-native";
import { useRef } from "react";
import loginBannerAnimation from "../assets/login-banner.json";

export function LoginBanner() {
	const animation = useRef<LottieView>(null);
	return (
		<LottieView
			autoPlay={true}
			ref={animation}
			style={{
				width: 200,
				height: 200,
			}}
			source={loginBannerAnimation}
			loop={false}
		/>
	);
}
