const path = require('path')
const webpack = require('webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: {
    index: ['@babel/polyfill', path.join(__dirname, '../src/main.js')],
    other: path.join(__dirname, '../src/other.js')
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js'
  },
  plugins: [
    new htmlWebpackPlugin({
      template: path.join(__dirname, '../src/index.html'),
      filename: 'index.html',
      chunks: ['index']
    }),
    new htmlWebpackPlugin({
      template: path.join(__dirname, '../src/other.html'),
      filename: 'other.html',
      chunks: ['index','other']
    }),
    new CleanWebpackPlugin(),
    new webpack.BannerPlugin('我真牛掰！'),
    // 将jquery库自动加载到每个模块
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(scss|sass)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.(png|jpg|gif)/,
        use: [{
          loader: 'url-loader',
          options: {
            // limit表示如果图片大于5KB，就以路径形式展示，小于的话就用base64格式展示
            limit: 5 * 1024,
            // 打包输出目录
            outputPath: 'images',
            // 打包输出图片名称
            name: '[name]-[hash:5].[ext]'
          }
        }]
      },
      {
        test: /\.(ttf|eot|svg|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'icons'
        },
      },
      // 打包html中的图片
      {
        test: /\.(htm|html)$/,
        loader: 'html-withimg-loader',
        options: {
          name: '[name]-[hash:5].[ext]',
          outputPath: 'images'
        },
      },
      // 将jquery挂载到window（需在入口文件引入一次）
      // {
      //   test: require.resolve('jquery'),
      //   use: {
      //     loader: 'expose-loader',
      //     options: '$'
      //   }
      // }
    ]
  },
}