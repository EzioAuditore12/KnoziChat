import { isStrongPassword } from "validator";
import { z } from "zod";

export const changePasswordSchema = z
	.object({
		newPassword: z
			.string()
			.max(64)
			.refine(
				(input) => {
					return isStrongPassword(input, {
						minLength: 8,
						minLowercase: 1,
						minNumbers: 1,
						minSymbols: 1,
					});
				},
				{
					error:
						"Password must be at least 8 characters and include a lowercase letter, number, and symbol.",
				},
			),
		confirmNewPassword: z
			.string()
			.min(1, { message: "Confirm password is required" }),
	})
	.refine((input) => input.newPassword === input.confirmNewPassword, {
		error: "Passwords do not match",
		path: ["confirmNewPassword"],
	});
