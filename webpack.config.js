const path = require('path');

module.exports = {
  mode: 'production',
  context: path.resolve(__dirname, 'src'),
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css'],
  },
};
