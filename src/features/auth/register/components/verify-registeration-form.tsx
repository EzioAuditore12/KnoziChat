import React, { useEffect } from 'react';
import { View, type ViewProps } from 'react-native';

import { InputOTP, InputOTPGroup, InputOTPSlot, useOTPInput } from '@/components/input-otp';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

import { Text } from '@/components/ui/text';
import type { VerifyRegisterationParam } from '../schemas/verify-registeration/verify-registeration-param.schema';

interface VerificationRegisterationFormProps extends ViewProps {
  phoneNumber: string;
  handleSumit: (data: VerifyRegisterationParam) => void;
  isSubmitting?: boolean;
  size?: number;
}

export function VerificationRegisterationForm({
  className,
  handleSumit,
  isSubmitting = false,
  phoneNumber,
  size = 6,
  ...props
}: VerificationRegisterationFormProps) {
  const digits = useOTPInput(size);

  useEffect(() => {
    if (digits.isComplete) {
      handleSumit({ otp: digits.value, phoneNumber });
    }
  }, [digits.isComplete, digits.value, phoneNumber, handleSumit]);

  return (
    <>
      <View className={cn('relative gap-y-3', className)} {...props}>
        <InputOTP
          containerClassName={cn('justify-center', className)}
          value={digits.value}
          onChange={digits.setValue}
          maxLength={size}>
          <InputOTPGroup>
            {Array.from({ length: size }).map((_, index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>

        {isSubmitting && (
          <Text className="text-muted absolute top-20 self-center" variant={'h3'}>
            Submitting
          </Text>
        )}
        {digits.value.length > 0 && (
          <Button disabled={isSubmitting} onPress={digits.clear} className="self-end">
            <Text>Clear</Text>
          </Button>
        )}
      </View>
    </>
  );
}
