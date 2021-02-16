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
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// config files
const baseConfig = require('./webpack.common.js');

const { cssLoaders } = require('./util');
const copyWebpackPlugin = require('copy-webpack-plugin');

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
    terserOptions: {
      sourceMap: true
    }
  };
};

// Configure Optimization
const configureOptimization = () => {
  return {
    minimize: true,
    minimizer: [new TerserPlugin(configureTerser())],
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
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
    filename: ({ chunk }) => `${chunk.name === 'index'
      ? 'vendor/css/index.[fullhash].css'
      : 'vendor/css/article.[fullhash].css'}`
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
};

const configureFavicons = () => {
  return {
    logo: './sources/assets/logo.png',
    prefix: 'assets/',
    cache: true,
    inject: true,
    favicons: {
      appName: 'Fotoblog Grzegorz Tomicki',
      appShortName: 'Fotoblog GT',
      appDescription: 'Blog fotograficzny, ciekawe nietuzinkowe zdjęcia, niezapomniane chwile',
      background: '#FFF',
      theme_color: '#FFF',
      display: 'standalone',
      lang: 'PL',
      appleStatusBarStyle: 'black-translucent',
      orientation: 'portrait',
      start_url: "/?source=pwa",
      scope: '/',
      icons: {
        android: true,
        appleIcon: true,
        favicons: true,
        appleStartup: false,
        coast: false,
        firefox: false,
        window: false,
        yandex: false
      }
    }
  }
};

// Configure Copy Webpack
const configureCopyWebpack = () => {
  // const images = { from: 'sources/images/', to: 'images/' };
  // const check = checkFolder(IMAGE_FOLDER);

  const config = {
    patterns: [
      { from: 'sources/assets/js', to: 'assets/js' }
    ]
  }
  // return check ? config : { patterns: [...config.patterns, images] };
  return config;
};

// Configure Bundle Analyzer
const configureBundleAnalyzer = () => {
  return {
    openAnalyzer: true,
    // generateStatsFile: true,
  };
};

// Configure Css Loader
const configureCssLoader = () => {
  return {
    test: /\.(css|sass|scss)$/,
    use: [
      MiniCssExtractPlugin.loader,
      ...cssLoaders
    ],
  };
};

module.exports = merge(baseConfig, {
  mode: 'production',
  target: 'browserslist',
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
    new FaviconsWebpackPlugin(
      configureFavicons()
    ),
    new copyWebpackPlugin(
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
