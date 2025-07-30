import { InputField } from "@/components/form/styled-input-field";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, PhoneCall } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { loginUserValidations } from "../../validation/loginForm";

interface LoginFormProps {
	triggerLogin: ({
		phoneNumber,
		password,
	}: { phoneNumber: string; password: string }) => void;
	isLoading: boolean;
}

interface LoginFormData {
	phoneNumber: string;
	password: string;
}

export function LoginForm({ triggerLogin, isLoading }: LoginFormProps) {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(loginUserValidations),
	});

	const onSubmit: (data: LoginFormData) => void = (data) =>
		triggerLogin({ phoneNumber: data.phoneNumber, password: data.password });

	return (
		<View className="gap-y-3 max-w-md p-2 w-full">
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

			<Controller
				control={control}
				rules={{
					required: true,
				}}
				render={({ field: { onChange, onBlur, value } }) => (
					<InputField
						placeholder="Password"
						secureTextEntry
						error={errors.password}
						value={value}
						onChangeText={onChange}
						onBlur={onBlur}
						Icon={Lock}
					/>
				)}
				name="password"
			/>
			<Button
				className="rounded-3xl elevation-sm"
				onPress={handleSubmit(onSubmit)}
				disabled={isLoading}
			>
				<Text className="font-bold text-xl py-1">
					{isLoading ? "LOGGING IN" : "LOGIN"}
				</Text>
			</Button>
		</View>
	);
}
