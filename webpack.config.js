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
      {
        test: /\.js$/,
        include: /node_modules\/undici/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  node: '18'
                }
              }]
            ],
            plugins: [
              '@babel/plugin-transform-private-methods',
              '@babel/plugin-transform-class-properties',
              '@babel/plugin-transform-private-property-in-object'
            ]
          }
        }
      }
    ],
  },
  externals: [
    {
      'undici': 'commonjs undici',
      '@firebase/auth': 'commonjs @firebase/auth',
      'firebase/auth': 'commonjs firebase/auth',
    },
  ],
  experiments: {
    topLevelAwait: true
  }
};
