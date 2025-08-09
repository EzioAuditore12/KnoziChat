import { KeyboardAwareScrollView } from "@/components/keyboard-aware-scrollView";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VirtualizedList } from "@/components/virtual-list";
import { ChatMessageBubble } from "@/modules/app/chats/private-chat/components/chat-bubble";
import { InputArea } from "@/modules/app/chats/private-chat/components/input-area";
import { useGetMessages } from "@/modules/app/features/hooks/use-get-messages";
import { getSocket } from "@/providers/socket-provider";
import { authStore } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import { Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import {
	FlatList,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	View,
} from "react-native";

interface ChatMessage {
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
interface BackendMessage {
	id: string;
	content: string;
	sender: {
		id: string;
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

export default function PrivateChatScreen() {
	const { chatId, userName } = useLocalSearchParams() as {
		chatId: string;
		userName?: string;
	};

	const [realtimeMessages, setRealtimeMessages] = useState<ChatMessage[]>([]);
	const flatListRef = useRef<FlatList>(null);
	const socket = getSocket();
	const queryClient = useQueryClient();

	// Get current user ID from auth store
	const { user } = authStore.getState();
	const currentUserId = user?.id;

	// Fetch messages using the hook
	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useGetMessages({
			chatId,
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
		const messageMap = new Map<string, ChatMessage>();

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

		// Convert to array and sort by creation time (newest first for inverted list)
		const sortedMessages = Array.from(messageMap.values()).sort(
			(a, b) =>
				new Date(a.createdAt).getTime() - new Date(a.createdAt).getTime(),
		);

		console.log("Total messages:", sortedMessages.length);
		console.log("DB messages:", dbMessages.length);
		console.log("Realtime messages:", filteredRealtimeMessages.length);
		console.log("Original realtime messages:", realtimeMessages.length);

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
				message: BackendMessage;
			}) => {
				if (data.chatId === chatId) {
					console.log("New message received:", data.message);

					// Transform backend message to frontend format
					const transformedMessage: ChatMessage = {
						id: data.message.id,
						content: data.message.content,
						sender: {
							id: data.message.sender.id,
							name: "Unknown User", // You might want to fetch this
							profilePicture: null,
						},
						chatId: data.message.chatId,
						createdAt: new Date(data.message.createdAt),
						attachments: [],
						isCurrentUser: data.message.sender.id === currentUserId,
					};

					// Add to real-time messages (since backend excludes sender, these are always from others)
					setRealtimeMessages((prev) => {
						// Check if message already exists to avoid duplicates
						const exists = prev.some(
							(msg) => msg.id === transformedMessage.id,
						);
						if (exists) return prev;

						return [...prev, transformedMessage];
					});

					// Scroll to bottom (newest message in inverted list)
					setTimeout(() => {
						flatListRef.current?.scrollToEnd({ animated: true });
					}, 100);

					// Invalidate queries to refresh from server and clean up optimistic messages
					queryClient.invalidateQueries({
						queryKey: ["Chat-Messages", chatId],
					});
				}
			};

			// Listen for message alerts
			const handleMessageAlert = (data: { chatId: string }) => {
				if (data.chatId === chatId) {
					console.log("New message alert for chat:", chatId);
				}
			};

			// Listen for attachment messages
			const handleNewAttachment = (data: {
				chatId: string;
				message: BackendAttachmentMessage;
			}) => {
				if (data.chatId === chatId) {
					console.log("New attachment received:", data.message);

					// Transform backend attachment message to frontend format
					const transformedMessage: ChatMessage = {
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
						queryKey: ["Chat-Messages", chatId],
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
		}, [socket, chatId, currentUserId, queryClient]),
	);

	const handleSendMessage = (inputMessage: string) => {
		if (!inputMessage.trim() || !socket) return;

		// Create optimistic message for immediate UI update
		const optimisticMessage: ChatMessage = {
			id: `temp-${Date.now()}`, // Temporary ID
			content: inputMessage.trim(),
			sender: {
				id: currentUserId || "",
				name: user ? `${user.firstName} ${user.lastName}` : "You",
				profilePicture: user?.profilePicture || null,
			},
			chatId: chatId,
			createdAt: new Date(),
			attachments: [],
			isCurrentUser: true,
		};

		// Add optimistic message immediately
		setRealtimeMessages((prev) => [...prev, optimisticMessage]);

		// Emit the message to the server
		socket.emit("NEW_MESSAGE", {
			chatId: chatId,
			message: inputMessage.trim(),
		});

		// Scroll to bottom (newest message in inverted list)
		setTimeout(() => {
			flatListRef.current?.scrollToEnd({ animated: true });
		}, 100);
	};

	const handleLoadMore = () => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage();
		}
	};

	const renderMessage = ({ item }: { item: ChatMessage }) => (
		<ChatMessageBubble
			message={{
				isCurrentUser: String(item.isCurrentUser),
				content: item.content,
				createdAt: item.createdAt.toISOString(),
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
					headerTitle: userName,
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

				<InputArea handleSendMessage={handleSendMessage} />
			</KeyboardAvoidingView>
		</>
	);
}
