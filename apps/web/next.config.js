/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure API calls work in production
  async rewrites() {
    return [];
  },
}

module.exports = nextConfig

