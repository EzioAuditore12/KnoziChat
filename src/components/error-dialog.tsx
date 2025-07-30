import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Text } from "@/components/ui/text";
import React from "react";

export function ErrorDialog({
	error,
	open,
	onOpenChange,
}: {
	error: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className="bg-zinc-900 rounded-2xl p-6 min-w-72">
				<AlertDialogHeader>
					<AlertDialogTitle className="text-red-500 text-xl font-bold">
						Error
					</AlertDialogTitle>
					<AlertDialogDescription className="text-white mt-2 text-base">
						{error}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className="bg-red-500 rounded-lg px-4">
						<Text className="text-white font-semibold">Close</Text>
					</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
