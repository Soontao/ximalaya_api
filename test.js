var ximalaya = require('./main');


ximalaya.requestPageContent('卓老板', 't2', undefined, (body) => {
  body && console.log("success")
  console.log(ximalaya.getItemsInfoFromPage_T2(body))
})

ximalaya.getSearchRecordNum('卓老板', 't2', num => {
  console.log(num)
})

ximalaya.getSearchPageNum('卓老板', 't2', num => {
  console.log(num)
})

