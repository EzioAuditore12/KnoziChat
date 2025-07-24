import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { LoginBanner } from "@/modules/auth/login/components/loginBanner";
import { LoginForm } from "@/modules/auth/login/components/loginUserForm";
import { SocialProviderLogin } from "@/modules/auth/login/components/socialProviderLogin";
import { useloginUserForm } from "@/modules/auth/login/hooks/useLoginUserForm";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

export default function LoginScreen() {
	const { mutate, error, isPending } = useloginUserForm();
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
					rowGap: 32,
				}}
			>
				<LoginBanner />
				<H1>Login</H1>
				<LoginForm isLoading={isPending} triggerLogin={mutate} />
				{error && <Text className="text-red-500">{error}</Text>}
				<Muted className="text-lg">Or Continue With</Muted>
				<SocialProviderLogin />
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
