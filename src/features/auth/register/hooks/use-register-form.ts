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
          phoneNumber: data.phoneNumber,
        },
      });
    },
    onError: (data) => {
      alert(data.message);
    },
  });
};
