import env from "@/env";
import axios from "axios";

interface ForgotPasswordTriggerProps {
	phoneNumber: string;
}

interface ForgotPasswordTriggerResponse {
	status: boolean;
	message: string;
	phoneNumber: string;
	otpDuration: number;
	requestToken: string;
}

const url = `${env.EXPO_PUBLIC_BACKEND_API_URL}/auth/forget-password-trigger`;

export async function forgetPasswordTriggerAPI({
	phoneNumber,
}: ForgotPasswordTriggerProps) {
	const response = await axios.post<ForgotPasswordTriggerResponse>(url, {
		phoneNumber,
	});
	return response.data;
}
