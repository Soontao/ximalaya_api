function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var ximalaya = require('.');

_asyncToGenerator(function* () {
  var body = yield ximalaya.requestPageContent('卓老板', 't2', undefined);
  // console.log(ximalaya.getItemsInfoFromPage_T2(body))

  console.log((yield ximalaya.getItemsInfo_All('卓老板', 't2')));
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy90ZXN0LmpzIl0sIm5hbWVzIjpbInhpbWFsYXlhIiwicmVxdWlyZSIsImJvZHkiLCJyZXF1ZXN0UGFnZUNvbnRlbnQiLCJ1bmRlZmluZWQiLCJjb25zb2xlIiwibG9nIiwiZ2V0SXRlbXNJbmZvX0FsbCJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxXQUFXQyxRQUFRLEdBQVIsQ0FBZjs7QUFFQSxrQkFBQyxhQUFXO0FBQ1YsTUFBSUMsT0FBTyxNQUFNRixTQUFTRyxrQkFBVCxDQUE0QixLQUE1QixFQUFtQyxJQUFuQyxFQUF5Q0MsU0FBekMsQ0FBakI7QUFDQTs7QUFFQUMsVUFBUUMsR0FBUixFQUFZLE1BQU1OLFNBQVNPLGdCQUFULENBQTBCLEtBQTFCLEVBQWdDLElBQWhDLENBQWxCO0FBQ0QsQ0FMRCIsImZpbGUiOiJ0ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHhpbWFsYXlhID0gcmVxdWlyZSgnLicpO1xyXG5cclxuKGFzeW5jKCkgPT4ge1xyXG4gIHZhciBib2R5ID0gYXdhaXQgeGltYWxheWEucmVxdWVzdFBhZ2VDb250ZW50KCfljZPogIHmnb8nLCAndDInLCB1bmRlZmluZWQpXHJcbiAgLy8gY29uc29sZS5sb2coeGltYWxheWEuZ2V0SXRlbXNJbmZvRnJvbVBhZ2VfVDIoYm9keSkpXHJcblxyXG4gIGNvbnNvbGUubG9nKGF3YWl0IHhpbWFsYXlhLmdldEl0ZW1zSW5mb19BbGwoJ+WNk+iAgeadvycsJ3QyJykpXHJcbn0pKCk7Il19