import { ErrorDialog } from "@/components/error-dialog";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "@/components/keyboard-aware-scrollView";

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
	
	const { error, isPending, mutate } = useChangePasswordForm();
	
	const [dialogOpen, setDialogOpen] = useState(false);

	useEffect(() => {
		if (error) setDialogOpen(true);
	}, [error]);

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

				{/* Error Component */}
				<ErrorDialog
					error={error}
					open={dialogOpen}
					onOpenChange={setDialogOpen}
				/>
		</KeyboardAwareScrollView>
	);
}
