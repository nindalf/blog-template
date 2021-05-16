module.exports = {
  trailingSlash: true,
  future: {
    webpack5: true,
  },
  webpack: (config, options) => {
    config.experiments = {
      topLevelAwait: true,
    };
    return config;
  },
}