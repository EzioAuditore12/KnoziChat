import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { View, type ViewProps } from "react-native";

interface GroupActionProps extends ViewProps {
	LeaveGroupAction: () => void;
	isPending: boolean;
}

export function GroupActions({
	className,
	LeaveGroupAction,
	isPending,
	...props
}: GroupActionProps) {
	return (
		<View className={cn("px-3", className)} {...props}>
			<Button onPress={LeaveGroupAction} disabled={isPending}>
				<Text>Leave Group</Text>
			</Button>
		</View>
	);
}
