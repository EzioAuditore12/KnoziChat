import { useRefreshOnFocus } from "@/lib/query/useRefreshOnFocus";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getMessagesAPI } from "../api/get-messages";

export function useGetMessages({
	chatId,
	limit,
}: { chatId: string; limit: number }) {
	const {
		data,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch,
	} = useInfiniteQuery({
		queryKey: ["Chat-Messages", chatId],
		queryFn: ({ pageParam }) =>
			getMessagesAPI({ id: chatId, limit, page: pageParam }),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			// If we got fewer messages than the limit, we've reached the end
			if (lastPage.messages.length < limit) {
				return undefined;
			}
			// Otherwise, get the next page
			return allPages.length + 1;
		},
		enabled: !!chatId,
	});

	useRefreshOnFocus(refetch);

	return {
		data,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch,
	};
}
