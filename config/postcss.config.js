const cssnano = require('cssnano')
const autoprefixer = require('autoprefixer')
const postcssUrl = require('postcss-url')

module.exports = {
  plugins: [
    postcssUrl({
      url: 'inline',
      maxSize: 50,
    }),
    cssnano({
      safe: true,
    }),
    autoprefixer({ grid: "autoplace" }),
  ],
};
