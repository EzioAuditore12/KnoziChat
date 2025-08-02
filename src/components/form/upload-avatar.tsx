import { getImageFromGallery } from "@/hooks/get-image-gallery";
import { getLocalAssets } from "@/hooks/get-local-assets";
import { useEffect } from "react";
import { Pressable, View } from "react-native";
import { Image } from "../ui/image";
import { Button } from "../ui/button";
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

	// Local asset array for getLocalAssets
	const localAssetArr = [
		require("@/modules/auth/register/assets/profile-photo/image1.png"),
	];
	const localAssets = getLocalAssets({ Assets: localAssetArr });

	// Set default avatar on mount if value is not set
	useEffect(() => {
		if (
			(!value || !value.uri) &&
			localAssets &&
			localAssets.length > 0 &&
			onChange
		) {
			onChange({
				uri: localAssets[0].uri ?? "",
				type: localAssets[0].type,
				name: localAssets[0].name,
			});
		}
	}, [localAssets, value, value?.uri, onChange]);

	const handleUseDefaultAvatar = () => {
		if (localAssets && localAssets.length > 0 && onChange) {
			onChange({
				uri: localAssets[0].uri ?? "",
				type: localAssets[0].type,
				name: localAssets[0].name,
			});
		}
	};

	return (
		<View className="justify-center items-center gap-y-1">
			<Pressable onPress={retreiveGalleryImage}>
				<Image
					source={
						value?.uri
							? { uri: value.uri }
							: require("@/modules/auth/register/assets/profile-photo/image1.png")
					}
				size={"xl"}
				shape={"circle"}
				/>
			</Pressable>
			<Button className="bg-purple-500 rounded-2xl"  onPress={handleUseDefaultAvatar}>
				<Text className="text-white">Use Default Avatar</Text>
			</Button>
		</View>
	);
}
