// next.config.ts - FIXED CONFIG
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Remove experimental.optimizeCss to fix critters error
};

export default nextConfig;