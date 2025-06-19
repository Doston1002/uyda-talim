/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '213.230.99.101',
        port: '2246',
        pathname: '/uploads/**', // bu barcha uploads ichidagi papkalarga ruxsat beradi
      },
      {
        protocol: 'https',
        hostname: 'media.graphassets.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'uyda-talim.uz',
      },
      {
        protocol: 'https',
        hostname: 'api.uyda-talim.uz',
      },
    ],
  },
};

module.exports = nextConfig;
