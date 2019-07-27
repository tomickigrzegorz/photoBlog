const HtmlWebPackPlugin = require('html-webpack-plugin');

const ENTRY = require('./entry.js');

module.exports = {
  entry: ENTRY.html,
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
  plugins: Object.keys(ENTRY.html).map(entryName => {
    const templateName = entryName === 'index' ? 'index' : 'article';
    return new HtmlWebPackPlugin({
      filename: `${entryName}.html`,
      template: `./sources/templates/${templateName}.pug`,
      file: require(`../sources/data/${entryName}.json`),
      chunks: [entryName],
      mode: process.env.NODE_ENV === 'production' ? 'production': 'development'
    });
  })
};