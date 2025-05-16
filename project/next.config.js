/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    webpackBuildWorker: true,
  },
  images: { 
    domains: ['images.unsplash.com'],
    unoptimized: true 
  }
};

module.exports = nextConfig;