const webpack = require("webpack");
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const PUBLIC_PATH = 'http://blog.grzegorztomicki.pl/';

const entry = require('./entry.js');

module.exports = (env, argv) => {

    const type = (argv.mode === 'production')
        ? {
            'pathToDist': '../dist',
            'mode': 'production',
            'minify': { 
                removeComments: true, 
                collapseWhitespace: true,
                removeScriptTypeAttributes: true,
            }
        }
        : {
            'pathToDist': 'dist',
            'mode': 'development',
            'minify': false
        }

    const entryHtmlPlugins = Object.values(entry.html).map(siteName => {
        const templateName = (siteName === 'index') ? 'index' : 'article'
        return new HtmlWebpackPlugin({
            filename: `${siteName}.html`,
            template: `./sources/templates/${templateName}.pug`,
            chunks: [templateName],
            minify: type.minify,
            file: require(`../sources/data/${siteName}.json`),
            mode: type.mode,
            // inlineSource: '.(js|css)$',
        })
    });

    const output = {
        path: path.resolve(__dirname, type.pathToDist),
        filename: "./vendor/js/[name].[hash].js"
    }

    return {
        devtool: devProdOption('source-map', 'none', argv),
        entry: entry.site,
        output: output,
        module: {
            rules: [
                {
                    // JS
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                },
                {   // CSS SASS SCSS
                    test: /\.(css|sass|scss)$/,
                    use: [
                        argv.mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 2,
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                                plugins: () => [require('autoprefixer')({
                                    'browsers': ['> 1%', 'last 2 versions']
                                })],
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'sass-resources-loader',
                            options: {
                                resources: [
                                    path.resolve(__dirname, '../sources/scss/style.scss')
                                ]
                            },
                        }
                    ]
                },
                {
                    // IMAGES
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    loader: "file-loader",
                    options: {
                        useRelativePath: true,
                        name: '[name].[ext]',
                    }
                },
                {
                    // PUG
                    test: /\.pug$/,
                    loader: 'pug-loader',
                    options: {
                        pretty: true,
                        self: true
                    }
                }
            ]
        },
        optimization: {
            // runtimeChunk: 'single'
            // namedModules: true
            // runtimeChunk: true
        },
        plugins: [
            prodPlugin(
                new CleanWebpackPlugin('dist', {
                    verbose: true,
                    root: path.resolve('./')
                }), argv
            ),
            prodPlugin(
                new MiniCssExtractPlugin({
                    filename: "./vendor/css/[name].[hash].css"
                }), argv
            ),
            prodPlugin(
                new SWPrecacheWebpackPlugin({
                    cacheId: 'gt',
                    dontCacheBustUrlsMatching: /\.\w{8}\./,
                    filename: 'service-worker.js',
                    minify: true,
                    navigateFallback: PUBLIC_PATH + 'index.html',
                    staticFileGlobsIgnorePatterns: [
                        /\.map$/,
                        /manifest\.json$/,
                        /robots\.txt$/,
                        /\.html$/,
                        /\.css$/,
                        /images/,
                    ],
                }), argv
            ),
            prodPlugin(
                new CopyWebpackPlugin([
                    { from: 'sources/assets/manifest.json', to: 'assets/' },
                    { from: 'sources/assets/robots.txt', to: './' },
                    { from: 'sources/images/', to: 'images/' }

                ]), argv
            ),
            prodPlugin(
                new OptimizeCssAssetsPlugin(), argv
            ),
            new webpack.DefinePlugin({
                PRODUCTION: JSON.stringify(true)
            }),
        ]
            .concat(entryHtmlPlugins)
            // .concat(prodPlugin(
            //     new ScriptExtHtmlWebpackPlugin({
            //         defaultAttribute: 'async'
            //     }), argv
            // ))
            .concat(prodPlugin(
                new HtmlWebpackInlineSourcePlugin(), argv
            ))
            .concat(prodPlugin(
                new BundleAnalyzerPlugin({
                    openAnalyzer: true,
                }), argv
            ))
    }
};


function devProdOption(dev, prod, argv) {
    return argv.mode === 'development' ? dev : prod;
}

function prodPlugin(plugin, argv) {
    return argv.mode === 'production' ? plugin : () => { };
}

function devPlugin(plugin, argv) {
    return argv.mode === 'development' ? plugin : () => { };
}