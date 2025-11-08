/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure API calls work in production
  async rewrites() {
    return [];
  },
  // Ensure path aliases work in production builds
  webpack: (config) => {
    return config;
  },
}

module.exports = nextConfig

