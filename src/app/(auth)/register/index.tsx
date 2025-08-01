import { ErrorDialog } from "@/components/error-dialog";
import { useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "@/components/keyboard-aware-scrollView";

// Register User Screen Components
import { RegisterationForm } from "@/modules/auth/register/components/register-form";

// Register User Screen Hooks
import { useRegisterationForm } from "@/modules/auth/register/hooks/use-registeration-form";

export default function RegisterMainScreen() {
	const { error, isPending, mutate } = useRegisterationForm();

	const [dialogOpen, setDialogOpen] = useState(false);

	useEffect(() => {
		if (error) setDialogOpen(true);
	}, [error]);

	return (
		<KeyboardAwareScrollView className="justify-center items-center">
			<RegisterationForm triggerRegisteration={mutate} isLoading={isPending} />

			{/* Error Component */}
			<ErrorDialog
				error={error}
				open={dialogOpen}
				onOpenChange={setDialogOpen}
			/>
		</KeyboardAwareScrollView >
	);
}
