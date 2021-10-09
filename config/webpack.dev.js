const path = require('path');
const buildMode =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';

const webpack = require('webpack');
const baseConfig = require('./webpack.common.js');
const { merge } = require('webpack-merge');

const { cssLoaders } = require('./util');

// Configure Dev Server
const configureDevServer = () => {
  return {
    static: {
      directory: path.resolve(__dirname, '../sources'),
      publicPath: '/',
    },
    open: true,
    port: 3000,
    liveReload: true,
    hot: true,
  };
};

// Configure Css Loader
const configureCssLoader = () => {
  return {
    test: /\.(css|sass|scss)$/,
    use: ['style-loader', ...cssLoaders],
  };
};

module.exports = merge(baseConfig, {
  devtool: 'eval-source-map',
  mode: 'development',
  target: 'web',
  devServer: configureDevServer(),
  module: {
    rules: [configureCssLoader(buildMode)],
  },
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(false),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
});
