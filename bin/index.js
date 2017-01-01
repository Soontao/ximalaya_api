"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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
    if (keyword) this.keyword = keyword;else throw new Error("param error, keyword can't be empty or undefined");
    this.domain = "http://www.ximalaya.com";
    this.searchType = searchType || 't2';
    this.perPageItemNum = 20;
  }

  /**
   * 请求一个页面的内容
   * 
   * @param {number} pageIdx 页码
   * @returns
   * 
   * @memberOf ApiRequest
   */
  requestPageContent(pageIdx) {
    var _this = this;

    return _asyncToGenerator(function* () {
      var content = yield request(encodeURI(`${ _this.domain }/search/${ _this.keyword }/${ _this.searchType }s2p${ pageIdx || 1 }`));
      return content;
    })();
  }

  /**
   * 获取搜索包含的页面数
   * 
   * @returns
   * 
   * @memberOf ApiRequest
   */
  getSearchPageNum() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      var num = yield _this2.getSearchRecordNum();
      return Math.ceil(num / _this2.perPageItemNum);
    })();
  }

  /**
   * 获取搜索包含的记录数
   * 
   * @returns
   * 
   * @memberOf ApiRequest
   */
  getSearchRecordNum() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      // 当搜索记录大于1000时，显示为1000+，这里需要fix
      var page = yield _this3.requestPageContent();
      var $ = cheerio.load(page);
      var num = $('#searchUserPage > div.mainbox_left > div.report > div.searchHint > div.searchCount').text().replace(/[^0-9]/ig, '');
      return parseInt(num);
    })();
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
      };
    });
    return result;
  }

  /**
   * 从一个T3类型的页面中获取信息
   * 
   * 
   * @param {string} content 页面内容
   * 
   * @memberOf ApiRequest
   */
  getItemsInfoFromPage_T3(content) {
    var $ = cheerio.load(content);
    var result = $('.body_list > li.item').toArray().map(item => {
      return {
        link: $('.picture a', item).attr('href'),
        img: $('.picture a span img', item).attr('src'),
        title: $('.title a', item).text(),
        publisherName: $('.last a', item).text().trim(),
        publisherID: $('.last a', item).attr('card')
      };
    });
    return result;
  }

  /**
   * 获取所有页面的信息
   * 
   * @returns
   * 
   * @memberOf ApiRequest
   */
  getItemsInfo_All() {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      var pageNum = yield _this4.getSearchPageNum();
      var getItemsFromPage = _this4[`getItemsInfoFromPage_${ _this4.searchType.toUpperCase() }`];
      if (getItemsFromPage) {
        var pagePromises = _.range(1, pageNum + 1).map(function (pageIdx) {
          return _this4.requestPageContent(pageIdx);
        });
        var pages = yield Promise.all(pagePromises);
        var result = pages.map(function (aPage) {
          return getItemsFromPage(aPage);
        }).reduce(function (pre, cur) {
          return pre.concat(cur);
        }, []);
        return result;
      }
    })();
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
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJjaGVlcmlvIiwicmVxdWlyZSIsInJlcXVlc3QiLCJfIiwiQXBpUmVxdWVzdCIsImNvbnN0cnVjdG9yIiwia2V5d29yZCIsInNlYXJjaFR5cGUiLCJFcnJvciIsImRvbWFpbiIsInBlclBhZ2VJdGVtTnVtIiwicmVxdWVzdFBhZ2VDb250ZW50IiwicGFnZUlkeCIsImNvbnRlbnQiLCJlbmNvZGVVUkkiLCJnZXRTZWFyY2hQYWdlTnVtIiwibnVtIiwiZ2V0U2VhcmNoUmVjb3JkTnVtIiwiTWF0aCIsImNlaWwiLCJwYWdlIiwiJCIsImxvYWQiLCJ0ZXh0IiwicmVwbGFjZSIsInBhcnNlSW50IiwiZ2V0SXRlbXNJbmZvRnJvbVBhZ2VfVDIiLCJyZXN1bHQiLCJ0b0FycmF5IiwibWFwIiwiaXRlbSIsInRpdGxlIiwidGFnIiwidiIsImF1dGhvciIsInRyaW0iLCJhbGJ1bSIsInBsYXlDb3VudCIsImdldEl0ZW1zSW5mb0Zyb21QYWdlX1QzIiwibGluayIsImF0dHIiLCJpbWciLCJwdWJsaXNoZXJOYW1lIiwicHVibGlzaGVySUQiLCJnZXRJdGVtc0luZm9fQWxsIiwicGFnZU51bSIsImdldEl0ZW1zRnJvbVBhZ2UiLCJ0b1VwcGVyQ2FzZSIsInBhZ2VQcm9taXNlcyIsInJhbmdlIiwicGFnZXMiLCJQcm9taXNlIiwiYWxsIiwiYVBhZ2UiLCJyZWR1Y2UiLCJwcmUiLCJjdXIiLCJjb25jYXQiLCJtb2R1bGUiLCJleHBvcnRzIiwic2VhcmNoIiwidHlwZSJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUFFQSxJQUFJQSxVQUFVQyxRQUFRLFNBQVIsQ0FBZDtBQUNBLElBQUlDLFVBQVVELFFBQVEsaUJBQVIsQ0FBZDtBQUNBLElBQUlFLElBQUlGLFFBQVEsUUFBUixDQUFSOztBQUVBOzs7QUFHQTs7Ozs7QUFLQSxNQUFNRyxVQUFOLENBQWlCOztBQUVmOzs7Ozs7OztBQVFBQyxjQUFZQyxPQUFaLEVBQXFCQyxVQUFyQixF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Q0FBd0IsTUFBeEI7QUFMUixPQUFQO0FBT0QsS0FSWSxDQUFiO0FBU0EsV0FBT2IsTUFBUDtBQUNEOztBQUVEOzs7Ozs7O0FBT01pQixrQkFBTixHQUF5QjtBQUFBOztBQUFBO0FBQ3ZCLFVBQUlDLFVBQVUsTUFBTSxPQUFLOUIsZ0JBQUwsRUFBcEI7QUFDQSxVQUFJK0IsbUJBQW1CLE9BQU0seUJBQXVCLE9BQUt2QyxVQUFMLENBQWdCd0MsV0FBaEIsRUFBOEIsR0FBM0QsQ0FBdkI7QUFDQSxVQUFJRCxnQkFBSixFQUFzQjtBQUNwQixZQUFJRSxlQUFlN0MsRUFBRThDLEtBQUYsQ0FBUSxDQUFSLEVBQVdKLFVBQVUsQ0FBckIsRUFBd0JoQixHQUF4QixDQUE0QjtBQUFBLGlCQUFXLE9BQUtsQixrQkFBTCxDQUF3QkMsT0FBeEIsQ0FBWDtBQUFBLFNBQTVCLENBQW5CO0FBQ0EsWUFBSXNDLFFBQVEsTUFBTUMsUUFBUUMsR0FBUixDQUFZSixZQUFaLENBQWxCO0FBQ0EsWUFBSXJCLFNBQVN1QixNQUFNckIsR0FBTixDQUFVO0FBQUEsaUJBQVNpQixpQkFBaUJPLEtBQWpCLENBQVQ7QUFBQSxTQUFWLEVBQTRDQyxNQUE1QyxDQUFtRCxVQUFDQyxHQUFELEVBQU1DLEdBQU47QUFBQSxpQkFBY0QsSUFBSUUsTUFBSixDQUFXRCxHQUFYLENBQWQ7QUFBQSxTQUFuRCxFQUFrRixFQUFsRixDQUFiO0FBQ0EsZUFBTzdCLE1BQVA7QUFDRDtBQVJzQjtBQVN4Qjs7QUF6SGM7O0FBOEhqQjs7Ozs7OztBQU9BK0IsT0FBT0MsT0FBUCxDQUFlQyxNQUFmLEdBQXdCLENBQUN0RCxPQUFELEVBQVV1RCxJQUFWLEtBQW1CO0FBQ3pDLFNBQU8sSUFBSXpELFVBQUosQ0FBZUUsT0FBZixFQUF3QnVELElBQXhCLENBQVA7QUFDRCxDQUZEIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbnZhciBjaGVlcmlvID0gcmVxdWlyZSgnY2hlZXJpbycpO1xyXG52YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3QtcHJvbWlzZScpO1xyXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5cclxuLy8g6ZyA6KaB5LiA5Liq5a6a5pe26L+H5pyf55qE57yT5a2YXHJcblxyXG5cclxuLyoqXHJcbiAqIEFQSeivt+axglxyXG4gKiBcclxuICogQGNsYXNzIEFwaVJlcXVlc3RcclxuICovXHJcbmNsYXNzIEFwaVJlcXVlc3Qge1xyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIEFwaVJlcXVlc3QuXHJcbiAgICogXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleXdvcmQg5pCc57Si5YWz6ZSu6K+NXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlYXJjaFR5cGVcclxuICAgKiBcclxuICAgKiBAbWVtYmVyT2YgQXBpUmVxdWVzdFxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKGtleXdvcmQsIHNlYXJjaFR5cGUpIHtcclxuICAgIGlmIChrZXl3b3JkKVxyXG4gICAgICB0aGlzLmtleXdvcmQgPSBrZXl3b3JkO1xyXG4gICAgZWxzZVxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJhbSBlcnJvciwga2V5d29yZCBjYW4ndCBiZSBlbXB0eSBvciB1bmRlZmluZWRcIik7XHJcbiAgICB0aGlzLmRvbWFpbiA9IFwiaHR0cDovL3d3dy54aW1hbGF5YS5jb21cIjtcclxuICAgIHRoaXMuc2VhcmNoVHlwZSA9IHNlYXJjaFR5cGUgfHwgJ3QyJztcclxuICAgIHRoaXMucGVyUGFnZUl0ZW1OdW0gPSAyMDtcclxuXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDor7fmsYLkuIDkuKrpobXpnaLnmoTlhoXlrrlcclxuICAgKiBcclxuICAgKiBAcGFyYW0ge251bWJlcn0gcGFnZUlkeCDpobXnoIFcclxuICAgKiBAcmV0dXJuc1xyXG4gICAqIFxyXG4gICAqIEBtZW1iZXJPZiBBcGlSZXF1ZXN0XHJcbiAgICovXHJcbiAgYXN5bmMgcmVxdWVzdFBhZ2VDb250ZW50KHBhZ2VJZHgpIHtcclxuICAgIHZhciBjb250ZW50ID0gYXdhaXQgcmVxdWVzdChlbmNvZGVVUkkoYCR7dGhpcy5kb21haW59L3NlYXJjaC8ke3RoaXMua2V5d29yZH0vJHt0aGlzLnNlYXJjaFR5cGV9czJwJHtwYWdlSWR4fHwxfWApKTtcclxuICAgIHJldHVybiBjb250ZW50O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W5pCc57Si5YyF5ZCr55qE6aG16Z2i5pWwXHJcbiAgICogXHJcbiAgICogQHJldHVybnNcclxuICAgKiBcclxuICAgKiBAbWVtYmVyT2YgQXBpUmVxdWVzdFxyXG4gICAqL1xyXG4gIGFzeW5jIGdldFNlYXJjaFBhZ2VOdW0oKSB7XHJcbiAgICB2YXIgbnVtID0gYXdhaXQgdGhpcy5nZXRTZWFyY2hSZWNvcmROdW0oKTtcclxuICAgIHJldHVybiBNYXRoLmNlaWwobnVtIC8gdGhpcy5wZXJQYWdlSXRlbU51bSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5bmkJzntKLljIXlkKvnmoTorrDlvZXmlbBcclxuICAgKiBcclxuICAgKiBAcmV0dXJuc1xyXG4gICAqIFxyXG4gICAqIEBtZW1iZXJPZiBBcGlSZXF1ZXN0XHJcbiAgICovXHJcbiAgYXN5bmMgZ2V0U2VhcmNoUmVjb3JkTnVtKCkge1xyXG4gICAgLy8g5b2T5pCc57Si6K6w5b2V5aSn5LqOMTAwMOaXtu+8jOaYvuekuuS4ujEwMDAr77yM6L+Z6YeM6ZyA6KaBZml4XHJcbiAgICB2YXIgcGFnZSA9IGF3YWl0IHRoaXMucmVxdWVzdFBhZ2VDb250ZW50KCk7XHJcbiAgICB2YXIgJCA9IGNoZWVyaW8ubG9hZChwYWdlKTtcclxuICAgIHZhciBudW0gPSAkKCcjc2VhcmNoVXNlclBhZ2UgPiBkaXYubWFpbmJveF9sZWZ0ID4gZGl2LnJlcG9ydCA+IGRpdi5zZWFyY2hIaW50ID4gZGl2LnNlYXJjaENvdW50JykudGV4dCgpLnJlcGxhY2UoL1teMC05XS9pZywgJycpO1xyXG4gICAgcmV0dXJuIHBhcnNlSW50KG51bSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDku47kuIDkuKpUMuexu+Wei+eahOmhtemdouS4reiOt+WPluS/oeaBr1xyXG4gICAqIFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50XHJcbiAgICogQHJldHVybnNcclxuICAgKiBcclxuICAgKiBAbWVtYmVyT2YgQXBpUmVxdWVzdFxyXG4gICAqL1xyXG4gIGdldEl0ZW1zSW5mb0Zyb21QYWdlX1QyKGNvbnRlbnQpIHtcclxuICAgIHZhciAkID0gY2hlZXJpby5sb2FkKGNvbnRlbnQpO1xyXG4gICAgdmFyIHJlc3VsdCA9ICQoJyNzZWFyY2hVc2VyUGFnZSA+IGRpdi5tYWluYm94X2xlZnQgPiBkaXYucmVwb3J0ID4gZGl2LnJlcG9ydF9saXN0VmlldyA+IGRpdiA+IGRpdjpudGgtY2hpbGQoMSknKS50b0FycmF5KCkubWFwKGl0ZW0gPT4ge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHRpdGxlOiAkKCdhLnNvdW5kUmVwb3J0X3NvdW5kbmFtZScsIGl0ZW0pLnRleHQoKSxcclxuICAgICAgICB0YWc6ICQoJ2Euc291bmRSZXBvcnRfdGFnJywgaXRlbSkudG9BcnJheSgpLm1hcCh2ID0+ICQodikudGV4dCgpKSxcclxuICAgICAgICBhdXRob3I6ICQoJ2Rpdi5zb3VuZFJlcG9ydF9hdXRob3IgPiBhJywgaXRlbSkudGV4dCgpLnRyaW0oKSxcclxuICAgICAgICBhbGJ1bTogJCgnZGl2LnNvdW5kUmVwb3J0X2FsYnVtID4gYScsIGl0ZW0pLnRleHQoKS50cmltKCksXHJcbiAgICAgICAgcGxheUNvdW50OiAkKCdzcGFuLnNvdW5kX3BsYXljb3VudCcsIGl0ZW0pLnRleHQoKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOS7juS4gOS4qlQz57G75Z6L55qE6aG16Z2i5Lit6I635Y+W5L+h5oGvXHJcbiAgICogXHJcbiAgICogXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbnRlbnQg6aG16Z2i5YaF5a65XHJcbiAgICogXHJcbiAgICogQG1lbWJlck9mIEFwaVJlcXVlc3RcclxuICAgKi9cclxuICBnZXRJdGVtc0luZm9Gcm9tUGFnZV9UMyhjb250ZW50KSB7XHJcbiAgICB2YXIgJCA9IGNoZWVyaW8ubG9hZChjb250ZW50KTtcclxuICAgIHZhciByZXN1bHQgPSAkKCcuYm9keV9saXN0ID4gbGkuaXRlbScpLnRvQXJyYXkoKS5tYXAoaXRlbSA9PiB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgbGluazogJCgnLnBpY3R1cmUgYScsIGl0ZW0pLmF0dHIoJ2hyZWYnKSxcclxuICAgICAgICBpbWc6ICQoJy5waWN0dXJlIGEgc3BhbiBpbWcnLCBpdGVtKS5hdHRyKCdzcmMnKSxcclxuICAgICAgICB0aXRsZTogJCgnLnRpdGxlIGEnLCBpdGVtKS50ZXh0KCksXHJcbiAgICAgICAgcHVibGlzaGVyTmFtZTogJCgnLmxhc3QgYScsIGl0ZW0pLnRleHQoKS50cmltKCksXHJcbiAgICAgICAgcHVibGlzaGVySUQ6ICQoJy5sYXN0IGEnLCBpdGVtKS5hdHRyKCdjYXJkJylcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5bmiYDmnInpobXpnaLnmoTkv6Hmga9cclxuICAgKiBcclxuICAgKiBAcmV0dXJuc1xyXG4gICAqIFxyXG4gICAqIEBtZW1iZXJPZiBBcGlSZXF1ZXN0XHJcbiAgICovXHJcbiAgYXN5bmMgZ2V0SXRlbXNJbmZvX0FsbCgpIHtcclxuICAgIHZhciBwYWdlTnVtID0gYXdhaXQgdGhpcy5nZXRTZWFyY2hQYWdlTnVtKCk7XHJcbiAgICB2YXIgZ2V0SXRlbXNGcm9tUGFnZSA9IHRoaXNbYGdldEl0ZW1zSW5mb0Zyb21QYWdlXyR7dGhpcy5zZWFyY2hUeXBlLnRvVXBwZXJDYXNlKCl9YF1cclxuICAgIGlmIChnZXRJdGVtc0Zyb21QYWdlKSB7XHJcbiAgICAgIHZhciBwYWdlUHJvbWlzZXMgPSBfLnJhbmdlKDEsIHBhZ2VOdW0gKyAxKS5tYXAocGFnZUlkeCA9PiB0aGlzLnJlcXVlc3RQYWdlQ29udGVudChwYWdlSWR4KSk7XHJcbiAgICAgIHZhciBwYWdlcyA9IGF3YWl0IFByb21pc2UuYWxsKHBhZ2VQcm9taXNlcyk7XHJcbiAgICAgIHZhciByZXN1bHQgPSBwYWdlcy5tYXAoYVBhZ2UgPT4gZ2V0SXRlbXNGcm9tUGFnZShhUGFnZSkpLnJlZHVjZSgocHJlLCBjdXIpID0+IHByZS5jb25jYXQoY3VyKSwgW10pO1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbn1cclxuXHJcblxyXG4vKipcclxuICog5pCc57Si5YWz6ZSu6K+NXHJcbiAqIFxyXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5d29yZFxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxyXG4gKiBAcmV0dXJuc1xyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMuc2VhcmNoID0gKGtleXdvcmQsIHR5cGUpID0+IHtcclxuICByZXR1cm4gbmV3IEFwaVJlcXVlc3Qoa2V5d29yZCwgdHlwZSk7XHJcbn0iXX0=