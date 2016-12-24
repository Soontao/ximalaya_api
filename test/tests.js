var assert = require('assert');
var ximalaya = require('../main');
var testKeyword = '卓老板';
var testType = 't2';

describe('Unit Test', function() {

  this.slow(2000);

  describe('#requestPageContent', function() {
    it('should be string', function(done) {
      ximalaya.requestPageContent(testKeyword, testType, body => {
        assert.equal(typeof body, 'string');
        done();
      })
    });
  });

  describe('#getSearchPageNum', () => {
    it('should be a number', done => {
      ximalaya.getSearchPageNum(testKeyword, testType, num => {
        assert.equal(typeof num, 'number');
        assert.ok(num > 0);
        done();
      })
    })
  })

  describe('#getSearchRecordNum', () => {
    it('shoud be a number', done => {
      ximalaya.getSearchRecordNum(testKeyword, testType, num => {
        assert.equal(typeof num, 'number');
        assert.ok(num > 0);
        done();
      })
    })
  })

});