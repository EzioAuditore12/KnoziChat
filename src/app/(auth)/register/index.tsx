import { router } from 'expo-router';
import { LinkButton } from 'heroui-native/link-button';
import { Typography } from 'heroui-native/text';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RegisterForm } from '@/features/auth/local/register/components/register-form';
import { useRegisterForm } from '@/features/auth/local/register/hooks/mutations/use-register-form';

export default function RegisterFormScreen() {
  const safeAreaInsets = useSafeAreaInsets();

  const { mutate, isPending } = useRegisterForm();

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        paddingTop: safeAreaInsets.top,
        paddingBottom: safeAreaInsets.bottom,
        flexGrow: 1,
      }}
      extraKeyboardSpace={50}
      contentContainerClassName="px-2 justify-center items-center"
    >
      <Typography.Heading type="h2" className="self-start font-bold md:self-center">
        Regiser your Details !
      </Typography.Heading>

      <RegisterForm className="w-full max-w-lg" handleSubmit={mutate} isSubmitting={isPending} />

      <View className="flex-row items-center gap-x-1">
        <Typography.Paragraph color="muted">Already have an account?</Typography.Paragraph>
        <LinkButton onPress={() => router.dismissTo('/login')}>
          <LinkButton.Label className="text-[16px] text-blue-500 underline">Login</LinkButton.Label>
        </LinkButton>
      </View>
    </KeyboardAwareScrollView>
  );
}
