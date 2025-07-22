import { isStrongPassword } from "validator";
import { z } from "zod";

export const loginUserValidations = z.object({
	email: z
		.email({ message: "Enter a valid email address" })
		.max(254, { message: "Email too long" })
		.nonempty({ message: "Email is required" }),
	password: z
		.string()
		.min(1, { message: "Password is required" })
		.max(64, { message: "Password too long" })
		.refine(
			(input) =>
				isStrongPassword(input, {
					minLength: 8,
					minLowercase: 1,
					minUppercase: 1,
					minNumbers: 1,
					minSymbols: 1,
				}),
			{
				message:
					"Password must be strong (8+ chars, upper, lower, number, symbol)",
			},
		),
});

export type loginUserInputs = z.infer<typeof loginUserValidations>;
