import { CustomBackendError } from "@/utils/axios-error";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { verifyforgetPasswordRequestTriggerAPI } from "../api/verify-forget-otp-request";

export function useVerifyOTP() {
	const { mutate, isPending, isError, error } = useMutation({
		mutationFn: verifyforgetPasswordRequestTriggerAPI,
		onSuccess: (data) => {
			router.replace({
				pathname: "/forget-password/change-password",
				params: {
					phoneNumber: data.phoneNumber,
					verificationRequestToken: data.verificationRequestToken,
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
