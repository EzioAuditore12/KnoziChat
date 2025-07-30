import env from "@/env";
import axios from "axios";

interface RegisterUserFromApiProps {
	firstName: string;
	lastName: string;
	phoneNumber: string;
	password: string;
	profilePicture: File;
}

interface RegisterUserFromApiResponse {
	success: boolean;
	phoneNumber: string;
	message: string;
	registerationToken: string;
	otpDuration: number;
}

const url = `${env.EXPO_PUBLIC_BACKEND_API_URL}/auth/register`;

export const registerUserApi = async ({
	firstName,
	lastName,
	password,
	phoneNumber,
	profilePicture,
}: RegisterUserFromApiProps) => {
	const multipartFormData = new FormData();
	multipartFormData.append("firstName", firstName);
	multipartFormData.append("lastName", lastName);
	multipartFormData.append("password", password);
	multipartFormData.append("phoneNumber", phoneNumber);
	multipartFormData.append("profilePicture", profilePicture);

	const response = await axios.post<RegisterUserFromApiResponse>(
		url,
		multipartFormData,
		{
			headers: {
				"Content-Type": "multipart/form-data",
			},
		},
	);

	return response.data;
};
