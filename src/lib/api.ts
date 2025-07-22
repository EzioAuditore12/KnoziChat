import env from "@/env";
import { authStore } from "@/store";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { router } from "expo-router";

interface RegenerateTokensApiResponse {
	status: true;
	message: string;
	tokens: {
		accessToken: string;
		refreshToken: string;
	};
}

export function getAxiosInstance() {
	const accessToken = authStore.getState().tokens?.accessToken;
	const refreshToken = authStore.getState().tokens?.refreshToken;
	const setTokens = authStore.getState().setTokens;

	const instance = axios.create({
		baseURL: env.EXPO_PUBLIC_BACKEND_API_URL,
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	instance.interceptors.response.use(
		(response: AxiosResponse) => response,
		async (error: AxiosError) => {
			const status = error.response?.status;
			const config = error.config as AxiosRequestConfig;

			console.log(status);
			if (status === 403) {
				if (refreshToken) {
					try {
						const response = await axios.post<RegenerateTokensApiResponse>(
							`${env.EXPO_PUBLIC_BACKEND_API_URL}/auth/regenerate-tokens`,
							{ oldRefreshToken: refreshToken },
						);

						console.log(response);

						setTokens({
							accessToken: response.data.tokens.accessToken,
							refreshToken: response.data.tokens.refreshToken,
						});

						if (config.headers) {
							config.headers.Authorization = `Bearer ${response.data.tokens.accessToken}`;
						}

						// Create a new axios instance with the new token for the retry
						const retryInstance = getAxiosInstance();
						return retryInstance.request(config);
					} catch (refreshError) {
						router.replace("/(auth)/login");
						return Promise.reject(refreshError);
					}
				} else {
					router.replace("/(auth)/login");
					return Promise.reject(error);
				}
			}
			return Promise.reject(error);
		},
	);
	return instance;
}
