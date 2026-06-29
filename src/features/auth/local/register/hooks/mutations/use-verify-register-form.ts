import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';

import { useAuthStore } from '@/store/auth';
import { verifyRegisterFormApi } from '../../api/verify-registeration.api';

export const useVerifyRegisterForm = () => {
  const { setUserDetails, setUserTokens } = useAuthStore((state) => state);

  return useMutation({
    mutationFn: verifyRegisterFormApi,
    onSuccess: (data) => {
      setUserTokens(data.tokens);

      setUserDetails(data.user);

      router.replace('/(main)');
    },
    onError: (data) => {
      alert(data.message);
    },
  });
};
