import env from "@/env";
import axios from "axios";

interface RegisterUserProps {
	profilePicture?: File | null;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	password: string;
}

export interface RegisterUserResponse {
	success: boolean;
	phoneNumber: string;
	message: string;
	registerationToken: string;
	otpDuration: number;
}

export const registerUserAPI = async ({
	profilePicture,
	firstName,
	lastName,
	phoneNumber,
	password,
}: RegisterUserProps) => {
	const formData = new FormData();

	// Only append profilePicture if it exists
	if (profilePicture) {
		formData.append("profilePicture", profilePicture as any);
	}

	formData.append("firstName", firstName);
	formData.append("lastName", lastName);
	formData.append("phoneNumber", phoneNumber);
	formData.append("password", password);

	const response = await axios.post<RegisterUserResponse>(
		`${env.EXPO_PUBLIC_BACKEND_API_URL}/auth/register`,
		formData,
		{
			headers: {
				"Content-Type": "multipart/form-data",
			},
		},
	);

	return response.data;
};
