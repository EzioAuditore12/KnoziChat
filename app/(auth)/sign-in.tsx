import { Container } from "@/components/ui/layout";
import { Text } from "@/components/ui/text";
import { H1, H2 } from "@/components/ui/typography";
import { AuthLayout } from "@/modules/auth/layout/auth-layout";
import { PassKeyLogin } from "@/modules/auth/login/components/pass-key-signin";
import { SocialProviderLogin } from "@/modules/auth/login/components/social-provider-login";
import { LoginHook } from "@/modules/auth/login/hooks";

export default function SignIn() {
    const {error,googleSignIn,passKeySignIn}=LoginHook()
	return (
		<AuthLayout className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
			<Container centered padded className="gap-y-7">
				<H1>Welcome to KnoziChat</H1>
				<H2>Continue with us</H2>
				
                <PassKeyLogin
                onPress={passKeySignIn}
                />
				<SocialProviderLogin
                onPress={googleSignIn}
                />

				<Text className="text-red-500">
					{Array.isArray(error)
						? error.map((e, i) => <span key={i}>{e.message || String(e)}</span>)
						: error}
				</Text>
			</Container>
		</AuthLayout>
	);
}
