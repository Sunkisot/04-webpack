const path = require('path')
const webpack = require('webpack')
module.exports = {
  mode: 'development',
  entry: {
    react: [
      'react',
      'react-dom'
    ]
  },
  output: {
    filename: "[name]_dll.js",
    path: path.resolve(__dirname, '../dist'),
    library: '[name]_dll'
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_dll',
      path: path.resolve(__dirname, '../dist/manifest.json')
    })
  ]
}