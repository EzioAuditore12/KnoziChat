
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VirtualizedList } from "@/components/virtual-list";
import { ChatMessageBubble } from "@/modules/app/chats/private-chat/components/chat-bubble";
import { InputArea } from "@/modules/app/chats/private-chat/components/input-area";
import { useGetMessages } from "@/modules/app/features/hooks/use-get-messages";
import { getSocket } from "@/providers/socket-provider";
import { authStore } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import { Stack, router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import {
	FlatList,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	View,
} from "react-native";

interface GroupChatMessage {
	id: string;
	content: string | null;
	sender: {
		id: string;
		name: string;
		profilePicture: string | null;
	};
	chatId: string;
	createdAt: Date;
	attachments: Array<{
		downloadUrl: string;
		fileId: string;
		fileName: string;
		fileSize: number;
		previewUrl: string;
		viewUrl: string;
	} | null>;
	isCurrentUser?: boolean;
}

// Backend message format
interface BackendGroupMessage {
	id: string;
	content: string;
	sender: {
		id: string;
		name?: string;
		profilePicture?: string | null;
	};
	chatId: string;
	createdAt: string;
}

// Backend attachment message format
interface BackendAttachmentMessage {
	content: string;
	uploadedAttachments: Array<{
		fileId: string;
		fileName: string;
		fileSize: number;
		previewUrl: string;
		viewUrl: string;
		downloadUrl: string;
	}>;
	sender: {
		id: string;
		name: string;
		profilePicture: string;
	};
	chat: string;
}

export default function GroupChatScreen() {
	const { groupId, groupName } = useLocalSearchParams() as unknown as {
		groupId: string;
		groupName: string;
	};

	const [realtimeMessages, setRealtimeMessages] = useState<GroupChatMessage[]>([]);
	const flatListRef = useRef<FlatList>(null);
	const socket = getSocket();
	const queryClient = useQueryClient();

	// Get current user ID from auth store
	const { user } = authStore.getState();
	const currentUserId = user?.id;

	// Fetch messages using the hook
	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useGetMessages({
			chatId: groupId,
			limit: 20,
		});

	// Flatten messages from all pages and add isCurrentUser flag
	const dbMessages =
		data?.pages.flatMap((page) =>
			page.messages.map((message) => ({
				...message,
				createdAt: new Date(message.createdAt), // Ensure consistent Date objects
				isCurrentUser: message.sender.id === currentUserId,
			})),
		) || [];

	// Remove duplicates and combine database messages with real-time messages
	const allMessages = useMemo(() => {
		const messageMap = new Map<string, GroupChatMessage>();

		// Add database messages first
		dbMessages.forEach((message) => {
			messageMap.set(message.id, message);
		});

		// Filter out optimistic messages that now exist in database
		const filteredRealtimeMessages = realtimeMessages.filter((rtMessage) => {
			// If it's a temp message and we have a real message with similar content and time, remove it
			if (rtMessage.id.startsWith("temp-")) {
				const hasMatchingDbMessage = dbMessages.some((dbMessage) => 
					dbMessage.content === rtMessage.content &&
					dbMessage.sender.id === rtMessage.sender.id &&
					Math.abs(new Date(dbMessage.createdAt).getTime() - new Date(rtMessage.createdAt).getTime()) < 10000 // Within 10 seconds
				);
				return !hasMatchingDbMessage;
			}
			return true;
		});

		// Add filtered real-time messages (will overwrite if duplicate IDs)
		filteredRealtimeMessages.forEach((message) => {
			messageMap.set(message.id, message);
		});

		// Convert to array and sort by creation time (same as private chat)
		const sortedMessages = Array.from(messageMap.values()).sort(
			(a, b) =>
				new Date(a.createdAt).getTime() - new Date(a.createdAt).getTime(),
		);

		// Update realtime messages to remove the filtered ones
		if (filteredRealtimeMessages.length !== realtimeMessages.length) {
			setTimeout(() => {
				setRealtimeMessages(filteredRealtimeMessages);
			}, 0);
		}

		return sortedMessages;
	}, [dbMessages, realtimeMessages]);

	useFocusEffect(
		useCallback(() => {
			if (!socket) return;

			// Listen for new messages
			const handleNewMessage = (data: {
				chatId: string;
				message: BackendGroupMessage;
			}) => {
				if (data.chatId === groupId) {
					console.log("New group message received:", data.message);
					console.log("Sender data:", data.message.sender);

					// Try to find sender name from existing database messages
					const existingSender = dbMessages.find(msg => msg.sender.id === data.message.sender.id);
					const senderName = data.message.sender.name || 
									 existingSender?.sender.name || 
									 "Unknown User";

					// Transform backend message to frontend format
					const transformedMessage: GroupChatMessage = {
						id: data.message.id,
						content: data.message.content,
						sender: {
							id: data.message.sender.id,
							name: senderName,
							profilePicture: data.message.sender.profilePicture || 
										   existingSender?.sender.profilePicture || 
										   null,
						},
						chatId: data.message.chatId,
						createdAt: new Date(data.message.createdAt),
						attachments: [],
						isCurrentUser: data.message.sender.id === currentUserId,
					};

					// Add to real-time messages
					setRealtimeMessages((prev) => {
						// Check if message already exists to avoid duplicates
						const exists = prev.some(
							(msg) => msg.id === transformedMessage.id,
						);
						if (exists) return prev;

						return [...prev, transformedMessage];
					});

					// Scroll to bottom
					setTimeout(() => {
						flatListRef.current?.scrollToEnd({ animated: true });
					}, 100);

					// Invalidate queries to refresh from server
					queryClient.invalidateQueries({
						queryKey: ["Chat-Messages", groupId],
					});
				}
			};

			// Listen for message alerts
			const handleMessageAlert = (data: { chatId: string }) => {
				if (data.chatId === groupId) {
					console.log("New group message alert for chat:", groupId);
				}
			};

			// Listen for attachment messages
			const handleNewAttachment = (data: {
				chatId: string;
				message: BackendAttachmentMessage;
			}) => {
				if (data.chatId === groupId) {
					console.log("New attachment received:", data.message);

					// Transform backend attachment message to frontend format
					const transformedMessage: GroupChatMessage = {
						id: `attachment-${Date.now()}`, // Generate temp ID for attachments
						content: null, // Attachments don't have text content
						sender: {
							id: data.message.sender.id,
							name: data.message.sender.name || "Unknown User",
							profilePicture: data.message.sender.profilePicture || null,
						},
						chatId: data.chatId,
						createdAt: new Date(),
						attachments: data.message.uploadedAttachments,
						isCurrentUser: data.message.sender.id === currentUserId,
					};

					// Add to real-time messages
					setRealtimeMessages((prev) => {
						// Check if message already exists to avoid duplicates
						const exists = prev.some(
							(msg) => msg.id === transformedMessage.id,
						);
						if (exists) return prev;

						return [...prev, transformedMessage];
					});

					// Scroll to bottom
					setTimeout(() => {
						flatListRef.current?.scrollToEnd({ animated: true });
					}, 100);

					// Invalidate queries to refresh from server
					queryClient.invalidateQueries({
						queryKey: ["Chat-Messages", groupId],
					});
				}
			};

			socket.on("NEW_MESSAGE", handleNewMessage);
			socket.on("NEW_MESSAGE_ALERT", handleMessageAlert);
			socket.on("NEW_ATTACHMENT", handleNewAttachment);

			return () => {
				socket.off("NEW_MESSAGE", handleNewMessage);
				socket.off("NEW_MESSAGE_ALERT", handleMessageAlert);
				socket.off("NEW_ATTACHMENT", handleNewAttachment);
			};
		}, [socket, groupId, currentUserId, queryClient, dbMessages]),
	);

	const handleSendMessage = (inputMessage: string) => {
		if (!inputMessage.trim() || !socket) return;

		// Create optimistic message for immediate UI update
		const optimisticMessage: GroupChatMessage = {
			id: `temp-${Date.now()}`, // Temporary ID
			content: inputMessage.trim(),
			sender: {
				id: currentUserId || "",
				name: user ? `${user.firstName} ${user.lastName}` : "You",
				profilePicture: user?.profilePicture || null,
			},
			chatId: groupId,
			createdAt: new Date(),
			attachments: [],
			isCurrentUser: true,
		};

		// Add optimistic message immediately
		setRealtimeMessages((prev) => [...prev, optimisticMessage]);

		// Emit the message to the server
		socket.emit("NEW_MESSAGE", {
			chatId: groupId,
			message: inputMessage.trim(),
		});

		// Scroll to bottom
		setTimeout(() => {
			flatListRef.current?.scrollToEnd({ animated: true });
		}, 100);
	};

	const handleLoadMore = () => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	};

	const renderMessage = ({ item }: { item: GroupChatMessage }) => (
		<ChatMessageBubble
			message={{
				isCurrentUser: String(item.isCurrentUser),
				content: item.content,
				createdAt: item.createdAt.toISOString(),
				senderName: !item.isCurrentUser ? item.sender.name : undefined,
				senderAvatar: !item.isCurrentUser ? item.sender.profilePicture : undefined,
			}}
		/>
	);

	if (isLoading) {
		return (
			<View className="flex-1 justify-center items-center bg-white dark:bg-black">
				<Text>Loading messages...</Text>
			</View>
		);
	}

	return (
		<>
			<Stack.Screen
				options={{
					headerTitle: () => (
						<Pressable
							onPress={() =>
								router.push({
									pathname: "/chats/group-chat/group-info",
									params: {
										groupChatId: groupId,
									},
								})
							}
						>
							<Text className="text-lg font-bold">{groupName}</Text>
						</Pressable>
					),
					headerTitleAlign: "center",
				}}
			/>
			<KeyboardAvoidingView
				className="flex-1 bg-white dark:bg-black"
				behavior={Platform.OS === "ios" ? "padding" : undefined}
			>
				<FlatList
					ref={flatListRef}
					data={allMessages}
					renderItem={renderMessage}
					keyExtractor={(message) => message.id}
					onEndReached={handleLoadMore}
					onEndReachedThreshold={0.5}
					showsVerticalScrollIndicator={false}
				/>

				<InputArea handleSendMessage={handleSendMessage} chatId={groupId} />
			</KeyboardAvoidingView>
		</>
	);
}
