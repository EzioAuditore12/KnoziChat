import { authStore } from "@/store";
import { CustomBackendError } from "@/utils/axios-error";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { VerifyRegisterationUserAPI } from "../api/verify-register";

export function useVerifyRegisteration() {
	const { mutate, isPending } = useMutation({
		mutationFn: VerifyRegisterationUserAPI,
		onSuccess: (data) => {
			// Set Authorization tokens
			authStore.getState().setTokens({
				accessToken: data.tokens.accessToken,
				refreshToken: data.tokens.refreshToken,
			});

			// Set User details
			authStore.getState().setUser({
				firstName: data.user.firstName,
				lastName: data.user.lastName,
				email: data.user.email ?? "",
				profilePicture: data.user.profilePicture,
			});

			router.replace("/(tabs)");
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
