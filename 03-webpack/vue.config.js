
'use strict'
const path = require('path')
const defaultSettings = require('./src/settings')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue-framework' // 标题

const port = 3000 // 端口

module.exports = {
  lintOnSave: false,
  publicPath: '/', //
  // outputDir: 'build', // 构建项目存放的目录地址
  assetsDir: 'static', // 放置静态文件的目录 相对于outputDir 目录
  // indexPath: 'base/index.html' // 指定index.html的生成目录
  devServer: {
    // open: true,
    host: '0.0.0.0',
    port: port,
    proxy: {
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      '/test': {
        target: 'http://localhost:8024/',
        changeOrigin: true
      },
      // '/sirb/list': {
      //   target: 'https://jdy-insurance.cn.utools.club/',
      //   changeOrigin: true
      // },
      // '/sys': {
      //   target: 'https://jdy-system.cn.utools.club/',
      //   changeOrigin: true
      // },
      // '/file/uploadPublic': {
      //   target: 'https://jdy-system.cn.utools.club/',
      //   changeOrigin: true
      // },
      // '/subTree': {
      //   target: 'https://jdy-mechanism.cn1.utools.club/',
      //   changeOrigin: true
      // },
      [process.env.VUE_APP_BASE_API]: {
        target: 'https://dev.admin-api.jdy.iyobee.com/', // dev
        // target: 'https://testing.admin-api.jdy.iyobee.com/', // test
        // target: 'http://10.10.8.137:8001/',
        // target: 'https://jdy-mechanism.cn1.utools.club/',
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    },
    disableHostCheck: true
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      },
      extensions: ['.js', '.jsx', '.json', ".vue", ".scss", ".less"], // 默认可以省略 .js 和 .json 后缀
    }
  },
  chainWebpack (config) {
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()
  }
}
