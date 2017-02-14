var path = require('path');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

let broserSyncConfig = require('./broser-sync.config')
let postcssConfig = require('./postcss.config')

module.exports = {
  entry: './app/entry',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist/js')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|ico|gif)/,
        use: 'url-loader'
      },
      {
        test: /\.pcss$/,
        use: [
          'style-loader',
          'css-loader?imprtLoaders=1',
          {
            loader: 'postcss-loader',
            options: {
              plugins: postcssConfig
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