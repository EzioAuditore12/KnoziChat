import { type RefObject } from "react";
import { TextInput, type TextInputProps } from "react-native";
import { cn } from "@/lib/utils";

interface InputProps extends TextInputProps {
	className?: string;
	ref?: RefObject<TextInput>;
}

function Input({ className, ...props }: InputProps) {
	return (
		<TextInput
			className={cn(
				"h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-lg text-foreground focus:border-ring dark:focus:border-white",
				props.editable === false && "opacity-50",
				className,
			)}
			placeholderTextColor="rgba(156, 163, 175, 1)"
			textAlignVertical="center"
			{...props}
		/>
	);
}

export { Input, type InputProps };
