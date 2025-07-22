import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import { loginUserValidations } from "../validation/loginForm";

interface LoginFormProps {
	triggerLogin: ({
		email,
		password,
	}: { email: string; password: string }) => void;
	isLoading: boolean;
}

interface LoginFormData {
	email: string;
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
		triggerLogin({ email: data.email, password: data.password });

	return (
		<View className="gap-y-2 w-full p-2 max-w-md">
			<Controller
				control={control}
				rules={{
					required: true,
				}}
				render={({ field: { onChange, onBlur, value } }) => (
					<Input
						placeholder="Enter your email address"
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
					/>
				)}
				name="email"
			/>
			{errors.email && (
				<Text className="text-red-500">{errors.email?.message}</Text>
			)}

			<Controller
				control={control}
				rules={{
					required: true,
				}}
				render={({ field: { onChange, onBlur, value } }) => (
					<Input
						placeholder="Enter your password"
						secureTextEntry
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
					/>
				)}
				name="password"
			/>
			{errors.password && (
				<Text className="text-red-500">{errors.password?.message}</Text>
			)}

			<Button onPress={handleSubmit(onSubmit)} disabled={isLoading}>
				<Text>{isLoading ? "Logging in..." : "Login"}</Text>
			</Button>
		</View>
	);
}
