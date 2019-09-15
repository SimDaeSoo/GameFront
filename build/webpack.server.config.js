const nodeExternals = require('webpack-node-externals');
const path = require('path');

const webpackConfig = {
  mode: 'production',
  entry: {
    server: ['./src/ServerApp.ts']
  },
  target: 'node',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../dist')
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  },
  externals: [nodeExternals()]
};

module.exports = webpackConfig;