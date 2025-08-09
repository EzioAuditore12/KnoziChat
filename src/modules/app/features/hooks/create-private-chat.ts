import { CustomBackendError } from "@/utils/axios-error";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert } from "react-native";
import { createPrivateChatAPI } from "../api/create-private-chat";

export function useCreatePrivateChat() {
	const { data, mutate, isPending } = useMutation({
		mutationFn: createPrivateChatAPI,
		onSuccess: () => {
			router.push({
				pathname: "/chats/personal-chat/[chatId]",
				params: {
					chatId: data?.chatId as string,
				},
			});
		},
		onError: (data) => {
			return Alert.alert(
				"Private Chat Alert",
				`${CustomBackendError.getErrorMessage(data)}`,
				[
					{
						text: "Cancel",
						onPress: () => console.log(data),
					},
				],
			);
		},
	});

	return {
		mutate,
		isPending,
	};
}
