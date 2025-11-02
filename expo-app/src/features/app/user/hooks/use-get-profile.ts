import { useQuery } from '@tanstack/react-query';

import { getProfileApi } from '../api/get-profile.api';
import { useRefreshOnFocus } from '@/hooks/use-refresh-on-focus';

export const useGetProfile = () => {
  const { data, isError, error, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfileApi,
  });

  useRefreshOnFocus(refetch);

  return {
    data,
    isError,
    error,
  };
};
