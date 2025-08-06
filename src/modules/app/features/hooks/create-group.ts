import { CustomBackendError } from "@/utils/axios-error";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { createGroupChatAPI } from "../api/create-group";

export function createGroupChat() {
	const { mutate, isPending } = useMutation({
		mutationFn: createGroupChatAPI,
		onSuccess: () => {
			router.replace("/(tabs)");
		},
		onError: (data) => {
			return alert(
				`Group Creation Failed: ${CustomBackendError.getErrorMessage(data)}`,
			);
		},
	});

	return {
		mutate,
		isPending,
	};
}
