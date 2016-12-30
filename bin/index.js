"use strict";

/* istanbul ignore next */

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
      var getItemsFromPage;
      switch (_this4.searchType) {
        case "t2":
          getItemsFromPage = _this4.getItemsInfoFromPage_T2;
          break;
        default:
          break;
      }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJjaGVlcmlvIiwicmVxdWlyZSIsInJlcXVlc3QiLCJfIiwiQXBpUmVxdWVzdCIsImNvbnN0cnVjdG9yIiwia2V5d29yZCIsInNlYXJjaFR5cGUiLCJFcnJvciIsImRvbWFpbiIsInBlclBhZ2VJdGVtTnVtIiwicmVxdWVzdFBhZ2VDb250ZW50IiwicGFnZUlkeCIsImNvbnRlbnQiLCJlbmNvZGVVUkkiLCJnZXRTZWFyY2hQYWdlTnVtIiwibnVtIiwiZ2V0U2VhcmNoUmVjb3JkTnVtIiwiTWF0aCIsImNlaWwiLCJwYWdlIiwiJCIsImxvYWQiLCJ0ZXh0IiwicmVwbGFjZSIsInBhcnNlSW50IiwiZ2V0SXRlbXNJbmZvRnJvbVBhZ2VfVDIiLCJyZXN1bHQiLCJ0b0FycmF5IiwibWFwIiwiaXRlbSIsInRpdGxlIiwidGFnIiwidiIsImF1dGhvciIsInRyaW0iLCJhbGJ1bSIsInBsYXlDb3VudCIsImdldEl0ZW1zSW5mb19BbGwiLCJwYWdlTnVtIiwiZ2V0SXRlbXNGcm9tUGFnZSIsInBhZ2VQcm9taXNlcyIsInJhbmdlIiwicGFnZXMiLCJQcm9taXNlIiwiYWxsIiwiYVBhZ2UiLCJyZWR1Y2UiLCJwcmUiLCJjdXIiLCJjb25jYXQiLCJtb2R1bGUiLCJleHBvcnRzIiwic2VhcmNoIiwidHlwZSJdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUE7Ozs7QUFFQSxJQUFJQSxVQUFVQyxRQUFRLFNBQVIsQ0FBZDtBQUNBLElBQUlDLFVBQVVELFFBQVEsaUJBQVIsQ0FBZDtBQUNBLElBQUlFLElBQUlGLFFBQVEsUUFBUixDQUFSOztBQUVBOzs7QUFHQTs7Ozs7QUFLQSxNQUFNRyxVQUFOLENBQWlCOztBQUVmOzs7Ozs7OztBQVFBQyxjQUFZQyxPQUFaLEVBQXFCQyxVQUFyQixFQUFpQztBQUMvQixRQUFJRCxPQUFKLEVBQ0UsS0FBS0EsT0FBTCxHQUFlQSxPQUFmLENBREYsS0FHRSxNQUFNLElBQUlFLEtBQUosQ0FBVSxrREFB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QUE0Q0MsTUFBNUMsQ0FBbUQsVUFBQ0MsR0FBRCxFQUFNQyxHQUFOO0FBQUEsZUFBY0QsSUFBSUUsTUFBSixDQUFXRCxHQUFYLENBQWQ7QUFBQSxPQUFuRCxFQUFrRixFQUFsRixDQUFiO0FBQ0EsYUFBT3RCLE1BQVA7QUFidUI7QUFjeEI7O0FBaEhjOztBQXFIakI7Ozs7Ozs7QUFPQXdCLE9BQU9DLE9BQVAsQ0FBZUMsTUFBZixHQUF3QixDQUFDL0MsT0FBRCxFQUFVZ0QsSUFBVixLQUFtQjtBQUN6QyxTQUFPLElBQUlsRCxVQUFKLENBQWVFLE9BQWYsRUFBd0JnRCxJQUF4QixDQUFQO0FBQ0QsQ0FGRCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiXHJcblxyXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xyXG5cclxudmFyIGNoZWVyaW8gPSByZXF1aXJlKCdjaGVlcmlvJyk7XHJcbnZhciByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdC1wcm9taXNlJyk7XHJcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG4vLyDpnIDopoHkuIDkuKrlrprml7bov4fmnJ/nmoTnvJPlrZhcclxuXHJcblxyXG4vKipcclxuICogQVBJ6K+35rGCXHJcbiAqIFxyXG4gKiBAY2xhc3MgQXBpUmVxdWVzdFxyXG4gKi9cclxuY2xhc3MgQXBpUmVxdWVzdCB7XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgQXBpUmVxdWVzdC5cclxuICAgKiBcclxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5d29yZCDmkJzntKLlhbPplK7or41cclxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2VhcmNoVHlwZVxyXG4gICAqIFxyXG4gICAqIEBtZW1iZXJPZiBBcGlSZXF1ZXN0XHJcbiAgICovXHJcbiAgY29uc3RydWN0b3Ioa2V5d29yZCwgc2VhcmNoVHlwZSkge1xyXG4gICAgaWYgKGtleXdvcmQpXHJcbiAgICAgIHRoaXMua2V5d29yZCA9IGtleXdvcmQ7XHJcbiAgICBlbHNlXHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInBhcmFtIGVycm9yLCBrZXl3b3JkIGNhbid0IGJlIGVtcHR5IG9yIHVuZGVmaW5lZFwiKTtcclxuICAgIHRoaXMuZG9tYWluID0gXCJodHRwOi8vd3d3LnhpbWFsYXlhLmNvbVwiO1xyXG4gICAgdGhpcy5zZWFyY2hUeXBlID0gc2VhcmNoVHlwZTtcclxuXHJcbiAgICBzd2l0Y2ggKHRoaXMuc2VhcmNoVHlwZSkge1xyXG4gICAgICBjYXNlIFwidDJcIjpcclxuICAgICAgICB0aGlzLnBlclBhZ2VJdGVtTnVtID0gMjA7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgdGhpcy5zZWFyY2hUeXBlID0gXCJ0MlwiO1xyXG4gICAgICAgIHRoaXMucGVyUGFnZUl0ZW1OdW0gPSAyMDtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDor7fmsYLkuIDkuKrpobXpnaLnmoTlhoXlrrlcclxuICAgKiBcclxuICAgKiBAcGFyYW0ge251bWJlcn0gcGFnZUlkeCDpobXnoIFcclxuICAgKiBAcmV0dXJuc1xyXG4gICAqIFxyXG4gICAqIEBtZW1iZXJPZiBBcGlSZXF1ZXN0XHJcbiAgICovXHJcbiAgYXN5bmMgcmVxdWVzdFBhZ2VDb250ZW50KHBhZ2VJZHgpIHtcclxuICAgIHZhciBjb250ZW50ID0gYXdhaXQgcmVxdWVzdChlbmNvZGVVUkkoYCR7dGhpcy5kb21haW59L3NlYXJjaC8ke3RoaXMua2V5d29yZH0vJHt0aGlzLnNlYXJjaFR5cGV9czJwJHtwYWdlSWR4fHwxfWApKTtcclxuICAgIHJldHVybiBjb250ZW50O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W5pCc57Si5YyF5ZCr55qE6aG16Z2i5pWwXHJcbiAgICogXHJcbiAgICogQHJldHVybnNcclxuICAgKiBcclxuICAgKiBAbWVtYmVyT2YgQXBpUmVxdWVzdFxyXG4gICAqL1xyXG4gIGFzeW5jIGdldFNlYXJjaFBhZ2VOdW0oKSB7XHJcbiAgICB2YXIgbnVtID0gYXdhaXQgdGhpcy5nZXRTZWFyY2hSZWNvcmROdW0oKTtcclxuICAgIHJldHVybiBNYXRoLmNlaWwobnVtIC8gdGhpcy5wZXJQYWdlSXRlbU51bSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5bmkJzntKLljIXlkKvnmoTorrDlvZXmlbBcclxuICAgKiBcclxuICAgKiBAcmV0dXJuc1xyXG4gICAqIFxyXG4gICAqIEBtZW1iZXJPZiBBcGlSZXF1ZXN0XHJcbiAgICovXHJcbiAgYXN5bmMgZ2V0U2VhcmNoUmVjb3JkTnVtKCkge1xyXG4gICAgdmFyIHBhZ2UgPSBhd2FpdCB0aGlzLnJlcXVlc3RQYWdlQ29udGVudCgpO1xyXG4gICAgdmFyICQgPSBjaGVlcmlvLmxvYWQocGFnZSk7XHJcbiAgICB2YXIgbnVtID0gJCgnI3NlYXJjaFVzZXJQYWdlID4gZGl2Lm1haW5ib3hfbGVmdCA+IGRpdi5yZXBvcnQgPiBkaXYuc2VhcmNoSGludCA+IGRpdi5zZWFyY2hDb3VudCcpLnRleHQoKS5yZXBsYWNlKC9bXjAtOV0vaWcsICcnKTtcclxuICAgIHJldHVybiBwYXJzZUludChudW0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5LuO5LiA5LiqVDLnsbvlnovnmoTpobXpnaLkuK3ojrflj5bkv6Hmga9cclxuICAgKiBcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29udGVudFxyXG4gICAqIEByZXR1cm5zXHJcbiAgICogXHJcbiAgICogQG1lbWJlck9mIEFwaVJlcXVlc3RcclxuICAgKi9cclxuICBnZXRJdGVtc0luZm9Gcm9tUGFnZV9UMihjb250ZW50KSB7XHJcbiAgICB2YXIgJCA9IGNoZWVyaW8ubG9hZChjb250ZW50KTtcclxuICAgIHZhciByZXN1bHQgPSAkKCcjc2VhcmNoVXNlclBhZ2UgPiBkaXYubWFpbmJveF9sZWZ0ID4gZGl2LnJlcG9ydCA+IGRpdi5yZXBvcnRfbGlzdFZpZXcgPiBkaXYgPiBkaXY6bnRoLWNoaWxkKDEpJykudG9BcnJheSgpLm1hcChpdGVtID0+IHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0aXRsZTogJCgnYS5zb3VuZFJlcG9ydF9zb3VuZG5hbWUnLCBpdGVtKS50ZXh0KCksXHJcbiAgICAgICAgdGFnOiAkKCdhLnNvdW5kUmVwb3J0X3RhZycsIGl0ZW0pLnRvQXJyYXkoKS5tYXAodiA9PiAkKHYpLnRleHQoKSksXHJcbiAgICAgICAgYXV0aG9yOiAkKCdkaXYuc291bmRSZXBvcnRfYXV0aG9yID4gYScsIGl0ZW0pLnRleHQoKS50cmltKCksXHJcbiAgICAgICAgYWxidW06ICQoJ2Rpdi5zb3VuZFJlcG9ydF9hbGJ1bSA+IGEnLCBpdGVtKS50ZXh0KCkudHJpbSgpLFxyXG4gICAgICAgIHBsYXlDb3VudDogJCgnc3Bhbi5zb3VuZF9wbGF5Y291bnQnLCBpdGVtKS50ZXh0KClcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5bmiYDmnInpobXpnaLnmoTkv6Hmga9cclxuICAgKiBcclxuICAgKiBAcmV0dXJuc1xyXG4gICAqIFxyXG4gICAqIEBtZW1iZXJPZiBBcGlSZXF1ZXN0XHJcbiAgICovXHJcbiAgYXN5bmMgZ2V0SXRlbXNJbmZvX0FsbCgpIHtcclxuICAgIHZhciBwYWdlTnVtID0gYXdhaXQgdGhpcy5nZXRTZWFyY2hQYWdlTnVtKCk7XHJcbiAgICB2YXIgZ2V0SXRlbXNGcm9tUGFnZTtcclxuICAgIHN3aXRjaCAodGhpcy5zZWFyY2hUeXBlKSB7XHJcbiAgICAgIGNhc2UgXCJ0MlwiOlxyXG4gICAgICAgIGdldEl0ZW1zRnJvbVBhZ2UgPSB0aGlzLmdldEl0ZW1zSW5mb0Zyb21QYWdlX1QyXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgICB2YXIgcGFnZVByb21pc2VzID0gXy5yYW5nZSgxLCBwYWdlTnVtICsgMSkubWFwKHBhZ2VJZHggPT4gdGhpcy5yZXF1ZXN0UGFnZUNvbnRlbnQocGFnZUlkeCkpO1xyXG4gICAgdmFyIHBhZ2VzID0gYXdhaXQgUHJvbWlzZS5hbGwocGFnZVByb21pc2VzKTtcclxuICAgIHZhciByZXN1bHQgPSBwYWdlcy5tYXAoYVBhZ2UgPT4gZ2V0SXRlbXNGcm9tUGFnZShhUGFnZSkpLnJlZHVjZSgocHJlLCBjdXIpID0+IHByZS5jb25jYXQoY3VyKSwgW10pO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIOaQnOe0ouWFs+mUruivjVxyXG4gKiBcclxuICogQHBhcmFtIHtzdHJpbmd9IGtleXdvcmRcclxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcclxuICogQHJldHVybnNcclxuICovXHJcbm1vZHVsZS5leHBvcnRzLnNlYXJjaCA9IChrZXl3b3JkLCB0eXBlKSA9PiB7XHJcbiAgcmV0dXJuIG5ldyBBcGlSZXF1ZXN0KGtleXdvcmQsIHR5cGUpO1xyXG59Il19