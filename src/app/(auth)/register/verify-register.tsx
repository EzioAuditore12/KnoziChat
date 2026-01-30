import { useLocalSearchParams } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';

import { VerificationRegisterationForm } from '@/features/auth/register/components/verify-registeration-form';
import { useVerifyRegisterForm } from '@/features/auth/register/hooks/use-verify-register-form';

import type { RegisterFormResponse } from '@/features/auth/register/schemas/register-form/register-form-response.schema';

export default function VerifyRegisterScreen() {
  const safeAreaInsets = useSafeAreaInsets();

  const { phoneNumber, duration } = useLocalSearchParams() as unknown as Omit<
    RegisterFormResponse,
    'message' | 'status'
  >;

  const { mutate, isPending } = useVerifyRegisterForm();

  return (
    <KeyboardAwareScrollView
      style={{
        paddingTop: safeAreaInsets.top,
      }}
      contentContainerClassName="flex-1 gap-y-2 items-center justify-center p-2">
      <VerificationRegisterationForm
        phoneNumber={phoneNumber}
        handleSumit={mutate}
        isSubmitting={isPending}
      />

      <Text>Duration is : {duration} </Text>
    </KeyboardAwareScrollView>
  );
}
