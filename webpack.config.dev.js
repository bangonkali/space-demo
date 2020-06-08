const path = require('path');
const merge = require('webpack-merge');
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
  ],
  externals: {
    babylonjs: 'BABYLON',
    'babylonjs-gui': 'BABYLON.GUI',
    'babylonjs-inspector': 'BABYLON',
    'babylonjs-materials': 'BABYLON',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.dev.json',
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
});
