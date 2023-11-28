/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env.API_URL,
  },
  future: {
    webpack5: true,
  },
  webpack: (config, { dev, isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
  experimental: { esmExternals: true },
};

module.exports = nextConfig;
