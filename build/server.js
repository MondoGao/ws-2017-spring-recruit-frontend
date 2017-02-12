const path = require('path')

const webpackConfig = require('./webpack.config');
const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const compiler = Webpack(webpackConfig);
const server = new WebpackDevServer(compiler, webpackConfig.devServer);

server.listen(webpackConfig.devServer.port, "127.0.0.1", function () {
  console.log("Starting sever");
});