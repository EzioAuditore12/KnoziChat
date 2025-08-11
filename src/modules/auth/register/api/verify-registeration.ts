import axios from "axios";
import env from "@/env";

interface VerifyRegisterationUserProps {
	phoneNumber: string;
	otp: string;
	registerationToken: string;
}

export interface VeirifyRegisterUserResponse {
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

const api_url = `${env.BACKEND_API_URL}/auth/verify-otp-register`;

export const VerifyRegisterationUserAPI = async ({
	otp,
	phoneNumber,
	registerationToken,
}: VerifyRegisterationUserProps) => {
	const response = await axios.post<VeirifyRegisterUserResponse>(api_url, {
		otp,
		phoneNumber,
		registerationToken,
	});
	return response.data;
};
