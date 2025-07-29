import { iconWithClassName } from "@/lib/icons/iconWithClassName";
import { cn } from "@/lib/utils";
import * as ImagePicker from "expo-image-picker";
import { Pencil } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, Pressable, type PressableProps } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Text } from "../ui/text";

iconWithClassName(Pencil);

export type UploadFieldProps = PressableProps;

const pickImage = async () => {
	const result = await ImagePicker.launchImageLibraryAsync({
		mediaTypes: ["images"],
		allowsEditing: true,
		aspect: [4, 3],
		quality: 1,
		selectionLimit: 1,
	});
	return result;
};

const maxFileSize = 10 * 1024 * 1024;

export function UploadAvatar({
	className,
	value,
	onChange,
	...props
}: UploadFieldProps & { value?: string; onChange?: (val: string) => void }) {
	const [image, setImage] = useState<string | undefined>(value);

	const handlePickImage = async () => {
		const result = await pickImage();
		if (result.assets && result.assets.length > 0) {
			const asset = result.assets[0];
			if (typeof asset.fileSize === "number" && asset.fileSize < maxFileSize) {
				setImage(asset.uri);
				onChange?.(asset.uri); // update form value
			} else if (typeof asset.fileSize === "number") {
				Alert.alert(
					"Image too large",
					"Please select an image smaller than 10MB.",
				);
			} else {
				Alert.alert(
					"File size unknown",
					"Unable to determine the file size of the selected image.",
				);
			}
		}
	};

	// Sync local state with form value
	useEffect(() => {
		setImage(value);
	}, [value]);

	return (
		<Pressable
			onPress={handlePickImage}
			className={cn("overflow-visible relative", className)}
			{...props}
		>
			<Avatar alt="Upload Field" className="h-32 w-32 elevation-md">
				<AvatarImage source={{ uri: image }} />
				<AvatarFallback>
					<Text>RS</Text>
				</AvatarFallback>
			</Avatar>
			<Pencil
				size={30}
				className="absolute z-20 bottom-0 right-0 rounded-full"
				color={"black"}
			/>
		</Pressable>
	);
}
