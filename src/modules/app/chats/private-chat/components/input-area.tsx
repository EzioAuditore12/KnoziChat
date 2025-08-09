import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { getImageFromGallery } from "@/hooks/get-image-gallery";
import { cn } from "@/lib/utils";
import { Paperclip } from "lucide-react-native";
import { useState } from "react";
import { Alert, TouchableOpacity, View, type ViewProps } from "react-native";

interface ImageData {
	uri: string;
	type: string;
	name: string;
}

interface InputAreaProps extends ViewProps {
	handleSendMessage: (message: string) => void;
	handleImageUpload?: (image: ImageData) => void;
}

export function InputArea({
	handleSendMessage,
	handleImageUpload,
	className,
	...props
}: InputAreaProps) {
	const [inputMessage, setInputMessage] = useState("");

	const submitMessage = () => {
		if (inputMessage.trim()) {
			handleSendMessage(inputMessage);
			setInputMessage("");
		}
	};

	const handleAttachment = async () => {
		try {
			const galleryImage = await getImageFromGallery({
				allowedImageType: ["image/png", "image/jpeg"],
			});

			if (galleryImage && handleImageUpload) {
				handleImageUpload({
					uri: galleryImage.uri,
					type: galleryImage.type ?? "image/jpeg",
					name: galleryImage.name ?? `image_${Date.now()}.jpg`,
				});
			}
		} catch {
			Alert.alert("Error", "Failed to select image from gallery");
		}
	};

	return (
		<View
			className={cn(
				"flex-row gap-x-3 items-center p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-black",
				className,
			)}
			{...props}
		>
			<TouchableOpacity onPress={handleAttachment}>
				<Paperclip size={24} color="#6b7280" />
			</TouchableOpacity>
			<Input
				placeholder="Type a message..."
				value={inputMessage}
				onChangeText={setInputMessage}
				className="flex-1 mr-3"
				returnKeyType="send"
				onSubmitEditing={submitMessage}
			/>
			<Button
				onPress={submitMessage}
				className="bg-blue-500 px-4 py-2 rounded-full"
				disabled={!inputMessage.trim()}
			>
				<Text className="text-white font-medium">Send</Text>
			</Button>
		</View>
	);
}
