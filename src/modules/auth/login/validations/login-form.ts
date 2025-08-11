import { isMobilePhone } from "validator";
import { z } from "zod";

export const loginUserValidations = z.object({
	phoneNumber: z.string().refine(
		(input) => {
			return isMobilePhone(input);
		},
		{
			error: "Given input is not a phone number",
		},
	),
	password: z
		.string()
		.min(1, { error: "Password is required" })
		.max(64, { error: "Password too long" }),
});

export type loginUserInputs = z.infer<typeof loginUserValidations>;
