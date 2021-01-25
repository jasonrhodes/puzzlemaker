const path = require('path');

module.exports = {
  mode: 'production',
  context: path.join(__dirname, './'),
  devtool: 'source-map', // uncomment this for source map support but builds get SO SLOW 😭
  entry: './app/app.jsx',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'jsx-loader',
        exclude: /node_modules/,
        include: path.join(__dirname, 'app'),
      },
    ],
  },
};