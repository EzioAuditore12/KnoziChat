import { getAxiosInstance } from "@/lib/api";

export interface CreatePrivateChatParameters {
	otherUserId: string;
}

export type User = {
	id: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	email: string | null;
	profilePicture: string | null;
};

export interface CreatePrivateChatQueryResponse {
	chatId: string;
	message: string;
	participants: {
		userA: string;
		userB: string;
	};
}

const url = "/chat/create-private-chat";

export const createPrivateChatAPI = async ({
	otherUserId,
}: CreatePrivateChatParameters) => {
	const axiosInstance = getAxiosInstance();
	const response = await axiosInstance.post<CreatePrivateChatQueryResponse>(
		url,
		{
			otherUserId,
		},
	);
	return response.data;
};
