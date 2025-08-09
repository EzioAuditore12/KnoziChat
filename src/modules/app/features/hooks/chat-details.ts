import { useQuery } from "@tanstack/react-query";
import { getChatDetailsAPI } from "../api/chat-details";

interface UseChatDetailsParams {
	id: string;
}

export function useChatDetails({ id }: UseChatDetailsParams) {
	return useQuery({
		queryKey: ["chat-details", id],
		queryFn: () => getChatDetailsAPI({ id }),
		enabled: !!id,
	});
}
