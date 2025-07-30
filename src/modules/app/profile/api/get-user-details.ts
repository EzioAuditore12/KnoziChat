import { getAxiosInstance } from "@/lib/api";

interface GetProfileReponse {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	profilePicture: string;
	message: string;
}

const url = "/user/profile";

export const getUserDetailsApi = async () => {
	const axiosInstance = getAxiosInstance();
	const response = await axiosInstance.get<GetProfileReponse>(url);
	return response.data;
};
