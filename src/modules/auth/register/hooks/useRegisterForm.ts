import { authStore } from "@/store";
import { CustomBackendError } from "@/utils/axios-error";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { success } from "zod";
import { registerUserAPI } from "../api/registerUserForm";

export function useRegisterationForm() {
	const { mutate, isPending, isError, error } = useMutation({
		mutationFn: registerUserAPI,
		onSuccess: (data) => {
			router.push({
				params: {
					email: data.email,
					otpDuration: data.otpDuration,
				},
				pathname: "/(auth)/register/verifyRegisterationOTP",
			});
		},
	});

	const errorMessage = isError ? CustomBackendError.getErrorMessage(error) : "";

	console.log(error);
	return {
		isPending,
		mutate,
		error: errorMessage,
	};
}
