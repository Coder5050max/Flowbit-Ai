/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure API calls work in production
  async rewrites() {
    return [];
  },
  // Ensure path aliases work in production builds
  webpack: (config, { isServer }) => {
    // Fix for monorepo path resolution
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
  // TypeScript configuration
  typescript: {
    // Don't fail build on TypeScript errors during build (but still show them)
    ignoreBuildErrors: false,
  },
  // ESLint configuration
  eslint: {
    // Don't fail build on ESLint errors during build
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig

