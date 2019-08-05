const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');

module.exports = {
    entry: ['./src/entry-server.ts'],
    output: {
        filename: 'static/js/[name].[chunkhash].js',
        publicPath: '/',
        libraryTarget: 'commonjs2',
        path: path.resolve('dist')
    },
    plugins: [
        // make sure to include the plugin!
        // VueLoader 버전업으로 플로그인 명시적으로 추가하지 않으면 에러남.
        new VueSSRServerPlugin(),
        new VueLoaderPlugin()
    ],
    mode: process.env.NODE_ENV,
    target: 'node',
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        ts: 'ts-loader!tslint-loader'
                    }
                }
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                }
            },
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader'],
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map'
}