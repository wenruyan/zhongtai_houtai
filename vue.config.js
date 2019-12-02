module.exports = {
  publicPath: process.env.NODE_ENV == 'production' ? '/' : '/',
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      "/api": {
        // target: "http://rest.apizza.net/mock/10a3983d31dbc231f1c2180d762a166c",
        // target: "http://focus.api:3000",
        // target: 'https://dietcoke.focus-base.com',
        // target: 'http://192.168.31.174:3000',
        // target: 'http://192.168.31.246:3000', // 李亮
        // target: 'http://192.168.31.224:3000', // 于哲
        // target: 'http://192.168.33.131:3000', // 杨林
        // target: 'http://210.22.122.126:13000',
        // target: 'http://192.168.33.202:3000', // 测试
        target: 'http://erikdeleyeuat.focus-base.com:3101', // uat
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      "/bpeClean": {
        // target: 'http://192.168.31.174:8181',
        // target: 'http://192.168.33.202:61908',
        // target: 'http://192.168.31.224:8181',
        // target: "http://focus.api:8181",f
        // target: 'http://dietcoke.focus-base.com:8088',
        // target: 'http://192.168.31.246:8181', // 李亮
        target: 'http://erikdeleyeuat.focus-base.com:61801',
        changeOrigin: true
      }
    }
  }
}
