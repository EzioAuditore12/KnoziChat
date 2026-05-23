import { cn } from '@gluestack-ui/utils';
import { useEffect, useRef, useState } from 'react';
import { NativeSyntheticEvent, TextInput } from 'react-native';

import { Box } from '@/components/ui/box';

import {
  FormControl,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';

import { HStack } from '@/components/ui/hstack';

import { Input, InputField } from '@/components/ui/input';

import { Text } from '@/components/ui/text';

import { VStack } from '@/components/ui/vstack';

import type { VerifyRegisterationParam } from '../schemas/verify-registeration/param.schema';

interface VerificationRegisterationFormProps {
  email: string;
  handleSumit: (data: VerifyRegisterationParam) => void;

  duration: number;
  isSubmitting?: boolean;
  size?: number;
  className?: string;
}

export function VerificationRegisterationForm({
  className,
  handleSumit,
  duration,
  isSubmitting = false,
  email,
  size = 6,
}: VerificationRegisterationFormProps) {
  const [otp, setOtp] = useState(Array(size).fill(''));

  const [timeLeft, setTimeLeft] = useState(duration);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTimeLeft(duration);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [duration]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 1000 ? prev - 1000 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);

    const minutes = Math.floor(totalSeconds / 60);

    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;

    setOtp(updatedOtp);

    if (value && index < size - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    const code = updatedOtp.join('');

    if (code.length === size) {
      handleSumit({
        otp: code,
        email,
      });
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<{ key: string }>, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <Box className={cn(className)}>
      <FormControl isRequired>
        <VStack className="gap-4">
          <FormControlLabel>
            <FormControlLabelText>Enter OTP</FormControlLabelText>
          </FormControlLabel>

          <FormControlHelper>
            <FormControlHelperText>Please enter the OTP sent to your email.</FormControlHelperText>
          </FormControlHelper>

          <HStack className="justify-between gap-2">
            {Array.from({
              length: size,
            }).map((_, index) => (
              <Input key={index} className="h-14 w-14 items-center rounded-xl">
                <InputField
                  ref={(ref) => {
                    inputRefs.current[index] = ref as TextInput | null;
                  }}
                  value={otp[index]}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                  className="text-center text-xl font-semibold"
                />
              </Input>
            ))}
          </HStack>

          <Text className="text-typography-500 text-center text-sm">
            {timeLeft > 0
              ? `Resend code in ${formatTime(timeLeft)}`
              : 'You can resend the code now'}
          </Text>

          {isSubmitting && <Text className="text-center text-base">Submitting...</Text>}
        </VStack>
      </FormControl>
    </Box>
  );
}
