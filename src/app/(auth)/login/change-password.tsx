import { ErrorDialog } from "@/components/error-dialog";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";

// Change Password Screen Components
import { ChangePasswordBanner } from "@/modules/auth/login/components/changePassword/changePasswordBanner";
import { ChangePasswordForm } from "@/modules/auth/login/components/changePassword/changePasswordForm";

// Change Password Screen hooks
import { useChangePasswordForm } from "@/modules/auth/login/hooks/useChangePassword";

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
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
