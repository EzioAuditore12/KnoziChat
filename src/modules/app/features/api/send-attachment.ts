import env from "@/env";
import axios from "axios";

interface SendAttachmentProps {
	attachments: Array<{
		uri: string;
		type: string;
		name: string;
	}>;
	chatId: string;
}

export interface SendAttachmentResponse {
	success: boolean;
	message: string;
	// Add other response fields as needed
}

const api_url = `${env.EXPO_PUBLIC_BACKEND_API_URL}/chat/send-attachment`;

export const sendAttachmentAPI = async ({
	attachments,
	chatId,
}: SendAttachmentProps) => {
	const formData = new FormData();
	attachments.forEach((file) => {
		formData.append("attachments", file as any);
	});
	formData.append("chatId", chatId);

	const response = await axios.post<SendAttachmentResponse>(api_url, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

	return response.data;
};
