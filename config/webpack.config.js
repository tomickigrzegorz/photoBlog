const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

function devProdOption(dev, prod, argv) {
  return argv.mode === 'development' ? dev : prod;
}

function prodPlugin(plugin, argv) {
  return argv.mode === 'production' ? plugin : () => {};
}

function devPlugin(plugin, argv) {
  return argv.mode === 'development' ? plugin : () => {};
}

const PUBLIC_PATH = 'http://somesite.com/';

const ENTRY = require('./entry.js');

const OUTPUT_DIR = 'dist';

const optimization = {
  splitChunks: {
    cacheGroups: {
      styles: {
        name: 'commons',
        test: /\.s?css$/,
        chunks: 'all',
        minChunks: 2,
        reuseExistingChunk: false,
        enforce: true,
      },
    },
  },
  minimizer: [
    new UglifyJsPlugin({
      uglifyOptions: {
        warnings: false,
        output: {
          comments: false,
        },
      },
    }),
  ],
};

module.exports = (env, argv) => {
  const type =
    argv.mode === 'production'
      ? {
          pathToDist: '../dist',
          mode: 'production',
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeScriptTypeAttributes: true,
            minifyCSS: true,
          },
        }
      : {
          pathToDist: 'dist',
          mode: 'development',
          minify: false,
        };

  const entryHtmlPlugins = Object.keys(ENTRY.html).map(entryName => {
    const templateName = entryName === 'index' ? 'index' : 'article';
    return new HtmlWebPackPlugin({
      filename: `${entryName}.html`,
      template: `./sources/templates/${templateName}.pug`,
      file: require(`../sources/data/${entryName}.json`),
      chunks: [entryName],
      minify: type.minify,
      mode: type.mode,
    });
  });
  //   filename: 'vendor/js/[name].[chunkhash].bundle.js'
  const output = {
    path: path.resolve(__dirname, '../dist'),
    filename: chunkData => {
      return chunkData.chunk.name === 'index'
        ? 'vendor/js/index.[hash].js'
        : 'vendor/js/article.[hash].js';
    },
    chunkFilename: 'vendor/js/[name].[hash].js',
  };

  return {
    devtool: devProdOption('source-map', 'none', argv),
    entry: ENTRY.html,
    output,
    module: {
      rules: [
        {
          // JS
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          // HTML
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: {
                minimize: argv.mode !== 'development',
              },
            },
          ],
        },
        {
          // CSS SASS SCSS
          test: /\.(css|sass|scss)$/,
          use: [
            argv.mode === 'development'
              ? 'style-loader'
              : MiniCssExtractPlugin.loader,
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
                config: {
                  path: './config/',
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
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
        },
        {
          // IMAGES
          test: /\.(jpe?g|png|gif|svg)$/i,
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: argv.mode === 'production' ? './images/' : '',
            publicPath: argv.mode === 'production' ? '../../images/' : '',
            useRelativePath: true,
          },
        },
        {
          // PUG
          test: /\.pug$/,
          loader: 'pug-loader',
          options: {
            pretty: true,
            self: true,
          },
        },
      ],
    },
    optimization: argv.mode === 'production' ? optimization : {},
    // optimization: {},
    plugins: [
      prodPlugin(
        new CleanWebpackPlugin({
          verbose: true,
        }),
        argv
      ),
      prodPlugin(
        new MiniCssExtractPlugin({
          filename: 'vendor/css/[name].[hash].css',
          chunkFilename: 'vendor/css/[name].[hash].css',
        }),
        argv
      ),
      prodPlugin(
        new SWPrecacheWebpackPlugin({
          cacheId: 'gt',
          dontCacheBustUrlsMatching: /\.\w{8}\./,
          filename: 'sw.js',
          minify: false,
          navigateFallback: `${PUBLIC_PATH}index.html`,
          stripPrefix: OUTPUT_DIR,
          staticFileGlobs: [
            `${OUTPUT_DIR}/assets/manifest.json`,
            `${OUTPUT_DIR}/favicon.ico`,
            `${OUTPUT_DIR}/vendor/js/*.js`,
            `${OUTPUT_DIR}/vendor/css/*.css`,
            `${OUTPUT_DIR}/images/static/*.png`,
            `${OUTPUT_DIR}/images/*.ico`,
          ],
        }),
        argv
      ),
      prodPlugin(
        new CopyWebpackPlugin([
          { from: 'sources/assets/', to: 'assets/' },
          { from: 'sources/assets/favicon.ico', to: './' },
        ]),
        argv
      ),
      new webpack.DefinePlugin({
        PRODUCTION:
          argv.mode === 'development'
            ? JSON.stringify(false)
            : JSON.stringify(true),
      }),
    ].concat(entryHtmlPlugins),
    // .concat(
    //   prodPlugin(
    //     new ScriptExtHtmlWebpackPlugin({
    //       defaultAttribute: 'async'
    //     }),
    //     argv
    //   )
    // )
    // .concat(prodPlugin(new HtmlWebpackInlineSourcePlugin(), argv))
    // .concat(
    //   prodPlugin(
    //     new BundleAnalyzerPlugin({
    //       openAnalyzer: true
    //     }),
    //     argv
    //   )
    // )
  };
};
