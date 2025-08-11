import { Github } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { SocialProviderButton } from "@/components/form/social-provider-button";
import { GoogleIcon } from "../assets/icons/google";

// TODO: Need tp add social provider login in future

export function SocialProviderLogin() {
	return (
		<View className="flex-row gap-x-4">
			<SocialProviderButton Icon={Github} />
			<SocialProviderButton Icon={GoogleIcon} />
		</View>
	);
}
