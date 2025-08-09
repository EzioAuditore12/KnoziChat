import env from "@/env";
import { getAxiosInstance } from "@/lib/api";

interface LeaveGroupQueryParameters {
	groupId: string;
}

interface LeaveGroupResponse {
	groupId: string;
	message: string;
}

const url = `${env.EXPO_PUBLIC_BACKEND_API_URL}/chat/leave-group`;

export const leaveGroupAPI = async ({ groupId }: LeaveGroupQueryParameters) => {
	const axiosInstance = getAxiosInstance();
	const response = await axiosInstance.delete<LeaveGroupResponse>(
		`${url}/${groupId}`,
	);
	return response.data;
};
