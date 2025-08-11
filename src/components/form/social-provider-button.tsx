import { type LucideIcon } from "lucide-react-native";
import type { ComponentType } from "react";
import { Pressable, PressableProps } from "react-native";
import { cn } from "@/lib/utils";

type CustomIconType = {
	className?: string;
	color?: string;
	size?: number;
};

interface SocialProviderButtonProps extends PressableProps {
	Icon: ComponentType<CustomIconType> | LucideIcon;
	iconSize?: number;
	iconColor?: string;
}

export const SocialProviderButton = ({
	className,
	Icon,
	iconColor,
	iconSize = 40,
	...props
}: SocialProviderButtonProps) => {
	return (
		<Pressable
			className={cn(
				"p-2 bg-gray-200 rounded-xl justify-center items-center elevation-sm",
				className,
			)}
			{...props}
		>
			<Icon size={iconSize} color={iconColor ? iconColor : "black"} />
		</Pressable>
	);
};
