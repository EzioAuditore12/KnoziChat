import { isMobilePhone, isStrongPassword } from "validator";
import { z } from "zod";

export const registerUserValidations = z
	.object({
		firstName: z.string().min(1, { message: "First name is required" }).max(50),
		lastName: z.string().min(1, { message: "Last name is required" }).max(50),
		phoneNumber: z.string().refine(
			(input) => {
				return isMobilePhone(input);
			},
			{
				error: "Phone number is not valid",
			},
		),
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
		profilePicture: z.object({
			uri: z.string(),
			type: z.enum(["image/png", "image/jpeg", "image/jpg"]),
			name: z.string(),
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type registerUserInputs = z.infer<typeof registerUserValidations>;
