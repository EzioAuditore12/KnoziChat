import { ImagePickerExample } from "@/components/form/upload-image";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

export default function RegisterMainScreen(){
    return(
        <View className="flex-1 justify-center items-center">
            <Text>Hello registeration</Text>
            <ImagePickerExample/>
        </View>
    )
}