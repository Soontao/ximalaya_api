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
    this.searchType = searchType;

    switch (this.searchType) {
      case "t2":
        this.perPageItemNum = 20;
        break;
      case "t3":
        this.perPageItemNum = 20;
        break;
      case "t4":
        this.perPageItemNum = 20;
        break;
      default:
        thie.searchType = "t2";
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
      switch (_this4.type) {
        case "t2":
          getItemsFromPage = _this4.getItemsInfoFromPage_T2;
          break;
        default:
          getItemsFromPage = _this4.getItemsInfoFromPage_T2;
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

module.exports.search = (keyword, type) => {
  return new ApiRequest(keyword, type);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJjaGVlcmlvIiwicmVxdWlyZSIsInJlcXVlc3QiLCJfIiwiQXBpUmVxdWVzdCIsImNvbnN0cnVjdG9yIiwia2V5d29yZCIsInNlYXJjaFR5cGUiLCJFcnJvciIsImRvbWFpbiIsInBlclBhZ2VJdGVtTnVtIiwidGhpZSIsInJlcXVlc3RQYWdlQ29udGVudCIsInBhZ2VJZHgiLCJjb250ZW50IiwiZW5jb2RlVVJJIiwiZ2V0U2VhcmNoUGFnZU51bSIsIm51bSIsImdldFNlYXJjaFJlY29yZE51bSIsIk1hdGgiLCJjZWlsIiwicGFnZSIsIiQiLCJsb2FkIiwidGV4dCIsInJlcGxhY2UiLCJwYXJzZUludCIsImdldEl0ZW1zSW5mb0Zyb21QYWdlX1QyIiwicmVzdWx0IiwidG9BcnJheSIsIm1hcCIsIml0ZW0iLCJ0aXRsZSIsInRhZyIsInYiLCJhdXRob3IiLCJ0cmltIiwiYWxidW0iLCJwbGF5Q291bnQiLCJnZXRJdGVtc0luZm9fQWxsIiwicGFnZU51bSIsImdldEl0ZW1zRnJvbVBhZ2UiLCJ0eXBlIiwicGFnZVByb21pc2VzIiwicmFuZ2UiLCJwYWdlcyIsIlByb21pc2UiLCJhbGwiLCJhUGFnZSIsInJlZHVjZSIsInByZSIsImN1ciIsImNvbmNhdCIsIm1vZHVsZSIsImV4cG9ydHMiLCJzZWFyY2giXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FBQ0EsSUFBSUEsVUFBVUMsUUFBUSxTQUFSLENBQWQ7QUFDQSxJQUFJQyxVQUFVRCxRQUFRLGlCQUFSLENBQWQ7QUFDQSxJQUFJRSxJQUFJRixRQUFRLFFBQVIsQ0FBUjs7QUFFQTs7O0FBR0E7Ozs7O0FBS0EsTUFBTUcsVUFBTixDQUFpQjs7QUFFZjs7Ozs7Ozs7QUFRQUMsY0FBWUMsT0FBWixFQUFxQkMsVUFBckIsRUFBaUM7QUFDL0IsUUFBSUQsT0FBSixFQUNFLEtBQUtBLE9BQUwsR0FBZUEsT0FBZixDQURGLEtBR0UsTUFBTSxJQUFJRSxLQUFKLENBQVUsa0RBQVYsQ0FBTjtBQUNGLFNBQUtDLE1BQUwsR0FBYyx5QkFBZDtBQUNBLFNBQUtGLFVBQUwsR0FBa0JBLFVBQWxCOztBQUVBLFlBQVEsS0FBS0EsVUFBYjtBQUNFLFdBQUssSUFBTDtBQUNFLGFBQUtHLGNBQUwsR0FBc0IsRUFBdEI7QUFDQTtBQUNGLFdBQUssSUFBTDtBQUNFLGFBQUtBLGNBQUwsR0FBc0IsRUFBdEI7QUFDQTtBQUNGLFdBQUssSUFBTDtBQUNFLGFBQUtBLGNBQUwsR0FBc0IsRUFBdEI7QUFDQTtBQUNGO0FBQ0VDLGFBQUtKLFVBQUwsR0FBa0IsSUFBbEI7QUFDQSxhQUFLRyxjQUFMLEdBQXNCLEVBQXRCO0FBQ0E7QUFiSjtBQWdCRDs7QUFFRDs7Ozs7Ozs7QUFRTUUsb0JBQU4sQ0FBeUJDLE9BQXpCLEVBQWtDO0FBQUE7O0FBQUE7QUFDaEMsVUFBSUMsVUFBVSxNQUFNWixRQUFRYSxVQUFXLElBQUUsTUFBS04sTUFBTyxhQUFVLE1BQUtILE9BQVEsTUFBRyxNQUFLQyxVQUFXLFFBQUtNLFdBQVMsQ0FBRSxHQUFuRixDQUFSLENBQXBCO0FBQ0EsYUFBT0MsT0FBUDtBQUZnQztBQUdqQzs7QUFFRDs7Ozs7OztBQU9NRSxrQkFBTixHQUF5QjtBQUFBOztBQUFBO0FBQ3ZCLFVBQUlDLE1BQU0sTUFBTSxPQUFLQyxrQkFBTCxFQUFoQjtBQUNBLGFBQU9DLEtBQUtDLElBQUwsQ0FBVUgsTUFBTSxPQUFLUCxjQUFyQixDQUFQO0FBRnVCO0FBR3hCOztBQUVEOzs7Ozs7O0FBT01RLG9CQUFOLEdBQTJCO0FBQUE7O0FBQUE7QUFDekIsVUFBSUcsT0FBTyxNQUFNLE9BQUtULGtCQUFMLEVBQWpCO0FBQ0EsVUFBSVUsSUFBSXRCLFFBQVF1QixJQUFSLENBQWFGLElBQWIsQ0FBUjtBQUNBLFVBQUlKLE1BQU1LLEVBQUUsb0ZBQUYsRUFBd0ZFLElBQXhGLEdBQStGQyxPQUEvRixDQUF1RyxVQUF2RyxFQUFtSCxFQUFuSCxDQUFWO0FBQ0EsYUFBT0MsU0FBU1QsR0FBVCxDQUFQO0FBSnlCO0FBSzFCOztBQUVEOzs7Ozs7OztBQVFBVSwwQkFBd0JiLE9BQXhCLEVBQWlDO0FBQy9CLFFBQUlRLElBQUl0QixRQUFRdUIsSUFBUixDQUFhVCxPQUFiLENBQVI7QUFDQSxRQUFJYyxTQUFTTixFQUFFLGdHQUFGLEVBQW9HTyxPQUFwRyxHQUE4R0MsR0FBOUcsQ0FBa0hDLFFBQVE7QUFDckksYUFBTztBQUNMQyxlQUFPVixFQUFFLHlCQUFGLEVBQTZCUyxJQUE3QixFQUFtQ1AsSUFBbkMsRUFERjtBQUVMUyxhQUFLWCxFQUFFLG1CQUFGLEVBQXVCUyxJQUF2QixFQUE2QkYsT0FBN0IsR0FBdUNDLEdBQXZDLENBQTJDSSxLQUFLWixFQUFFWSxDQUFGLEVBQUtWLElBQUwsRUFBaEQsQ0FGQTtBQUdMVyxnQkFBUWIsRUFBRSw0QkFBRixFQUFnQ1MsSUFBaEMsRUFBc0NQLElBQXRDLEdBQTZDWSxJQUE3QyxFQUhIO0FBSUxDLGVBQU9mLEVBQUUsMkJBQUYsRUFBK0JTLElBQS9CLEVBQXFDUCxJQUFyQyxHQUE0Q1ksSUFBNUMsRUFKRjtBQUtMRSxtQkFBV2hCLEVBQUUsc0JBQUYsRUFBMEJTLElBQTFCLEVBQWdDUCxJQUFoQztBQUxOLE9BQVA7QUFPRCxLQVJZLENBQWI7QUFTQSxXQUFPSSxNQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUFPTVcsa0JBQU4sR0FBeUI7QUFBQTs7QUFBQTtBQUN2QixVQUFJQyxVQUFVLE1BQU0sT0FBS3hCLGdCQUFMLEVBQXBCO0FBQ0EsVUFBSXlCLGdCQUFKO0FBQ0EsY0FBUSxPQUFLQyxJQUFiO0FBQ0UsYUFBSyxJQUFMO0FBQ0VELDZCQUFtQixPQUFLZCx1QkFBeEI7QUFDQTtBQUNGO0FBQ0VjLDZCQUFtQixPQUFLZCx1QkFBeEI7QUFDQTtBQU5KO0FBUUEsVUFBSWdCLGVBQWV4QyxFQUFFeUMsS0FBRixDQUFRLENBQVIsRUFBV0osVUFBVSxDQUFyQixFQUF3QlYsR0FBeEIsQ0FBNEI7QUFBQSxlQUFXLE9BQUtsQixrQkFBTCxDQUF3QkMsT0FBeEIsQ0FBWDtBQUFBLE9BQTVCLENBQW5CO0FBQ0EsVUFBSWdDLFFBQVEsTUFBTUMsUUFBUUMsR0FBUixDQUFZSixZQUFaLENBQWxCO0FBQ0EsVUFBSWYsU0FBU2lCLE1BQU1mLEdBQU4sQ0FBVTtBQUFBLGVBQVNXLGlCQUFpQk8sS0FBakIsQ0FBVDtBQUFBLE9BQVYsRUFBNENDLE1BQTVDLENBQW1ELFVBQUNDLEdBQUQsRUFBTUMsR0FBTjtBQUFBLGVBQWNELElBQUlFLE1BQUosQ0FBV0QsR0FBWCxDQUFkO0FBQUEsT0FBbkQsRUFBa0YsRUFBbEYsQ0FBYjtBQUNBLGFBQU92QixNQUFQO0FBZHVCO0FBZXhCOztBQXZIYzs7QUE0SGpCeUIsT0FBT0MsT0FBUCxDQUFlQyxNQUFmLEdBQXdCLENBQUNqRCxPQUFELEVBQVVvQyxJQUFWLEtBQW1CO0FBQ3pDLFNBQU8sSUFBSXRDLFVBQUosQ0FBZUUsT0FBZixFQUF3Qm9DLElBQXhCLENBQVA7QUFDRCxDQUZEIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCJcclxudmFyIGNoZWVyaW8gPSByZXF1aXJlKCdjaGVlcmlvJyk7XHJcbnZhciByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdC1wcm9taXNlJyk7XHJcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG4vLyDpnIDopoHkuIDkuKrlrprml7bov4fmnJ/nmoTnvJPlrZhcclxuXHJcblxyXG4vKipcclxuICogQVBJ6K+35rGCXHJcbiAqIFxyXG4gKiBAY2xhc3MgQXBpUmVxdWVzdFxyXG4gKi9cclxuY2xhc3MgQXBpUmVxdWVzdCB7XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgQXBpUmVxdWVzdC5cclxuICAgKiBcclxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5d29yZCDmkJzntKLlhbPplK7or41cclxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2VhcmNoVHlwZVxyXG4gICAqIFxyXG4gICAqIEBtZW1iZXJPZiBBcGlSZXF1ZXN0XHJcbiAgICovXHJcbiAgY29uc3RydWN0b3Ioa2V5d29yZCwgc2VhcmNoVHlwZSkge1xyXG4gICAgaWYgKGtleXdvcmQpXHJcbiAgICAgIHRoaXMua2V5d29yZCA9IGtleXdvcmQ7XHJcbiAgICBlbHNlXHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInBhcmFtIGVycm9yLCBrZXl3b3JkIGNhbid0IGJlIGVtcHR5IG9yIHVuZGVmaW5lZFwiKTtcclxuICAgIHRoaXMuZG9tYWluID0gXCJodHRwOi8vd3d3LnhpbWFsYXlhLmNvbVwiO1xyXG4gICAgdGhpcy5zZWFyY2hUeXBlID0gc2VhcmNoVHlwZTtcclxuXHJcbiAgICBzd2l0Y2ggKHRoaXMuc2VhcmNoVHlwZSkge1xyXG4gICAgICBjYXNlIFwidDJcIjpcclxuICAgICAgICB0aGlzLnBlclBhZ2VJdGVtTnVtID0gMjA7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgXCJ0M1wiOlxyXG4gICAgICAgIHRoaXMucGVyUGFnZUl0ZW1OdW0gPSAyMDtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcInQ0XCI6XHJcbiAgICAgICAgdGhpcy5wZXJQYWdlSXRlbU51bSA9IDIwO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHRoaWUuc2VhcmNoVHlwZSA9IFwidDJcIjtcclxuICAgICAgICB0aGlzLnBlclBhZ2VJdGVtTnVtID0gMjA7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6K+35rGC5LiA5Liq6aG16Z2i55qE5YaF5a65XHJcbiAgICogXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IHBhZ2VJZHgg6aG156CBXHJcbiAgICogQHJldHVybnNcclxuICAgKiBcclxuICAgKiBAbWVtYmVyT2YgQXBpUmVxdWVzdFxyXG4gICAqL1xyXG4gIGFzeW5jIHJlcXVlc3RQYWdlQ29udGVudChwYWdlSWR4KSB7XHJcbiAgICB2YXIgY29udGVudCA9IGF3YWl0IHJlcXVlc3QoZW5jb2RlVVJJKGAke3RoaXMuZG9tYWlufS9zZWFyY2gvJHt0aGlzLmtleXdvcmR9LyR7dGhpcy5zZWFyY2hUeXBlfXMycCR7cGFnZUlkeHx8MX1gKSk7XHJcbiAgICByZXR1cm4gY29udGVudDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluaQnOe0ouWMheWQq+eahOmhtemdouaVsFxyXG4gICAqIFxyXG4gICAqIEByZXR1cm5zXHJcbiAgICogXHJcbiAgICogQG1lbWJlck9mIEFwaVJlcXVlc3RcclxuICAgKi9cclxuICBhc3luYyBnZXRTZWFyY2hQYWdlTnVtKCkge1xyXG4gICAgdmFyIG51bSA9IGF3YWl0IHRoaXMuZ2V0U2VhcmNoUmVjb3JkTnVtKCk7XHJcbiAgICByZXR1cm4gTWF0aC5jZWlsKG51bSAvIHRoaXMucGVyUGFnZUl0ZW1OdW0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W5pCc57Si5YyF5ZCr55qE6K6w5b2V5pWwXHJcbiAgICogXHJcbiAgICogQHJldHVybnNcclxuICAgKiBcclxuICAgKiBAbWVtYmVyT2YgQXBpUmVxdWVzdFxyXG4gICAqL1xyXG4gIGFzeW5jIGdldFNlYXJjaFJlY29yZE51bSgpIHtcclxuICAgIHZhciBwYWdlID0gYXdhaXQgdGhpcy5yZXF1ZXN0UGFnZUNvbnRlbnQoKTtcclxuICAgIHZhciAkID0gY2hlZXJpby5sb2FkKHBhZ2UpO1xyXG4gICAgdmFyIG51bSA9ICQoJyNzZWFyY2hVc2VyUGFnZSA+IGRpdi5tYWluYm94X2xlZnQgPiBkaXYucmVwb3J0ID4gZGl2LnNlYXJjaEhpbnQgPiBkaXYuc2VhcmNoQ291bnQnKS50ZXh0KCkucmVwbGFjZSgvW14wLTldL2lnLCAnJyk7XHJcbiAgICByZXR1cm4gcGFyc2VJbnQobnVtKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOS7juS4gOS4qlQy57G75Z6L55qE6aG16Z2i5Lit6I635Y+W5L+h5oGvXHJcbiAgICogXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbnRlbnRcclxuICAgKiBAcmV0dXJuc1xyXG4gICAqIFxyXG4gICAqIEBtZW1iZXJPZiBBcGlSZXF1ZXN0XHJcbiAgICovXHJcbiAgZ2V0SXRlbXNJbmZvRnJvbVBhZ2VfVDIoY29udGVudCkge1xyXG4gICAgdmFyICQgPSBjaGVlcmlvLmxvYWQoY29udGVudCk7XHJcbiAgICB2YXIgcmVzdWx0ID0gJCgnI3NlYXJjaFVzZXJQYWdlID4gZGl2Lm1haW5ib3hfbGVmdCA+IGRpdi5yZXBvcnQgPiBkaXYucmVwb3J0X2xpc3RWaWV3ID4gZGl2ID4gZGl2Om50aC1jaGlsZCgxKScpLnRvQXJyYXkoKS5tYXAoaXRlbSA9PiB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdGl0bGU6ICQoJ2Euc291bmRSZXBvcnRfc291bmRuYW1lJywgaXRlbSkudGV4dCgpLFxyXG4gICAgICAgIHRhZzogJCgnYS5zb3VuZFJlcG9ydF90YWcnLCBpdGVtKS50b0FycmF5KCkubWFwKHYgPT4gJCh2KS50ZXh0KCkpLFxyXG4gICAgICAgIGF1dGhvcjogJCgnZGl2LnNvdW5kUmVwb3J0X2F1dGhvciA+IGEnLCBpdGVtKS50ZXh0KCkudHJpbSgpLFxyXG4gICAgICAgIGFsYnVtOiAkKCdkaXYuc291bmRSZXBvcnRfYWxidW0gPiBhJywgaXRlbSkudGV4dCgpLnRyaW0oKSxcclxuICAgICAgICBwbGF5Q291bnQ6ICQoJ3NwYW4uc291bmRfcGxheWNvdW50JywgaXRlbSkudGV4dCgpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog6I635Y+W5omA5pyJ6aG16Z2i55qE5L+h5oGvXHJcbiAgICogXHJcbiAgICogQHJldHVybnNcclxuICAgKiBcclxuICAgKiBAbWVtYmVyT2YgQXBpUmVxdWVzdFxyXG4gICAqL1xyXG4gIGFzeW5jIGdldEl0ZW1zSW5mb19BbGwoKSB7XHJcbiAgICB2YXIgcGFnZU51bSA9IGF3YWl0IHRoaXMuZ2V0U2VhcmNoUGFnZU51bSgpO1xyXG4gICAgdmFyIGdldEl0ZW1zRnJvbVBhZ2U7XHJcbiAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xyXG4gICAgICBjYXNlIFwidDJcIjpcclxuICAgICAgICBnZXRJdGVtc0Zyb21QYWdlID0gdGhpcy5nZXRJdGVtc0luZm9Gcm9tUGFnZV9UMlxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGdldEl0ZW1zRnJvbVBhZ2UgPSB0aGlzLmdldEl0ZW1zSW5mb0Zyb21QYWdlX1QyXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgICB2YXIgcGFnZVByb21pc2VzID0gXy5yYW5nZSgxLCBwYWdlTnVtICsgMSkubWFwKHBhZ2VJZHggPT4gdGhpcy5yZXF1ZXN0UGFnZUNvbnRlbnQocGFnZUlkeCkpO1xyXG4gICAgdmFyIHBhZ2VzID0gYXdhaXQgUHJvbWlzZS5hbGwocGFnZVByb21pc2VzKTtcclxuICAgIHZhciByZXN1bHQgPSBwYWdlcy5tYXAoYVBhZ2UgPT4gZ2V0SXRlbXNGcm9tUGFnZShhUGFnZSkpLnJlZHVjZSgocHJlLCBjdXIpID0+IHByZS5jb25jYXQoY3VyKSwgW10pO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG59XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMuc2VhcmNoID0gKGtleXdvcmQsIHR5cGUpID0+IHtcclxuICByZXR1cm4gbmV3IEFwaVJlcXVlc3Qoa2V5d29yZCwgdHlwZSk7XHJcbn1cclxuIl19