import { KeyboardAwareScrollView } from "@/components/keyboard-aware-scrollView";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { getSocket } from "@/providers/socket-provider";
import { useGetMessages } from "@/modules/app/features/hooks/use-get-messages";
import { Stack, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useState, useCallback, useRef, useMemo } from "react";
import { Pressable, View, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { authStore } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import { ChatMessageBubble } from "@/modules/app/chats/private-chat/components/chat-bubble";
import { InputArea } from "@/modules/app/chats/private-chat/components/input-area";
import { VirtualizedList } from "@/components/virtual-list";

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
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetMessages({
        chatId,
        limit: 20,
    });

    // Flatten messages from all pages and add isCurrentUser flag
    const dbMessages = data?.pages.flatMap((page) => 
        page.messages.map((message) => ({
            ...message,
            createdAt: new Date(message.createdAt), // Ensure consistent Date objects
            isCurrentUser: message.sender.id === currentUserId,
        }))
    ) || [];

    // Remove duplicates and combine database messages with real-time messages
    const allMessages = useMemo(() => {
        const messageMap = new Map<string, ChatMessage>();
        
        // Add database messages
        dbMessages.forEach(message => {
            messageMap.set(message.id, message);
        });
        
        // Add real-time messages (will overwrite if duplicate)
        realtimeMessages.forEach(message => {
            messageMap.set(message.id, message);
        });
        
        // Convert to array and sort by creation time (oldest first)
        const sortedMessages = Array.from(messageMap.values()).sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        
        console.log("Total messages:", sortedMessages.length);
        console.log("DB messages:", dbMessages.length);
        console.log("Realtime messages:", realtimeMessages.length);
        
        return sortedMessages;
    }, [dbMessages, realtimeMessages]);

    useFocusEffect(
        useCallback(() => {
            if (!socket) return;

            // Listen for new messages
            const handleNewMessage = (data: { chatId: string; message: BackendMessage }) => {
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

                    // Add to real-time messages and remove any optimistic message
                    setRealtimeMessages(prev => {
                        // Remove optimistic messages for current user (they start with 'temp-')
                        const filteredPrev = transformedMessage.isCurrentUser 
                            ? prev.filter(msg => !msg.id.startsWith('temp-'))
                            : prev;
                        
                        // Check if message already exists to avoid duplicates
                        const exists = filteredPrev.some(msg => msg.id === transformedMessage.id);
                        if (exists) return filteredPrev;
                        
                        return [...filteredPrev, transformedMessage];
                    });

                    // Scroll to bottom
                    setTimeout(() => {
                        flatListRef.current?.scrollToEnd({ animated: true });
                    }, 100);

                    // Invalidate queries to refresh from server
                    queryClient.invalidateQueries({ queryKey: ['Chat-Messages', chatId] });
                }
            };

            // Listen for message alerts
            const handleMessageAlert = (data: { chatId: string }) => {
                if (data.chatId === chatId) {
                    console.log("New message alert for chat:", chatId);
                }
            };

            socket.on("NEW_MESSAGE", handleNewMessage);
            socket.on("NEW_MESSAGE_ALERT", handleMessageAlert);

            return () => {
                socket.off("NEW_MESSAGE", handleNewMessage);
                socket.off("NEW_MESSAGE_ALERT", handleMessageAlert);
            };
        }, [socket, chatId, currentUserId, queryClient])
    );

    const handleSendMessage = (inputMessage:string) => {
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
        setRealtimeMessages(prev => [...prev, optimisticMessage]);

        // Emit the message to the server
        socket.emit("NEW_MESSAGE", {
            chatId: chatId,
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

    const renderMessage = ({ item }: { item: ChatMessage }) => (
        <ChatMessageBubble message={{
            isCurrentUser: String(item.isCurrentUser),
            content: item.content,
            createdAt: item.createdAt.toISOString()
        }} />
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
                    headerTitle: userName || "Chat",
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
                    inverted={false} // Changed to false since we're sorting chronologically
                    showsVerticalScrollIndicator={false}
                />

				<InputArea
				handleSendMessage={handleSendMessage}
				/>
            </KeyboardAvoidingView>
        </>
    );
}