function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var ximalaya = require('./main');

_asyncToGenerator(function* () {
  var body = yield ximalaya.requestPageContent('卓老板', 't2', undefined);
  // console.log(ximalaya.getItemsInfoFromPage_T2(body))

  console.log((yield ximalaya.getItemsInfo_All('卓老板', 't2')));
})();