import { InputField } from "@/components/form/input-field";
import { UploadAvatar } from "@/components/form/upload-avatar";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import {
	type registerUserInputs,
	registerUserValidations,
} from "../validations";

interface RegisterationFormProps {
	triggerRegisteration: (
		data: Omit<registerUserInputs, "confirmPassword">,
	) => void;
	isLoading: boolean;
}

export function RegisterationForm({
	isLoading,
	triggerRegisteration,
}: RegisterationFormProps) {
	const {
		control,
		formState: { errors },
		handleSubmit,
	} = useForm({ resolver: zodResolver(registerUserValidations) });

	const onSubmit = async (data: registerUserInputs) => {
		const { confirmPassword, ...registerData } = data;
		triggerRegisteration(registerData);
	};

	return (
		<View className="justify-center items-center gap-y-2 max-w-md w-full">
			{/* Avatar Controller */}
			<Controller
				control={control}
				name="profilePicture"
				render={({ field: { onChange, value } }) => (
					<UploadAvatar value={value} onChange={onChange} />
				)}
			/>
			<View className="w-full flex-row gap-x-1 justify-center items-center">
				<Controller
					control={control}
					render={({ field: { onChange, onBlur, value } }) => (
						<InputField
							viewStyle={{
								width: "50%",
							}}
							placeholder="First Name"
							onChangeText={onChange}
							onBlur={onBlur}
							value={value}
							error={errors.firstName}
						/>
					)}
					name="firstName"
				/>

				<Controller
					control={control}
					render={({ field: { onChange, onBlur, value } }) => (
						<InputField
							viewStyle={{
								width: "50%",
							}}
							placeholder="Last Name"
							error={errors.lastName}
							value={value}
							onChangeText={onChange}
							onBlur={onBlur}
						/>
					)}
					name="lastName"
				/>
			</View>

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
					/>
				)}
				name="phoneNumber"
			/>

			<Controller
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<InputField
						placeholder="Password"
						secureTextEntry
						onChangeText={onChange}
						onBlur={onBlur}
						value={value}
						error={errors.password}
					/>
				)}
				name="password"
			/>

			<Controller
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<InputField
						placeholder="Confirm Password"
						secureTextEntry
						onChangeText={onChange}
						onBlur={onBlur}
						value={value}
						error={errors.confirmPassword}
					/>
				)}
				name="confirmPassword"
			/>

			<Button
				className="rounded-3xl elevation-sm"
				onPress={handleSubmit(onSubmit)}
				disabled={isLoading}
			>
				<Text className="font-bold text-xl py-1">
					{isLoading ? "Registering ..." : "Register"}
				</Text>
			</Button>
		</View>
	);
}
