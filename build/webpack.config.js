var path = require('path');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
  entry: './app/entry',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  devServer: {
    port: 3100,
    contentBase: [path.join(__dirname, '../app'), path.join(__dirname, '../dist')],
    publicPath: '/js',
    compress: true,
    stats: {
      colors: true
    }
  },
  plugins: [
    new BrowserSyncPlugin(
      {
        host: 'localhost',
        port: 3000,
        files: ['app/**/*.html'],
        proxy: 'http://localhost:3100/'
      }, {
        reload: true
      }
    )
  ]
};