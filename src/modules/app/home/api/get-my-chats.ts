import { getAxiosInstance } from "@/lib/api";

export interface GetChatsQueryParameters {
	page: number;
	limit: number;
}

type member = {
	id: string;
	name: string;
	profilePicture: string;
};

export type Chat = {
	id: string;
	name: string;
	avatar: string | null;
	creatorId: string;
	groupChat: boolean;
	createdAt: Date;
	members: member[];
};

interface GetChatsQueryResponse {
	status: boolean;
	message: string;
	chats: Chat[];
}

const url = "/chat/get-my-chats";

export const getMyChatsAPI = async ({
	limit,
	page,
}: GetChatsQueryParameters) => {
	const axiosInstance = getAxiosInstance();

	const response = await axiosInstance.get<GetChatsQueryResponse>(url, {
		params: {
			page,
			limit,
		},
	});

	return response.data;
};
