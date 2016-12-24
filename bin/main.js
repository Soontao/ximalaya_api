"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var http = require('http');
var cheerio = require('cheerio');
var cacheIt = require('lru-func');
var request = require('request-promise');
var perPageItemNum = 20;
var domain = "http://www.ximalaya.com";

/**
 * 请求页面内容
 * 
 * @param {string} keyword 关键词
 * @param {string} type 查询分类
 * @param {string} page 页数
 */
var requestPageContent = (() => {
  var _ref = _asyncToGenerator(function* (keyword, type, page) {
    if (!keyword) throw new Error("param err");
    type = type || "t2";
    page = page || "p1";
    var content = yield request(encodeURI(`${ domain }/search/${ keyword }/${ type }${ page }`));
    return content;
  });

  return function requestPageContent(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
})();

/**
 * 获取搜索页面总数
 * 
 * @param {string} keyword
 * @param {string} type
 * @param {function(Number)} cb
 */
var getSearchPageNum = (() => {
  var _ref2 = _asyncToGenerator(function* (keyword, type) {
    if (!keyword) throw new Error("param err");
    type = type || "t2";
    var num = yield getSearchRecordNum(keyword, type);
    return Math.ceil(num / perPageItemNum);
  });

  return function getSearchPageNum(_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
})();

/**
 * 获取搜索记录数
 * 
 * @param {any} keyword 关键字
 * @param {any} type 类型
 * @returns {number} 记录数
 */
var getSearchRecordNum = (() => {
  var _ref3 = _asyncToGenerator(function* (keyword, type) {
    if (!keyword) throw new Error("param err");
    type = type || "t2";
    var page = yield requestPageContent(keyword, type, undefined);
    var $ = cheerio.load(page);
    var num = $('#searchUserPage > div.mainbox_left > div.report > div.searchHint > div.searchCount').text().replace(/[^0-9]/ig, '');
    return parseInt(num);
  });

  return function getSearchRecordNum(_x6, _x7) {
    return _ref3.apply(this, arguments);
  };
})();

/**
 * [T2]类型，获取一个页面中所有的录音信息
 * 
 * @param {string} page
 * @returns {Object}
 * 
 */
var getItemsInfoFromPage_T2 = page => {
  var $ = cheerio.load(page);
  // var result = [];
  var result = $('#searchUserPage > div.mainbox_left > div.report > div.report_listView > div > div:nth-child(1)').toArray().map(item => {
    return {
      title: $('a.soundReport_soundname', item).text(),
      tag: $('a.soundReport_tag', item).toArray().map(v => $(v).text()),
      author: $('div.soundReport_author > a', item).text().trim(),
      album: $('div.soundReport_album > a', item).text().trim(),
      playCount: $('span.sound_playcount', item).text()
    };
  });
  return result;
};

/**
 * 获取所有页面的信息
 * 
 * @param {any} keyword
 * @param {any} type
 * @returns {List} 
 */
var getItemsInfo_All = (() => {
  var _ref4 = _asyncToGenerator(function* (keyword, type) {
    var pageNum = yield getSearchPageNum(keyword, type);
    var result = [];
    var getItemFromPage;
    switch (type) {
      case "t2":
        getItemFromPage = getItemsInfoFromPage_T2;
        break;
      default:
        getItemFromPage = getItemsInfoFromPage_T2;
        break;
    }
    for (var pageIndex = 1; pageIndex <= pageNum; pageIndex++) {
      result = result.concat(getItemFromPage((yield requestPageContent(keyword, type, `p${ pageIndex }`))));
    }
    return result;
  });

  return function getItemsInfo_All(_x8, _x9) {
    return _ref4.apply(this, arguments);
  };
})();

module.exports = {
  getSearchPageNum,
  getSearchRecordNum,
  requestPageContent,
  getItemsInfoFromPage_T2,
  getItemsInfo_All
};