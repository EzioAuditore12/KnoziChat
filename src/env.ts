import Constants from "expo-constants";
import { z } from "zod";
const envSchema = z.object({
	EXPO_PUBLIC_BACKEND_API_URL: z.url(),
});

/**
 * TODO: Need to change into expo constants when building
 */
// const env = envSchema.parse(Constants.expoConfig?.extra);

const env = envSchema.parse(process.env);
export default env;
