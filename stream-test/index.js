// 查一下 node.js 用 stream 的好处

// 标准输入输出
// process.stdin.pipe(process.stdout)

// const http = require("http")
// const server = http.createServer((req, res) => {
//   if (req.method === 'POST') {
//     req.pipe(res)
//   }
// })
// server.listen(8000)

// 拷贝文件
// const fs = require("fs")
// const path = require("path")
// // data.txt 文件路径
// const fileName1 = path.resolve(__dirname, "data.txt")
// // data-backup.txt 文件路径
// const fileName2 = path.resolve(__dirname, "data-backup.txt")
// // 读取 data.txt 
// const readStream = fs.createReadStream(fileName1)
// // 往 data-backup.txt 写入
// const writeStream = fs.createWriteStream(fileName2)
// // 从 data.txt 往 data-backup.txt 写入内容
// readStream.pipe(writeStream)
// readStream.on("data", chunk => {
//   console.log(chunk.toString())
// })
// // 监听结束事件
// readStream.on("end", () => {
//   console.log("copy done")
// })

// 利用 stream 读取文件作为返回体返回
const http = require("http")
const fs = require("fs")
const path = require("path")
const fileName = path.resolve(__dirname, "data.txt")
const server = http.createServer((req, res) => {
  if (req.method === "GET") {
    const readStream = fs.createReadStream(fileName)
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); // 设置 content-type，汉字不乱码
    readStream.pipe(res)
  }
})
server.listen(8000)
