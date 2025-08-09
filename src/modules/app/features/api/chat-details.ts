import env from "@/env";
import axios from "axios";

interface ChatDetailsQueryParameters {
	id: string;
}

export type Chat = {
	id: string;
	name: string;
	avatar: string | null;
	creatorId: string;
	groupChat: boolean;
	createdAt: Date;
};

export type ChatMember = {
	id: string;
	name: string;
	avatar: string | null;
	phoneNumber: string;
};

interface ChatDetailsResponse {
	success: boolean;
	message: string;
	chat: Chat;
	chatMembers: ChatMember[];
}

const url = `${env.EXPO_PUBLIC_BACKEND_API_URL}/chat/details`;

export const getChatDetailsAPI = async ({ id }: ChatDetailsQueryParameters) => {
	const response = await axios.get<ChatDetailsResponse>(`${url}/${id}`);
	return response.data;
};
