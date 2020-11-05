const buildMode =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';

const webpack = require('webpack');
const baseConfig = require('./webpack.base.js');
const { merge } = require('webpack-merge');

const { cssLoaders } = require('./util');

// Configure Dev Server
const configureDevServer = () => {
  return {
    contentBase: './sources',
    open: true,
    port: 3000,
    inline: true,
    stats: "errors-only",
    hot: true,
  };
};

// Configure Css Loader
const configureCssLoader = () => {
  return {
    test: /\.(css|sass|scss)$/,
    use: [
      'style-loader',
      ...cssLoaders
    ],
  };
};

module.exports = merge(baseConfig, {
  devtool: 'eval-source-map',
  mode: 'development',
  devServer: configureDevServer(),
  module: {
    rules: [configureCssLoader(buildMode)],
  },
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(false),
    }),
  ],
});
