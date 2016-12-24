"use strict"
var http = require('http');
var cheerio = require('cheerio');
var cacheIt = require('lru-func');
var perPageItemNum = 20;
var domain = "http://www.ximalaya.com";

/**
 * 请求页面内容
 * 
 * @param {string} keyword 关键词
 * @param {string} type 查询分类
 * @param {function} cb 回调函数
 */
var requestPageContent = (keyword, type, page, cb) => {
  if (!keyword) throw new Error("param err");
  type = type || "t2";
  page = page || "p1";
  http.get(encodeURI(`${domain}/search/${keyword}/${type}${page}`), (res) => {
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
 * @param {function(number)} cb
 */
var getSearchRecordNum = (keyword, type, cb) => {
  if (!keyword) throw new Error("param err");
  type = type || "t2";
  requestPageContent(keyword, type, undefined, (page) => {
    var $ = cheerio.load(page);
    var num = $('#searchUserPage > div.mainbox_left > div.report > div.searchHint > div.searchCount').text().replace(/[^0-9]/ig, '');
    cb(parseInt(num));
  })
}

/**
 * [T2]类型，获取一个页面中所有的录音信息
 * 
 * @param {string} page
 * @returns {Object}
 * 
 */
var getItemsInfoFromPage_T2 = (page) => {
  var $ = cheerio.load(page);
  var result = [];
  $('#searchUserPage > div.mainbox_left > div.report > div.report_listView > div > div:nth-child(1)').each((i, item) => {
    result.push({
      title: $('a.soundReport_soundname', item).text(),
      tag: $('a.soundReport_tag', item).toArray().map(v => $(v).text()),
      author: $('div.soundReport_author > a', item).text().trim(),
      album: $('div.soundReport_album > a', item).text().trim(),
      playCount: $('span.sound_playcount', item).text()
    })
  })
  return result;
}


module.exports = {
  getSearchPageNum,
  getSearchRecordNum,
  requestPageContent,
  getItemsInfoFromPage_T2
}