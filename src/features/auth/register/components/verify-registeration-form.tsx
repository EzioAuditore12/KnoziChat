import { Description } from 'heroui-native/description';
import { cn } from 'tailwind-variants';
import { TextField, type TextFieldRootProps } from 'heroui-native/text-field';
import { InputOTP } from 'heroui-native/input-otp';
import { Label } from 'heroui-native/label';
import { useEffect, useState } from 'react';

import type { VerifyRegisterationParam } from '../schemas/verify-registeration/verify-registeration-param.schema';

interface VerificationRegisterationFormProps extends TextFieldRootProps {
  email: string;
  handleSumit: (data: VerifyRegisterationParam) => void;
  duration: number;
  isSubmitting?: boolean;
  size?: number;
}

export function VerificationRegisterationForm({
  className,
  handleSumit,
  duration,
  isSubmitting = false,
  email,
  size = 6,
  ...props
}: VerificationRegisterationFormProps) {
  // Local state for the countdown
  const [timeLeft, setTimeLeft] = useState(duration);

  // Update timer when duration prop changes (e.g., on resend)
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  // Countdown effect
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 1000 ? prev - 1000 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Helper to format milliseconds as mm:ss
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <TextField isRequired className={cn('gap-y-3', className)} {...props}>
      <Label>Enter Otp</Label>
      <Description>
        Please enter the one-time password (OTP) sent to your phone number. The code is valid for a
        limited time.
      </Description>
      <InputOTP maxLength={size} onComplete={(code) => handleSumit({ otp: code, email })}>
        <InputOTP.Group>
          {Array.from({ length: size }).map((_, index) => (
            <InputOTP.Slot key={index} index={index} />
          ))}
        </InputOTP.Group>
      </InputOTP>

      {/* Timer in mm:ss format */}
      <Description className="text-muted text-center text-sm">
        {timeLeft > 0 ? `Resend code in ${formatTime(timeLeft)}` : 'You can resend the code now'}
      </Description>

      {isSubmitting && (
        <Description className="text-muted absolute top-20 self-center text-lg">
          Submitting
        </Description>
      )}
    </TextField>
  );
}
