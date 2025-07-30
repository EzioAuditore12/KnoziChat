import { Image } from "@/components/ui/image";
import { getLocalAssets } from "@/hooks/handle-pickup-local-assets";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";

const selectedImages=[
    require("@/modules/auth/register/assets/profile-photos/image1.png"),
    require("@/modules/auth/register/assets/profile-photos/image2.png"),
    require("@/modules/auth/register/assets/profile-photos/image3.png"),
    require("@/modules/auth/register/assets/profile-photos/image4.png"),
    require("@/modules/auth/register/assets/profile-photos/image5.png"),
    require("@/modules/auth/register/assets/profile-photos/image6.png"),
]

function retreiveLocalAssets(){
    const assets=getLocalAssets({Assets:selectedImages})
    console.log(assets)
}


export default function RegisterMainScreen() {
	


	return (
		<View className="flex-1 justify-center items-center">
			
		<Button>
            <Text>Load Local Assets</Text>
        </Button>
		</View>
	);
}
