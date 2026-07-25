import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./src/__tests__/setup.ts'],
		// The editorial/security suites under src/lib use Node's native runner.
		// Keep Vitest scoped to its own test tree so the runners do not overlap.
		include: ['src/__tests__/**/*.{test,spec}.{ts,tsx}'],
		exclude: ['node_modules', '.next', 'src/__tests__/e2e/**'],
		css: {
			modules: {
				classNameStrategy: 'non-scoped',
			},
		},
		coverage: {
			provider: 'v8',
			include: ['src/**/*.{ts,tsx}'],
			exclude: [
				'src/payload-types.ts',
				'src/payload.config.ts',
				'src/__tests__/**',
				'src/app/(payload)/**',
			],
		},
	},
})
