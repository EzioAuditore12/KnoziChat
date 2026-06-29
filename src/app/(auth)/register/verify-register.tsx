import { useLocalSearchParams } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { VerificationRegisterationForm } from '@/features/auth/local/register/components/verify-registeration-form';
import { useVerifyRegisterForm } from '@/features/auth/local/register/hooks/mutations/use-verify-register-form';
import type { RegisterFormResponse } from '@/features/auth/local/register/schemas/register-form/response.schema';

export default function VerifyRegisterScreen() {
  const safeAreaInsets = useSafeAreaInsets();

  const { email, duration } = useLocalSearchParams() as unknown as Omit<
    RegisterFormResponse,
    'message' | 'status'
  >;

  const { mutate, isPending } = useVerifyRegisterForm();

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
      <VerificationRegisterationForm
        duration={duration}
        email={email}
        handleSumit={mutate}
        isSubmitting={isPending}
      />
    </KeyboardAwareScrollView>
  );
}
