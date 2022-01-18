// 引入 http 协议
const http = require('http')

// 创建一个 server 服务器
// request 客户端请求体
// response 服务器返回体
const server = http.createServer((req, res) => {
  // 返回体头部类型
  res.writeHead(200, {'content-type': 'text/html'})
  // 返回体
  res.end('<h1>hello world!</h1>')
})

// 监听本地 3000 端口
server.listen(3000, () => {
  console.log('listening on 3000 port')
})