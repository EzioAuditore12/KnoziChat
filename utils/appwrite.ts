import { Client, Databases } from "react-native-appwrite";

if (
	!process.env.EXPO_PUBLIC_APPWRITE_APP_ID ||
	!process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID
) {
	throw new Error("EXPO_PUBLIC_APPWRTIE_APP_ID is not set");
}

const appwriteConfig = {
	endpoint: "https://cloud.appwrite.io/v1",
	projectId: process.env.EXPO_PUBLIC_APPWRITE_APP_ID,
	platform: "com.dakshpurohit.KnoziChat",
	db: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
	col: {
		chatrooms: process.env.EXPO_PUBLIC_APPWRITE_CHATROOMS_ID,
		messages: process.env.EXPO_PUBLIC_APPWRITE_MESSAGES_ID,
	},
};

const client = new Client()
	.setEndpoint(appwriteConfig.endpoint)
	.setProject(appwriteConfig.projectId)
	.setPlatform(appwriteConfig.platform);

const db = new Databases(client);

export { db, appwriteConfig, client };
