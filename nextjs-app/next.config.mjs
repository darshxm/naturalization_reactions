/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ignore leaflet warnings in build
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },
};

export default nextConfig;
