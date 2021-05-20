// // 添加全局配置文件
// const path = require('path')
// module.exports = {
//   // 关闭eslint开发提示
//   // lintOnSave: false
//   // 开发服务器的相关配置
//   devServer: {
//     // 配置静态资源目录
//     contentBase: path.join(__dirname, 'public'),
//     // 设置开发服务器的端口号
//     port: 8848
//   },
//   // 配置webpack相关
//   configureWebpack: {
//     // 解析
//     resolve: {
//       alias: {
//         '@v': path.resolve(__dirname, 'src/views'),
//         '@c': path.resolve(__dirname, 'src/components')
//       }
//     }
//   }
// }

const proxyObj = {}
proxyObj['/'] = {
  // websocket
  ws: false,
  target: 'http://localhost:8082',
  changeOrigin: true,
  pathReWrite: {
    '^/': '/'
  }
}

proxyObj['/ws'] = {
  // websocket
  ws: true,
  target: 'ws://localhost:8082'
}

module.exports = {
  devServer: {
    host: 'localhost',
    port: 8080,
    proxy: proxyObj
  }
}
