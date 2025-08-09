export interface ChatMessage {
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

export interface BackendMessage {
    id: string;
    content: string;
    sender: {
        id: string;
    };
    chatId: string;
    createdAt: string;
}