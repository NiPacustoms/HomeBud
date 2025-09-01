const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  experimental: {
    // Du hast das schon an – stelle sicher, dass 'undici' dabei ist
    serverComponentsExternalPackages: ['undici', '@firebase/auth'],
  },
  optimizeFonts: false,
  poweredByHeader: false,
  compress: true,
  generateEtags: false,
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'lh3.googleusercontent.com',
      'graph.facebook.com',
      'platform-lookaside.fbsbx.com',
    ],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  // wir wollen NICHT 'undici' transpilen; eher extern halten
  webpack: (config, { isServer }) => {
    if (isServer) {
      // verhindert, dass Webpack 'undici' überhaupt parst
      config.externals = Array.isArray(config.externals)
        ? [...config.externals, 'undici']
        : config.externals;
    } else {
      // im Client darf 'undici' gar nicht auftauchen
      config.resolve = config.resolve || {};
      config.resolve.alias = { ...(config.resolve.alias || {}), undici: false };
    }
    return config;
  },
};

module.exports = process.env.NODE_ENV === 'development' ? nextConfig : withPWA(nextConfig);
