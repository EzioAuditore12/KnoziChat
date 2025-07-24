import { authStore } from "@/store";
import { CustomBackendError } from "@/utils/axios-error";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { loginUserAPI } from "../api/loginUserForm";

export function useloginUserForm() {
	const { mutate, isPending, isError, error } = useMutation({
		mutationFn: loginUserAPI,
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
				email: data.user.email,
				profilePicture: data.user.profilePicture,
			});

			router.replace("/");
		},
	});

	const errorMessage = isError ? CustomBackendError.getErrorMessage(error) : "";

	return {
		isPending,
		mutate,
		error: errorMessage,
	};
}
