import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'yplnnnprjmoxllbzileb.supabase.co',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  /* config options here */
};

export default nextConfig;
