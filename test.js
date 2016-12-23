var ximalaya = require('./main');


ximalaya.requestPageContent('卓老板', 't2', (body) => {
  body && console.log("success")
})

ximalaya.getSearchRecordNum('卓老板', 't2', num => {
  console.log(num)
})

ximalaya.getSearchPageNum('卓老板', 't2', num => {
  console.log(num)
})