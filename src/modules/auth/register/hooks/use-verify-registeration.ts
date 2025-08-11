import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useAuthStore } from "@/store";
import { CustomBackendError } from "@/utils/axios-error";
import { VerifyRegisterationUserAPI } from "../api/verify-registeration";

export function useVerifyRegisteration() {
	const { mutate, isPending, isError } = useMutation({
		mutationFn: VerifyRegisterationUserAPI,
		onSuccess: (data) => {
			// Set Authorization tokens
			useAuthStore.getState().setTokens({
				accessToken: data.tokens.accessToken,
				refreshToken: data.tokens.refreshToken,
			});

			// Set User details
			useAuthStore.getState().setUser({
				id: data.user.id,
				firstName: data.user.firstName,
				lastName: data.user.lastName,
				email: data.user.email ?? "",
				profilePicture: data.user.profilePicture,
			});

			router.replace("/(app)");
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
		isError,
	};
}
