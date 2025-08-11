import { Pressable, View } from "react-native";
import { getImageFromGallery } from "@/hooks/use-get-image-gallery";
import { Button } from "../ui/button";
import { Image } from "../ui/image";
import { Text } from "../ui/text";

interface UploadAvatarProps {
	value?: {
		uri: string;
		type: string;
		name: string;
	};
	onChange?: (img: { uri: string; type: string; name: string }) => void;
}

export function UploadAvatar({ value, onChange }: UploadAvatarProps) {
	const retreiveGalleryImage = async () => {
		const galleryImage = await getImageFromGallery({
			allowedImageType: ["image/png", "image/jpeg"],
		});
		if (galleryImage && onChange) {
			onChange({
				uri: galleryImage.uri,
				type: galleryImage.type ?? "",
				name: galleryImage.name ?? "",
			});
		}
	};

	return (
		<View className="justify-center items-center gap-y-1">
			<Pressable onPress={retreiveGalleryImage}>
				{value?.uri ? (
					<Image source={{ uri: value.uri }} size={"xl"} shape={"circle"} />
				) : (
					<View className="w-24 h-24 bg-gray-300 rounded-full justify-center items-center">
						<Text className="text-gray-600">No Image</Text>
					</View>
				)}
			</Pressable>
			<Button
				className="bg-purple-500 rounded-2xl"
				onPress={retreiveGalleryImage}
			>
				<Text className="text-white">Select Avatar</Text>
			</Button>
		</View>
	);
}
