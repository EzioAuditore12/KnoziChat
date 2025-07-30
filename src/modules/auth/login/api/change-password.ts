import env from "@/env";
import axios from "axios";

interface ChangePasswordTriggerProps {
	phoneNumber: string;
	newPassword: string;
	verificationRequestToken: string;
}

interface ChangePasswordTriggerResponse {
	status: boolean;
	user: {
		id: string;
		firstName: string;
		lastName: string;
		phoneNumber: string;
		email: string;
		profilePicture: string;
	};
	tokens: {
		accessToken: string;
		refreshToken: string;
	};
}

const url = `${env.EXPO_PUBLIC_BACKEND_API_URL}/auth/change-user-password`;

export async function changePasswordTriggerAPI({
	phoneNumber,
	newPassword,
	verificationRequestToken,
}: ChangePasswordTriggerProps) {
	const response = await axios.post<ChangePasswordTriggerResponse>(url, {
		phoneNumber,
		newPassword,
		verificationRequestToken,
	});
	return response.data;
}
