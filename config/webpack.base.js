const path = require('path');
const buildMode =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const ENTRY = require('./entry.js');

// Configure Html Loader
const configureHtmlLoader = (mode) => {
  const type = mode === 'production' ? true : false;
  return {
    test: /\.html$/,
    use: [
      {
        loader: 'html-loader',
        options: {
          minimize: type
        }
      },
    ],
  };
};

// Configure Babel Loader
const configureBabelLoader = () => {
  return {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
    },
  };
};

// Configure Pug Loader
const configurePugLoader = () => {
  return {
    test: /\.pug$/,
    loader: 'pug-loader',
    options: {
      pretty: true,
      self: true,
    },
  };
};

// Configure File Loader
const configureFileLoader = () => {
  return {
    test: /\.(jpe?g|png|gif|svg)$/i,
    loader: 'file-loader',
    options: {
      name: '[name].[ext]',
    },
  };
};

// Multiple Entry
const entryHtmlPlugins = ENTRY.html.map(entryName => {
  const templateName = entryName === 'index' ? 'index' : 'article';

  return new HtmlWebPackPlugin({
    filename: `${entryName}.html`,
    template: `./sources/templates/${templateName}.pug`,
    DATA: require(`../sources/data/${entryName}.json`),
    chunks: ['share', templateName],
    inject: true,
    cache: true
  });
});

module.exports = {
  target: process.env.NODE_ENV === 'development' ? 'web' : 'browserslist',
  entry: {
    index: './sources/js/index.js',
    article: './sources/js/article.js',
    share: './sources/js/share.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'vendor/js/[name].[fullhash].js',
    // filename: ({ chunk }) => {
    //   return chunk.name === 'index'
    //     ? 'vendor/js/index.[fullhash].js'
    //     : 'vendor/js/article.[fullhash].js'
    // },
    // publicPath: '/',
    chunkFilename: 'vendor/js/[name].[fullhash].chunk.js',
  },
  resolve: {
    alias: {
      'styles': path.resolve(__dirname, '../sources/scss')
    }
  },
  module: {
    rules: [
      configureHtmlLoader(buildMode),
      configureBabelLoader(),
      configurePugLoader(),
      configureFileLoader(),
    ],
  },
  plugins: [
    ...entryHtmlPlugins
  ]
};
