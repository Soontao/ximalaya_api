"use strict"
var http = require('http');
var perPageItemNum = 20;

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
 * 
 * @param {string} keyword
 * @param {string} type
 * @param {function(Number)} cb
 */
var getSearchPageNum = (keyword, type, cb) => {
  if (!keyword) throw new Error("param err");
  type = type || "t2";
  getSearchRecordNum(keyword, type, (num) => {
    cb(Math.ceil(num / perPageItemNum));
  })
}



/**
 * 获取记录总数
 * 
 * @param {string} keyword
 * @param {string} type
 * @param {any} cb
 */
var getSearchRecordNum = (keyword, type, cb) => {
  if (!keyword) throw new Error("param err");
  type = type || "t2";
  var numReg = /<div class="searchCount">共找到(\d+)个有关<em>/;
  requestPageContent(keyword, type, (page) => {
    cb(page.match(numReg)[1]);
  })
}


module.exports = {
  getSearchPageNum,
  getSearchRecordNum,
  requestPageContent
}