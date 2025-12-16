import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { LoginForm } from '@/features/auth/login/components/login-form';

import { useLoginForm } from '@/features/auth/login/hooks/use-login-form';

export default function LoginScreen() {
  const { mutate, isPending } = useLoginForm();

  return (
    <View className="flex-1 items-center justify-center p-2">
      <Text variant={'h2'}>Login Screen</Text>
      <LoginForm className="w-full max-w-2xl" handleSubmit={mutate} isSubmitting={isPending} />
    </View>
  );
}
