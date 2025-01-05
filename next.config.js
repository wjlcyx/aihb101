const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@authing/guard-react18'],
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'zebo-c.oss-cn-hangzhou.aliyuncs.com',
      },
      {
        protocol: 'https',
        hostname: 'zebo-c.oss-cn-hangzhou.aliyuncs.com',
      },
      {
        protocol: 'https',
        hostname: 'files.authing.co',
      },
      // 如果还有其他域名，按照同样的格式添加
    ],
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "coffee-script": false,
      "vm2": false
    };
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './'),
    }
    return config;
  },
}

module.exports = nextConfig 