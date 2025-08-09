import { Pressable,type PressableProps } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type Message={
    isCurrentUser:string
    content:string | null
    createdAt:string
}

interface ChatMessageBubleProps extends PressableProps {
    message:Message
}

export function ChatMessageBubble({ message,className,...props }: ChatMessageBubleProps) {
    return (
        <Pressable
            className={cn("relative flex-row mb-3 p-3 py-4 min-w-[110px] max-w-[80%] rounded-2xl",className)}
            style={{
                alignSelf:message.isCurrentUser ? "flex-end" : "flex-start",
                backgroundColor:message.isCurrentUser ? "blue" : "gray"
            }}
            {...props}
        >
                <Text
                className="text-md mb-1"
                style={{
                    color:message.isCurrentUser ? "white" : "gray"
                }}
                >
                    {message.content || ""}
                </Text>
                <Text
                    className="absolute bottom-[0.5] right-2 text-xs text-muted"
                >
                    {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </Text>
        </Pressable>
    );
}