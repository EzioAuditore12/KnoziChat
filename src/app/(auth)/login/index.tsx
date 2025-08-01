import { ErrorDialog } from "@/components/error-dialog";
import { KeyboardAwareScrollView } from "@/components/keyboard-aware-scrollView";
import { H1, Muted } from "@/components/ui/typography";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";

// Login Screen Components
import { LoginBanner } from "@/modules/auth/login/components/loginForm/loginBanner";
import { LoginForm } from "@/modules/auth/login/components/loginForm/loginUserForm";
import { SocialProviderLogin } from "@/modules/auth/login/components/loginForm/socialProviderLogin";

// Login Screen Hooks
import { useloginUserForm } from "@/modules/auth/login/hooks/useLoginUserForm";

export default function LoginScreen() {
	const { mutate, error, isPending } = useloginUserForm();
	const [dialogOpen, setDialogOpen] = useState(false);

	const windowDimensions = useWindowDimensions();

	useEffect(() => {
		if (error) setDialogOpen(true);
	}, [error]);

	return (
		<KeyboardAwareScrollView className="justify-center items-center gap-y-5">
			{/* Login Banner */}
			{windowDimensions.height > 700 ? <LoginBanner /> : undefined}

			<H1>Login</H1>

			{/* Login Form */}
			<LoginForm isLoading={isPending} triggerLogin={mutate} />

			{/* Error Component */}
			{error && (
				<ErrorDialog
					error={error}
					open={dialogOpen}
					onOpenChange={setDialogOpen}
				/>
			)}
			{/* Link to forget Password */}
			<Link
				href={"/(auth)/forget-password"}
				className="text-black dark:text-white"
			>
				Forgot Password ?
			</Link>

			<Muted className="text-lg">Or Continue With</Muted>

			{/* Social Provider Login */}
			<SocialProviderLogin />

			<Link href={"/(auth)/register"} className="text-black dark:text-white">
				Don't have an account
			</Link>
		</KeyboardAwareScrollView>
	);
}
