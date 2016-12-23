"use strict"
var http = require('http');


/**
 * 请求页面内容
 * 
 * @param {string} keyword 关键词
 * @param {string} type 查询分类
 * @param {function} cb 回调函数
 */
var requestPageContent = (keyword, type, cb) => {
  if (!keyword) throw new Error("param err");
  type = type || "t2";
  http.get(encodeURI(`http://www.ximalaya.com/search/${keyword}/${type}`), (res) => {
    var body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => cb(body));
  }).on('error', (e) => {
    throw e;
  });
}

/**
 * 获取搜索页面总数
 * 根据页面总数可以获取相应URL
 * 
 * @param {string} keyword
 * @param {string} type
 * @param {function} cb
 */
var getSearchPageNum = (keyword, type, cb) => {
  if (!keyword) throw new Error("param err");
  type = type || "t2";
  requestPageContent(keyword, type, (page) => {

  })
}

requestPageContent('卓老板', 't2', (body) => {
  console.log(body)
})