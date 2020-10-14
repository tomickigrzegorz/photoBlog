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
// const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// config files
const baseConfig = require('./webpack.base.js');

const { cssLoaders } = require('./util');

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
      cache: true,
      parallel: true,
      sourceMap: true
    }
  };
};

// Configure Optimization
const configureOptimization = () => {
  return {
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
  target: 'es5',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: ({ chunk }) => {
      return chunk.name === 'index'
        ? 'vendor/js/index.[fullhash].js'
        : 'vendor/js/article.[fullhash].js'
    },
    chunkFilename: 'vendor/js/[name].[fullhash].js',
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
    // not compatible with webpack 5
    // new FaviconsWebpackPlugin(
    //   configureFavicons()
    // ),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
    }),
    new BundleAnalyzerPlugin(
      configureBundleAnalyzer()
    ),
  ],
});
