const path = require('path');

module.exports.cssLoaders = [
  {
    loader: 'css-loader',
    options: {
      importLoaders: 2,
      sourceMap: true,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      sourceMap: true,
      postcssOptions: {
        config: path.resolve(__dirname, 'postcss.config.js'),
      },
    },
  },
  {
    loader: 'sass-loader',
    options: {
      sourceMap: true,
      webpackImporter: true
    },
  },
  {
    loader: 'sass-resources-loader',
    options: {
      resources: './sources/scss/modules/_config.scss',
    },
  }
];