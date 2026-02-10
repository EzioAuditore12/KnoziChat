import { useQuery } from '@tanstack/react-query';

import { getUserApi } from '../../api/get-user.api';

export const useGetUser = (id: string) => {
  return useQuery({
    queryKey: ['profile', id],
    queryFn: () => getUserApi(id),
  });
};
