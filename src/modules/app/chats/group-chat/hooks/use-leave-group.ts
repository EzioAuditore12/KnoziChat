import { CustomBackendError } from "@/utils/axios-error";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert } from "react-native";
import { leaveGroupAPI } from "../api/leave-group";

export function useLeaveGroup() {
	return useMutation({
		mutationFn: (params: { groupId: string }) => leaveGroupAPI(params),
		onSuccess: () => {
			router.replace({
				pathname: "/(app)/(tabs)",
			});
		},
		onError: (error) => {
			const errorMessage = CustomBackendError.getErrorMessage(error);
			return Alert.alert(errorMessage);
		},
	});
}
