import { useMutation } from '@tanstack/react-query';
import { updateProfileApi } from '../../api/update-profile.api';
import { useAuthStore } from '@/store/auth';

export function useUpdateProfile() {
  const { setUserDetails } = useAuthStore((state) => state);

  return useMutation({
    mutationFn: updateProfileApi,
    onSuccess: (data) => {
      alert('Profile updated successfully');
      setUserDetails(data);
    },
    onError: (error) => {
      alert(error);
    },
  });
}
