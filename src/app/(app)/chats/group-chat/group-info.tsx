import { VirtualizedList } from "@/components/virtual-list";
import { GroupActions } from "@/modules/app/chats/group-chat/components/details/group-actions";
import { GroupInfo } from "@/modules/app/chats/group-chat/components/details/group-info";
import { ChatMemberCard } from "@/modules/app/chats/group-chat/components/details/group-members";
import { LoadingGroupInfoSkeleton } from "@/modules/app/chats/group-chat/components/details/loading-group-details";
import { useEditGroup } from "@/modules/app/chats/group-chat/hooks/use-edit-group";
import { useLeaveGroup } from "@/modules/app/chats/group-chat/hooks/use-leave-group";
import type { ChatMember } from "@/modules/app/features/api/chat-details";
import { useChatDetails } from "@/modules/app/features/hooks/chat-details";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GroupInfoScreen() {
	const { groupChatId } = useLocalSearchParams() as { groupChatId: string };

	const { data, isLoading } = useChatDetails({ id: groupChatId });

	const { mutate, isPending } = useLeaveGroup();

	const { mutate: editMutation, isPending: editRequestPending } =
		useEditGroup();

	if (isLoading) {
		return <LoadingGroupInfoSkeleton />;
	}

	const group = data?.chat;
	const chatMembers = data?.chatMembers || [];

	return (
		<>
			<Stack.Screen options={{ headerShown: false }} />

			<SafeAreaView className="flex-1 bg-white dark:bg-black">
				<GroupInfo
					className="max-w-md mt-2 "
					creatorId={group?.creatorId ?? ""}
					groupAvatarURL={group?.avatar!}
					groupName={group?.name!}
					membersLength={chatMembers.length}
					editRequestAction={(newGroupName: string) =>
						editMutation({ groupId: groupChatId, newGroupName })
					}
				/>

				<VirtualizedList
					items={chatMembers}
					renderItem={(member: ChatMember) => (
						<ChatMemberCard
							member={member}
							onPress={() => {
								router.push({
									pathname: "/(app)/(features)/[userId]",
									params: {
										userId: member.id,
									},
								});
							}}
						/>
					)}
					keyExtractor={(member: ChatMember) => member.id}
				/>

				<GroupActions
					isPending={isPending}
					LeaveGroupAction={() => mutate({ groupId: groupChatId })}
				/>
			</SafeAreaView>
		</>
	);
}
