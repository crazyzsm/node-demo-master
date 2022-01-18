const { SuccessModel, ErrorModel } = require('../model/resModel')
const { login } = require('../controller/user')
const { set } = require('../db/redis')

const handleUserRouter = (req, res) => {
  const method = req.method

  // 登录
  // if (method === 'POST' && req.path === '/api/user/login') {
  //   const { username, password } = req.body
  //   const result = login(username, password)
  //   return result.then(data => {
  //     if (data.username) {
  //       // 设置 session
  //       req.session.username = data.username
  //       // 同步到redis
  //       set(req.sessionId, req.session)
  //       return new SuccessModel()
  //     } 
  //     return new ErrorModel('登录失败')
  //   })
  // }

  // 临时测试使用，因为 post 需要浏览器联调，为了方便改为 get 请求测试。
  if (method === 'GET' && req.path === '/api/user/login') {
    // 获取 username， password
    const { username, password } = req.query
    const result = login(username, password)
    return result.then(data => {
      if (data.username) {
        // 设置 session
        req.session.username = data.username
        // 同步到redis
        set(req.sessionId, req.session)
        return new SuccessModel()
      } 
      return new ErrorModel('登录失败')
    })
  }

  // 登录验证的测试
  // if (method === "GET" && req.path === "/api/user/login-test") {
  //   if(req.session.username) {
  //     return Promise.resolve(new SuccessModel({
  //       username: req.session.username
  //     }))
  //   }
  //   return Promise.resolve(new ErrorModel("尚未登录")) 
  // }
}

module.exports = handleUserRouter