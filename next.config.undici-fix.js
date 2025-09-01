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
    serverComponentsExternalPackages: ['@prisma/client'],
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
  webpack: (config, { isServer }) => {
    // Firebase App Hosting kompatible Webpack-Konfiguration
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        os: false,
        path: false,
        querystring: false,
        buffer: false,
        util: false,
        assert: false,
        constants: false,
        domain: false,
        events: false,
        punycode: false,
        string_decoder: false,
        sys: false,
        timers: false,
        tty: false,
        vm: false,
      };
    }
   
    // Komplette undici-Ausschließung
    config.resolve.alias = {
      ...config.resolve.alias,
      'undici': false,
      '@firebase/auth': false,
      'firebase/auth': false,
    };
   
    // Externe Pakete für Server Components
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push({
        'undici': 'commonjs undici',
        '@firebase/auth': 'commonjs @firebase/auth',
        'firebase/auth': 'commonjs firebase/auth'
      });
    }
   
    // Ignoriere undici-Module komplett
    config.module.rules.push({
      test: /node_modules\/undici/,
      use: 'ignore-loader'
    });
    
    // Behandle moderne JavaScript-Syntax in node_modules mit verbesserter Babel-Konfiguration
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules/,
      exclude: /node_modules\/undici/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', {
              targets: {
                node: '18'
              },
              modules: false
            }]
          ],
          plugins: [
            '@babel/plugin-transform-private-methods',
            '@babel/plugin-transform-class-properties',
            '@babel/plugin-transform-private-property-in-object',
            '@babel/plugin-transform-class-static-block'
          ]
        }
      }
    });

    // Zusätzliche Regel für undici-spezifische Dateien
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/undici/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', {
              targets: {
                node: '18'
              },
              modules: 'commonjs'
            }]
          ],
          plugins: [
            '@babel/plugin-transform-private-methods',
            '@babel/plugin-transform-class-properties',
            '@babel/plugin-transform-private-property-in-object',
            '@babel/plugin-transform-class-static-block',
            '@babel/plugin-transform-optional-chaining',
            '@babel/plugin-transform-nullish-coalescing-operator'
          ]
        }
      }
    });
   
    return config;
  },
};

module.exports = withPWA(nextConfig);
