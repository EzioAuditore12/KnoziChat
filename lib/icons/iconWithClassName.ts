import type { LucideIcon } from "lucide-react-native";
import { cssInterop } from "nativewind";
import type { ComponentType } from "react";
import type { SvgProps } from "react-native-svg";

// Cache the processed icons to avoid repeated processing
const processedIcons = new WeakSet<LucideIcon | ComponentType<SvgProps>>();

export function iconWithClassName(icon: LucideIcon) {
	if (processedIcons.has(icon)) {
		return;
	}

	cssInterop(icon, {
		className: {
			target: "style",
			nativeStyleToProp: {
				color: true,
				opacity: true,
			},
		},
	});

	processedIcons.add(icon);
}

export function customIconWithClassName(icon: ComponentType<SvgProps>) {
	if (processedIcons.has(icon)) {
		return;
	}

	cssInterop(icon, {
		className: {
			target: "style",
			nativeStyleToProp: {
				color: true,
				opacity: true,
				width: true,
				height: true,
			},
		},
	});

	processedIcons.add(icon);
}

// Type for custom icon components that accept className
export interface CustomIconProps extends SvgProps {
	className?: string;
	size?: number;
}
