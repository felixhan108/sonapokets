import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
