// production builds
const buildMode =
  process.env.NODE_ENV === "production" ? "production" : "development";
const IMAGE_FOLDER = "./dist/images/";

// node modules
const fs = require("fs");
const webpack = require("webpack");
const path = require("path");
const { merge } = require("webpack-merge");

// webpack plugins
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// config files
const baseConfig = require("./webpack.common.js");

const { cssLoaders } = require("./util");
const copyWebpackPlugin = require("copy-webpack-plugin");

const checkFolder = (folder) => {
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
      sourceMap: true,
    },
  };
};

// Configure Optimization
const configureOptimization = () => {
  return {
    minimize: true,
    minimizer: [new TerserPlugin(configureTerser())],
    splitChunks: {
      cacheGroups: {
        styles: {
          name: "styles",
          type: "css/mini-extract",
          chunks: "all",
          enforce: true,
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

const configureMiniCssExtract = () => {
  return {
    filename: "vendor/css/[name].[fullhash].css",
  };
};

// configure SW
const configureSW = () => {
  return {
    clientsClaim: true,
    skipWaiting: true,
    directoryIndex: "index.html",
    offlineGoogleAnalytics: true,
    exclude: ["images"],
  };
};

// Configure Copy Webpack
const configureCopyWebpack = () => {
  // const images = { from: 'sources/images/', to: 'images/' };
  // const check = checkFolder(IMAGE_FOLDER);

  const config = {
    patterns: [
      { from: "sources/assets/js", to: "assets/js" },
      { from: "sources/assets/sprite.svg", to: "assets/" },
      { from: "sources/assets/og-logo.png", to: "assets/" },
      { from: "sources/favicons", to: "assets/" },
      { from: "sources/favicons/favicon.ico", to: "/dist" },
    ],
  };
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
    use: [MiniCssExtractPlugin.loader, ...cssLoaders],
  };
};

module.exports = merge(baseConfig, {
  mode: "production",
  target: "web",
  optimization: configureOptimization(),
  module: {
    rules: [configureCssLoader(buildMode)],
  },
  plugins: [
    new CleanWebpackPlugin(configureCleanWebpack()),
    new MiniCssExtractPlugin(configureMiniCssExtract()),
    new WorkboxPlugin.GenerateSW(configureSW()),
    new copyWebpackPlugin(configureCopyWebpack()),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
    }),
    // new BundleAnalyzerPlugin(configureBundleAnalyzer()),
  ],
});
