import { LinearGradient } from "@/components/ui/linear-gradient";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import { LoginForm } from "@/modules/auth/login/components/loginUserForm";
import { useloginUserForm } from "@/modules/auth/login/hooks/useLoginUserForm";
import { View } from "react-native";

export default function LoginScreen() {
	const { mutate, error, isPending } = useloginUserForm();
	return (
		<View className="flex-1 justify-around items-center gap-y-2">
			<LinearGradient />

			<H1>Login Form</H1>
			<LoginForm isLoading={isPending} triggerLogin={mutate} />

			{error && <Text className="text-red-500">{error}</Text>}
		</View>
	);
}
