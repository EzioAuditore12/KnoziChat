import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/clerk-expo";
import { Query } from "react-native-appwrite";
import { appwriteConfig, db } from "@/utils/appwrite";
import type { ChatRoom } from "../types";

export function useChatScreenData() {
    const { user } = useUser();
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchChatRooms = useCallback(async () => {
        try {
            setError(null);
            const { documents } = await db.listDocuments(
                appwriteConfig.db,
                appwriteConfig.col.chatrooms,
                [Query.limit(100)],
            );
            setChatRooms(documents as unknown as ChatRoom[]);
        } catch (err) {
            const message = err instanceof Error ? err.message : "An unknown error occurred";
            setError(message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchChatRooms();
    }, [fetchChatRooms]);

    return {
        userProfile: user?.imageUrl,
        chatRooms,
        loading,
        error,
    };
}
