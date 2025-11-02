import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';

import { loginFormApi } from '../api/login-form.api';
import { useAuthStore } from '@/store';

export const useLoginForm = () => {
  const { setUserDetails, setUserTokens } = useAuthStore((state) => state);

  return useMutation({
    mutationFn: loginFormApi,
    onSuccess: (data) => {
      setUserTokens(data.tokens);

      setUserDetails(data.user);

      router.replace('/(app)');
    },
    onError: (data) => {
      alert(data.message);
    },
  });
};
