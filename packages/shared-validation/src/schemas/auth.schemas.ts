import { z } from "zod";

/**
 * Password validation schema
 * Requirements:
 * - Minimum 6 characters
 * - At least one lowercase letter
 * - At least one uppercase letter
 * - At least one digit
 * - At least one special character/symbol
 */
export const passwordSchema = z
	.string()
	.min(6, "Password must be at least 6 characters")
	.regex(/[a-z]/, "Password must contain at least one lowercase letter")
	.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
	.regex(/[0-9]/, "Password must contain at least one digit")
	.regex(
		/[^a-zA-Z0-9]/,
		"Password must contain at least one special character",
	);

/**
 * Email validation schema
 */
export const emailSchema = z.string().email("Invalid email address");

/**
 * Signup schema
 * Used for user registration
 */
export const signupSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
});

/**
 * Login schema
 * Used for user authentication
 */
export const loginSchema = z.object({
	email: emailSchema,
	password: z.string().min(1, "Password is required"),
});

/**
 * Type exports for TypeScript
 */
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
