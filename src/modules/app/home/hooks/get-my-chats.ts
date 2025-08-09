import { useRefreshOnFocus } from "@/lib/query/useRefreshOnFocus";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getMyChatsAPI } from "../api/get-my-chats";

export function getMyChats({ limit }: { limit: number }) {
	const {
		data,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch,
	} = useInfiniteQuery({
		queryKey: ["User-Chats"],
		queryFn: ({ pageParam }) => getMyChatsAPI({ limit, page: pageParam }),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.chats.length > 0 ? allPages.length + 1 : undefined;
		},
	});

	useRefreshOnFocus(refetch);

	return {
		data,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	};
}
