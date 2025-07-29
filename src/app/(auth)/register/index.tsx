import { Text } from "@/components/ui/text";
import { H2, Muted } from "@/components/ui/typography";
import { RegisterationForm } from "@/modules/auth/register/components/registerationForm";
import { SocialProviderRegister } from "@/modules/auth/register/components/socialProviderLogin";
import { useRegisterationForm } from "@/modules/auth/register/hooks/useRegisterForm";
import { Link } from "expo-router";
import { Alert, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RegisterationScreen() {
	const insets = useSafeAreaInsets();

	const { error, isPending, mutate } = useRegisterationForm();

	if (error) {
		Alert.alert("Error", error || "Something went wrong");
	}

	return (
		<View
			className="flex-1 justify-center items-center gap-y-2"
			style={{
				paddingTop: insets.top,
				paddingBottom: insets.bottom,
			}}
		>
			<H2>Create an Account</H2>
			<RegisterationForm
				triggerRegisteration={(data) => {
					// Convert profilePicture from string to File if needed
					const { profilePicture, ...rest } = data;
					let fileProfilePicture: File;
					if (typeof profilePicture === "string") {
						// You may need to adjust this conversion based on your app's logic
						fileProfilePicture = new File([], profilePicture);
					} else {
						fileProfilePicture = profilePicture;
					}
					mutate({ ...rest, profilePicture: fileProfilePicture });
				}}
				isLoading={isPending}
			/>

			<Muted>Or Continue With</Muted>

			<SocialProviderRegister />

			<View className="flex-row gap-x-1">
				<Muted>Already have an acoount</Muted>
				<Link
					href={"/(auth)/register/verifyRegisterationOTP"}
					className="text-sm underline text-blue-500"
				>
					Login
				</Link>
			</View>
		</View>
	);
}
