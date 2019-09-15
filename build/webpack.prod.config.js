const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

const webpackConfig = merge(baseConfig, {
    mode: 'production',
    plugins: [
        new CompressionPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp('\\.(js|css)$'),
            threshold: 10240,
            minRatio: 0.8
        }),
        new webpack.HashedModuleIdsPlugin(),
        new MiniCSSExtractPlugin({
            filename: '[name].[hash].css',
            chunkFilename: '[id].[hash].css'
        }),
    ],
    optimization: {
        minimizer: [
            new OptimizeCSSAssetsPlugin({
                cssProcessorPluginOptions: {
                    preset: [
                        'default',
                        { discardComments: { removeAll: true } }
                    ],
                }
            }),
            new TerserPlugin()
        ],
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        },
        runtimeChunk: true
    },
    module: {
        rules: [
            {
                test: /\.s?css$/,
                use: [
                    MiniCSSExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
});

module.exports = webpackConfig;