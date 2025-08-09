import { KeyboardAwareScrollView } from "@/components/keyboard-aware-scrollView";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VirtualizedList } from "@/components/virtual-list";
import { getSocket } from "@/providers/socket-provider";
import { Stack, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useState, useCallback, useRef, useEffect } from "react";
import { Pressable, View, FlatList } from "react-native";
import { authStore } from "@/store";

interface ChatMessage {
    _id: string;
    content: string;
    sender: {
        _id: string;
        name?: string;
    };
    chat: string;
    createdAt: string;
    isCurrentUser?: boolean;
}

// Chat message component
function ChatMessageBubble({ message }: { message: ChatMessage }) {
    return (
        <View
            className={`flex-row mb-3 ${message.isCurrentUser ? "justify-end" : "justify-start"}`}
        >
            <View
                className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                    message.isCurrentUser
                        ? "bg-blue-500 rounded-br-md"
                        : "bg-gray-200 dark:bg-gray-700 rounded-bl-md"
                }`}
            >
                <Text
                    className={`text-sm ${
                        message.isCurrentUser
                            ? "text-white"
                            : "text-gray-900 dark:text-gray-100"
                    }`}
                >
                    {message.content}
                </Text>
                <Text
                    className={`text-xs mt-1 ${
                        message.isCurrentUser
                            ? "text-blue-100"
                            : "text-gray-500 dark:text-gray-400"
                    }`}
                >
                    {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </Text>
            </View>
        </View>
    );
}

export default function PrivateChatScreen() {
    const { chatId, userName } = useLocalSearchParams() as {
        chatId: string;
        userName?: string;
    };
    
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const flatListRef = useRef<FlatList<ChatMessage>>(null);
    const socket = getSocket();

    // Get current user ID from your auth store
    const { user } = authStore.getState(); // Adjust according to your auth store structure
    const currentUserId = user?._id;

    useFocusEffect(
        useCallback(() => {
            if (!socket) return;

            // Listen for new messages
            const handleNewMessage = (data: { chatId: string; message: ChatMessage }) => {
                if (data.chatId === chatId) {
                    const messageWithUserFlag = {
                        ...data.message,
                        isCurrentUser: data.message.sender._id === currentUserId
                    };
                    
                    setMessages(prev => [...prev, messageWithUserFlag]);
                    
                    // Auto scroll to bottom
                    setTimeout(() => {
                        flatListRef.current?.scrollToEnd({ animated: true });
                    }, 100);
                }
            };

            // Listen for message alerts
            const handleMessageAlert = (data: { chatId: string }) => {
                if (data.chatId === chatId) {
                    console.log("New message alert for chat:", chatId);
                    // You can add notification logic here
                }
            };

            socket.on("NEW_MESSAGE", handleNewMessage);
            socket.on("NEW_MESSAGE_ALERT", handleMessageAlert);

            return () => {
                socket.off("NEW_MESSAGE", handleNewMessage);
                socket.off("NEW_MESSAGE_ALERT", handleMessageAlert);
            };
        }, [socket, chatId, currentUserId])
    );

    // Load existing messages when component mounts
    useEffect(() => {
        // You might want to fetch existing messages from your API here
        // const fetchMessages = async () => {
        //     try {
        //         const response = await fetch(`/api/chats/${chatId}/messages`);
        //         const existingMessages = await response.json();
        //         setMessages(existingMessages.map(msg => ({
        //             ...msg,
        //             isCurrentUser: msg.sender._id === currentUserId
        //         })));
        //     } catch (error) {
        //         console.error('Failed to fetch messages:', error);
        //     }
        // };
        // fetchMessages();
    }, [chatId, currentUserId]);

    const handleSendMessage = () => {
        if (!inputMessage.trim() || !socket) return;

        // You'll need to get the chat members from your chat data
        // This could come from your chat store or API
        const chatMembers = []; // Get this from your chat data/store

        // Emit the message to the server
        socket.emit("NEW_MESSAGE", {
            chatId: chatId,
            members: chatMembers, // Array of user IDs in the chat
            message: inputMessage.trim(),
        });

        // Clear the input
        setInputMessage("");
    };

    // Prepare messages with user flag
    const messagesWithUserFlag = messages.map(message => ({
        ...message,
        isCurrentUser: message.sender._id === currentUserId
    }));

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: userName || "Chat",
                }}
            />
            <KeyboardAwareScrollView className="flex-1 bg-white dark:bg-black">
                {/* Messages List */}
                <View className="flex-1 px-4 pt-4">
                    <VirtualizedList
                        ref={flatListRef}
                        items={messagesWithUserFlag}
                        renderItem={(message: ChatMessage) => (
                            <ChatMessageBubble message={message} />
                        )}
                        keyExtractor={(message: ChatMessage) => message._id}
                        className="flex-1"
                    />
                </View>

                {/* Input Area */}
                <View className="flex-row items-center p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-black">
                    <Input
                        placeholder="Type a message..."
                        value={inputMessage}
                        onChangeText={setInputMessage}
                        className="flex-1 mr-3"
                        onSubmitEditing={handleSendMessage}
                    />
                    <Pressable
                        onPress={handleSendMessage}
                        className="bg-blue-500 px-4 py-2 rounded-full"
                    >
                        <Text className="text-white font-medium">Send</Text>
                    </Pressable>
                </View>
            </KeyboardAwareScrollView>
        </>
    );
}