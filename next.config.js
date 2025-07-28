/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disabled to prevent auth double-mounting issues
  poweredByHeader: false, // Remove X-Powered-By header for security

  // ESLint configuration for production builds
  eslint: {
    // Allow production builds to successfully complete even if project has ESLint errors
    ignoreDuringBuilds: true,
  },

  // TypeScript configuration
  typescript: {
    // Allow production builds to successfully complete even if project has type errors
    ignoreBuildErrors: true,
  },

  // Image optimization settings
  images: {
    domains: ['localhost', 'arsanexus.com', 'images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
  },

  // Environment-specific settings
  env: {
    CUSTOM_KEY: process.env.NODE_ENV,
  },

  // Compression settings
  compress: true,

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
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
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Add support for importing 3D model files
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/images',
          outputPath: 'static/images',
        },
      },
    });

    // Optimization for production
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all';
    }

    return config;
  },

  // Output settings
  trailingSlash: false,
};

module.exports = nextConfig;