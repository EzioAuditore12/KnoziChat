import { CustomBackendError } from "@/utils/axios-error";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
	type SearchUserQueryParameters,
	getUsersFromName,
} from "../api/search-user";

interface getUserDetailsProps {
	name: string;
	limit: number;
}

export function getUsers({ limit, name }: getUserDetailsProps) {
	const {
		data,
		isLoading,
		isError,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery({
		queryKey: ["Search-User", name],
		queryFn: ({ pageParam }) =>
			getUsersFromName({ name, page: pageParam, limit }),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.users.length > 0 ? allPages.length + 1 : undefined;
		},
	});

	const errorMessage = isError ? CustomBackendError.getErrorMessage(error) : "";

	return {
		data,
		isLoading,
		error: errorMessage,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	};
}
