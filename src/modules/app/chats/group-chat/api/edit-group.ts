import env from "@/env";
import { getAxiosInstance } from "@/lib/api";

interface EditGroupQueryParameters {
	groupId: string;
	newGroupName: string;
}

interface EditGroupResponse {
	groupId: string;
	message: string;
	newGroupName: string;
}

const url = `${env.EXPO_PUBLIC_BACKEND_API_URL}/chat/rename-group`;

export const editGroupAPI = async ({
	groupId,
	newGroupName,
}: EditGroupQueryParameters) => {
	const axiosInstance = getAxiosInstance();
	const response = await axiosInstance.put<EditGroupResponse>(
		`${url}/${groupId}`,
		{ newName: newGroupName },
	);
	return response.data;
};
