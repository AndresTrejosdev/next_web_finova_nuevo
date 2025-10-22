/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_PANEL_URL: process.env.NEXT_PUBLIC_PANEL_URL,
    NEXT_PUBLIC_PAYVALIDA_API: process.env.NEXT_PUBLIC_PAYVALIDA_API,
    NEXT_PUBLIC_GOPAGOS_API: process.env.NEXT_PUBLIC_GOPAGOS_API,
    NEXT_PUBLIC_RETURN_URL: process.env.NEXT_PUBLIC_RETURN_URL,
    NEXT_PUBLIC_CANCEL_URL: process.env.NEXT_PUBLIC_CANCEL_URL,
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [360, 414, 768, 1024, 1920],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'finova.com.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'server.finova.com.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;