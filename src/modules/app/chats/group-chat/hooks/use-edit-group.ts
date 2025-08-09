import { CustomBackendError } from "@/utils/axios-error";
import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import { editGroupAPI } from "../api/edit-group";

export function useEditGroup() {
	return useMutation({
		mutationFn: (params: { groupId: string; newGroupName: string }) =>
			editGroupAPI(params),
		onError: (error) => {
			const errorMessage = CustomBackendError.getErrorMessage(error);
			return Alert.alert(errorMessage);
		},
	});
}
