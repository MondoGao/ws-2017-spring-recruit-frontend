const path = require('path')

const config = require('./webpack.config');
const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const compiler = Webpack(config);
const server = new WebpackDevServer(compiler, {
  contentBase: [path.join(__dirname, '../app'), path.join(__dirname, '../dist')],
  publicPath: '/js',
  compress: true,
  stats: {
    colors: true
  }
});

server.listen(3100, "127.0.0.1", function () {
  console.log("Starting sever");
});