import type { NextConfig } from 'next'

import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

import { buildSecurityHeaders } from './src/lib/security/headers'

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
				headers: buildSecurityHeaders({ publicServerUrl: process.env.NEXT_PUBLIC_SERVER_URL }),
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
				{ source: '/contact/book', destination: '/en/contact/book' },
				{ source: '/insights', destination: '/en/insights' },
				{ source: '/curriculum-vitae', destination: '/en/curriculum-vitae' },
			],
		}
	},
}

export default withPayload(withNextIntl(nextConfig))
