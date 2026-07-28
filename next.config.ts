import type { NextConfig } from 'next'

import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
	experimental: {
		globalNotFound: true,
		serverActions: {
			allowedOrigins: ['codeguy.cz', 'localhost:3000'],
			bodySizeLimit: '2mb',
		},
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'codeguy.cz',
				port: '',
				pathname: '/**',
			},
		],
		formats: ['image/avif', 'image/webp'],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
	},
	output: 'standalone',
	outputFileTracingIncludes: {
		'/*': [
			'./node_modules/sharp/**/*',
			'./node_modules/@img/sharp-linux-x64/**/*',
			'./node_modules/@img/sharp-libvips-linux-x64/**/*',
		],
	},
	webpack: (config) => {
		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack'],
		})

		return config
	},
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{ key: 'X-Frame-Options', value: 'DENY' },
					{ key: 'X-Content-Type-Options', value: 'nosniff' },
					{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
					{ key: 'X-DNS-Prefetch-Control', value: 'on' },
					{
						key: 'Strict-Transport-Security',
						value: 'max-age=31536000; includeSubDomains; preload',
					},
					{
						key: 'Permissions-Policy',
						value:
							'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
					},
					{
						key: 'Content-Security-Policy',
						value: [
							"default-src 'self'",
							"script-src 'self' 'unsafe-inline' 'unsafe-eval'",
							"style-src 'self' 'unsafe-inline'",
							"img-src 'self' blob: data: https:",
							"font-src 'self' data:",
							"connect-src 'self' https://calendar.google.com",
							"frame-src 'self' https://calendar.google.com",
							"base-uri 'self'",
							"form-action 'self'",
							"frame-ancestors 'none'",
							'upgrade-insecure-requests',
						].join('; '),
					},
				],
			},
		]
	},
	async redirects() {
		return [
			{
				source: '/:path*',
				has: [
					{
						type: 'host',
						value: 'www.codeguy.cz',
					},
				],
				destination: 'https://codeguy.cz/:path*',
				permanent: true,
			},
			{
				source: '/en',
				destination: '/',
				permanent: false,
			},
			{
				source: '/en/:path*',
				destination: '/:path*',
				permanent: false,
			},
			{
				source: '/cs/insights/:slug',
				destination: '/insights/:slug',
				permanent: false,
			},
		]
	},
	async rewrites() {
		return {
			beforeFiles: [
				{ source: '/', destination: '/en' },
				{ source: '/work', destination: '/en/work' },
				{ source: '/experience', destination: '/en/experience' },
				{ source: '/about', destination: '/en/about' },
				{ source: '/contact', destination: '/en/contact' },
				{ source: '/insights', destination: '/en/insights' },
				{ source: '/curriculum-vitae', destination: '/en/curriculum-vitae' },
			],
		}
	},
}

export default withPayload(withNextIntl(nextConfig))
