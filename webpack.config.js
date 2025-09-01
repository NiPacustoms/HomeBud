const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      fs: false,
      net: false,
      tls: false,
      undici: false,
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
      },
      // Zusätzliche Regel für undici-spezifische Dateien
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
