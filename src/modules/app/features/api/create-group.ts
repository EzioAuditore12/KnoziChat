import { getAxiosInstance } from "@/lib/api";

export interface CreateGroupChatParameters {
	chatMembers: string[];
	name: string;
	groupChat?: true;
}

export type User = {
	id: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	email: string | null;
	profilePicture: string | null;
};

export interface SearchUserQueryParametersResponse {
	id: string;
	name: string;
	creatorId: string;
	groupChat: boolean;
	createdAt: Date;
	chatMembers: string[];
}

const url = "/chat/create-group-chat";

export const createGroupChatAPI = async ({
	name,
	chatMembers,
	groupChat = true,
}: CreateGroupChatParameters) => {
	const axiosInstance = getAxiosInstance();
	const response = await axiosInstance.post<SearchUserQueryParametersResponse>(
		url,
		{
			name,
			chatMembers,
			groupChat,
		},
	);
	return response.data;
};
