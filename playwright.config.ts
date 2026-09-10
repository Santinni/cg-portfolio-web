import { defineConfig, devices } from '@playwright/test'

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000'

/**
 * Specs that assert Figma-measured pixels (`toBeCloseTo`, `expectPx`, rect values) or pixel
 * baselines (`toHaveScreenshot`). Their numbers are Chromium-on-Linux text-wrapping facts
 * (see the compose.e2e.yaml header), so they run only on the chromium project.
 */
const PARITY_SPECS = [
	'home-cta-parity',
	'home-flagship-parity',
	'home-integrated-parity',
	'home-selected-work-parity',
	'home-principles-parity',
	'home-hero-anchoring',
	'home-experience-anchoring',
	'home-final-cta-anchoring',
	'home-section-tone-parity',
	'work-insights-hero-parity',
	'navigation-geometry',
	'curriculum-vitae-visual',
].map((name) => `**/${name}.spec.ts`)

export default defineConfig({
	testDir: './src/__tests__/e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'html',
	use: {
		baseURL,
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] },
			testIgnore: PARITY_SPECS,
		},
		{
			name: 'webkit',
			use: { ...devices['Desktop Safari'] },
			testIgnore: PARITY_SPECS,
		},
		{
			name: 'mobile-chrome',
			use: { ...devices['Pixel 5'] },
			testIgnore: PARITY_SPECS,
		},
	],
	webServer:
		process.env.PLAYWRIGHT_EXTERNAL_SERVER === 'true'
			? undefined
			: {
					command: process.env.CI ? 'node .next/standalone/server.js' : 'pnpm dev',
					url: baseURL,
					reuseExistingServer: !process.env.CI,
					timeout: 120_000,
				},
})
