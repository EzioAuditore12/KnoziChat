import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';

import { registerFormApi } from '../api/register-form.api';

export const useRegisterForm = () => {
  return useMutation({
    mutationFn: registerFormApi,
    onSuccess: (data) => {
      router.push({
        pathname: '/(auth)/register/verify-register',
        params: {
          email: data.email,
          duration: data.duration,
        },
      });
    },
    onError: (data) => {
      alert(data.message);
    },
  });
};
