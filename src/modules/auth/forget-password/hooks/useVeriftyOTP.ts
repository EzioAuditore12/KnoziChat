import { CustomBackendError } from "@/utils/axios-error";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { verifyforgetPasswordRequestTriggerAPI } from "../api/verify-forget-otp-request";

export function useVerifyOTP() {
	const { mutate, isPending } = useMutation({
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
		onError: (data) => {
			return alert(
				`Verification Failed: ${CustomBackendError.getErrorMessage(data)}`,
			);
		},
	});

	return {
		isPending,
		mutate,
	};
}
