/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['undici', '@firebase/auth'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = Array.isArray(config.externals)
        ? [...config.externals, 'undici']
        : config.externals;
    } else {
      config.resolve = config.resolve || {};
      config.resolve.alias = { ...(config.resolve.alias || {}), undici: false };
    }
    return config;
  },
};
export default nextConfig;