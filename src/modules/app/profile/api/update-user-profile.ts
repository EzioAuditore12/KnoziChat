import env from "@/env";
import axios from "axios";

interface UpdateUserProfilePhotoApiProps {
	accessToken: string;
	name: string;
	photo: {
		name: string;
		uri: string;
		type: string;
	};
}

interface UpdateUserProfilePhotoApiResponse {
	status: boolean;
	profileUrl: string;
	viewUrl: string;
	downloadUrl: string;
	message: string;
}

const url = `${env.EXPO_PUBLIC_BACKEND_API_URL}/user/update-profile-photo`;

// Test function to check if regular API calls work
export const testApiConnection = async (accessToken: string) => {
	try {
		const response = await axios.post(
			`${env.EXPO_PUBLIC_BACKEND_API_URL}/user/test`,
			{ test: "data" },
			{
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${accessToken}`,
				},
			},
		);
		return response.data;
	} catch (error) {
		console.error("Test API call failed:", error.message);
		throw error;
	}
};

export const updateUserProfileApi = async ({
	name,
	photo,
	accessToken,
}: UpdateUserProfilePhotoApiProps) => {
	console.log("API called with:", {
		name,
		photo,
		accessToken: accessToken.substring(0, 20) + "...",
	});
	console.log("Full API URL:", url);

	const multipartFormData = new FormData();
	multipartFormData.append("name", name);

	// For React Native, FormData expects the file object in this specific format
	multipartFormData.append("photo", {
		uri: photo.uri,
		type: photo.type,
		name: photo.name,
	} as any);

	console.log("FormData created with photo:", {
		uri: photo.uri,
		type: photo.type,
		name: photo.name,
	});

	// Test basic connectivity first
	try {
		console.log("Testing basic connectivity to server...");
		const testResponse = await axios.get(
			`${env.EXPO_PUBLIC_BACKEND_API_URL}/health`,
			{
				timeout: 10000,
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			},
		);
		console.log("Server connectivity test successful:", testResponse.status);
	} catch (testError) {
		console.log("Server connectivity test failed:", testError.message);
		// Continue with the upload attempt anyway
	}

	try {
		console.log("Attempting file upload...");
		const response = await axios.post<UpdateUserProfilePhotoApiResponse>(
			url,
			multipartFormData,
			{
				timeout: 30000, // 30 second timeout for file uploads
				headers: {
					// Don't set Content-Type manually for multipart/form-data in React Native
					// Let axios handle it automatically
					Authorization: `Bearer ${accessToken}`,
				},
			},
		);

		console.log("Upload successful:", response.data);
		return response.data;
	} catch (error) {
		console.error("Upload error details:", {
			message: error.message,
			response: error.response?.data,
			status: error.response?.status,
			headers: error.response?.headers,
			code: error.code,
			config: {
				url: error.config?.url,
				method: error.config?.method,
				timeout: error.config?.timeout,
			},
		});
		throw error;
	}
};
