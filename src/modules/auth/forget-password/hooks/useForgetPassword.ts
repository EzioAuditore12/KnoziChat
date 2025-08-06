import { CustomBackendError } from "@/utils/axios-error";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { forgetPasswordTriggerAPI } from "../api/forget-password-trigger";

export function useForgetPassword() {
	const { mutate, isPending } = useMutation({
		mutationFn: forgetPasswordTriggerAPI,
		onSuccess: (data) => {
			router.push({
				pathname: "/forget-password/forget-password-otp",
				params: {
					phoneNumber: data.phoneNumber,
					otpDuration: data.otpDuration,
					requestToken: data.requestToken,
				},
			});
		},
		onError: (data) => {
			return alert(
				`Failed forget password Request: ${CustomBackendError.getErrorMessage(data)}`,
			);
		},
	});

	return {
		isPending,
		mutate,
	};
}
