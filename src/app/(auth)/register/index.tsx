import { ErrorDialog } from "@/components/error-dialog";
import { RegisterationForm } from "@/modules/auth/register/components/register-form";
import { useRegisterationForm } from "@/modules/auth/register/hooks/use-registeration-form";
import { useEffect, useState } from "react";
import { View } from "react-native";

export default function RegisterMainScreen() {
	const { error, isPending, mutate } = useRegisterationForm();

	const [dialogOpen, setDialogOpen] = useState(false);

	useEffect(() => {
		if (error) setDialogOpen(true);
	}, [error]);

	return (
		<View className="flex-1 justify-center items-center">
			<RegisterationForm triggerRegisteration={mutate} isLoading={isPending} />

			{/* Error Component */}
			<ErrorDialog
				error={error}
				open={dialogOpen}
				onOpenChange={setDialogOpen}
			/>
		</View>
	);
}
