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
 * [T3]类型，获取一个页面中所有的Item信息
 * 
 * @param {string} page
 * @returns {List} result
 */
var getItemsInfoFromPage_T3 = page => {
  var result = [];

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJodHRwIiwicmVxdWlyZSIsImNoZWVyaW8iLCJjYWNoZUl0IiwicmVxdWVzdCIsInBlclBhZ2VJdGVtTnVtIiwiZG9tYWluIiwicmVxdWVzdFBhZ2VDb250ZW50Iiwia2V5d29yZCIsInR5cGUiLCJwYWdlIiwiRXJyb3IiLCJjb250ZW50IiwiZW5jb2RlVVJJIiwiZ2V0U2VhcmNoUGFnZU51bSIsIm51bSIsImdldFNlYXJjaFJlY29yZE51bSIsIk1hdGgiLCJjZWlsIiwidW5kZWZpbmVkIiwiJCIsImxvYWQiLCJ0ZXh0IiwicmVwbGFjZSIsInBhcnNlSW50IiwiZ2V0SXRlbXNJbmZvRnJvbVBhZ2VfVDIiLCJyZXN1bHQiLCJ0b0FycmF5IiwibWFwIiwiaXRlbSIsInRpdGxlIiwidGFnIiwidiIsImF1dGhvciIsInRyaW0iLCJhbGJ1bSIsInBsYXlDb3VudCIsImdldEl0ZW1zSW5mb0Zyb21QYWdlX1QzIiwiZ2V0SXRlbXNJbmZvX0FsbCIsInBhZ2VOdW0iLCJnZXRJdGVtc0Zyb21QYWdlIiwicGFnZUluZGV4IiwiY29uY2F0IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUFDQSxJQUFJQSxPQUFPQyxRQUFRLE1BQVIsQ0FBWDtBQUNBLElBQUlDLFVBQVVELFFBQVEsU0FBUixDQUFkO0FBQ0EsSUFBSUUsVUFBVUYsUUFBUSxVQUFSLENBQWQ7QUFDQSxJQUFJRyxVQUFVSCxRQUFRLGlCQUFSLENBQWQ7QUFDQSxJQUFJSSxpQkFBaUIsRUFBckI7QUFDQSxJQUFJQyxTQUFTLHlCQUFiOztBQUVBOzs7Ozs7O0FBT0EsSUFBSUM7QUFBQSwrQkFBcUIsV0FBTUMsT0FBTixFQUFlQyxJQUFmLEVBQXFCQyxJQUFyQixFQUE4QjtBQUNyRCxRQUFJLENBQUNGLE9BQUwsRUFBYyxNQUFNLElBQUlHLEtBQUosQ0FBVSxXQUFWLENBQU47QUFDZEYsV0FBT0EsUUFBUSxJQUFmO0FBQ0FDLFdBQU9B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OENFLFdBQTlDLEVBQTJEO0FBQ3pEZixlQUFTQSxPQUFPZ0IsTUFBUCxDQUFjRixrQkFBaUIsTUFBTWpDLG1CQUFtQkMsT0FBbkIsRUFBNEJDLElBQTVCLEVBQW1DLEtBQUdnQyxTQUFVLEdBQWhELENBQXZCLEVBQWQsQ0FBVDtBQUNEO0FBQ0QsV0FBT2YsTUFBUDtBQUNELEdBaEJHOztBQUFBO0FBQUE7QUFBQTtBQUFBLElBQUo7O0FBa0JBaUIsT0FBT0MsT0FBUCxHQUFpQjtBQUNmOUIsa0JBRGU7QUFFZkUsb0JBRmU7QUFHZlQsb0JBSGU7QUFJZmtCLHlCQUplO0FBS2ZhO0FBTGUsQ0FBakIiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIlxyXG52YXIgaHR0cCA9IHJlcXVpcmUoJ2h0dHAnKTtcclxudmFyIGNoZWVyaW8gPSByZXF1aXJlKCdjaGVlcmlvJyk7XHJcbnZhciBjYWNoZUl0ID0gcmVxdWlyZSgnbHJ1LWZ1bmMnKTtcclxudmFyIHJlcXVlc3QgPSByZXF1aXJlKCdyZXF1ZXN0LXByb21pc2UnKTtcclxudmFyIHBlclBhZ2VJdGVtTnVtID0gMjA7XHJcbnZhciBkb21haW4gPSBcImh0dHA6Ly93d3cueGltYWxheWEuY29tXCI7XHJcblxyXG4vKipcclxuICog6K+35rGC6aG16Z2i5YaF5a65XHJcbiAqIFxyXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5d29yZCDlhbPplK7or41cclxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGUg5p+l6K+i5YiG57G7XHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYWdlIOmhteaVsFxyXG4gKi9cclxudmFyIHJlcXVlc3RQYWdlQ29udGVudCA9IGFzeW5jKGtleXdvcmQsIHR5cGUsIHBhZ2UpID0+IHtcclxuICBpZiAoIWtleXdvcmQpIHRocm93IG5ldyBFcnJvcihcInBhcmFtIGVyclwiKTtcclxuICB0eXBlID0gdHlwZSB8fCBcInQyXCI7XHJcbiAgcGFnZSA9IHBhZ2UgfHwgXCJwMVwiO1xyXG4gIHZhciBjb250ZW50ID0gYXdhaXQgcmVxdWVzdChlbmNvZGVVUkkoYCR7ZG9tYWlufS9zZWFyY2gvJHtrZXl3b3JkfS8ke3R5cGV9JHtwYWdlfWApKTtcclxuICByZXR1cm4gY29udGVudDtcclxufVxyXG5cclxuLyoqXHJcbiAqIOiOt+WPluaQnOe0oumhtemdouaAu+aVsFxyXG4gKiBcclxuICogQHBhcmFtIHtzdHJpbmd9IGtleXdvcmRcclxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcclxuICogQHBhcmFtIHtmdW5jdGlvbihOdW1iZXIpfSBjYlxyXG4gKi9cclxudmFyIGdldFNlYXJjaFBhZ2VOdW0gPSBhc3luYyhrZXl3b3JkLCB0eXBlKSA9PiB7XHJcbiAgaWYgKCFrZXl3b3JkKSB0aHJvdyBuZXcgRXJyb3IoXCJwYXJhbSBlcnJcIik7XHJcbiAgdHlwZSA9IHR5cGUgfHwgXCJ0MlwiO1xyXG4gIHZhciBudW0gPSBhd2FpdCBnZXRTZWFyY2hSZWNvcmROdW0oa2V5d29yZCwgdHlwZSk7XHJcbiAgcmV0dXJuIE1hdGguY2VpbChudW0gLyBwZXJQYWdlSXRlbU51bSk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qKlxyXG4gKiDojrflj5bmkJzntKLorrDlvZXmlbBcclxuICogXHJcbiAqIEBwYXJhbSB7YW55fSBrZXl3b3JkIOWFs+mUruWtl1xyXG4gKiBAcGFyYW0ge2FueX0gdHlwZSDnsbvlnotcclxuICogQHJldHVybnMge251bWJlcn0g6K6w5b2V5pWwXHJcbiAqL1xyXG52YXIgZ2V0U2VhcmNoUmVjb3JkTnVtID0gYXN5bmMoa2V5d29yZCwgdHlwZSkgPT4ge1xyXG4gIGlmICgha2V5d29yZCkgdGhyb3cgbmV3IEVycm9yKFwicGFyYW0gZXJyXCIpO1xyXG4gIHR5cGUgPSB0eXBlIHx8IFwidDJcIjtcclxuICB2YXIgcGFnZSA9IGF3YWl0IHJlcXVlc3RQYWdlQ29udGVudChrZXl3b3JkLCB0eXBlLCB1bmRlZmluZWQpO1xyXG4gIHZhciAkID0gY2hlZXJpby5sb2FkKHBhZ2UpO1xyXG4gIHZhciBudW0gPSAkKCcjc2VhcmNoVXNlclBhZ2UgPiBkaXYubWFpbmJveF9sZWZ0ID4gZGl2LnJlcG9ydCA+IGRpdi5zZWFyY2hIaW50ID4gZGl2LnNlYXJjaENvdW50JykudGV4dCgpLnJlcGxhY2UoL1teMC05XS9pZywgJycpO1xyXG4gIHJldHVybiBwYXJzZUludChudW0pO1xyXG59XHJcblxyXG4vKipcclxuICogW1QyXeexu+Wei++8jOiOt+WPluS4gOS4qumhtemdouS4reaJgOacieeahOW9lemfs+S/oeaBr1xyXG4gKiBcclxuICogQHBhcmFtIHtzdHJpbmd9IHBhZ2VcclxuICogQHJldHVybnMge09iamVjdH1cclxuICogXHJcbiAqL1xyXG52YXIgZ2V0SXRlbXNJbmZvRnJvbVBhZ2VfVDIgPSAocGFnZSkgPT4ge1xyXG4gIHZhciAkID0gY2hlZXJpby5sb2FkKHBhZ2UpO1xyXG4gIC8vIHZhciByZXN1bHQgPSBbXTtcclxuICB2YXIgcmVzdWx0ID0gJCgnI3NlYXJjaFVzZXJQYWdlID4gZGl2Lm1haW5ib3hfbGVmdCA+IGRpdi5yZXBvcnQgPiBkaXYucmVwb3J0X2xpc3RWaWV3ID4gZGl2ID4gZGl2Om50aC1jaGlsZCgxKScpLnRvQXJyYXkoKS5tYXAoaXRlbSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0aXRsZTogJCgnYS5zb3VuZFJlcG9ydF9zb3VuZG5hbWUnLCBpdGVtKS50ZXh0KCksXHJcbiAgICAgIHRhZzogJCgnYS5zb3VuZFJlcG9ydF90YWcnLCBpdGVtKS50b0FycmF5KCkubWFwKHYgPT4gJCh2KS50ZXh0KCkpLFxyXG4gICAgICBhdXRob3I6ICQoJ2Rpdi5zb3VuZFJlcG9ydF9hdXRob3IgPiBhJywgaXRlbSkudGV4dCgpLnRyaW0oKSxcclxuICAgICAgYWxidW06ICQoJ2Rpdi5zb3VuZFJlcG9ydF9hbGJ1bSA+IGEnLCBpdGVtKS50ZXh0KCkudHJpbSgpLFxyXG4gICAgICBwbGF5Q291bnQ6ICQoJ3NwYW4uc291bmRfcGxheWNvdW50JywgaXRlbSkudGV4dCgpXHJcbiAgICB9XHJcbiAgfSlcclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG4vKipcclxuICogW1QzXeexu+Wei++8jOiOt+WPluS4gOS4qumhtemdouS4reaJgOacieeahEl0ZW3kv6Hmga9cclxuICogXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYWdlXHJcbiAqIEByZXR1cm5zIHtMaXN0fSByZXN1bHRcclxuICovXHJcbnZhciBnZXRJdGVtc0luZm9Gcm9tUGFnZV9UMyA9IHBhZ2UgPT4ge1xyXG4gIHZhciByZXN1bHQgPSBbXTtcclxuXHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDojrflj5bmiYDmnInpobXpnaLnmoTkv6Hmga9cclxuICogXHJcbiAqIEBwYXJhbSB7YW55fSBrZXl3b3JkXHJcbiAqIEBwYXJhbSB7YW55fSB0eXBlXHJcbiAqIEByZXR1cm5zIHtMaXN0fSBcclxuICovXHJcbnZhciBnZXRJdGVtc0luZm9fQWxsID0gYXN5bmMoa2V5d29yZCwgdHlwZSkgPT4ge1xyXG4gIHZhciBwYWdlTnVtID0gYXdhaXQgZ2V0U2VhcmNoUGFnZU51bShrZXl3b3JkLCB0eXBlKTtcclxuICB2YXIgcmVzdWx0ID0gW107XHJcbiAgdmFyIGdldEl0ZW1zRnJvbVBhZ2U7XHJcbiAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICBjYXNlIFwidDJcIjpcclxuICAgICAgZ2V0SXRlbXNGcm9tUGFnZSA9IGdldEl0ZW1zSW5mb0Zyb21QYWdlX1QyXHJcbiAgICAgIGJyZWFrO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgZ2V0SXRlbXNGcm9tUGFnZSA9IGdldEl0ZW1zSW5mb0Zyb21QYWdlX1QyXHJcbiAgICAgIGJyZWFrO1xyXG4gIH1cclxuICBmb3IgKHZhciBwYWdlSW5kZXggPSAxOyBwYWdlSW5kZXggPD0gcGFnZU51bTsgcGFnZUluZGV4KyspIHtcclxuICAgIHJlc3VsdCA9IHJlc3VsdC5jb25jYXQoZ2V0SXRlbXNGcm9tUGFnZShhd2FpdCByZXF1ZXN0UGFnZUNvbnRlbnQoa2V5d29yZCwgdHlwZSwgYHAke3BhZ2VJbmRleH1gKSkpO1xyXG4gIH1cclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICBnZXRTZWFyY2hQYWdlTnVtLFxyXG4gIGdldFNlYXJjaFJlY29yZE51bSxcclxuICByZXF1ZXN0UGFnZUNvbnRlbnQsXHJcbiAgZ2V0SXRlbXNJbmZvRnJvbVBhZ2VfVDIsXHJcbiAgZ2V0SXRlbXNJbmZvX0FsbFxyXG59Il19