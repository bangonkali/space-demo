const path = require('path');

module.exports = {
  mode: 'production',
  context: path.resolve(__dirname, 'src'),
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devtool: 'source-map',
};
