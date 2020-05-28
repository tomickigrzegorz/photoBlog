const path = require('path');
const buildMode =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';
const HtmlWebPackPlugin = require('html-webpack-plugin');

const ENTRY = require('./entry.js');

// Configure Html Loader
const configureHtmlLoader = () => {
  if (buildMode === 'production') {
    return {
      test: /\.html$/,
      use: [
        {
          loader: 'html-loader',
          options: {
            minimize: true,
          },
        },
      ],
    };
  }
  if (buildMode === 'development') {
    return {
      test: /\.html$/,
      use: [
        {
          loader: 'html-loader',
        },
      ],
    };
  }
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
const entryHtmlPlugins = Object.keys(ENTRY.html).map(entryName => {
  const templateName = entryName === 'index' ? 'index' : 'article';
  return new HtmlWebPackPlugin({
    filename: `${entryName}.html`,
    template: `./sources/templates/${templateName}.pug`,
    file: require(`../sources/data/${entryName}.json`),
    chunks: [entryName],
    mode: buildMode,
  });
});

module.exports = {
  entry: ENTRY.html,
  resolve: {
    alias: {
      Styles: path.resolve(__dirname, '../sources/scss/')
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
  plugins: entryHtmlPlugins,
};
