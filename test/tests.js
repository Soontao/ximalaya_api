var assert = require('assert');
var ximalaya = require('../bin');
var testKeyword = '卓老板';
var testType = 't2';

describe('Unit Test', function() {


  // disable timeout
  this.timeout(0)
  this.slow(-1);

  describe('#requestPageContent', function() {
    it('should be string', function(done) {
      ximalaya.search(testKeyword, testType).requestPageContent()
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
      ximalaya.search(testKeyword, testType).getSearchPageNum()
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
      ximalaya.search(testKeyword, testType).getSearchRecordNum()
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

  describe('#ClassGetAll', () => {
    it('should sucess', (done) => {
      ximalaya.search(testKeyword, testType)
        .getItemsInfo_All()
        .then(olist => {
          assert.ok(olist.length > 0);
          done();
        })
        .catch(err => {
          assert.ifError(err);
          done();
        })
    });
  });


});