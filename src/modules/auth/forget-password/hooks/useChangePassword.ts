import { authStore } from "@/store";
import { CustomBackendError } from "@/utils/axios-error";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { changePasswordTriggerAPI } from "../api/change-password";

export function useChangePasswordForm() {
	const { mutate, isPending } = useMutation({
		mutationFn: changePasswordTriggerAPI,
		onSuccess: (data) => {
			// Set Authorization tokens
			authStore.getState().setTokens({
				accessToken: data.tokens.accessToken,
				refreshToken: data.tokens.refreshToken,
			});

			// Set User details
			authStore.getState().setUser({
				id:data.user.id,
				firstName: data.user.firstName,
				lastName: data.user.lastName,
				email: data.user.email ?? "",
				profilePicture: data.user.profilePicture,
			});

			router.replace("/(tabs)");
		},
		onError: (data) => {
			return alert(
				`Change Password Failed: ${CustomBackendError.getErrorMessage(data)}`,
			);
		},
	});
	return {
		isPending,
		mutate,
	};
}
