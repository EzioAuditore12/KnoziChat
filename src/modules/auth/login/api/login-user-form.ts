import axios from "axios";
import env from "@/env";

interface LoginUserApiProps {
	phoneNumber: string;
	password: string;
}

interface LoginUserApiResponse {
	status: boolean;
	user: {
		id: string;
		email: string | null;
		phoneNumber: string;
		firstName: string;
		lastName: string;
		profilePicture: string;
	};
	tokens: {
		accessToken: string;
		refreshToken: string;
	};
	message: string;
}

const url = `${env.BACKEND_API_URL}/auth/login`;

export async function loginUserAPI({
	phoneNumber,
	password,
}: LoginUserApiProps) {
	const response = await axios.post<LoginUserApiResponse>(url, {
		phoneNumber,
		password,
	});
	return response.data;
}
