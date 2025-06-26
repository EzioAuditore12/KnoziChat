import { type ReactNode } from "react";
import {
	ScrollContainer,
	type ScrollContainerProps,
} from "@/components/ui/layout";
import { LinearGradient } from "@/components/ui/linear-gradient";
import { cn } from "@/lib/utils";

type AuthLayoutProps = {
	children: ReactNode;
	className?: string;
	showGradient?: boolean;
} & ScrollContainerProps;

export function AuthLayout({
	children,
	className,
	showGradient = true,
	contentContainerClassName,
	...props
}: AuthLayoutProps) {
	return (
		<ScrollContainer
			className={cn(className)}
			contentContainerClassName={contentContainerClassName}
			{...props}
		>
			{showGradient && <LinearGradient position={"absolute"} size={"screen"} />}

			{children}
		</ScrollContainer>
	);
}

export type { AuthLayoutProps };
