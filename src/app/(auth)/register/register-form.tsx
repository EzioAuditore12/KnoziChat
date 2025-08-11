import { KeyboardAwareScrollView } from "@/components/keyboard-aware-scroll-view";
import { H2 } from "@/components/ui/typography";

// Register User Screen Components
import { RegisterationForm } from "@/modules/auth/register/components/register-form/register-form";

// Register User Screen Hooks
import { useRegisterationForm } from "@/modules/auth/register/hooks/use-register-form";

export default function RegisterMainScreen() {
	const { isPending, mutate } = useRegisterationForm();

	return (
		<KeyboardAwareScrollView className="flex-1 justify-center items-center px-2 gap-y-1">
			<H2>CREATE YOUR ACCOUNT</H2>
			<RegisterationForm triggerRegisteration={mutate} isLoading={isPending} />
		</KeyboardAwareScrollView>
	);
}
