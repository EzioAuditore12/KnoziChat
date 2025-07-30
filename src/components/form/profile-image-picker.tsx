import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { launchImageLibraryAsync } from "expo-image-picker";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

interface ProfileImagePickerProps {
	onImageSelect: (imageUri: string, isDefault: boolean) => void;
	selectedImage?: string;
}

export function ProfileImagePicker({
	onImageSelect,
	selectedImage,
}: ProfileImagePickerProps) {
	const [customImage, setCustomImage] = useState<string | null>(null);

	// Array of default profile images
	const defaultImages = [
		require("@/modules/auth/register/assets/profile-photos/image1.png"),
		require("@/modules/auth/register/assets/profile-photos/image2.png"),
		require("@/modules/auth/register/assets/profile-photos/image3.png"),
		require("@/modules/auth/register/assets/profile-photos/image4.png"),
		require("@/modules/auth/register/assets/profile-photos/image5.png"),
		require("@/modules/auth/register/assets/profile-photos/image6.png"),
	];

	const pickImage = async () => {
		let result = await launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (!result.canceled) {
			const uri = result.assets[0].uri;
			setCustomImage(uri);
			onImageSelect(uri, false);
		}
	};

	const selectDefaultImage = (imageIndex: number) => {
		const imageUri = `image${imageIndex + 1}.png`;
		onImageSelect(imageUri, true);
		setCustomImage(null);
	};

	const getCurrentImageSource = () => {
		if (customImage) {
			return { uri: customImage };
		}
		if (selectedImage && selectedImage.startsWith("image")) {
			const imageNumber = selectedImage
				.replace("image", "")
				.replace(".png", "");
			return defaultImages[parseInt(imageNumber) - 1];
		}
		return defaultImages[0]; // Default to first image
	};

	return (
		<View className="items-center gap-4">
			{/* Main Profile Image */}
			<Pressable onPress={pickImage} className="relative">
				<Image
					source={getCurrentImageSource()}
					shape="circle"
					size="xl"
					shadow="md"
					className="border-4 border-indigo-500"
				/>
				<View className="absolute bottom-2 right-2 bg-indigo-500 rounded-full p-2">
					<Text className="text-white text-xs font-bold">✎</Text>
				</View>
			</Pressable>

			<Text className="text-center text-gray-600">
				Tap to upload custom photo or choose from below
			</Text>

			{/* Default Image Options */}
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				className="max-h-20"
				contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}
			>
				{defaultImages.map((image, index) => (
					<Pressable
						key={index}
						onPress={() => selectDefaultImage(index)}
						className={`rounded-full border-2 ${
							selectedImage === `image${index + 1}.png` && !customImage
								? "border-indigo-500"
								: "border-gray-300"
						}`}
					>
						<Image source={image} shape="circle" size="sm" className="m-1" />
					</Pressable>
				))}
			</ScrollView>
		</View>
	);
}
