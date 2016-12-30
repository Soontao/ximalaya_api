"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var http = require('http');
var cheerio = require('cheerio');
var cacheIt = require('lru-func');
var request = require('request-promise');
var _ = require('lodash');
var perPageItemNum = 20;
var domain = "http://www.ximalaya.com";

// 考虑根据类型创建相应类的实例

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
    if (keyword) this.keyword = keyword;else throw new Error("param error, keyword cannot be empty or undefined");
    this.searchType = searchType;
    switch (searchType) {
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
    this.domain = "http://www.ximalaya.com";
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

  getSearchPageNum() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      var num = yield _this2.getSearchRecordNum(_this2.keyword, _this2.searchType);
      return Math.ceil(num / _this2.perPageItemNum);
    })();
  }

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
      var result = [];
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

module.exports = {
  "search": (keyword, type) => {
    return new ApiRequest(keyword, type);
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJodHRwIiwicmVxdWlyZSIsImNoZWVyaW8iLCJjYWNoZUl0IiwicmVxdWVzdCIsIl8iLCJwZXJQYWdlSXRlbU51bSIsImRvbWFpbiIsIkFwaVJlcXVlc3QiLCJjb25zdHJ1Y3RvciIsImtleXdvcmQiLCJzZWFyY2hUeXBlIiwiRXJyb3IiLCJ0aGllIiwicmVxdWVzdFBhZ2VDb250ZW50IiwicGFnZUlkeCIsImNvbnRlbnQiLCJlbmNvZGVVUkkiLCJnZXRTZWFyY2hQYWdlTnVtIiwibnVtIiwiZ2V0U2VhcmNoUmVjb3JkTnVtIiwiTWF0aCIsImNlaWwiLCJwYWdlIiwiJCIsImxvYWQiLCJ0ZXh0IiwicmVwbGFjZSIsInBhcnNlSW50IiwiZ2V0SXRlbXNJbmZvRnJvbVBhZ2VfVDIiLCJyZXN1bHQiLCJ0b0FycmF5IiwibWFwIiwiaXRlbSIsInRpdGxlIiwidGFnIiwidiIsImF1dGhvciIsInRyaW0iLCJhbGJ1bSIsInBsYXlDb3VudCIsImdldEl0ZW1zSW5mb19BbGwiLCJwYWdlTnVtIiwiZ2V0SXRlbXNGcm9tUGFnZSIsInR5cGUiLCJwYWdlUHJvbWlzZXMiLCJyYW5nZSIsInBhZ2VzIiwiUHJvbWlzZSIsImFsbCIsImFQYWdlIiwicmVkdWNlIiwicHJlIiwiY3VyIiwiY29uY2F0IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUFDQSxJQUFJQSxPQUFPQyxRQUFRLE1BQVIsQ0FBWDtBQUNBLElBQUlDLFVBQVVELFFBQVEsU0FBUixDQUFkO0FBQ0EsSUFBSUUsVUFBVUYsUUFBUSxVQUFSLENBQWQ7QUFDQSxJQUFJRyxVQUFVSCxRQUFRLGlCQUFSLENBQWQ7QUFDQSxJQUFJSSxJQUFJSixRQUFRLFFBQVIsQ0FBUjtBQUNBLElBQUlLLGlCQUFpQixFQUFyQjtBQUNBLElBQUlDLFNBQVMseUJBQWI7O0FBRUE7O0FBRUE7Ozs7O0FBS0EsTUFBTUMsVUFBTixDQUFpQjs7QUFFZjs7Ozs7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QTtBQU5KO0FBUUEsVUFBSWdCLGVBQWV4QyxFQUFFeUMsS0FBRixDQUFRLENBQVIsRUFBV0osVUFBVSxDQUFyQixFQUF3QlYsR0FBeEIsQ0FBNEI7QUFBQSxlQUFXLE9BQUtsQixrQkFBTCxDQUF3QkMsT0FBeEIsQ0FBWDtBQUFBLE9BQTVCLENBQW5CO0FBQ0EsVUFBSWdDLFFBQVEsTUFBTUMsUUFBUUMsR0FBUixDQUFZSixZQUFaLENBQWxCO0FBQ0EsVUFBSWYsU0FBU2lCLE1BQU1mLEdBQU4sQ0FBVTtBQUFBLGVBQVNXLGlCQUFpQk8sS0FBakIsQ0FBVDtBQUFBLE9BQVYsRUFBNENDLE1BQTVDLENBQW1ELFVBQUNDLEdBQUQsRUFBTUMsR0FBTjtBQUFBLGVBQWNELElBQUlFLE1BQUosQ0FBV0QsR0FBWCxDQUFkO0FBQUEsT0FBbkQsRUFBa0YsRUFBbEYsQ0FBYjtBQUNBLGFBQU92QixNQUFQO0FBZnVCO0FBZ0J4Qjs7QUF6R2M7O0FBOEdqQnlCLE9BQU9DLE9BQVAsR0FBaUI7QUFDZixZQUFVLENBQUM5QyxPQUFELEVBQVVrQyxJQUFWLEtBQW1CO0FBQzNCLFdBQU8sSUFBSXBDLFVBQUosQ0FBZUUsT0FBZixFQUF3QmtDLElBQXhCLENBQVA7QUFDRDtBQUhjLENBQWpCIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCJcclxudmFyIGh0dHAgPSByZXF1aXJlKCdodHRwJyk7XHJcbnZhciBjaGVlcmlvID0gcmVxdWlyZSgnY2hlZXJpbycpO1xyXG52YXIgY2FjaGVJdCA9IHJlcXVpcmUoJ2xydS1mdW5jJyk7XHJcbnZhciByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdC1wcm9taXNlJyk7XHJcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcbnZhciBwZXJQYWdlSXRlbU51bSA9IDIwO1xyXG52YXIgZG9tYWluID0gXCJodHRwOi8vd3d3LnhpbWFsYXlhLmNvbVwiO1xyXG5cclxuLy8g6ICD6JmR5qC55o2u57G75Z6L5Yib5bu655u45bqU57G755qE5a6e5L6LXHJcblxyXG4vKipcclxuICogQVBJ6K+35rGCXHJcbiAqIFxyXG4gKiBAY2xhc3MgQXBpUmVxdWVzdFxyXG4gKi9cclxuY2xhc3MgQXBpUmVxdWVzdCB7XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgQXBpUmVxdWVzdC5cclxuICAgKiBcclxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5d29yZCDmkJzntKLlhbPplK7or41cclxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2VhcmNoVHlwZVxyXG4gICAqIFxyXG4gICAqIEBtZW1iZXJPZiBBcGlSZXF1ZXN0XHJcbiAgICovXHJcbiAgY29uc3RydWN0b3Ioa2V5d29yZCwgc2VhcmNoVHlwZSkge1xyXG4gICAgaWYgKGtleXdvcmQpXHJcbiAgICAgIHRoaXMua2V5d29yZCA9IGtleXdvcmQ7XHJcbiAgICBlbHNlXHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInBhcmFtIGVycm9yLCBrZXl3b3JkIGNhbm5vdCBiZSBlbXB0eSBvciB1bmRlZmluZWRcIik7XHJcbiAgICB0aGlzLnNlYXJjaFR5cGUgPSBzZWFyY2hUeXBlO1xyXG4gICAgc3dpdGNoIChzZWFyY2hUeXBlKSB7XHJcbiAgICAgIGNhc2UgXCJ0MlwiOlxyXG4gICAgICAgIHRoaXMucGVyUGFnZUl0ZW1OdW0gPSAyMDtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBcInQzXCI6XHJcbiAgICAgICAgdGhpcy5wZXJQYWdlSXRlbU51bSA9IDIwO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFwidDRcIjpcclxuICAgICAgICB0aGlzLnBlclBhZ2VJdGVtTnVtID0gMjA7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgdGhpZS5zZWFyY2hUeXBlID0gXCJ0MlwiO1xyXG4gICAgICAgIHRoaXMucGVyUGFnZUl0ZW1OdW0gPSAyMDtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICAgIHRoaXMuZG9tYWluID0gXCJodHRwOi8vd3d3LnhpbWFsYXlhLmNvbVwiO1xyXG5cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOivt+axguS4gOS4qumhtemdoueahOWGheWuuVxyXG4gICAqIFxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBwYWdlSWR4IOmhteeggVxyXG4gICAqIEByZXR1cm5zXHJcbiAgICogXHJcbiAgICogQG1lbWJlck9mIEFwaVJlcXVlc3RcclxuICAgKi9cclxuICBhc3luYyByZXF1ZXN0UGFnZUNvbnRlbnQocGFnZUlkeCkge1xyXG4gICAgdmFyIGNvbnRlbnQgPSBhd2FpdCByZXF1ZXN0KGVuY29kZVVSSShgJHt0aGlzLmRvbWFpbn0vc2VhcmNoLyR7dGhpcy5rZXl3b3JkfS8ke3RoaXMuc2VhcmNoVHlwZX1zMnAke3BhZ2VJZHh8fDF9YCkpO1xyXG4gICAgcmV0dXJuIGNvbnRlbnQ7XHJcbiAgfVxyXG5cclxuICBhc3luYyBnZXRTZWFyY2hQYWdlTnVtKCkge1xyXG4gICAgdmFyIG51bSA9IGF3YWl0IHRoaXMuZ2V0U2VhcmNoUmVjb3JkTnVtKHRoaXMua2V5d29yZCwgdGhpcy5zZWFyY2hUeXBlKTtcclxuICAgIHJldHVybiBNYXRoLmNlaWwobnVtIC8gdGhpcy5wZXJQYWdlSXRlbU51bSk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBnZXRTZWFyY2hSZWNvcmROdW0oKSB7XHJcbiAgICB2YXIgcGFnZSA9IGF3YWl0IHRoaXMucmVxdWVzdFBhZ2VDb250ZW50KCk7XHJcbiAgICB2YXIgJCA9IGNoZWVyaW8ubG9hZChwYWdlKTtcclxuICAgIHZhciBudW0gPSAkKCcjc2VhcmNoVXNlclBhZ2UgPiBkaXYubWFpbmJveF9sZWZ0ID4gZGl2LnJlcG9ydCA+IGRpdi5zZWFyY2hIaW50ID4gZGl2LnNlYXJjaENvdW50JykudGV4dCgpLnJlcGxhY2UoL1teMC05XS9pZywgJycpO1xyXG4gICAgcmV0dXJuIHBhcnNlSW50KG51bSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDku47kuIDkuKpUMuexu+Wei+eahOmhtemdouS4reiOt+WPluS/oeaBr1xyXG4gICAqIFxyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50XHJcbiAgICogQHJldHVybnNcclxuICAgKiBcclxuICAgKiBAbWVtYmVyT2YgQXBpUmVxdWVzdFxyXG4gICAqL1xyXG4gIGdldEl0ZW1zSW5mb0Zyb21QYWdlX1QyKGNvbnRlbnQpIHtcclxuICAgIHZhciAkID0gY2hlZXJpby5sb2FkKGNvbnRlbnQpO1xyXG4gICAgdmFyIHJlc3VsdCA9ICQoJyNzZWFyY2hVc2VyUGFnZSA+IGRpdi5tYWluYm94X2xlZnQgPiBkaXYucmVwb3J0ID4gZGl2LnJlcG9ydF9saXN0VmlldyA+IGRpdiA+IGRpdjpudGgtY2hpbGQoMSknKS50b0FycmF5KCkubWFwKGl0ZW0gPT4ge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHRpdGxlOiAkKCdhLnNvdW5kUmVwb3J0X3NvdW5kbmFtZScsIGl0ZW0pLnRleHQoKSxcclxuICAgICAgICB0YWc6ICQoJ2Euc291bmRSZXBvcnRfdGFnJywgaXRlbSkudG9BcnJheSgpLm1hcCh2ID0+ICQodikudGV4dCgpKSxcclxuICAgICAgICBhdXRob3I6ICQoJ2Rpdi5zb3VuZFJlcG9ydF9hdXRob3IgPiBhJywgaXRlbSkudGV4dCgpLnRyaW0oKSxcclxuICAgICAgICBhbGJ1bTogJCgnZGl2LnNvdW5kUmVwb3J0X2FsYnVtID4gYScsIGl0ZW0pLnRleHQoKS50cmltKCksXHJcbiAgICAgICAgcGxheUNvdW50OiAkKCdzcGFuLnNvdW5kX3BsYXljb3VudCcsIGl0ZW0pLnRleHQoKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIOiOt+WPluaJgOaciemhtemdoueahOS/oeaBr1xyXG4gICAqIFxyXG4gICAqIEByZXR1cm5zXHJcbiAgICogXHJcbiAgICogQG1lbWJlck9mIEFwaVJlcXVlc3RcclxuICAgKi9cclxuICBhc3luYyBnZXRJdGVtc0luZm9fQWxsKCkge1xyXG4gICAgdmFyIHBhZ2VOdW0gPSBhd2FpdCB0aGlzLmdldFNlYXJjaFBhZ2VOdW0oKTtcclxuICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgIHZhciBnZXRJdGVtc0Zyb21QYWdlO1xyXG4gICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcclxuICAgICAgY2FzZSBcInQyXCI6XHJcbiAgICAgICAgZ2V0SXRlbXNGcm9tUGFnZSA9IHRoaXMuZ2V0SXRlbXNJbmZvRnJvbVBhZ2VfVDJcclxuICAgICAgICBicmVhaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBnZXRJdGVtc0Zyb21QYWdlID0gdGhpcy5nZXRJdGVtc0luZm9Gcm9tUGFnZV9UMlxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgdmFyIHBhZ2VQcm9taXNlcyA9IF8ucmFuZ2UoMSwgcGFnZU51bSArIDEpLm1hcChwYWdlSWR4ID0+IHRoaXMucmVxdWVzdFBhZ2VDb250ZW50KHBhZ2VJZHgpKTtcclxuICAgIHZhciBwYWdlcyA9IGF3YWl0IFByb21pc2UuYWxsKHBhZ2VQcm9taXNlcyk7XHJcbiAgICB2YXIgcmVzdWx0ID0gcGFnZXMubWFwKGFQYWdlID0+IGdldEl0ZW1zRnJvbVBhZ2UoYVBhZ2UpKS5yZWR1Y2UoKHByZSwgY3VyKSA9PiBwcmUuY29uY2F0KGN1ciksIFtdKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxufVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIFwic2VhcmNoXCI6IChrZXl3b3JkLCB0eXBlKSA9PiB7XHJcbiAgICByZXR1cm4gbmV3IEFwaVJlcXVlc3Qoa2V5d29yZCwgdHlwZSk7XHJcbiAgfVxyXG59Il19