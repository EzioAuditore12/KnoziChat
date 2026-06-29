import { cn } from 'cnfast';
import { InputOTP } from 'heroui-native/input-otp';
import { Typography } from 'heroui-native/text';
import { Activity, useEffect, useState } from 'react';
import { View } from 'react-native';

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
  const [timeLeft, setTimeLeft] = useState(duration);

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

  return (
    <View className={cn('px-4 py-6', className)}>
      <View className="flex-col gap-8">
        <View className="items-center">
          <Typography className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
            Verify your email
          </Typography>
          <Typography className="text-center text-zinc-500 dark:text-zinc-400">
            We have ve sent a code to{' '}
            <Typography className="font-semibold text-zinc-900 dark:text-white">{email}</Typography>
          </Typography>
        </View>

        <View className="flex-row justify-center">
          <InputOTP maxLength={size} onComplete={(code) => handleSumit({ otp: code, email })}>
            <InputOTP.Group className="flex-row gap-3">
              {({ slots }) => (
                <>
                  {slots.map((slot) => (
                    <InputOTP.Slot
                      key={slot.index}
                      index={slot.index}
                      className={cn(
                        'h-16 w-14 items-center justify-center rounded-2xl border-2 border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50',
                        slot.char
                          ? 'border-emerald-500 bg-emerald-50/50 dark:border-emerald-500 dark:bg-emerald-900/20'
                          : ''
                      )}
                    >
                      <InputOTP.SlotPlaceholder />
                      <InputOTP.SlotValue className="text-2xl font-bold text-zinc-900 dark:text-white" />
                      <InputOTP.SlotCaret />
                    </InputOTP.Slot>
                  ))}
                </>
              )}
            </InputOTP.Group>
          </InputOTP>
        </View>

        <View className="flex-col items-center gap-2">
          <Typography className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {timeLeft > 0 ? `Resend code in ${formatTime(timeLeft)}` : "Didn't receive the code?"}
          </Typography>
          {timeLeft <= 0 && (
            <Typography className="font-bold text-emerald-600 dark:text-emerald-400">
              Resend Code
            </Typography>
          )}
        </View>

        <Activity mode={isSubmitting ? 'visible' : 'hidden'}>
          <Typography className="text-center text-base font-medium text-zinc-500">
            Verifying code...
          </Typography>
        </Activity>
      </View>
    </View>
  );
}
