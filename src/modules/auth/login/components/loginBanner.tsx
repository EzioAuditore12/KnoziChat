import LottieView from "lottie-react-native";
import { useRef } from "react";

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
			source={require("../assets/Login.json")}
			loop={false}
		/>
	);
}
