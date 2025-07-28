/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  compress: true,
  poweredByHeader: false,

  // Performance optimizations
  swcMinify: true,
  experimental: {
    optimizeCss: true,
  },

  // Image optimization
  images: {
    domains: ['localhost', 'arsanexus.com', '82.180.132.240'],
    formats: ['image/webp', 'image/avif'],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/admin/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },

  // Redirects for admin routes
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/login',
        permanent: false,
      },
    ];
  },

  // Environment variables
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'https://arsanexus.com',
  },
};

export default nextConfig;
