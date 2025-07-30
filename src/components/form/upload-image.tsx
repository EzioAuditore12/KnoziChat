import { useState } from "react";
import { View } from "react-native";
import { ProfileImagePicker } from "./profile-image-picker";

export function ImagePickerExample() {
	const [selectedImage, setSelectedImage] = useState<string>("image1.png");
	const [isDefaultImage, setIsDefaultImage] = useState<boolean>(true);

	const handleImageSelect = (imageUri: string, isDefault: boolean) => {
		setSelectedImage(imageUri);
		setIsDefaultImage(isDefault);
		console.log("Selected image:", imageUri, "Is default:", isDefault);
	};

	return (
		<View className="justify-center items-center p-4">
			<ProfileImagePicker
				onImageSelect={handleImageSelect}
				selectedImage={selectedImage}
			/>
		</View>
	);
}
