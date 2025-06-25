import {
	Fallback,
	type FallbackProps,
	type FallbackRef,
	Image,
	type ImageProps,
	type ImageRef,
	Root,
	type RootProps,
	type RootRef,
} from "@rn-primitives/avatar";
import { type RefObject } from "react";
import { cn } from "@/lib/utils";

function Avatar({
	className,
	...props
}: RootProps & {
	ref?: RefObject<RootRef>;
}) {
	return (
		<Root
			className={cn(
				"relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
				className,
			)}
			{...props}
		/>
	);
}

function AvatarImage({
	className,
	...props
}: ImageProps & {
	ref?: RefObject<ImageRef>;
}) {
	return (
		<Image
			className={cn("aspect-square h-full w-full", className)}
			{...props}
		/>
	);
}

function AvatarFallback({
	className,
	...props
}: FallbackProps & {
	ref?: React.RefObject<FallbackRef>;
}) {
	return (
		<Fallback
			className={cn(
				"flex h-full w-full items-center justify-center rounded-full bg-muted",
				className,
			)}
			{...props}
		/>
	);
}

export { Avatar, AvatarFallback, AvatarImage };
