import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { useAuthStore } from "@/store";
import { CustomBackendError } from "@/utils/axios-error";
import { loginUserAPI } from "../api/login-user-form";

export function useLoginUserForm() {
	const { mutate, isPending } = useMutation({
		mutationFn: loginUserAPI,
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

			router.replace("/");
		},
		onError: (data) => {
			return alert(`Login Failed: ${CustomBackendError.getErrorMessage(data)}`);
		},
	});

	return {
		isPending,
		mutate,
	};
}
