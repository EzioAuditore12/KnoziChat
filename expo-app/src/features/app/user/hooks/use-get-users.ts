import { useInfiniteQuery } from '@tanstack/react-query';

import type { UserSearchParams } from '../schemas/search-user/user-search-parmas.schema';
import { getUsersApi } from '../api/get-users.api';

export function useGetUsers({
  firstName,
  limit,
}: Omit<UserSearchParams, 'page'>) {
  return useInfiniteQuery({
    queryKey: ['search-user', firstName],

    queryFn: ({ pageParam }) =>
      getUsersApi({ firstName, page: pageParam, limit }),

    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) => {
      return lastPage.data.length > 0 ? allPages.length + 1 : undefined;
    },
  });
}
