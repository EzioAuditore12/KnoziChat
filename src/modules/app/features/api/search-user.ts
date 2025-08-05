import env from "@/env";
import axios from "axios";

export interface SearchUserQueryParameters {
	name: string;
	page: number;
	limit: number;
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
	users: User[];
}

export const getUsersFromName = async ({
	name,
	page,
	limit,
}: SearchUserQueryParameters) => {
	const response = await axios.get<SearchUserQueryParametersResponse>(
		`${env.EXPO_PUBLIC_BACKEND_API_URL}/open/user`,
		{
			params: {
				name,
				page,
				limit,
			},
		},
	);
	return response.data;
};
