import env from "@/env";
import axios from "axios";

interface VerifyForgotOTPRequestProps {
	phoneNumber: string;
	otp: string;
	requestToken: string;
}

interface VerifyForgotOTPRequestResponse {
	status: boolean;
	message: string;
	phoneNumber: string;
	verificationRequestToken: string;
}

const url = `${env.EXPO_PUBLIC_BACKEND_API_URL}/auth/verify-change-password-request`;

export async function verifyforgetPasswordRequestTriggerAPI({
	phoneNumber,
	otp,
	requestToken,
}: VerifyForgotOTPRequestProps) {
	const response = await axios.post<VerifyForgotOTPRequestResponse>(url, {
		phoneNumber,
		otp,
		requestToken,
	});
	return response.data;
}
