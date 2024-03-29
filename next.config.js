/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env.API_URL,
    API_URL_PRODUCTION: process.env.API_URL_PRODUCTION,
  },
  webpack: (config, { dev, isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
  experimental: { esmExternals: true },
  swcMinify: false,
};

module.exports = nextConfig;
