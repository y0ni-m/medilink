/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Old onboarding page — content now lives on Resources.
      { source: '/onboarding', destination: '/resources#onboarding', permanent: true },
    ];
  },
};

module.exports = nextConfig;
