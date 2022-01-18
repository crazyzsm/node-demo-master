// 一个解析 query 参数的 js 库
const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const { get } = require('./src/db/redis')
const { access } = require("./src/utils/log")

// 获取 cookie 过期时间
const getCookieExpires = () => {
  const d = new Date()
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
  console.log("toGMTString:", d.toGMTString())
  return d.toGMTString()
}

// 用于获取 post 请求的参数
const getPostData = (req) => {
  promise = new Promise((resolve, reject) => {
    if (req.method !== 'POST') {
      resolve({})
      return
    }
    if (req.headers['content-type'] !== 'application/json') {
      resolve({})
      return
    }
    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      if (!postData) {
        resolve({})
        return
      }
      resolve(
        JSON.parse(postData)
      )
    })
  })
  return promise
}

const serverHandle = async (req, res) => {
  // 记录 access log
  access(`${req.method} -- ${req.url} -- ${req.headers["user-agent"]} -- ${Date.now()}`)
  // 设置返回格式 JSON
  res.setHeader('Content-type', 'application/json')

  // 获取 path
  const url = req.url
  req.path = url.split('?')[0]

  // 解析 query 成对象
  req.query = querystring.parse(url.split('?')[1])

  // 解析 cookie 
  // cookie 格式为 k1=v1;k2=v2;k3=v3
  req.cookie = {}
  const cookieStr = req.headers.cookie || ""
  // 通过 ; 分割成数组，遍历数组元素，再通过 = 分割成数组，拿到 key 和 val 赋值给 cookie 对象
  cookieStr.split(";").forEach(item => {
    if (!item) return
    const arr = item.split("=")
    // trim() 去除 cookie 转成对象之后键值对中的空格
    const key = arr[0].trim()
    const val = arr[1].trim()
    req.cookie[key] = val
  });
  console.log("req cookie is",req.cookie)

  // 解析 session
  // 是否需要设置 cookie
  let needSetCookie = false
  // 获取请求头中 cookie 的 sessionId
  let sessionId = req.cookie.sessionId
  console.log("sessionId:", sessionId)
  let session = {}
  if (sessionId) { 
    // 如果 sessionId 存在，查询是否已登录
    session = await get(sessionId)
  } else {
    // 如果 sessionId 不存在，则需要设置 cookie 中的 sessionId 的值。
    needSetCookie = true
    // 随机生成 userId
    sessionId = `${Date.now()}_${Math.random()}`
  }
  console.log('session:', session)
  console.log("needSetCookie:", needSetCookie)
  req.sessionId = sessionId
  req.session = session

  getPostData(req).then(postData => {
    req.body = postData

    // 处理 blog 路由
    const blogResult = handleBlogRouter(req, res)
    if (blogResult) {
      blogResult.then(blogData => {
        if (needSetCookie) {
          // 操作 cookie 
          // path 设置 / 开头的路径通用
          // httpOnly 客户端只读属性，不可以更改
          // expires cookie过期时间
          res.setHeader("Set-Cookie", `sessionId=${sessionId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
        res.end(
          JSON.stringify(blogData)
        )
      })
      return
    }

    // 处理 user 路由
    const userResult = handleUserRouter(req, res)
    if (userResult) {
      userResult.then(userData => {
        if (needSetCookie) {
          // 操作 cookie 
          // path 设置 / 开头的路径通用
          // httpOnly 客户端只读属性，不可以更改
          // expires cookie过期时间
          res.setHeader("Set-Cookie", `sessionId=${sessionId}; path=/; httpOnly; expires=${getCookieExpires()}`)
        }
        res.end(
          JSON.stringify(userData)
        )
      })
      return
    }

    // 未命中路由
    res.writeHead(404, { 'Content-type': 'text/plain' })
    res.write('404 Not Found\n')
    res.end()
  })
}

module.exports = serverHandle