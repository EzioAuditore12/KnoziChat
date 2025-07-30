import { PasswordInputField } from "@/components/form/password-input-field";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { changePasswordSchema } from "../../validation/changePassword";

interface ChangePasswordFormProps {
	phoneNumber: string;
	verificationRequestToken: string;
	isLoading: boolean;
	triggerChangePasswordRequest: ({
		phoneNumber,
		verificationRequestToken,
		newPassword,
	}: {
		phoneNumber: string;
		verificationRequestToken: string;
		newPassword: string;
	}) => void;
}

interface ChangePasswordFormData {
	newPassword: string;
	confirmNewPassword: string;
}

export function ChangePasswordForm({
	isLoading,
	phoneNumber,
	triggerChangePasswordRequest,
	verificationRequestToken,
}: ChangePasswordFormProps) {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: zodResolver(changePasswordSchema) });

	const onSubmit: (data: ChangePasswordFormData) => void = (data) => {
		triggerChangePasswordRequest({
			newPassword: data.newPassword,
			phoneNumber,
			verificationRequestToken,
		});
	};

	return (
		<View className="gap-y-3 max-w-md p-2 w-full">
			<Controller
				control={control}
				rules={{
					required: true,
				}}
				render={({ field: { onChange, onBlur, value } }) => (
					<PasswordInputField
						placeholder="New Password"
						error={errors.newPassword}
						value={value}
						onChangeText={onChange}
						onBlur={onBlur}
					/>
				)}
				name="newPassword"
			/>

			<Controller
				control={control}
				rules={{
					required: true,
				}}
				render={({ field: { onChange, onBlur, value } }) => (
					<PasswordInputField
						placeholder="Confirm New Password"
						error={errors.confirmNewPassword}
						value={value}
						onChangeText={onChange}
						onBlur={onBlur}
					/>
				)}
				name="confirmNewPassword"
			/>

			<Button
				className="rounded-3xl elevation-sm"
				onPress={handleSubmit(onSubmit)}
				disabled={isLoading}
			>
				<Text>{isLoading ? "SUBMITTING" : "SUBMIT"}</Text>
			</Button>
		</View>
	);
}
