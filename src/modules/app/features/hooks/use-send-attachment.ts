import { CustomBackendError } from "@/utils/axios-error";
import { useMutation } from "@tanstack/react-query";
import { sendAttachmentAPI } from "../api/send-attachment";

export function useSendAttachment() {
	const { mutate, isPending } = useMutation({
		mutationFn: sendAttachmentAPI,
		onSuccess: (data) => {
			// You can add navigation or success logic here
			// e.g., show a toast or update UI
		},
		onError: (error) => {
			alert(`Send Attachment Failed: ${CustomBackendError.getErrorMessage(error)}`);
		},
	});

	return {
		isPending,
		mutate,
	};
}
