import { getImageFromGallery } from "@/hooks/get-image-gallery";
import { getLocalAssets } from "@/hooks/get-local-assets";
import { Button, Pressable, View } from "react-native";
import { Image } from "../ui/image";

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
		<View style={{ alignItems: "center" }}>
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
			<Button title="Use Default Avatar" onPress={handleUseDefaultAvatar} />
		</View>
	);
}
