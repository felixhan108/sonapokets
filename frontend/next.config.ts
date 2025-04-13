import type { NextConfig } from 'next';
import packageJson from './package.json';

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
  images: {
    domains: ['sonapokets.day', 'localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:2342/admin/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
