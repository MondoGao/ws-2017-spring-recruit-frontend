let path = require('path');
let Webpack = require('webpack');
let webpackConfig = require('./webpack.config');

function build() {
  Webpack(webpackConfig, function (err, stats) {
    if (err) throw err;
  });
}
build();

module.exports = {
  build: build
};