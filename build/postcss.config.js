module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-cssnext'),
    require('autoprefixer'),
    require('postcss-px2rem')({
      remUnit: 32
    })
  ]
};