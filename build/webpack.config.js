var path = require('path');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

let broserSyncConfig = require('./broser-sync.config')

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
        use: 'babel-loader'
      },
      {
        test: /\.pcss$/,
        use: [
          'style-loader',
          'css-loader?imprtLoaders=1',
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('postcss-cssnext'),
                  require('autoprefixer')
                ];
              }
            }
          }
        ]
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
    new BrowserSyncPlugin(broserSyncConfig, {
        reload: true
      }
    )
  ]
};