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
      } else {
        throw new Error(`Cannot parse page with type : ${ _this4.searchType }`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJjaGVlcmlvIiwicmVxdWlyZSIsInJlcXVlc3QiLCJfIiwiQXBpUmVxdWVzdCIsImNvbnN0cnVjdG9yIiwia2V5d29yZCIsInNlYXJjaFR5cGUiLCJFcnJvciIsImRvbWFpbiIsInBlclBhZ2VJdGVtTnVtIiwicmVxdWVzdFBhZ2VDb250ZW50IiwicGFnZUlkeCIsImNvbnRlbnQiLCJlbmNvZGVVUkkiLCJnZXRTZWFyY2hQYWdlTnVtIiwibnVtIiwiZ2V0U2VhcmNoUmVjb3JkTnVtIiwiTWF0aCIsImNlaWwiLCJwYWdlIiwiJCIsImxvYWQiLCJ0ZXh0IiwicmVwbGFjZSIsInBhcnNlSW50IiwiZ2V0SXRlbXNJbmZvRnJvbVBhZ2VfVDIiLCJyZXN1bHQiLCJ0b0FycmF5IiwibWFwIiwiaXRlbSIsInRpdGxlIiwidGFnIiwidiIsImF1dGhvciIsInRyaW0iLCJhbGJ1bSIsInBsYXlDb3VudCIsImdldEl0ZW1zSW5mb0Zyb21QYWdlX1QzIiwibGluayIsImF0dHIiLCJpbWciLCJwdWJsaXNoZXJOYW1lIiwicHVibGlzaGVySUQiLCJnZXRJdGVtc0luZm9fQWxsIiwicGFnZU51bSIsImdldEl0ZW1zRnJvbVBhZ2UiLCJ0b1VwcGVyQ2FzZSIsInBhZ2VQcm9taXNlcyIsInJhbmdlIiwicGFnZXMiLCJQcm9taXNlIiwiYWxsIiwiYVBhZ2UiLCJyZWR1Y2UiLCJwcmUiLCJjdXIiLCJjb25jYXQiLCJtb2R1bGUiLCJleHBvcnRzIiwic2VhcmNoIiwidHlwZSJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUFFQSxJQUFJQSxVQUFVQyxRQUFRLFNBQVIsQ0FBZDtBQUNBLElBQUlDLFVBQVVELFFBQVEsaUJBQVIsQ0FBZDtBQUNBLElBQUlFLElBQUlGLFFBQVEsUUFBUixDQUFSOztBQUVBOzs7QUFHQTs7Ozs7QUFLQSxNQUFNRyxVQUFOLENBQWlCOztBQUVmOzs7Ozs7OztBQVFBQyxjQUFZQyxPQUFaLEVBQXFCQyxVQUFyQixF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dCI6WyJcInVzZSBzdHJpY3RcIlxyXG5cclxudmFyIGNoZWVyaW8gPSByZXF1aXJlKCdjaGVlcmlvJyk7XHJcbnZhciByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdC1wcm9taXNlJyk7XHJcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG4vLyDpnIDopoHkuIDkuKrlrprml7bov4fmnJ/nmoTnvJPlrZhcclxuXHJcblxyXG4vKipcclxuICogQVBJ6K+35rGCXHJcbiAqIFxyXG4gKiBAY2xhc3MgQXBpUmVxdWVzdFxyXG4gKi9cclxuY2xhc3MgQXBpUmVxdWVzdCB7XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgQXBpUmVxdWVzdC5cclxuICAgKiBcclxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5d29yZCDmkJzntKLlhbPplK7or41cclxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2VhcmNoVHlwZVxyXG4gICAqIFxyXG4gICAqIEBtZW1iZXJPZiBBcGlSZXF1ZXN0XHJcbiAgICovXHJcbiAgY29uc3RydWN0b3Ioa2V5d29yZCwgc2VhcmNoVHlwZSkge1xyXG4gICAgaWYgKGtleXdvcmQpXHJcbiAgICAgIHRoaXMua2V5d29yZCA9IGtleXdvcmQ7XHJcbiAgICBlbHNlXHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInBhcmFtIGVycm9yLCBrZXl3b3JkIGNhbid0IGJlIGVtcHR5IG9yIHVuZGVmaW5lZFwiKTtcclxuICAgIHRoaXMuZG9tYWluID0gXCJodHRwOi8vd3d3LnhpbWFsYXlhLmNvbVwiO1xyXG4gICAgdGhpcy5zZWFyY2hUeXBlID0gc2VhcmNoVHlwZSB8fCAndDInO1xyXG4gICAgdGhpcy5wZXJQYWdlSXRlbU51bSA9IDIwO1xyXG5cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOivt+axguS4gOS4qumhtemdoueahOWGheWuuVxyXG4gICAqIFxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBwYWdlSWR4IOmhteeggVxyXG4gICAqIEByZXR1cm5zXHJcbiAgICogXHJcbiAgICogQG1lbWJlck9mIEFwaVJlcXVlc3RcclxuICAgKi9cclxuICBhc3luYyByZXF1ZXN0UGFnZUNvbnRlbnQocGFnZUlkeCkge1xyXG4gICAgdmFyIGNvbnRlbnQgPSBhd2FpdCByZXF1ZXN0KGVuY29kZVVSSShgJHt0aGlzLmRvbWFpbn0vc2VhcmNoLyR7dGhpcy5rZXl3b3JkfS8ke3RoaXMuc2VhcmNoVHlwZX1zMnAke3BhZ2VJZHh8fDF9YCkpO1xyXG4gICAgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDojrflj5bmkJzntKLljIXlkKvnmoTpobXpnaLmlbBcclxuICAgKiBcclxuICAgKiBAcmV0dXJuc1xyXG4gICAqIFxyXG4gICAqIEBtZW1iZXJPZiBBcGlSZXF1ZXN0XHJcbiAgICovXHJcbiAgYXN5bmMgZ2V0U2VhcmNoUGFnZU51bSgpIHtcclxuICAgIHZhciBudW0gPSBhd2FpdCB0aGlzLmdldFNlYXJjaFJlY29yZE51bSgpO1xyXG4gICAgcmV0dXJuIE1hdGguY2VpbChudW0gLyB0aGlzLnBlclBhZ2VJdGVtTnVtKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluaQnOe0ouWMheWQq+eahOiusOW9leaVsFxyXG4gICAqIFxyXG4gICAqIEByZXR1cm5zXHJcbiAgICogXHJcbiAgICogQG1lbWJlck9mIEFwaVJlcXVlc3RcclxuICAgKi9cclxuICBhc3luYyBnZXRTZWFyY2hSZWNvcmROdW0oKSB7XHJcbiAgICAvLyDlvZPmkJzntKLorrDlvZXlpKfkuo4xMDAw5pe277yM5pi+56S65Li6MTAwMCvvvIzov5nph4zpnIDopoFmaXhcclxuICAgIHZhciBwYWdlID0gYXdhaXQgdGhpcy5yZXF1ZXN0UGFnZUNvbnRlbnQoKTtcclxuICAgIHZhciAkID0gY2hlZXJpby5sb2FkKHBhZ2UpO1xyXG4gICAgdmFyIG51bSA9ICQoJyNzZWFyY2hVc2VyUGFnZSA+IGRpdi5tYWluYm94X2xlZnQgPiBkaXYucmVwb3J0ID4gZGl2LnNlYXJjaEhpbnQgPiBkaXYuc2VhcmNoQ291bnQnKS50ZXh0KCkucmVwbGFjZSgvW14wLTldL2lnLCAnJyk7XHJcbiAgICByZXR1cm4gcGFyc2VJbnQobnVtKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOS7juS4gOS4qlQy57G75Z6L55qE6aG16Z2i5Lit6I635Y+W5L+h5oGvXHJcbiAgICogXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbnRlbnRcclxuICAgKiBAcmV0dXJuc1xyXG4gICAqIFxyXG4gICAqIEBtZW1iZXJPZiBBcGlSZXF1ZXN0XHJcbiAgICovXHJcbiAgZ2V0SXRlbXNJbmZvRnJvbVBhZ2VfVDIoY29udGVudCkge1xyXG4gICAgdmFyICQgPSBjaGVlcmlvLmxvYWQoY29udGVudCk7XHJcbiAgICB2YXIgcmVzdWx0ID0gJCgnI3NlYXJjaFVzZXJQYWdlID4gZGl2Lm1haW5ib3hfbGVmdCA+IGRpdi5yZXBvcnQgPiBkaXYucmVwb3J0X2xpc3RWaWV3ID4gZGl2ID4gZGl2Om50aC1jaGlsZCgxKScpLnRvQXJyYXkoKS5tYXAoaXRlbSA9PiB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdGl0bGU6ICQoJ2Euc291bmRSZXBvcnRfc291bmRuYW1lJywgaXRlbSkudGV4dCgpLFxyXG4gICAgICAgIHRhZzogJCgnYS5zb3VuZFJlcG9ydF90YWcnLCBpdGVtKS50b0FycmF5KCkubWFwKHYgPT4gJCh2KS50ZXh0KCkpLFxyXG4gICAgICAgIGF1dGhvcjogJCgnZGl2LnNvdW5kUmVwb3J0X2F1dGhvciA+IGEnLCBpdGVtKS50ZXh0KCkudHJpbSgpLFxyXG4gICAgICAgIGFsYnVtOiAkKCdkaXYuc291bmRSZXBvcnRfYWxidW0gPiBhJywgaXRlbSkudGV4dCgpLnRyaW0oKSxcclxuICAgICAgICBwbGF5Q291bnQ6ICQoJ3NwYW4uc291bmRfcGxheWNvdW50JywgaXRlbSkudGV4dCgpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5LuO5LiA5LiqVDPnsbvlnovnmoTpobXpnaLkuK3ojrflj5bkv6Hmga9cclxuICAgKiBcclxuICAgKiBcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29udGVudCDpobXpnaLlhoXlrrlcclxuICAgKiBcclxuICAgKiBAbWVtYmVyT2YgQXBpUmVxdWVzdFxyXG4gICAqL1xyXG4gIGdldEl0ZW1zSW5mb0Zyb21QYWdlX1QzKGNvbnRlbnQpIHtcclxuICAgIHZhciAkID0gY2hlZXJpby5sb2FkKGNvbnRlbnQpO1xyXG4gICAgdmFyIHJlc3VsdCA9ICQoJy5ib2R5X2xpc3QgPiBsaS5pdGVtJykudG9BcnJheSgpLm1hcChpdGVtID0+IHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBsaW5rOiAkKCcucGljdHVyZSBhJywgaXRlbSkuYXR0cignaHJlZicpLFxyXG4gICAgICAgIGltZzogJCgnLnBpY3R1cmUgYSBzcGFuIGltZycsIGl0ZW0pLmF0dHIoJ3NyYycpLFxyXG4gICAgICAgIHRpdGxlOiAkKCcudGl0bGUgYScsIGl0ZW0pLnRleHQoKSxcclxuICAgICAgICBwdWJsaXNoZXJOYW1lOiAkKCcubGFzdCBhJywgaXRlbSkudGV4dCgpLnRyaW0oKSxcclxuICAgICAgICBwdWJsaXNoZXJJRDogJCgnLmxhc3QgYScsIGl0ZW0pLmF0dHIoJ2NhcmQnKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluaJgOaciemhtemdoueahOS/oeaBr1xyXG4gICAqIFxyXG4gICAqIEByZXR1cm5zXHJcbiAgICogXHJcbiAgICogQG1lbWJlck9mIEFwaVJlcXVlc3RcclxuICAgKi9cclxuICBhc3luYyBnZXRJdGVtc0luZm9fQWxsKCkge1xyXG4gICAgdmFyIHBhZ2VOdW0gPSBhd2FpdCB0aGlzLmdldFNlYXJjaFBhZ2VOdW0oKTtcclxuICAgIHZhciBnZXRJdGVtc0Zyb21QYWdlID0gdGhpc1tgZ2V0SXRlbXNJbmZvRnJvbVBhZ2VfJHt0aGlzLnNlYXJjaFR5cGUudG9VcHBlckNhc2UoKX1gXVxyXG4gICAgaWYgKGdldEl0ZW1zRnJvbVBhZ2UpIHtcclxuICAgICAgdmFyIHBhZ2VQcm9taXNlcyA9IF8ucmFuZ2UoMSwgcGFnZU51bSArIDEpLm1hcChwYWdlSWR4ID0+IHRoaXMucmVxdWVzdFBhZ2VDb250ZW50KHBhZ2VJZHgpKTtcclxuICAgICAgdmFyIHBhZ2VzID0gYXdhaXQgUHJvbWlzZS5hbGwocGFnZVByb21pc2VzKTtcclxuICAgICAgdmFyIHJlc3VsdCA9IHBhZ2VzLm1hcChhUGFnZSA9PiBnZXRJdGVtc0Zyb21QYWdlKGFQYWdlKSkucmVkdWNlKChwcmUsIGN1cikgPT4gcHJlLmNvbmNhdChjdXIpLCBbXSk7XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBwYXJzZSBwYWdlIHdpdGggdHlwZSA6ICR7dGhpcy5zZWFyY2hUeXBlfWApXHJcbiAgICB9XHJcbiAgfVxyXG5cclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiDmkJzntKLlhbPplK7or41cclxuICogXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXl3b3JkXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXHJcbiAqIEByZXR1cm5zXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cy5zZWFyY2ggPSAoa2V5d29yZCwgdHlwZSkgPT4ge1xyXG4gIHJldHVybiBuZXcgQXBpUmVxdWVzdChrZXl3b3JkLCB0eXBlKTtcclxufSJdfQ==