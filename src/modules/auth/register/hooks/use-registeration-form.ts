import { CustomBackendError } from "@/utils/axios-error";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { registerUserAPI } from "../api/register-user-form";

export function useRegisterationForm() {
	const { mutate, isPending } = useMutation({
		mutationFn: registerUserAPI,
		onSuccess: (data) => {
			router.push({
				params: {
					phoneNumber: data.phoneNumber,
					otpDuration: data.otpDuration,
					registerationToken: data.registerationToken,
				},
				pathname: "/(auth)/register/verify-registeration",
			});
		},
		onError: (data) => {
			return alert(
				`Registeration Failed: ${CustomBackendError.getErrorMessage(data)}`,
			);
		},
	});

	return {
		isPending,
		mutate,
	};
}
