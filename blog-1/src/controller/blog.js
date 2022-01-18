// 引入 sql 执行函数
const { exec } = require('../db/mysql')
const xss = require("xss")

// 查询博客列表
const getList = (author, keyword) => {
  let sql = `select * from blogs where 1 `
  if (author) {
    sql += `and author='${author}' `
  }
  if (keyword) {
    sql += `and title like '%${keyword}%' `
  }
  sql += `order by createtime desc;`
  // exec 返回的是一个 promise 
  return exec(sql)
}

// 查询博客详情
const getDetail = (id) => {
  // 根据 id 查找博客详情，我们查询出来的肯定是一条数据
  // 但是查询到的数据依然是一个 list，可以直接取出下标为 0 的数据返回即可
  let sql = `select * from blogs where id='${id}';`
  return exec(sql).then(rows => {
    return rows[0]
  })
}

// 新增博客
const newBlog = (blogData = {}) => {
  // blogData 是一个对象，包含 title，content 等属性
  const title = xss(blogData.title)
  const content = xss(blogData.content)
  const author = xss(blogData.author)

  const sql = `
    insert into blogs (title, content, createtime, author)
    values ('${title}', '${content}', now(), '${author}');
  `

  return exec(sql).then(inseretData => {
    return {
      id: inseretData.insertId
    }
  })
}

// 更新博客
const updateBlog = (id, blogData = {}) => {
  const title = blogData.title
  const content = blogData.content

  const sql = `
    update blogs set title='${title}', content='${content}' where id = '${id}';
  `

  return exec(sql).then(updateData => {
    console.log('updateData:', updateData)
    if (updateData.affectedRows > 0) {
      return true
    }
    return false
  })
}

// 删除博客
const delBlog = (id, author) => {
  const sql = `
    delete from blogs where id='${id}' and author='${author}';
  `
  return exec(sql).then(delData => {
    console.log('delData:', delData)
    if (delData.affectedRows > 0) {
      return true
    }
    return false
  })
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}