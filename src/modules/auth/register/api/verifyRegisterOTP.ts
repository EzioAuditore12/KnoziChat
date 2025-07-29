import env from "@/env";
import axios from "axios";

interface VerifyOtpRegister {
	email: string;
	otp: number;
}

interface VerifyOtpRegisterResponse {
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

export const verifyregisterUserOtpAPI = async ({
	email,
	otp,
}: VerifyOtpRegister) => {
	const response = await axios.post<VerifyOtpRegisterResponse>(
		`${env.EXPO_PUBLIC_BACKEND_API_URL}/auth/verify-otp-register`,
		{
			email,
			otp,
		},
	);

	return response.data;
};
