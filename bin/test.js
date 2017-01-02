function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var ximalaya = require('.');

_asyncToGenerator(function* () {
  // var body = await ximalaya.requestPageContent('卓老板', 't2', undefined)
  // console.log(ximalaya.getItemsInfoFromPage_T2(body))

  // console.log(await ximalaya.getItemsInfo_All('卓老板','t2'))
  try {
    console.log((yield ximalaya.search('卓老板', 't4').getItemsInfo_All()));
  } catch (error) {
    console.log(error);
  }
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy90ZXN0LmpzIl0sIm5hbWVzIjpbInhpbWFsYXlhIiwicmVxdWlyZSIsImNvbnNvbGUiLCJsb2ciLCJzZWFyY2giLCJnZXRJdGVtc0luZm9fQWxsIiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsV0FBV0MsUUFBUSxHQUFSLENBQWY7O0FBRUEsa0JBQUMsYUFBVztBQUNWO0FBQ0E7O0FBRUE7QUFDQSxNQUFJO0FBQ0ZDLFlBQVFDLEdBQVIsRUFBWSxNQUFNSCxTQUFTSSxNQUFULENBQWdCLEtBQWhCLEVBQXVCLElBQXZCLEVBQTZCQyxnQkFBN0IsRUFBbEI7QUFFRCxHQUhELENBR0UsT0FBT0MsS0FBUCxFQUFjO0FBQ2RKLFlBQVFDLEdBQVIsQ0FBWUcsS0FBWjtBQUNEO0FBQ0YsQ0FYRCIsImZpbGUiOiJ0ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHhpbWFsYXlhID0gcmVxdWlyZSgnLicpO1xyXG5cclxuKGFzeW5jKCkgPT4ge1xyXG4gIC8vIHZhciBib2R5ID0gYXdhaXQgeGltYWxheWEucmVxdWVzdFBhZ2VDb250ZW50KCfljZPogIHmnb8nLCAndDInLCB1bmRlZmluZWQpXHJcbiAgLy8gY29uc29sZS5sb2coeGltYWxheWEuZ2V0SXRlbXNJbmZvRnJvbVBhZ2VfVDIoYm9keSkpXHJcblxyXG4gIC8vIGNvbnNvbGUubG9nKGF3YWl0IHhpbWFsYXlhLmdldEl0ZW1zSW5mb19BbGwoJ+WNk+iAgeadvycsJ3QyJykpXHJcbiAgdHJ5IHtcclxuICAgIGNvbnNvbGUubG9nKGF3YWl0IHhpbWFsYXlhLnNlYXJjaCgn5Y2T6ICB5p2/JywgJ3Q0JykuZ2V0SXRlbXNJbmZvX0FsbCgpKVxyXG5cclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5sb2coZXJyb3IpXHJcbiAgfVxyXG59KSgpOyJdfQ==