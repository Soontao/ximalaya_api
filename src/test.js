var ximalaya = require('.');

(async() => {
  var body = await ximalaya.requestPageContent('卓老板', 't2', undefined)
  // console.log(ximalaya.getItemsInfoFromPage_T2(body))

  console.log(await ximalaya.getItemsInfo_All('卓老板','t2'))
})();