import { useWindowDimensions } from "react-native";
import { KeyboardAwareScrollView } from "@/components/keyboard-aware-scroll-view";
import { Link } from "@/components/ui/link";

// Components
import {
	LoginBanner,
	LoginForm,
	SocialProviderLogin,
} from "@/modules/auth/login/components";

// Hooks
import { useLoginUserForm } from "@/modules/auth/login/hooks/use-login-form";

export default function LoginScreen() {
	const { mutate, isPending } = useLoginUserForm();

	const windowDimensions = useWindowDimensions();

	return (
		<KeyboardAwareScrollView className="flex-1 justify-center items-center gap-y-3 p-2">
			{windowDimensions.height > 700 ? <LoginBanner /> : undefined}

			<LoginForm triggerLogin={mutate} isLoading={isPending} />

			<Link href={"/forgot-password/trigger-forget-request"}>
				Forgot Password ?
			</Link>

			<SocialProviderLogin />

			<Link href={"/(auth)/register/register-form"}> Dont Have an Account</Link>
		</KeyboardAwareScrollView>
	);
}
