import {
	Content,
	type ContentProps,
	type ContentRef,
	Overlay,
	Portal,
	Root,
	Trigger,
} from "@rn-primitives/tooltip";
import { type RefObject } from "react";
import { StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";

const Tooltip = Root;

const TooltipTrigger = Trigger;

type TooltipContentProps = ContentProps & {
	ref?: RefObject<ContentRef>;
	portalHost?: string;
};

function TooltipContent({
	className,
	sideOffset = 4,
	portalHost,
	...props
}: TooltipContentProps) {
	return (
		<Portal hostName={portalHost}>
			<Overlay style={StyleSheet.absoluteFill}>
				<Animated.View entering={FadeIn} exiting={FadeOut}>
					<TextClassContext.Provider value="text-sm native:text-base text-popover-foreground">
						<Content
							sideOffset={sideOffset}
							className={cn(
								"z-50 overflow-hidden rounded-md border border-border bg-popover px-3 py-1.5 shadow-md shadow-foreground/5 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
								className,
							)}
							{...props}
						/>
					</TextClassContext.Provider>
				</Animated.View>
			</Overlay>
		</Portal>
	);
}

export { Tooltip, TooltipContent, TooltipTrigger };
export type { TooltipContentProps };
