import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * We must set valid env vars BEFORE importing the module because
 * the module eagerly validates process.env at import time.
 * We use vi.resetModules() + dynamic import to get fresh module state.
 */

const validEnv = {
	PAYLOAD_SECRET: 'a'.repeat(32),
	DATABASE_URI: 'postgres://localhost:5432/test',
	NEXT_PUBLIC_SERVER_URL: 'http://localhost:3000',
}

let originalEnv: NodeJS.ProcessEnv

beforeEach(() => {
	originalEnv = { ...process.env }
	vi.resetModules()
})

afterEach(() => {
	process.env = originalEnv
})

async function importEnvModule() {
	return import('@/lib/env')
}

describe('validateEnv', () => {
	it('returns parsed data when all required vars are valid', async () => {
		Object.assign(process.env, validEnv)
		const { serverEnvSchema, validateEnv } = await importEnvModule()

		const result = validateEnv(serverEnvSchema, validEnv, 'server')

		expect(result.PAYLOAD_SECRET).toBe('a'.repeat(32))
		expect(result.DATABASE_URI).toBe('postgres://localhost:5432/test')
		expect(result.NODE_ENV).toBe('development')
	})

	it('throws when required variables are missing', async () => {
		Object.assign(process.env, validEnv)
		const { serverEnvSchema, validateEnv } = await importEnvModule()

		expect(() => validateEnv(serverEnvSchema, {}, 'server')).toThrow(
			'Invalid server environment variables',
		)
	})

	it('throws when PAYLOAD_SECRET is too short', async () => {
		Object.assign(process.env, validEnv)
		const { serverEnvSchema, validateEnv } = await importEnvModule()

		const env = {
			PAYLOAD_SECRET: 'short',
			DATABASE_URI: 'postgres://localhost:5432/test',
		}

		expect(() => validateEnv(serverEnvSchema, env, 'server')).toThrow(
			'Invalid server environment variables',
		)
	})

	it('throws when DATABASE_URI is empty', async () => {
		Object.assign(process.env, validEnv)
		const { serverEnvSchema, validateEnv } = await importEnvModule()

		const env = {
			PAYLOAD_SECRET: 'a'.repeat(32),
			DATABASE_URI: '',
		}

		expect(() => validateEnv(serverEnvSchema, env, 'server')).toThrow(
			'Invalid server environment variables',
		)
	})

	it('defaults NODE_ENV to development when not provided', async () => {
		Object.assign(process.env, validEnv)
		const { serverEnvSchema, validateEnv } = await importEnvModule()

		const env = {
			PAYLOAD_SECRET: 'a'.repeat(32),
			DATABASE_URI: 'postgres://localhost:5432/test',
		}

		const result = validateEnv(serverEnvSchema, env, 'server')
		expect(result.NODE_ENV).toBe('development')
	})

	it('accepts valid NODE_ENV values', async () => {
		Object.assign(process.env, validEnv)
		const { serverEnvSchema, validateEnv } = await importEnvModule()

		for (const nodeEnv of ['development', 'production', 'test'] as const) {
			const env = {
				PAYLOAD_SECRET: 'a'.repeat(32),
				DATABASE_URI: 'postgres://localhost:5432/test',
				NODE_ENV: nodeEnv,
			}

			const result = validateEnv(serverEnvSchema, env, 'server')
			expect(result.NODE_ENV).toBe(nodeEnv)
		}
	})

	it('rejects invalid NODE_ENV values', async () => {
		Object.assign(process.env, validEnv)
		const { serverEnvSchema, validateEnv } = await importEnvModule()

		const env = {
			PAYLOAD_SECRET: 'a'.repeat(32),
			DATABASE_URI: 'postgres://localhost:5432/test',
			NODE_ENV: 'staging',
		}

		expect(() => validateEnv(serverEnvSchema, env, 'server')).toThrow(
			'Invalid server environment variables',
		)
	})

	it('includes the label in the error message', async () => {
		Object.assign(process.env, validEnv)
		const { publicEnvSchema, validateEnv } = await importEnvModule()

		expect(() => validateEnv(publicEnvSchema, {}, 'public')).toThrow(
			'Invalid public environment variables',
		)
	})
})

describe('publicEnvSchema', () => {
	it('validates valid public env', async () => {
		Object.assign(process.env, validEnv)
		const { publicEnvSchema, validateEnv } = await importEnvModule()

		const env = { NEXT_PUBLIC_SERVER_URL: 'https://codeguy.cz' }
		const result = validateEnv(publicEnvSchema, env, 'public')

		expect(result.NEXT_PUBLIC_SERVER_URL).toBe('https://codeguy.cz')
	})

	it('throws when NEXT_PUBLIC_SERVER_URL is missing', async () => {
		Object.assign(process.env, validEnv)
		const { publicEnvSchema, validateEnv } = await importEnvModule()

		expect(() => validateEnv(publicEnvSchema, {}, 'public')).toThrow(
			'Invalid public environment variables',
		)
	})

	it('throws when NEXT_PUBLIC_SERVER_URL is empty', async () => {
		Object.assign(process.env, validEnv)
		const { publicEnvSchema, validateEnv } = await importEnvModule()

		expect(() => validateEnv(publicEnvSchema, { NEXT_PUBLIC_SERVER_URL: '' }, 'public')).toThrow(
			'Invalid public environment variables',
		)
	})
})
