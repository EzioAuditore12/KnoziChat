import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';

import { LoginForm } from '@/features/auth/login/components/login-form';
import { useLoginForm } from '@/features/auth/login/hooks/use-login-form';

export default function LoginScreen() {
  const { mutate, isPending } = useLoginForm();

  return (
    <Box className="flex-1 items-center justify-center">
      <Heading size="3xl">Login</Heading>
      <LoginForm
        handleFormSubmit={mutate}
        isFormSubmitting={isPending}
        className="w-full max-w-4xl"
      />
    </Box>
  );
}
