import {
	type ImagePickerOptions,
	launchImageLibraryAsync,
} from "expo-image-picker";

const defaultOptions: ImagePickerOptions = {
	allowsEditing: true,
	aspect: [4, 3],
	mediaTypes: ["images"],
	quality: 1,
	selectionLimit: 1,
	base64: false,
};

const ALL_IMAGE_TYPES = [
	"image/png",
	"image/jpeg",
	"image/gif",
	"image/svg+xml",
	"image/webp",
];

type AllowedImageType = (typeof ALL_IMAGE_TYPES)[number];

interface getImageGalleryProps {
	options?: ImagePickerOptions;
	allowedImageType?: AllowedImageType[];
}

export async function getImageFromGallery({
	options = defaultOptions,
	allowedImageType = ALL_IMAGE_TYPES,
}: getImageGalleryProps) {
	const pickupImage = await launchImageLibraryAsync(options);

	if (
		!pickupImage.canceled &&
		pickupImage.assets &&
		pickupImage.assets.length > 0
	) {
		const asset = pickupImage.assets[0];

		if (allowedImageType.includes(asset.mimeType as AllowedImageType)) {
			return {
				uri: asset.uri,
				name: asset.fileName,
				type: asset.mimeType,
				size: asset.fileSize,
			};
		}
	}
	return null;
}
