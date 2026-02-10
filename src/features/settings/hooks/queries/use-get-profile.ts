import { useQuery } from '@tanstack/react-query';

import { userProfileApi } from '../../api/get-profile.api';

export const useGetProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: userProfileApi,
  });
};
