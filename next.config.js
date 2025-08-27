/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.uydatalim.uzedu.uz',
        port: '8000',
        pathname: '/uploads/**', // bu barcha uploads ichidagi papkalarga ruxsat beradi
      },
      {
        protocol: 'https',
        hostname: 'media.graphassets.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost:3000',
      },
      {
        protocol: 'https',
        hostname: 'uydatalim.uzedu.uz',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
    ],
  },
};

module.exports = nextConfig;
