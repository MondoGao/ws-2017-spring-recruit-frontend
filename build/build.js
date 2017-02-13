let path = require('path');
let Webpack = require('webpack');
let webpackConfig = require('./webpack.config');

Webpack(webpackConfig, function (err, stats) {
  if (err) throw err;
});
