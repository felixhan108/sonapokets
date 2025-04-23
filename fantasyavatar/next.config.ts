import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  // 프로덕션 환경에서는 절대 경로로 설정
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://sonapokets.day/fantasyavatar' : '',
};

export default nextConfig;
