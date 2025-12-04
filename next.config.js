const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "frame-ancestors 'none'",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://uydatalim.uzedu.uz https://api.uydatalim.uzedu.uz",
    ].join('; '),
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
];

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
        port: '8000', // bo'sh qoldiring
      },
      {
        protocol: 'https',
        hostname: 'uydatalim.uzedu.uz',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '', // 8000 o'rniga bo'sh qoldiring
        pathname: '/uploads/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;



// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: false,
//   images: {
//     dangerouslyAllowSVG: true,
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'api.uydatalim.uzedu.uz', // barcha uploads ichidagi papkalarga ruxsat beradi
//       },
//       {
//         protocol: 'https',
//         hostname: 'media.graphassets.com',
//       },
//       {
//         protocol: 'http',
//         hostname: 'localhost', // portni alohida yozish shart emas
//         port: '8000', // bo'sh qoldiring
//       },
//       {
//         protocol: 'https',
//         hostname: 'uydatalim.uzedu.uz',
//       },
//       {
//         protocol: 'http',
//         hostname: 'localhost', 
//         port: '', // 8000 o'rniga bo'sh qoldiring
//         pathname: '/uploads/**',
//       },
//     ],
//   },
//   // ✅ SECURITY FIX: Clickjacking protection - barcha response'larga security headerlar qo'shish
//   async headers() {
//     return [
//       {
//         // Barcha route'larga security headerlar qo'shish
//         source: '/:path*',
//         headers: [
//           {
//             key: 'X-Frame-Options',
//             value: 'DENY',
//           },
//           {
//             key: 'Content-Security-Policy',
//             value: "frame-ancestors 'none'; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com; default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://uydatalim.uzedu.uz https://api.uydatalim.uzedu.uz;",
//           },
//           {
//             key: 'X-Content-Type-Options',
//             value: 'nosniff',
//           },
//           {
//             key: 'X-XSS-Protection',
//             value: '1; mode=block',
//           },
//           {
//             key: 'Referrer-Policy',
//             value: 'strict-origin-when-cross-origin',
//           },
//         ],
//       },
//     ];
//   },
// };

// module.exports = nextConfig;
