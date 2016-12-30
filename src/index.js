"use strict"

var cheerio = require('cheerio');
var request = require('request-promise');
var _ = require('lodash');

// 需要一个定时过期的缓存


/**
 * API请求
 * 
 * @class ApiRequest
 */
class ApiRequest {

  /**
   * Creates an instance of ApiRequest.
   * 
   * @param {string} keyword 搜索关键词
   * @param {string} searchType
   * 
   * @memberOf ApiRequest
   */
  constructor(keyword, searchType) {
    if (keyword)
      this.keyword = keyword;
    else
      throw new Error("param error, keyword can't be empty or undefined");
    this.domain = "http://www.ximalaya.com";
    this.searchType = searchType;

    switch (this.searchType) {
      case "t2":
        this.perPageItemNum = 20;
        break;
      default:
        this.searchType = "t2";
        this.perPageItemNum = 20;
        break;
    }

  }

  /**
   * 请求一个页面的内容
   * 
   * @param {number} pageIdx 页码
   * @returns
   * 
   * @memberOf ApiRequest
   */
  async requestPageContent(pageIdx) {
    var content = await request(encodeURI(`${this.domain}/search/${this.keyword}/${this.searchType}s2p${pageIdx||1}`));
    return content;
  }

  /**
   * 获取搜索包含的页面数
   * 
   * @returns
   * 
   * @memberOf ApiRequest
   */
  async getSearchPageNum() {
    var num = await this.getSearchRecordNum();
    return Math.ceil(num / this.perPageItemNum);
  }

  /**
   * 获取搜索包含的记录数
   * 
   * @returns
   * 
   * @memberOf ApiRequest
   */
  async getSearchRecordNum() {
    var page = await this.requestPageContent();
    var $ = cheerio.load(page);
    var num = $('#searchUserPage > div.mainbox_left > div.report > div.searchHint > div.searchCount').text().replace(/[^0-9]/ig, '');
    return parseInt(num);
  }

  /**
   * 从一个T2类型的页面中获取信息
   * 
   * @param {string} content
   * @returns
   * 
   * @memberOf ApiRequest
   */
  getItemsInfoFromPage_T2(content) {
    var $ = cheerio.load(content);
    var result = $('#searchUserPage > div.mainbox_left > div.report > div.report_listView > div > div:nth-child(1)').toArray().map(item => {
      return {
        title: $('a.soundReport_soundname', item).text(),
        tag: $('a.soundReport_tag', item).toArray().map(v => $(v).text()),
        author: $('div.soundReport_author > a', item).text().trim(),
        album: $('div.soundReport_album > a', item).text().trim(),
        playCount: $('span.sound_playcount', item).text()
      }
    })
    return result;
  }

  /**
   * 获取所有页面的信息
   * 
   * @returns
   * 
   * @memberOf ApiRequest
   */
  async getItemsInfo_All() {
    var pageNum = await this.getSearchPageNum();
    var getItemsFromPage;
    switch (this.searchType) {
      case "t2":
        getItemsFromPage = this.getItemsInfoFromPage_T2
        break;
      default:
        break;
    }
    var pagePromises = _.range(1, pageNum + 1).map(pageIdx => this.requestPageContent(pageIdx));
    var pages = await Promise.all(pagePromises);
    var result = pages.map(aPage => getItemsFromPage(aPage)).reduce((pre, cur) => pre.concat(cur), []);
    return result;
  }

}


/**
 * 搜索关键词
 * 
 * @param {string} keyword
 * @param {string} type
 * @returns
 */
module.exports.search = (keyword, type) => {
  return new ApiRequest(keyword, type);
}