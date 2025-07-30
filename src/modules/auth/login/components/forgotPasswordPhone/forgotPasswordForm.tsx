import { InputField } from "@/components/form/styled-input-field";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { zodResolver } from "@hookform/resolvers/zod";
import { PhoneCall } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { forgotPasswordPhoneNumberSchema } from "../../validation/forgotPasswordForm";

interface ForgotPasswordFormProps {
	triggerForgotPasswordRequest: ({
		phoneNumber,
	}: { phoneNumber: string }) => void;
	isLoading: boolean;
}

type ForgetPaswordFromData = { phoneNumber: string };

export function ForgotPasswordForm({
	triggerForgotPasswordRequest,
	isLoading,
}: ForgotPasswordFormProps) {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: zodResolver(forgotPasswordPhoneNumberSchema) });

	const onSubmit: (data: ForgetPaswordFromData) => void = (data) =>
		triggerForgotPasswordRequest(data);

	return (
		<View className="max-w-md w-full">
			<Controller
				control={control}
				rules={{
					required: true,
				}}
				render={({ field: { onChange, onBlur, value } }) => (
					<InputField
						placeholder="Phone Number"
						error={errors.phoneNumber}
						value={value}
						onChangeText={onChange}
						onBlur={onBlur}
						Icon={PhoneCall}
					/>
				)}
				name="phoneNumber"
			/>

			<Button
				className="rounded-3xl elevation-sm"
				onPress={handleSubmit(onSubmit)}
				disabled={isLoading}
			>
				<Text className="font-bold text-xl">
					{isLoading ? "SENDING OTP" : "SEND OTP"}
				</Text>
			</Button>
		</View>
	);
}
