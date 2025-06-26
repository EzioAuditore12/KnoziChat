import { ComponentType } from "react";
import { TextStyle } from "react-native";
import { Button, ButtonProps } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import type { CustomIconProps } from "@/lib/icons/iconWithClassName";
import { cn } from "@/lib/utils";

type SocialProviderButtonProps = {
	providerIcon: ComponentType<CustomIconProps>;
	providerName: string;
	iconSize?: number;
	textColor?: string;
	textStyle?: TextStyle;
} & ButtonProps;

export function SocialProviderButton({
	className,
	providerIcon: ProviderIcon,
	providerName,
	iconSize,
	textColor,
	...buttonProps
}: SocialProviderButtonProps) {
	return (
		<Button
			className={cn(
				"flex-row gap-x-2 rounded-2xl max-w-[400px]",
				"shadow-2xl",
				className,
			)}
			{...buttonProps}
		>
			<ProviderIcon size={iconSize} />
			<Text style={{ color: textColor }}>Sign In With {providerName}</Text>
		</Button>
	);
}
