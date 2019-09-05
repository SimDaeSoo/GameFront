const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const webpackConfig = {
    entry: {
        app: ['./src/App.ts']
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, '../dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            }, {
                test: /\.vue$/,
                use: 'vue-loader'
            }, {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                }
            }, {
                test: /\.(png|jpe?g|gif|svg)$/i,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                },
            }, {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[hash:7].[ext]'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        new VueLoaderPlugin(),
        new webpack.ProvidePlugin({
            PIXI: ['pixi.js']
        }),
        new CopyWebpackPlugin([
          {
            from: path.resolve(__dirname, '../src/assets'),
            to: 'src/assets',
            ignore: ['.*']
          }
        ])
    ],
    resolve: {
        extensions: ['.ts', '.js', '.json'],
        alias: {
            assets: path.resolve('src/assets/'),
            json: path.resolve('src/json/')
        }
    }
};

module.exports = webpackConfig;