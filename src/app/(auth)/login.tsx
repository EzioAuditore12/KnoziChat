import { Text } from "@/components/ui/text";
import { H2, Muted } from "@/components/ui/typography";
import { Link } from "expo-router";
import {
	Dimensions,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

//Components
import { LoginBanner } from "@/modules/auth/login/components/loginBanner";
import { LoginForm } from "@/modules/auth/login/components/loginUserForm";
import { SocialProviderLogin } from "@/modules/auth/login/components/socialProviderLogin";

//hook
import { useloginUserForm } from "@/modules/auth/login/hooks/useLoginUserForm";

export default function LoginScreen() {
	const { mutate, error, isPending } = useloginUserForm();

	const { height } = Dimensions.get("window");
	const insets = useSafeAreaInsets();

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
			style={{ flex: 1 }}
		>
			<ScrollView
				contentContainerStyle={{
					flexGrow: 1,
					padding: 8,
					justifyContent: "center",
					alignItems: "center",
					rowGap: 30,
					paddingBottom: insets.bottom,
				}}
			>
				{height > 700 ? <LoginBanner /> : undefined}

				<H2>Welcome Back !</H2>

				<LoginForm isLoading={isPending} triggerLogin={mutate} />

				{error && <Text className="text-red-500">{error}</Text>}

				<Muted className="text-lg">Or Continue With</Muted>

				<SocialProviderLogin />

				<View className="flex-row gap-x-1">
					<Muted className="text-md">Don't have an account</Muted>
					<Link href={"/(auth)/register/test"} className="text-blue-500">
						Register
					</Link>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
