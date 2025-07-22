import env from "@/env";
import axios from "axios";

interface LoginUserApiProps {
	email: string;
	password: string;
}

interface LoginUserApiResponse {
	status: boolean;
	user: {
		id: string;
		email: string;
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

const url = `${env.EXPO_PUBLIC_BACKEND_API_URL}/auth/login`;

export async function loginUserAPI({ email, password }: LoginUserApiProps) {
	const response = await axios.post<LoginUserApiResponse>(url, {
		email,
		password,
	});
	return response.data;
}
