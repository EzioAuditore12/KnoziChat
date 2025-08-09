import env from "@/env";
import axios from "axios";

interface UserDetailsQueryParamers {
	id: string;
}

interface UserDetailsQueryParametersResponse {
	id: string;
	firstName: string;
	phoneNumber: string;
	lastName: string;
	email: null | string;
	profilePicture: string | null;
	joinedAt: Date | null;
}

const url = `${env.EXPO_PUBLIC_BACKEND_API_URL}/open/user`;

export const getUserDetailsAPI = async ({ id }: UserDetailsQueryParamers) => {
	const response = await axios.get<UserDetailsQueryParametersResponse>(
		`${url}/${id}`,
	);
	return response.data;
};
