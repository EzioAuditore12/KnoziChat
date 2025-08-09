import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Label } from "@rn-primitives/dropdown-menu";
import { type ComponentProps, useState } from "react";
import { View, ViewProps } from "react-native";

interface EditGroupNameProps extends ComponentProps<typeof Dialog> {
	triggerEditRequest: (newName: string) => void;
}

function EditGroupName({ className, triggerEditRequest }: EditGroupNameProps) {
	const [input, setInput] = useState("");
	return (
		<Dialog className={cn(className)}>
			<DialogTrigger asChild>
				<Button>
					<Text>Edit Group</Text>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Edit Group Name</DialogTitle>
					<DialogDescription>
						Make changes to your profile here. Click save when you're done.
					</DialogDescription>
				</DialogHeader>
				<View className="gap-y-2">
					<Label> Enter New Group Name</Label>
					<Input
						placeholder="Enter ..."
						value={input}
						onChangeText={(text) => setInput(text)}
					/>
				</View>
				<DialogFooter>
					<DialogClose asChild>
						<Button
							onPress={() => {
								if (input.trim()) {
									triggerEditRequest(input.trim());
								}
							}}
						>
							<Text>OK</Text>
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

interface GroupDetailsProps extends ViewProps {
	groupAvatarURL: string;
	groupName: string;
	creatorId: string;
	membersLength: number;
	editRequestAction: (newGroupName: string) => void;
}

export function GroupInfo({
	className,
	groupAvatarURL,
	groupName,
	creatorId,
	membersLength,
	editRequestAction,
}: GroupDetailsProps) {
	return (
		<View
			className={cn("relative justify-center items-center gap-y-3", className)}
		>
			<EditGroupName
				className="absolute right-0 top-0"
				triggerEditRequest={editRequestAction}
			/>
			<Avatar alt="Group-Image" className="size-40 elevation-md">
				<AvatarImage source={{ uri: groupAvatarURL }} />
				<AvatarFallback>
					<Text>{groupName[0] ?? "U"}</Text>
				</AvatarFallback>
			</Avatar>
			<Text className="ml-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
				{groupName}
			</Text>
			<Text className="text-base text-gray-500 dark:text-gray-400">
				Created by: {creatorId}
			</Text>
			<Text className="text-base text-gray-500 dark:text-gray-400">
				Members: {membersLength}
			</Text>
		</View>
	);
}
