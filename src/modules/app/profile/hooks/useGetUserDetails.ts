import { useRefreshByUser } from "@/lib/query/useRefetchByUser";
import { useRefreshOnFocus } from "@/lib/query/useRefreshOnFocus";
import { CustomBackendError } from "@/utils/axios-error";
import { useQuery } from "@tanstack/react-query";
import { getUserDetailsApi } from "../api/getUserDetails";

export function useGetUserDetails() {
	const { data, error, isError, refetch, isLoading } = useQuery({
		queryKey: ["profile"],
		queryFn: getUserDetailsApi,
	});

	useRefreshOnFocus(refetch);

	const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);

	const errorMessage = isError ? CustomBackendError.getErrorMessage(error) : "";

	return {
		data,
		error: errorMessage,
		isLoading,
		isRefetchingByUser,
		refetchByUser,
	};
}
