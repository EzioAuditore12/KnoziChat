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
import { H3 } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import type { User } from "../api/search-user";
import { UserCard } from "./user-card";

interface CreateGroupDialogProps extends ComponentProps<typeof Dialog> {
	selectedUsers: User[];
	onCreateGroup: (groupName: string, userIds: string[]) => void;
	disabled?: boolean;
}

export function CreateGroupDialog({
	className,
	selectedUsers,
	onCreateGroup,
	disabled = false,
	...props
}: CreateGroupDialogProps) {
	const [groupName, setGroupName] = useState("");
	const [open, setOpen] = useState(false);

	const handleCreateGroup = () => {
		if (groupName.trim() && selectedUsers.length >= 2) {
			const userIds = selectedUsers.map((user) => user.id);
			onCreateGroup(groupName.trim(), userIds);
			setGroupName("");
			setOpen(false);
		}
	};

	return (
		<Dialog
			className={cn(className)}
			open={open}
			onOpenChange={setOpen}
			{...props}
		>
			<DialogTrigger asChild>
				<Button variant={"secondary"} disabled={disabled}>
					<Text>Create</Text>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px] max-h-[80vh]">
				<DialogHeader>
					<DialogTitle>Create Group</DialogTitle>
					<DialogDescription>
						Enter a group name and review selected members.
					</DialogDescription>
				</DialogHeader>

				<View className="gap-y-4">
					<Input
						placeholder="Enter group name..."
						value={groupName}
						onChangeText={setGroupName}
					/>

					<View>
						<H3 className="mb-2">Selected Members ({selectedUsers.length})</H3>
						<ScrollView
							style={{ maxHeight: 200 }}
							showsVerticalScrollIndicator={false}
						>
							{selectedUsers.map((user) => (
								<UserCard
									key={user.id}
									firstName={user.firstName}
									phoneNumber={user.phoneNumber}
									profilePicture={user.profilePicture}
								/>
							))}
						</ScrollView>
					</View>
				</View>

				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">
							<Text>Cancel</Text>
						</Button>
					</DialogClose>
					<Button
						onPress={handleCreateGroup}
						disabled={!groupName.trim() || selectedUsers.length < 2}
					>
						<Text>Create Group</Text>
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
