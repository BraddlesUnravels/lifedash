/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable React 19 features
    reactCompiler: true,
  },
  // Optimize for SPA behavior
  output: 'standalone',
  trailingSlash: false,
  // Configure for monorepo
  transpilePackages: ['@app/shared'],
  outputFileTracingRoot: require('path').join(__dirname, '../../'),
};

module.exports = nextConfig;
