// babel.config.js
module.exports = {
  presets: [
    ['next/babel', {
      'preset-env': {
        targets: {
          node: '10.19.0'
        },
        useBuiltIns: 'usage',
        corejs: 3
      }
    }]
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      helpers: true,
      regenerator: true,
      useESModules: false
    }]
  ]
};
