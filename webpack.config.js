const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      fs: false,
      net: false,
      tls: false,
      undici: false,
    },
    alias: {
      'firebase/auth': false,
      '@firebase/auth': false,
      undici: false,
    },
  },
  module: {
    rules: [
      {
        test: /node_modules\/undici/,
        use: 'ignore-loader',
      },
    ],
  },
  externals: [
    {
      'undici': 'commonjs undici',
      '@firebase/auth': 'commonjs @firebase/auth',
      'firebase/auth': 'commonjs firebase/auth',
    },
  ],
};
