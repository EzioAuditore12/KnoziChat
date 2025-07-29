import { isStrongPassword } from "validator";
import { z } from "zod";

export const registerUserValidations = z
	.object({
		firstName: z.string().min(1, { message: "First name is required" }).max(50),
		lastName: z.string().min(1, { message: "Last name is required" }).max(50),
		email: z
			.email({ message: "Enter a valid email address" })
			.min(1, { message: "Email is required" })
			.max(254, { message: "Email too long" }),
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
		confirmPassword: z
			.string()
			.min(1, { message: "Confirm password is required" }),
		profilePicture: z.string().optional(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type registerUserInputs = z.infer<typeof registerUserValidations>;
