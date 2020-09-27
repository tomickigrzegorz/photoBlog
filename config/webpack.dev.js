const path = require('path');
const buildMode =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';

const webpack = require('webpack');
const baseConfig = require('./webpack.base.js');
const { merge } = require('webpack-merge');

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
      },
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
