import { z } from 'zod'

/**
 * Schema for server-side environment variables.
 * Validates all required env vars at application startup.
 * If any required variable is missing, the app will fail fast with a clear error message.
 */
export const serverEnvSchema = z.object({
	PAYLOAD_SECRET: z.string().min(32, { error: 'PAYLOAD_SECRET must be at least 32 characters' }),
	DATABASE_URI: z.string().min(1, { error: 'DATABASE_URI is required' }),
	PAYLOAD_CONFIG_PATH: z.string().optional(),
	NODE_ENV: z.enum(['development', 'production', 'test']).optional().default('development'),
})

/**
 * Schema for public (client-safe) environment variables.
 * These are exposed to the browser via NEXT_PUBLIC_ prefix.
 */
export const publicEnvSchema = z.object({
	NEXT_PUBLIC_SERVER_URL: z.string().min(1, { error: 'NEXT_PUBLIC_SERVER_URL is required' }),
})

/**
 * Validates environment variables against a Zod schema.
 * Returns the parsed data or throws a descriptive error.
 */
export function validateEnv<T extends z.ZodObject<z.ZodRawShape>>(
	schema: T,
	env: Record<string, unknown>,
	label: string,
): z.infer<T> {
	const result = schema.safeParse(env)

	if (!result.success) {
		const formatted = result.error.issues
			.map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
			.join('\n')

		throw new Error(
			`\n❌ Invalid ${label} environment variables:\n${formatted}\n\nCheck your .env file or environment configuration.\n`,
		)
	}

	return result.data
}

/**
 * Validated server-side environment variables.
 * Throws a descriptive error at import time if validation fails.
 */
export const serverEnv = validateEnv(serverEnvSchema, process.env, 'server')

/**
 * Validated public environment variables.
 * Throws a descriptive error at import time if validation fails.
 */
export const publicEnv = validateEnv(publicEnvSchema, process.env, 'public')
