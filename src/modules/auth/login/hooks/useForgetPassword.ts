import { CustomBackendError } from "@/utils/axios-error";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { forgetPasswordTriggerAPI } from "../api/forget-password-trigger";

export function useForgetPassword() {
	const { mutate, isPending, isError, error } = useMutation({
		mutationFn: forgetPasswordTriggerAPI,
		onSuccess: (data) => {
			router.push({
				pathname: "/login/forget-password-otp",
				params: {
					phoneNumber: data.phoneNumber,
					otpDuration: data.otpDuration,
					requestToken: data.requestToken,
				},
			});
		},
	});

	const errorMessage = isError ? CustomBackendError.getErrorMessage(error) : "";

	return {
		isPending,
		mutate,
		error: errorMessage,
	};
}
