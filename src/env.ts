import { z } from "zod";

const envSchema = z.object({
  EXPO_PUBLIC_BACKEND_API_URL: z.url(),
});

const env = envSchema.parse(process.env);

export default env;