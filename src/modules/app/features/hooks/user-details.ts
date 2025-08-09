import { useQuery } from "@tanstack/react-query";
import { getUserDetailsAPI } from "../api/user-details";

export function useGetUserDetails(id: string) {
	return useQuery({
		queryKey: ["user-details", id],
		queryFn: () => getUserDetailsAPI({ id }),
		enabled: !!id, // Only run query if id is truthy
	});
}
