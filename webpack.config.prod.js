const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const common = require('./webpack.config');
const outputPath = path.resolve(__dirname, 'dist/prod');

module.exports = merge(common, {
  mode: 'production',
  context: path.resolve(__dirname, 'src'),
  output: {
    path: outputPath,
    publicPath: outputPath,
    filename: '[name].bundle.js',
  },
  entry: {
    bootstrap: path.resolve(__dirname, 'src/bootstrap.ts'),
    worker: path.resolve(__dirname, 'src/worker.ts'),
    index: path.resolve(__dirname, 'src/index.tsx'),
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
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
          from: path.resolve(__dirname, 'public/prod'),
          to: outputPath,
        },
      ],
    }),
    new webpack.DefinePlugin({
      __USE_WORKERS__: true,
    }),
  ],
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
              configFile: 'tsconfig.prod.json',
            },
          },
        ],
      },
    ],
  },
});
