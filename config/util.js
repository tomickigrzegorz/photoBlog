const path = require('path');

module.exports.cssLoaders = [
  {
    loader: 'css-loader',
    options: {
      importLoaders: 2,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        config: path.resolve(__dirname, 'postcss.config.js'),
      },
    },
  },
  {
    loader: 'sass-loader',
    options: {
      webpackImporter: true,
      additionalData: `
        @import "sources/scss/modules/_config.scss";
      `,
    },
  },
];
