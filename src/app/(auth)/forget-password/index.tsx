import { ErrorDialog } from "@/components/error-dialog";
import { useEffect, useState } from "react";

// Forgot Password Phone Screen Components
import { ForgotPasswordPhoneBanner } from "@/modules/auth/forget-password/components/forgotPasswordPhone/forget-password-banner";
import { ForgotPasswordForm } from "@/modules/auth/forget-password/components/forgotPasswordPhone/forgot-password-form";

// Forgot Password Phone Screen Hooks
import { useForgetPassword } from "@/modules/auth/forget-password/hooks/useForgetPassword";
import { KeyboardAwareScrollView } from "@/components/keyboard-aware-scrollView";

export default function ForgotPasswordPhoneScreen() {
	const { error, isPending, mutate } = useForgetPassword();
	const [dialogOpen, setDialogOpen] = useState(false);

	useEffect(() => {
		if (error) setDialogOpen(true);
	}, [error]);

	return (
		<KeyboardAwareScrollView className="justify-center items-center p-2 gap-y-8">
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
	</KeyboardAwareScrollView>
	);
}
