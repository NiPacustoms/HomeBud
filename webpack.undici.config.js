// Spezielle Webpack-Konfiguration für undici-Kompatibilität
module.exports = {
  module: {
    rules: [
      // Spezielle Behandlung für undici-Module
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
    ]
  }
};
