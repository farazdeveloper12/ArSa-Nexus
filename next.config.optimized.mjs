/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  compress: true,
  swcMinify: true,

  // Image optimization
  images: {
    domains: ['arsanexus.com', '82.180.132.240'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // Performance optimizations
  experimental: {
    optimizeCss: true,
  },

  // Webpack optimizations
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      // Optimize client-side bundle
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }

    // Fix build issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    return config;
  },

  // Headers for better caching
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=600',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
    ];
  },

  // Redirects for better SEO
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true,
      },
    ];
  },

  // Environment variables
  env: {
    CUSTOM_KEY: 'my-value',
  },

  // Output configuration for production
  output: 'standalone',

  // Disable x-powered-by header
  poweredByHeader: false,

  // Enable React strict mode
  reactStrictMode: true,
};

export default nextConfig; 