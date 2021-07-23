const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')

module.exports = merge(baseConfig, {
  mode: 'development',
  devServer: {
    open: true,
    contentBase: './',
    hot: true,
    port: '8000'
  },
  devtool: 'eval-cheap-module-source-map'
})