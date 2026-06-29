import { router } from 'expo-router';
import { LinkButton } from 'heroui-native/link-button';
import { Typography } from 'heroui-native/text';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LoginBanner } from '@/features/auth/local/login/components/banner';
import { LoginForm } from '@/features/auth/local/login/components/form';
import { useLoginForm } from '@/features/auth/local/login/hooks/mutations/use-login-form';

export default function LoginScreen() {
  const safeAreaInsets = useSafeAreaInsets();

  const { mutateAsync, isPending } = useLoginForm();

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        paddingTop: safeAreaInsets.top,
        paddingBottom: safeAreaInsets.bottom,
        flexGrow: 1,
      }}
      contentContainerClassName="px-2 justify-center items-center"
      bottomOffset={100}
    >
      <Typography.Heading>Welcome Back!</Typography.Heading>

      <LoginBanner />

      <LoginForm className="w-full max-w-4xl" handleSubmit={mutateAsync} isSubmitting={isPending} />

      <View className="mt-4 flex-row items-center gap-x-1">
        <Typography.Paragraph color="muted">Don&apos;t have an account?</Typography.Paragraph>
        <LinkButton onPress={() => router.push('/register')}>
          <LinkButton.Label className="text-[16px] text-blue-500 underline">
            Register
          </LinkButton.Label>
        </LinkButton>
      </View>
    </KeyboardAwareScrollView>
  );
}
