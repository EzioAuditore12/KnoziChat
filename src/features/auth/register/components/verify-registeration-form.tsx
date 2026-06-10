import { cn } from '@gluestack-ui/utils';
import { useEffect, useRef, useState, Activity } from 'react';
import { type NativeSyntheticEvent, TextInput } from 'react-native';

import { Box } from '@/components/ui/box';
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
    if (value.length > 1) {
      const numbers = value.replace(/\D/g, '').split('').slice(0, size);
      if (numbers.length === 0) return;

      const updatedOtp = [...otp];
      numbers.forEach((num, i) => {
        if (index + i < size) {
          updatedOtp[index + i] = num;
        }
      });

      setOtp(updatedOtp);

      const nextIndex = Math.min(index + numbers.length, size - 1);
      inputRefs.current[nextIndex]?.focus();

      const code = updatedOtp.join('');
      if (code.length === size) {
        handleSumit({ otp: code, email });
      }
      return;
    }

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
    <Box className={cn('px-4 py-6', className)}>
      <VStack className="gap-8">
        <Box className="items-center">
          <Text className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
            Verify your email
          </Text>
          <Text className="text-center text-zinc-500 dark:text-zinc-400">
            We have ve sent a code to{' '}
            <Text className="font-semibold text-zinc-900 dark:text-white">{email}</Text>
          </Text>
        </Box>

        <HStack className="justify-center gap-3">
          {Array.from({ length: size }).map((_, index) => (
            <Input
              key={index}
              className={cn(
                'h-16 w-14 items-center rounded-2xl border-2 border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50',
                otp[index]
                  ? 'border-emerald-500 bg-emerald-50/50 dark:border-emerald-500 dark:bg-emerald-900/20'
                  : ''
              )}>
              <InputField
                ref={(ref) => {
                  inputRefs.current[index] = ref as TextInput | null;
                }}
                value={otp[index]}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={size}
                textContentType="oneTimeCode"
                autoComplete="sms-otp"
                textAlign="center"
                className="text-center text-2xl font-bold text-zinc-900 dark:text-white"
              />
            </Input>
          ))}
        </HStack>

        <VStack className="items-center gap-2">
          <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {timeLeft > 0 ? `Resend code in ${formatTime(timeLeft)}` : "Didn't receive the code?"}
          </Text>
          {timeLeft <= 0 && (
            <Text className="font-bold text-emerald-600 dark:text-emerald-400">Resend Code</Text>
          )}
        </VStack>

        <Activity mode={isSubmitting ? 'visible' : 'hidden'}>
          <Text className="text-center text-base font-medium text-zinc-500">Verifying code...</Text>
        </Activity>
      </VStack>
    </Box>
  );
}
