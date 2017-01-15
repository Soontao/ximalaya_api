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
      var content = yield request(encodeURI(`${ _this.domain }/search/${ _this.keyword }/${ _this.searchType }p${ pageIdx || 1 }`));
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
   * 从一个T4类型的页面中获取信息
   * 
   * @param {string} content
   * 
   * @memberOf ApiRequest
   */
  getItemsInfoFromPage_T4(content) {
    var $ = cheerio.load(content);
    var result = $('.body_list > li.item').toArray().map(item => {
      return {
        publisher_id: $('.detail_top > a', item).attr('card'),
        publisher_name: $('.detail_top > .username', item).text().trim(),
        publisher_icon: $('.picture > a > img', item).attr('src'),
        content: $('.detail_content', item).text().trim(),
        sound_counter: $('.detail_bottom > .sound_counter', item).text().trim(),
        follower_counter: $('.detail_bottom > .follower_counter', item).text().trim()
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJjaGVlcmlvIiwicmVxdWlyZSIsInJlcXVlc3QiLCJfIiwiQXBpUmVxdWVzdCIsImNvbnN0cnVjdG9yIiwia2V5d29yZCIsInNlYXJjaFR5cGUiLCJFcnJvciIsImRvbWFpbiIsInBlclBhZ2VJdGVtTnVtIiwicmVxdWVzdFBhZ2VDb250ZW50IiwicGFnZUlkeCIsImNvbnRlbnQiLCJlbmNvZGVVUkkiLCJnZXRTZWFyY2hQYWdlTnVtIiwibnVtIiwiZ2V0U2VhcmNoUmVjb3JkTnVtIiwiTWF0aCIsImNlaWwiLCJwYWdlIiwiJCIsImxvYWQiLCJ0ZXh0IiwicmVwbGFjZSIsInBhcnNlSW50IiwiZ2V0SXRlbXNJbmZvRnJvbVBhZ2VfVDIiLCJyZXN1bHQiLCJ0b0FycmF5IiwibWFwIiwiaXRlbSIsInRpdGxlIiwidGFnIiwidiIsImF1dGhvciIsInRyaW0iLCJhbGJ1bSIsInBsYXlDb3VudCIsImdldEl0ZW1zSW5mb0Zyb21QYWdlX1QzIiwibGluayIsImF0dHIiLCJpbWciLCJwdWJsaXNoZXJOYW1lIiwicHVibGlzaGVySUQiLCJnZXRJdGVtc0luZm9Gcm9tUGFnZV9UNCIsInB1Ymxpc2hlcl9pZCIsInB1Ymxpc2hlcl9uYW1lIiwicHVibGlzaGVyX2ljb24iLCJzb3VuZF9jb3VudGVyIiwiZm9sbG93ZXJfY291bnRlciIsImdldEl0ZW1zSW5mb19BbGwiLCJwYWdlTnVtIiwiZ2V0SXRlbXNGcm9tUGFnZSIsInRvVXBwZXJDYXNlIiwicGFnZVByb21pc2VzIiwicmFuZ2UiLCJwYWdlcyIsIlByb21pc2UiLCJhbGwiLCJhUGFnZSIsInJlZHVjZSIsInByZSIsImN1ciIsImNvbmNhdCIsIm1vZHVsZSIsImV4cG9ydHMiLCJzZWFyY2giLCJ0eXBlIl0sIm1hcHBpbmdzIjoiQUFBQTs7OztBQUVBLElBQUlBLFVBQVVDLFFBQVEsU0FBUixDQUFkO0FBQ0EsSUFBSUMsVUFBVUQsUUFBUSxpQkFBUixDQUFkO0FBQ0Es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QixPQUFLN0MsVUFBTCxDQUFnQjhDLFdBQWhCLEVBQThCLEdBQTNELENBQXZCO0FBQ0EsVUFBSUQsZ0JBQUosRUFBc0I7QUFDcEIsWUFBSUUsZUFBZW5ELEVBQUVvRCxLQUFGLENBQVEsQ0FBUixFQUFXSixVQUFVLENBQXJCLEVBQXdCdEIsR0FBeEIsQ0FBNEI7QUFBQSxpQkFBVyxPQUFLbEIsa0JBQUwsQ0FBd0JDLE9BQXhCLENBQVg7QUFBQSxTQUE1QixDQUFuQjtBQUNBLFlBQUk0QyxRQUFRLE1BQU1DLFFBQVFDLEdBQVIsQ0FBWUosWUFBWixDQUFsQjtBQUNBLFlBQUkzQixTQUFTNkIsTUFBTTNCLEdBQU4sQ0FBVTtBQUFBLGlCQUFTdUIsaUJBQWlCTyxLQUFqQixDQUFUO0FBQUEsU0FBVixFQUE0Q0MsTUFBNUMsQ0FBbUQsVUFBQ0MsR0FBRCxFQUFNQyxHQUFOO0FBQUEsaUJBQWNELElBQUlFLE1BQUosQ0FBV0QsR0FBWCxDQUFkO0FBQUEsU0FBbkQsRUFBa0YsRUFBbEYsQ0FBYjtBQUNBLGVBQU9uQyxNQUFQO0FBQ0QsT0FMRCxNQUtPO0FBQ0wsY0FBTSxJQUFJbkIsS0FBSixDQUFXLGtDQUFnQyxPQUFLRCxVQUFXLEdBQTNELENBQU47QUFDRDtBQVZzQjtBQVd4Qjs7QUFqSmM7O0FBc0pqQjs7Ozs7OztBQU9BeUQsT0FBT0MsT0FBUCxDQUFlQyxNQUFmLEdBQXdCLENBQUM1RCxPQUFELEVBQVU2RCxJQUFWLEtBQW1CO0FBQ3pDLFNBQU8sSUFBSS9ELFVBQUosQ0FBZUUsT0FBZixFQUF3QjZELElBQXhCLENBQVA7QUFDRCxDQUZEIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbnZhciBjaGVlcmlvID0gcmVxdWlyZSgnY2hlZXJpbycpO1xyXG52YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3QtcHJvbWlzZScpO1xyXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5cclxuLy8g6ZyA6KaB5LiA5Liq5a6a5pe26L+H5pyf55qE57yT5a2YXHJcblxyXG5cclxuLyoqXHJcbiAqIEFQSeivt+axglxyXG4gKiBcclxuICogQGNsYXNzIEFwaVJlcXVlc3RcclxuICovXHJcbmNsYXNzIEFwaVJlcXVlc3Qge1xyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIEFwaVJlcXVlc3QuXHJcbiAgICogXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleXdvcmQg5pCc57Si5YWz6ZSu6K+NXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlYXJjaFR5cGVcclxuICAgKiBcclxuICAgKiBAbWVtYmVyT2YgQXBpUmVxdWVzdFxyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yKGtleXdvcmQsIHNlYXJjaFR5cGUpIHtcclxuICAgIGlmIChrZXl3b3JkKVxyXG4gICAgICB0aGlzLmtleXdvcmQgPSBrZXl3b3JkO1xyXG4gICAgZWxzZVxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJhbSBlcnJvciwga2V5d29yZCBjYW4ndCBiZSBlbXB0eSBvciB1bmRlZmluZWRcIik7XHJcbiAgICB0aGlzLmRvbWFpbiA9IFwiaHR0cDovL3d3dy54aW1hbGF5YS5jb21cIjtcclxuICAgIHRoaXMuc2VhcmNoVHlwZSA9IHNlYXJjaFR5cGUgfHwgJ3QyJztcclxuICAgIHRoaXMucGVyUGFnZUl0ZW1OdW0gPSAyMDtcclxuXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDor7fmsYLkuIDkuKrpobXpnaLnmoTlhoXlrrlcclxuICAgKiBcclxuICAgKiBAcGFyYW0ge251bWJlcn0gcGFnZUlkeCDpobXnoIFcclxuICAgKiBAcmV0dXJuc1xyXG4gICAqIFxyXG4gICAqIEBtZW1iZXJPZiBBcGlSZXF1ZXN0XHJcbiAgICovXHJcbiAgYXN5bmMgcmVxdWVzdFBhZ2VDb250ZW50KHBhZ2VJZHgpIHtcclxuICAgIHZhciBjb250ZW50ID0gYXdhaXQgcmVxdWVzdChlbmNvZGVVUkkoYCR7dGhpcy5kb21haW59L3NlYXJjaC8ke3RoaXMua2V5d29yZH0vJHt0aGlzLnNlYXJjaFR5cGV9cCR7cGFnZUlkeHx8MX1gKSk7XHJcbiAgICByZXR1cm4gY29udGVudDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluaQnOe0ouWMheWQq+eahOmhtemdouaVsFxyXG4gICAqIFxyXG4gICAqIEByZXR1cm5zXHJcbiAgICogXHJcbiAgICogQG1lbWJlck9mIEFwaVJlcXVlc3RcclxuICAgKi9cclxuICBhc3luYyBnZXRTZWFyY2hQYWdlTnVtKCkge1xyXG4gICAgdmFyIG51bSA9IGF3YWl0IHRoaXMuZ2V0U2VhcmNoUmVjb3JkTnVtKCk7XHJcbiAgICByZXR1cm4gTWF0aC5jZWlsKG51bSAvIHRoaXMucGVyUGFnZUl0ZW1OdW0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W5pCc57Si5YyF5ZCr55qE6K6w5b2V5pWwXHJcbiAgICogXHJcbiAgICogQHJldHVybnNcclxuICAgKiBcclxuICAgKiBAbWVtYmVyT2YgQXBpUmVxdWVzdFxyXG4gICAqL1xyXG4gIGFzeW5jIGdldFNlYXJjaFJlY29yZE51bSgpIHtcclxuICAgIC8vIOW9k+aQnOe0ouiusOW9leWkp+S6jjEwMDDml7bvvIzmmL7npLrkuLoxMDAwK++8jOi/memHjOmcgOimgWZpeFxyXG4gICAgdmFyIHBhZ2UgPSBhd2FpdCB0aGlzLnJlcXVlc3RQYWdlQ29udGVudCgpO1xyXG4gICAgdmFyICQgPSBjaGVlcmlvLmxvYWQocGFnZSk7XHJcbiAgICB2YXIgbnVtID0gJCgnI3NlYXJjaFVzZXJQYWdlID4gZGl2Lm1haW5ib3hfbGVmdCA+IGRpdi5yZXBvcnQgPiBkaXYuc2VhcmNoSGludCA+IGRpdi5zZWFyY2hDb3VudCcpLnRleHQoKS5yZXBsYWNlKC9bXjAtOV0vaWcsICcnKTtcclxuICAgIHJldHVybiBwYXJzZUludChudW0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5LuO5LiA5LiqVDLnsbvlnovnmoTpobXpnaLkuK3ojrflj5bkv6Hmga9cclxuICAgKiBcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29udGVudFxyXG4gICAqIEByZXR1cm5zXHJcbiAgICogXHJcbiAgICogQG1lbWJlck9mIEFwaVJlcXVlc3RcclxuICAgKi9cclxuICBnZXRJdGVtc0luZm9Gcm9tUGFnZV9UMihjb250ZW50KSB7XHJcbiAgICB2YXIgJCA9IGNoZWVyaW8ubG9hZChjb250ZW50KTtcclxuICAgIHZhciByZXN1bHQgPSAkKCcjc2VhcmNoVXNlclBhZ2UgPiBkaXYubWFpbmJveF9sZWZ0ID4gZGl2LnJlcG9ydCA+IGRpdi5yZXBvcnRfbGlzdFZpZXcgPiBkaXYgPiBkaXY6bnRoLWNoaWxkKDEpJykudG9BcnJheSgpLm1hcChpdGVtID0+IHtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB0aXRsZTogJCgnYS5zb3VuZFJlcG9ydF9zb3VuZG5hbWUnLCBpdGVtKS50ZXh0KCksXHJcbiAgICAgICAgdGFnOiAkKCdhLnNvdW5kUmVwb3J0X3RhZycsIGl0ZW0pLnRvQXJyYXkoKS5tYXAodiA9PiAkKHYpLnRleHQoKSksXHJcbiAgICAgICAgYXV0aG9yOiAkKCdkaXYuc291bmRSZXBvcnRfYXV0aG9yID4gYScsIGl0ZW0pLnRleHQoKS50cmltKCksXHJcbiAgICAgICAgYWxidW06ICQoJ2Rpdi5zb3VuZFJlcG9ydF9hbGJ1bSA+IGEnLCBpdGVtKS50ZXh0KCkudHJpbSgpLFxyXG4gICAgICAgIHBsYXlDb3VudDogJCgnc3Bhbi5zb3VuZF9wbGF5Y291bnQnLCBpdGVtKS50ZXh0KClcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDku47kuIDkuKpUM+exu+Wei+eahOmhtemdouS4reiOt+WPluS/oeaBr1xyXG4gICAqIFxyXG4gICAqIFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50IOmhtemdouWGheWuuVxyXG4gICAqIFxyXG4gICAqIEBtZW1iZXJPZiBBcGlSZXF1ZXN0XHJcbiAgICovXHJcbiAgZ2V0SXRlbXNJbmZvRnJvbVBhZ2VfVDMoY29udGVudCkge1xyXG4gICAgdmFyICQgPSBjaGVlcmlvLmxvYWQoY29udGVudCk7XHJcbiAgICB2YXIgcmVzdWx0ID0gJCgnLmJvZHlfbGlzdCA+IGxpLml0ZW0nKS50b0FycmF5KCkubWFwKGl0ZW0gPT4ge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGxpbms6ICQoJy5waWN0dXJlIGEnLCBpdGVtKS5hdHRyKCdocmVmJyksXHJcbiAgICAgICAgaW1nOiAkKCcucGljdHVyZSBhIHNwYW4gaW1nJywgaXRlbSkuYXR0cignc3JjJyksXHJcbiAgICAgICAgdGl0bGU6ICQoJy50aXRsZSBhJywgaXRlbSkudGV4dCgpLFxyXG4gICAgICAgIHB1Ymxpc2hlck5hbWU6ICQoJy5sYXN0IGEnLCBpdGVtKS50ZXh0KCkudHJpbSgpLFxyXG4gICAgICAgIHB1Ymxpc2hlcklEOiAkKCcubGFzdCBhJywgaXRlbSkuYXR0cignY2FyZCcpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5LuO5LiA5LiqVDTnsbvlnovnmoTpobXpnaLkuK3ojrflj5bkv6Hmga9cclxuICAgKiBcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29udGVudFxyXG4gICAqIFxyXG4gICAqIEBtZW1iZXJPZiBBcGlSZXF1ZXN0XHJcbiAgICovXHJcbiAgZ2V0SXRlbXNJbmZvRnJvbVBhZ2VfVDQoY29udGVudCkge1xyXG4gICAgdmFyICQgPSBjaGVlcmlvLmxvYWQoY29udGVudCk7XHJcbiAgICB2YXIgcmVzdWx0ID0gJCgnLmJvZHlfbGlzdCA+IGxpLml0ZW0nKS50b0FycmF5KCkubWFwKGl0ZW0gPT4ge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHB1Ymxpc2hlcl9pZDogJCgnLmRldGFpbF90b3AgPiBhJywgaXRlbSkuYXR0cignY2FyZCcpLFxyXG4gICAgICAgIHB1Ymxpc2hlcl9uYW1lOiAkKCcuZGV0YWlsX3RvcCA+IC51c2VybmFtZScsIGl0ZW0pLnRleHQoKS50cmltKCksXHJcbiAgICAgICAgcHVibGlzaGVyX2ljb246ICQoJy5waWN0dXJlID4gYSA+IGltZycsIGl0ZW0pLmF0dHIoJ3NyYycpLFxyXG4gICAgICAgIGNvbnRlbnQ6ICQoJy5kZXRhaWxfY29udGVudCcsIGl0ZW0pLnRleHQoKS50cmltKCksXHJcbiAgICAgICAgc291bmRfY291bnRlcjogJCgnLmRldGFpbF9ib3R0b20gPiAuc291bmRfY291bnRlcicsIGl0ZW0pLnRleHQoKS50cmltKCksXHJcbiAgICAgICAgZm9sbG93ZXJfY291bnRlcjogJCgnLmRldGFpbF9ib3R0b20gPiAuZm9sbG93ZXJfY291bnRlcicsIGl0ZW0pLnRleHQoKS50cmltKClcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W5omA5pyJ6aG16Z2i55qE5L+h5oGvXHJcbiAgICogXHJcbiAgICogQHJldHVybnNcclxuICAgKiBcclxuICAgKiBAbWVtYmVyT2YgQXBpUmVxdWVzdFxyXG4gICAqL1xyXG4gIGFzeW5jIGdldEl0ZW1zSW5mb19BbGwoKSB7XHJcbiAgICB2YXIgcGFnZU51bSA9IGF3YWl0IHRoaXMuZ2V0U2VhcmNoUGFnZU51bSgpO1xyXG4gICAgdmFyIGdldEl0ZW1zRnJvbVBhZ2UgPSB0aGlzW2BnZXRJdGVtc0luZm9Gcm9tUGFnZV8ke3RoaXMuc2VhcmNoVHlwZS50b1VwcGVyQ2FzZSgpfWBdXHJcbiAgICBpZiAoZ2V0SXRlbXNGcm9tUGFnZSkge1xyXG4gICAgICB2YXIgcGFnZVByb21pc2VzID0gXy5yYW5nZSgxLCBwYWdlTnVtICsgMSkubWFwKHBhZ2VJZHggPT4gdGhpcy5yZXF1ZXN0UGFnZUNvbnRlbnQocGFnZUlkeCkpO1xyXG4gICAgICB2YXIgcGFnZXMgPSBhd2FpdCBQcm9taXNlLmFsbChwYWdlUHJvbWlzZXMpO1xyXG4gICAgICB2YXIgcmVzdWx0ID0gcGFnZXMubWFwKGFQYWdlID0+IGdldEl0ZW1zRnJvbVBhZ2UoYVBhZ2UpKS5yZWR1Y2UoKHByZSwgY3VyKSA9PiBwcmUuY29uY2F0KGN1ciksIFtdKTtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHBhcnNlIHBhZ2Ugd2l0aCB0eXBlIDogJHt0aGlzLnNlYXJjaFR5cGV9YClcclxuICAgIH1cclxuICB9XHJcblxyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIOaQnOe0ouWFs+mUruivjVxyXG4gKiBcclxuICogQHBhcmFtIHtzdHJpbmd9IGtleXdvcmRcclxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcclxuICogQHJldHVybnNcclxuICovXHJcbm1vZHVsZS5leHBvcnRzLnNlYXJjaCA9IChrZXl3b3JkLCB0eXBlKSA9PiB7XHJcbiAgcmV0dXJuIG5ldyBBcGlSZXF1ZXN0KGtleXdvcmQsIHR5cGUpO1xyXG59Il19