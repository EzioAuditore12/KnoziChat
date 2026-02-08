import { View, type ViewProps } from 'react-native';
import { Description } from 'heroui-native/description';
import { cn } from 'tailwind-variants';
import { InputOTP } from 'heroui-native/input-otp';

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
  return (
    <>
      <View className={cn('relative gap-y-3', className)} {...props}>
        <InputOTP maxLength={size} onComplete={(code) => handleSumit({ otp: code, phoneNumber })}>
          <InputOTP.Group>
            {Array.from({ length: size }).map((_, index) => (
              <InputOTP.Slot key={index} index={index} />
            ))}
          </InputOTP.Group>
        </InputOTP>

        {isSubmitting && (
          <Description className="text-muted absolute top-20 self-center text-lg">
            Submitting
          </Description>
        )}
      </View>
    </>
  );
}
