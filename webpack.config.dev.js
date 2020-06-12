const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

const common = require('./webpack.config');
const outputPath = path.resolve(__dirname, 'dist/dev');

module.exports = merge(common, {
  mode: 'development',
  context: path.resolve(__dirname, 'src'),
  output: {
    path: outputPath,
    filename: '[name].bundle.js',
  },
  devtool: 'source-map',
  entry: {
    bootstrap: path.resolve(__dirname, 'src/bootstrap.ts'),
    index: path.resolve(__dirname, 'src/index.tsx'),
  },
  optimization: {
    minimize: false,
  },
  devServer: {
    contentBase: outputPath,
    compress: true,
    port: 9000,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public/common'),
          to: outputPath,
        },
      ],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public/dev'),
          to: outputPath,
        },
      ],
    }),
    new webpack.DefinePlugin({
      __USE_WORKERS__: false,
      __IN_DEBUG__: true,
      __VERSION__: process.enviro
    }),
  ],
  externals: {
    babylonjs: 'BABYLON',
    'babylonjs-gui': 'BABYLON.GUI',
    'babylonjs-inspector': 'BABYLON',
    'babylonjs-materials': 'BABYLON',
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.json',
            },
          },
        ],
      },
    ],
  },
});
