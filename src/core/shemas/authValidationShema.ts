import { z } from "zod";

export const authValidationSchema = (
	validateEmail = true,
	validatePassword = true,
) =>
	z.object({
		email: validateEmail
			? z
					.string()
					.min(1, { message: "This field is required." })
					.email({ message: "Incorrect email syntax." })
			: z.string().min(1, { message: "This field is required." }).optional(),
		password: validatePassword
			? z
					.string()
					.min(1, { message: "This field is required." })
					.min(6, { message: "Password must be at least 6 characters." })
					.regex(/[A-Z]/, {
						message: "Password must contain at least one uppercase letter.",
					})
					.regex(/[a-z]/, {
						message: "Password must contain at least one lowercase letter.",
					})
					.regex(/[0-9]/, {
						message: "Password must contain at least one number.",
					})
					.regex(/[^a-zA-Z0-9]/, {
						message: "Password must contain at least one special character.",
					})
			: z.string().min(1, { message: "This field is required." }).optional(),
	});
