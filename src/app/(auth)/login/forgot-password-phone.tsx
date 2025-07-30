import { ErrorDialog } from "@/components/error-dialog";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";

// Forgot Password Phone Screen Components
import { ForgotPasswordPhoneBanner } from "@/modules/auth/login/components/forgotPasswordPhone/forgetPasswordBanner";
import { ForgotPasswordForm } from "@/modules/auth/login/components/forgotPasswordPhone/forgotPasswordForm";

// Forgot Password Phone Screen Hooks
import { useForgetPassword } from "@/modules/auth/login/hooks/useForgetPassword";

export default function ForgotPasswordPhoneScreen() {
	const { error, isPending, mutate } = useForgetPassword();
	const [dialogOpen, setDialogOpen] = useState(false);

	useEffect(() => {
		if (error) setDialogOpen(true);
	}, [error]);

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
				{/* Forgot Password Phone Banner */}
				<ForgotPasswordPhoneBanner />

				{/* Forgot Password Phone Form */}
				<ForgotPasswordForm
					triggerForgotPasswordRequest={mutate}
					isLoading={isPending}
				/>

				{/* Error Component */}
				{error && (
					<ErrorDialog
						error={error}
						open={dialogOpen}
						onOpenChange={setDialogOpen}
					/>
				)}
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
