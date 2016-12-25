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
    var getItemsFromPage;
    switch (type) {
      case "t2":
        getItemsFromPage = getItemsInfoFromPage_T2;
        break;
      default:
        getItemsFromPage = getItemsInfoFromPage_T2;
        break;
    }
    for (var pageIndex = 1; pageIndex <= pageNum; pageIndex++) {
      result = result.concat(getItemsFromPage((yield requestPageContent(keyword, type, `p${ pageIndex }`))));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJodHRwIiwicmVxdWlyZSIsImNoZWVyaW8iLCJjYWNoZUl0IiwicmVxdWVzdCIsInBlclBhZ2VJdGVtTnVtIiwiZG9tYWluIiwicmVxdWVzdFBhZ2VDb250ZW50Iiwia2V5d29yZCIsInR5cGUiLCJwYWdlIiwiRXJyb3IiLCJjb250ZW50IiwiZW5jb2RlVVJJIiwiZ2V0U2VhcmNoUGFnZU51bSIsIm51bSIsImdldFNlYXJjaFJlY29yZE51bSIsIk1hdGgiLCJjZWlsIiwidW5kZWZpbmVkIiwiJCIsImxvYWQiLCJ0ZXh0IiwicmVwbGFjZSIsInBhcnNlSW50IiwiZ2V0SXRlbXNJbmZvRnJvbVBhZ2VfVDIiLCJyZXN1bHQiLCJ0b0FycmF5IiwibWFwIiwiaXRlbSIsInRpdGxlIiwidGFnIiwidiIsImF1dGhvciIsInRyaW0iLCJhbGJ1bSIsInBsYXlDb3VudCIsImdldEl0ZW1zSW5mb19BbGwiLCJwYWdlTnVtIiwiZ2V0SXRlbXNGcm9tUGFnZSIsInBhZ2VJbmRleCIsImNvbmNhdCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FBQ0EsSUFBSUEsT0FBT0MsUUFBUSxNQUFSLENBQVg7QUFDQSxJQUFJQyxVQUFVRCxRQUFRLFNBQVIsQ0FBZDtBQUNBLElBQUlFLFVBQVVGLFFBQVEsVUFBUixDQUFkO0FBQ0EsSUFBSUcsVUFBVUgsUUFBUSxpQkFBUixDQUFkO0FBQ0EsSUFBSUksaUJBQWlCLEVBQXJCO0FBQ0EsSUFBSUMsU0FBUyx5QkFBYjs7QUFFQTs7Ozs7OztBQU9BLElBQUlDO0FBQUEsK0JBQXFCLFdBQU1DLE9BQU4sRUFBZUMsSUFBZixFQUFxQkMsSUFBckIsRUFBOEI7QUFDckQsUUFBSSxDQUFDRixPQUFMLEVBQWMsTUFBTSxJQUFJRyxLQUFKLENBQVUsV0FBVixDQUFOO0FBQ2RGLFdBQU9BLFFBQVEsSUFBZjtBQUNBQyxXQUFPQSxRQUFRLElBQWY7QUFDQSxRQUFJRSxVQUFV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QXZCLEVBQWQsQ0FBVDtBQUNEO0FBQ0QsV0FBT2QsTUFBUDtBQUNELEdBaEJHOztBQUFBO0FBQUE7QUFBQTtBQUFBLElBQUo7O0FBa0JBZ0IsT0FBT0MsT0FBUCxHQUFpQjtBQUNmN0Isa0JBRGU7QUFFZkUsb0JBRmU7QUFHZlQsb0JBSGU7QUFJZmtCLHlCQUplO0FBS2ZZO0FBTGUsQ0FBakIiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIlxyXG52YXIgaHR0cCA9IHJlcXVpcmUoJ2h0dHAnKTtcclxudmFyIGNoZWVyaW8gPSByZXF1aXJlKCdjaGVlcmlvJyk7XHJcbnZhciBjYWNoZUl0ID0gcmVxdWlyZSgnbHJ1LWZ1bmMnKTtcclxudmFyIHJlcXVlc3QgPSByZXF1aXJlKCdyZXF1ZXN0LXByb21pc2UnKTtcclxudmFyIHBlclBhZ2VJdGVtTnVtID0gMjA7XHJcbnZhciBkb21haW4gPSBcImh0dHA6Ly93d3cueGltYWxheWEuY29tXCI7XHJcblxyXG4vKipcclxuICog6K+35rGC6aG16Z2i5YaF5a65XHJcbiAqIFxyXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5d29yZCDlhbPplK7or41cclxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGUg5p+l6K+i5YiG57G7XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYWdlIOmhteaVsFxyXG4gKi9cclxudmFyIHJlcXVlc3RQYWdlQ29udGVudCA9IGFzeW5jKGtleXdvcmQsIHR5cGUsIHBhZ2UpID0+IHtcclxuICBpZiAoIWtleXdvcmQpIHRocm93IG5ldyBFcnJvcihcInBhcmFtIGVyclwiKTtcclxuICB0eXBlID0gdHlwZSB8fCBcInQyXCI7XHJcbiAgcGFnZSA9IHBhZ2UgfHwgXCJwMVwiO1xyXG4gIHZhciBjb250ZW50ID0gYXdhaXQgcmVxdWVzdChlbmNvZGVVUkkoYCR7ZG9tYWlufS9zZWFyY2gvJHtrZXl3b3JkfS8ke3R5cGV9JHtwYWdlfWApKTtcclxuICByZXR1cm4gY29udGVudDtcclxufVxyXG5cclxuLyoqXHJcbiAqIOiOt+WPluaQnOe0oumhtemdouaAu+aVsFxyXG4gKiBcclxuICogQHBhcmFtIHtzdHJpbmd9IGtleXdvcmRcclxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcclxuICogQHBhcmFtIHtmdW5jdGlvbihOdW1iZXIpfSBjYlxyXG4gKi9cclxudmFyIGdldFNlYXJjaFBhZ2VOdW0gPSBhc3luYyhrZXl3b3JkLCB0eXBlKSA9PiB7XHJcbiAgaWYgKCFrZXl3b3JkKSB0aHJvdyBuZXcgRXJyb3IoXCJwYXJhbSBlcnJcIik7XHJcbiAgdHlwZSA9IHR5cGUgfHwgXCJ0MlwiO1xyXG4gIHZhciBudW0gPSBhd2FpdCBnZXRTZWFyY2hSZWNvcmROdW0oa2V5d29yZCwgdHlwZSk7XHJcbiAgcmV0dXJuIE1hdGguY2VpbChudW0gLyBwZXJQYWdlSXRlbU51bSk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qKlxyXG4gKiDojrflj5bmkJzntKLorrDlvZXmlbBcclxuICogXHJcbiAqIEBwYXJhbSB7YW55fSBrZXl3b3JkIOWFs+mUruWtl1xyXG4gKiBAcGFyYW0ge2FueX0gdHlwZSDnsbvlnotcclxuICogQHJldHVybnMge251bWJlcn0g6K6w5b2V5pWwXHJcbiAqL1xyXG52YXIgZ2V0U2VhcmNoUmVjb3JkTnVtID0gYXN5bmMoa2V5d29yZCwgdHlwZSkgPT4ge1xyXG4gIGlmICgha2V5d29yZCkgdGhyb3cgbmV3IEVycm9yKFwicGFyYW0gZXJyXCIpO1xyXG4gIHR5cGUgPSB0eXBlIHx8IFwidDJcIjtcclxuICB2YXIgcGFnZSA9IGF3YWl0IHJlcXVlc3RQYWdlQ29udGVudChrZXl3b3JkLCB0eXBlLCB1bmRlZmluZWQpO1xyXG4gIHZhciAkID0gY2hlZXJpby5sb2FkKHBhZ2UpO1xyXG4gIHZhciBudW0gPSAkKCcjc2VhcmNoVXNlclBhZ2UgPiBkaXYubWFpbmJveF9sZWZ0ID4gZGl2LnJlcG9ydCA+IGRpdi5zZWFyY2hIaW50ID4gZGl2LnNlYXJjaENvdW50JykudGV4dCgpLnJlcGxhY2UoL1teMC05XS9pZywgJycpO1xyXG4gIHJldHVybiBwYXJzZUludChudW0pO1xyXG59XHJcblxyXG4vKipcclxuICogW1QyXeexu+Wei++8jOiOt+WPluS4gOS4qumhtemdouS4reaJgOacieeahOW9lemfs+S/oeaBr1xyXG4gKiBcclxuICogQHBhcmFtIHtzdHJpbmd9IHBhZ2VcclxuICogQHJldHVybnMge09iamVjdH1cclxuICogXHJcbiAqL1xyXG52YXIgZ2V0SXRlbXNJbmZvRnJvbVBhZ2VfVDIgPSAocGFnZSkgPT4ge1xyXG4gIHZhciAkID0gY2hlZXJpby5sb2FkKHBhZ2UpO1xyXG4gIC8vIHZhciByZXN1bHQgPSBbXTtcclxuICB2YXIgcmVzdWx0ID0gJCgnI3NlYXJjaFVzZXJQYWdlID4gZGl2Lm1haW5ib3hfbGVmdCA+IGRpdi5yZXBvcnQgPiBkaXYucmVwb3J0X2xpc3RWaWV3ID4gZGl2ID4gZGl2Om50aC1jaGlsZCgxKScpLnRvQXJyYXkoKS5tYXAoaXRlbSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0aXRsZTogJCgnYS5zb3VuZFJlcG9ydF9zb3VuZG5hbWUnLCBpdGVtKS50ZXh0KCksXHJcbiAgICAgIHRhZzogJCgnYS5zb3VuZFJlcG9ydF90YWcnLCBpdGVtKS50b0FycmF5KCkubWFwKHYgPT4gJCh2KS50ZXh0KCkpLFxyXG4gICAgICBhdXRob3I6ICQoJ2Rpdi5zb3VuZFJlcG9ydF9hdXRob3IgPiBhJywgaXRlbSkudGV4dCgpLnRyaW0oKSxcclxuICAgICAgYWxidW06ICQoJ2Rpdi5zb3VuZFJlcG9ydF9hbGJ1bSA+IGEnLCBpdGVtKS50ZXh0KCkudHJpbSgpLFxyXG4gICAgICBwbGF5Q291bnQ6ICQoJ3NwYW4uc291bmRfcGxheWNvdW50JywgaXRlbSkudGV4dCgpXHJcbiAgICB9XHJcbiAgfSlcclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG4vKipcclxuICog6I635Y+W5omA5pyJ6aG16Z2i55qE5L+h5oGvXHJcbiAqIFxyXG4gKiBAcGFyYW0ge2FueX0ga2V5d29yZFxyXG4gKiBAcGFyYW0ge2FueX0gdHlwZVxyXG4gKiBAcmV0dXJucyB7TGlzdH0gXHJcbiAqL1xyXG52YXIgZ2V0SXRlbXNJbmZvX0FsbCA9IGFzeW5jKGtleXdvcmQsIHR5cGUpID0+IHtcclxuICB2YXIgcGFnZU51bSA9IGF3YWl0IGdldFNlYXJjaFBhZ2VOdW0oa2V5d29yZCwgdHlwZSk7XHJcbiAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gIHZhciBnZXRJdGVtc0Zyb21QYWdlO1xyXG4gIHN3aXRjaCAodHlwZSkge1xyXG4gICAgY2FzZSBcInQyXCI6XHJcbiAgICAgIGdldEl0ZW1zRnJvbVBhZ2UgPSBnZXRJdGVtc0luZm9Gcm9tUGFnZV9UMlxyXG4gICAgICBicmVhaztcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIGdldEl0ZW1zRnJvbVBhZ2UgPSBnZXRJdGVtc0luZm9Gcm9tUGFnZV9UMlxyXG4gICAgICBicmVhaztcclxuICB9XHJcbiAgZm9yICh2YXIgcGFnZUluZGV4ID0gMTsgcGFnZUluZGV4IDw9IHBhZ2VOdW07IHBhZ2VJbmRleCsrKSB7XHJcbiAgICByZXN1bHQgPSByZXN1bHQuY29uY2F0KGdldEl0ZW1zRnJvbVBhZ2UoYXdhaXQgcmVxdWVzdFBhZ2VDb250ZW50KGtleXdvcmQsIHR5cGUsIGBwJHtwYWdlSW5kZXh9YCkpKTtcclxuICB9XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgZ2V0U2VhcmNoUGFnZU51bSxcclxuICBnZXRTZWFyY2hSZWNvcmROdW0sXHJcbiAgcmVxdWVzdFBhZ2VDb250ZW50LFxyXG4gIGdldEl0ZW1zSW5mb0Zyb21QYWdlX1QyLFxyXG4gIGdldEl0ZW1zSW5mb19BbGxcclxufSJdfQ==