import { isMobilePhone } from "validator";
import { z } from "zod";

export const forgotPasswordPhoneNumberSchema = z.object({
	phoneNumber: z
		.string()
		.max(64)
		.refine(
			(input) => {
				return isMobilePhone(input);
			},
			{
				error: "Phone Number is not valid",
			},
		),
});
