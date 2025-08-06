import { KeyboardAwareScrollView } from "@/components/keyboard-aware-scrollView";

// Forgot Password Phone Screen Components
import { ForgotPasswordPhoneBanner } from "@/modules/auth/forget-password/components/forgotPasswordPhone/forget-password-banner";
import { ForgotPasswordForm } from "@/modules/auth/forget-password/components/forgotPasswordPhone/forgot-password-form";

// Forgot Password Phone Screen Hooks
import { useForgetPassword } from "@/modules/auth/forget-password/hooks/useForgetPassword";

export default function ForgotPasswordPhoneScreen() {
	const { isPending, mutate } = useForgetPassword();

	return (
		<KeyboardAwareScrollView className="justify-center items-center p-2 gap-y-8">
			{/* Forgot Password Phone Banner */}
			<ForgotPasswordPhoneBanner />

			{/* Forgot Password Phone Form */}
			<ForgotPasswordForm
				triggerForgotPasswordRequest={mutate}
				isLoading={isPending}
			/>
		</KeyboardAwareScrollView>
	);
}
