import type { NextConfig } from 'next';

import { withPayload } from '@payloadcms/next/withPayload';

const nextConfig: NextConfig = {
  // Server components are enabled
  experimental: {
    serverActions: {
      allowedOrigins: ['codeguy.cz', 'localhost:3000'],
      bodySizeLimit: '2mb'
    },
  },

  // Image optimization
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

  // Setting output
  output: 'standalone',

  // Webpack configuration for Payload
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },

  // Redirects for www
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
    ];
  },
};

export default withPayload(nextConfig);
