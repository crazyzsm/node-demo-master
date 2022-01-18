const http = require('http')

// // 创建监听 get 请求的 demo
// // 一个解析参数的库
// const querystring = require('querystring')

// // 创建一个服务
// const server = http.createServer((req, res) => {
//   // 获取请求方法
//   console.log('method:', req.method)
//   // 获取请求的 url
//   const url = req.url
//   console.log('url:', url)
//   req.query = querystring.parse(url.split('?')[1])
//   // 返回解析后的对象
//   res.end(JSON.stringify(req.query))
// })
// // 监听 8000 端口
// server.listen(8000)

// // 创建监听 post 请求的 server
// const server = http.createServer((req, res) => {
//   if (req.method === 'POST') {
//     // req 数据格式
//     console.log('req.headers:', req.headers)
//     console.log('req content-type:', req.headers['content-type'])
//     // 接受数据
//     let postData = ''
//     req.on('data', chunk => {
//       console.log('chunk:', chunk)
//       postData += chunk.toString()
//     })
//     req.on('end', () => {
//       console.log('postData:', postData)
//       res.end('hello world') // 在这里返回，因为是异步
//     })
//   }
// })
// // 监听 8000 端口
// server.listen(8000)

// 创建监听 get 与 post 请求的 server
// 解析 get 请求的 query 参数的库
const querystring = require('querystring')
const server = http.createServer((req, res) => {
  // 请求方法
  const method = req.method
  console.log('method:', method)
  // 请求 url
  const url = req.url
  console.log('url:', url)
  // 请求路径
  const path = url.split('?')[0]
  console.log('path:', path)
  // get 请求参数
  const query = querystring.parse(url.split('?')[1])
  console.log('query:', query)

  // 设置返回格式为 json
  res.setHeader('Content-type', 'application/json')

  // 返回的数据
  const resData= {
    method,
    url,
    path,
    query
  }

  if (req.method === 'GET') {
    res.end(
      JSON.stringify(resData)
    )
  }

  if (req.method === 'POST') {
    let postData = ''
    req.on('data', chunk => {
      console.log('chunk:', chunk)
      postData += chunk.toString()
    })
    req.on('end', () => {
      resData.postData = postData
      // 返回
      res.end(
        JSON.stringify(resData)
      )
    })
  }
})
// 监听 8000 端口 
server.listen(8000)


