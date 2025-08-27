/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.uydatalim.uzedu.uz', // barcha uploads ichidagi papkalarga ruxsat beradi
      },
      {
        protocol: 'https',
        hostname: 'media.graphassets.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost', // portni alohida yozish shart emas
        port: '', // bo'sh qoldiring
      },
      {
        protocol: 'https',
        hostname: 'uydatalim.uzedu.uz',
      },
      {
        protocol: 'http',
        hostname: 'localhost', 
        port: '', // 8000 o‘rniga bo‘sh qoldiring
        pathname: '/uploads/**',
      },
    ],
  },
};

module.exports = nextConfig;
