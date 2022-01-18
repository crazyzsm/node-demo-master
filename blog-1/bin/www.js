// 引入 http 模块
const http = require('http')

// 端口
const PORT = 8000
// 引入 app.js
const serverHandle = require('../app')

// 创建 server 服务
const server = http.createServer(serverHandle)
// 监听服务
server.listen(PORT)