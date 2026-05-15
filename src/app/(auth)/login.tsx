import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Link } from '@/components/native-link';

import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

import { LoginBanner } from '@/features/auth/login/components/banner';
import { LoginForm } from '@/features/auth/login/components/form';

import { useLoginForm } from '@/features/auth/login/hooks/mutations/use-login-form';
import { useDeviceConfigStore } from '@/store/device';

export default function LoginScreen() {
  const safeAreaInsets = useSafeAreaInsets();

  const { mutate, isPending } = useLoginForm();

  const { expoPushToken } = useDeviceConfigStore((state) => state);

  return (
    <KeyboardAwareScrollView
      style={{
        paddingTop: safeAreaInsets.top,
        paddingBottom: safeAreaInsets.bottom,
      }}
      extraKeyboardSpace={50}
      contentContainerClassName="grow items-center justify-center p-2">
      <Heading size="2xl">Welcome Back !</Heading>

      <LoginBanner />

      <LoginForm
        expoPushToken={expoPushToken}
        className="w-full max-w-xl"
        handleSubmit={mutate}
        isSubmitting={isPending}
      />

      <VStack className="items-center gap-x-1">
        <Text>Don&apos;t have an account</Text>
        <Link href={'/register'} asChild>
          <Text className="text-blue-500" underline>
            Register
          </Text>
        </Link>
      </VStack>
    </KeyboardAwareScrollView>
  );
}
