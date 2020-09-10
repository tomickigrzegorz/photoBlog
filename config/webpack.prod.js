// production builds
const buildMode =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';
const IMAGE_FOLDER = './dist/images/';

// node modules
const fs = require('fs');
const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');

// webpack plugins
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// config files
const baseConfig = require('./webpack.base.js');

const checkFolder = folder => {
  try {
    if (fs.existsSync(folder)) {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
};

// Configure Terser
const configureTerser = () => {
  return {
    cache: true,
    parallel: true,
    sourceMap: true,
  };
};

// Configure Optimization
const configureOptimization = () => {
  return {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
          enforce: true,
        },
        styles: {
          name: 'styles',
          test: /\.s?css$/,
          chunks: 'all',
          minChunks: 2,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    },
    minimizer: [new TerserPlugin(configureTerser())],
  };
};

// Configure Clean Webpack
const configureCleanWebpack = () => {
  return {
    dry: false,
    verbose: false,
  };
};

// Configure Mini Css Extract
const configureMiniCssExtract = () => {
  return {
    filename: 'vendor/css/[name].[hash].css',
    chunkFilename: 'vendor/css/[name].[hash].css',
  };
};

// configure SW
const configureSW = () => {
  return {
    clientsClaim: true,
    skipWaiting: true,
    directoryIndex: 'index.html',
    offlineGoogleAnalytics: true,
    exclude: ['images']
  }
}

// Configure Copy Webpack
const configureCopyWebpack = () => {
  // const images = { from: 'sources/images/', to: 'images/' };
  // const check = checkFolder(IMAGE_FOLDER);

  const config = {
    patterns: [
      { from: 'sources/assets/', to: 'assets/' },
      { from: 'sources/assets/favicon.ico', to: './' }
    ]
  }
  // return check ? config : { patterns: [...config.patterns, images] };
  return config;
};

// Configure Bundle Analyzer
const configureBundleAnalyzer = () => {
  return {
    openAnalyzer: true,
    generateStatsFile: true,
  };
};

// Configure Css Loader
const configureCssLoader = () => {
  return {
    test: /\.(css|sass|scss)$/,
    use: [
      MiniCssExtractPlugin.loader,
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
            config: path.resolve(__dirname, './postcss.config.js'),
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
          resources: [
            './sources/scss/modules/_config.scss',
            './sources/scss/modules/_mixins.scss',
          ],
        },
      },
    ],
  };
};

module.exports = merge(baseConfig, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: chunkData => {
      return chunkData.chunk.name === 'index'
        ? 'vendor/js/index.[hash].js'
        : 'vendor/js/article.[hash].js';
    },
    chunkFilename: 'vendor/js/[name].[hash].js',
  },
  optimization: configureOptimization(),
  module: {
    rules: [configureCssLoader(buildMode)],
  },
  plugins: [
    new CleanWebpackPlugin(
      configureCleanWebpack()
    ),
    new MiniCssExtractPlugin(
      configureMiniCssExtract()
    ),
    new WorkboxPlugin.GenerateSW(
      configureSW()
    ),
    new CopyWebpackPlugin(
      configureCopyWebpack()
    ),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
    }),
    new BundleAnalyzerPlugin(
      configureBundleAnalyzer()
    ),
  ],
});
