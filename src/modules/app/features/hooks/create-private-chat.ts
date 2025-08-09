import { CustomBackendError } from "@/utils/axios-error";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert } from "react-native";
import { createPrivateChatAPI } from "../api/create-private-chat";

export function useCreatePrivateChat() {
	const { mutate, isPending } = useMutation({
		mutationFn: createPrivateChatAPI,
		onSuccess: (data) => {
			router.replace({
				pathname: "/(app)/chats/personal-chat/[chatId]",
				params: {
					chatId: data.chatId,
					userName:data.participants.userB.name,
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
