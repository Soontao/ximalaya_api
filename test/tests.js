var assert = require('assert');
var ximalaya = require('../bin');
var testKeyword = '卓老板';
var testType = 't2';

describe('Unit Test', function() {

  this.slow(2000);

  describe('#requestPageContent', function() {
    it('should be string', function(done) {
      ximalaya.requestPageContent(testKeyword, testType, undefined)
        .then(v => {
          assert.equal(typeof v, "string", "result shoule be a string");
          done();
        })
        .catch(err => {
          assert.ifError(err);
          done();
        })

    });
  });

  describe('#getSearchPageNum', () => {
    it('should be a number', done => {
      ximalaya.getSearchPageNum(testKeyword, testType)
        .then(v => {
          assert.equal(typeof v, "number");
          assert.ok(v > 0);
          done();
        })
        .catch(err => {
          assert.ifError(err);
          done();
        })
    })
  })

  describe('#getSearchRecordNum', () => {
    it('shoud be a number', done => {
      ximalaya.getSearchRecordNum(testKeyword, testType)
        .then(v => {
          assert.equal(typeof v, "number");
          assert.ok(v > 0);
          done();
        })
        .catch(err => {
          assert.ifError(err);
          done();
        })
    })
  })

});