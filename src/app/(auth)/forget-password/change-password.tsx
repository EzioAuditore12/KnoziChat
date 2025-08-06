import { KeyboardAwareScrollView } from "@/components/keyboard-aware-scrollView";
import { useLocalSearchParams } from "expo-router";

// Change Password Screen Components
import { ChangePasswordBanner } from "@/modules/auth/forget-password/components/changePassword/change-password-banner";
import { ChangePasswordForm } from "@/modules/auth/forget-password/components/changePassword/change-password-form";

// Change Password Screen hooks
import { useChangePasswordForm } from "@/modules/auth/forget-password/hooks/useChangePassword";

interface LocalSearchParamsChangePassword {
	phoneNumber: string;
	verificationRequestToken: string;
}

export default function ChangePasswordScreen() {
	const { phoneNumber, verificationRequestToken } =
		useLocalSearchParams() as unknown as LocalSearchParamsChangePassword;

	const { isPending, mutate } = useChangePasswordForm();

	return (
		<KeyboardAwareScrollView className="justify-center items-center p-2 gap-y-8">
			{/* Change Password Banner */}
			<ChangePasswordBanner />

			{/* Change Password Form */}
			<ChangePasswordForm
				phoneNumber={phoneNumber}
				verificationRequestToken={verificationRequestToken}
				isLoading={isPending}
				triggerChangePasswordRequest={mutate}
			/>
		</KeyboardAwareScrollView>
	);
}
