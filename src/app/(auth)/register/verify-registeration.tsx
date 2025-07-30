import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import axios from "axios";
import { Asset } from "expo-asset";
import { launchImageLibraryAsync } from "expo-image-picker";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

const api_url = "http://10.0.2.2:3000/upload-file";

// Helper to get asset URIs
const assetImages = [
	require("../../../modules/auth/register/assets/profile-photos/image1.png"),
	require("../../../modules/auth/register/assets/profile-photos/image2.png"),
	require("../../../modules/auth/register/assets/profile-photos/image3.png"),
	require("../../../modules/auth/register/assets/profile-photos/image4.png"),
	require("../../../modules/auth/register/assets/profile-photos/image5.png"),
	require("../../../modules/auth/register/assets/profile-photos/image6.png"),
];

const uploadFileServer = async ({
	uri,
	type,
	name,
}: { uri: string; type: string; name: string }) => {
	const multipartFormData = new FormData();
	multipartFormData.append("profilePicture", { uri, type, name } as any);
	try {
		const response = await axios.post(api_url, multipartFormData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		console.log("Upload response:", response.data);
	} catch (error: any) {
		console.log("Upload error:", error.message);
	}
};

export default function ProfileImagePicker() {
	const [selectedIndex, setSelectedIndex] = useState<number>(0);
	const [customImage, setCustomImage] = useState<{
		uri: string;
		type: string;
		name: string;
	} | null>(null);

	// Show asset or custom image
	const showImage = customImage
		? { uri: customImage.uri }
		: { uri: Asset.fromModule(assetImages[selectedIndex]).uri };

	const handleImagePress = async () => {
		const result = await launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
			selectionLimit: 1,
			base64: false,
		});

		if (!result.canceled && result.assets && result.assets.length > 0) {
			const asset = result.assets[0];
			setCustomImage({
				uri: asset.uri,
				type: asset.mimeType ?? "image/jpeg",
				name: asset.fileName ?? "photo.jpg",
			});
		}
	};

	const handleUpload = async () => {
		if (customImage) {
			await uploadFileServer(customImage);
		} else {
			// Upload selected asset
			const assetObj = Asset.fromModule(assetImages[selectedIndex]);
			await assetObj.downloadAsync();
			const fileUri = assetObj.localUri || assetObj.uri;
			await uploadFileServer({
				uri: fileUri,
				type: "image/png",
				name: `image${selectedIndex + 1}.png`,
			});
		}
	};

	return (
		<View className="items-center">
			<View className="flex-row space-x-2 mb-4">
				{assetImages.map((img, idx) => (
					<TouchableOpacity
						key={idx}
						onPress={() => {
							setSelectedIndex(idx);
							setCustomImage(null);
						}}
					>
						<Image
							source={{ uri: Asset.fromModule(img).uri }}
							shape={
								selectedIndex === idx && !customImage ? "circle" : "rounded"
							}
							size="sm"
							shadow={selectedIndex === idx && !customImage ? "md" : "none"}
							style={{
								borderWidth: selectedIndex === idx && !customImage ? 2 : 0,
								borderColor: "#007AFF",
							}}
						/>
					</TouchableOpacity>
				))}
			</View>
			<TouchableOpacity onPress={handleImagePress}>
				<Image
					source={showImage}
					shape="circle"
					size="lg"
					shadow="lg"
					className="mb-4"
				/>
			</TouchableOpacity>
			<Button onPress={handleUpload}>
				<Text>Upload Selected Image</Text>
			</Button>
		</View>
	);
}
