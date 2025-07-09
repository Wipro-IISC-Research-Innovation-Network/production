// next.config.js
const withTM = require('next-transpile-modules')(['react-speech-recognition']);

module.exports = withTM({
  webpack: (config, { isServer }) => {
    // Ensure regenerator-runtime is available
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Add regenerator-runtime to entry points
    const originalEntry = config.entry;
    config.entry = async () => {
      const entries = await originalEntry();
      if (entries['main.js'] && !entries['main.js'].includes('regenerator-runtime')) {
        entries['main.js'].unshift('regenerator-runtime/runtime');
      }
      return entries;
    };
    
    return config;
  },
  // Your existing Next.js config here
});
