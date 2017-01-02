var assert = require('assert');
var ximalaya = require('../src');
var testKeyword = '卓老板';
var testType = 't2';

describe('Ximalaya API', function() {
  // disable timeout
  this.timeout(0)
  this.slow(-1);

  describe('Different Type Page Parse', () => {

    describe('#type 2', () => {
      it('should be a obj list', (done) => {
        var api = ximalaya.search(testKeyword, 't2');
        api.requestPageContent()
          .then(page => {
            assert.equal(typeof page, "string", "result should be a string");
            var result = api.getItemsInfoFromPage_T2(page)
            assert.ok(result && result.length > 0);
            done();
          })
          .catch(err => {
            assert.ifError(err);
            done();
          })
      });
    });

    describe('#type 3', () => {
      it('should be a obj list', (done) => {
        var api = ximalaya.search(testKeyword, 't3');
        api.requestPageContent()
          .then(page => {
            assert.equal(typeof page, "string", "page should be a string");
            var result = api.getItemsInfoFromPage_T3(page)
            assert.ok(result && result.length > 0);
            done();
          })
          .catch(err => {
            assert.ifError(err);
            done();
          })
      });
    });

  });

  describe('Unit Test', function() {

    describe('#requestPageContent', function() {
      it('should be string', function(done) {
        ximalaya.search(testKeyword, testType).requestPageContent()
          .then(v => {
            assert.equal(typeof v, "string", "result should be a string");
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
      it('should be a number', done => {
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

    describe('#getItemsInfo_All', () => {
      it('should get object list', (done) => {
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

    describe('#getItemsInfo_All testCache', () => {
      it('should quicker than before', (done) => {
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

  describe('Wrong Param Test', function() {

    describe('Wrong Constructor Param Test', () => {
      it('should throw an error', (done) => {
        try {
          ximalaya.search();
          assert.fail();
        } catch (error) {
          assert.ok(error instanceof Error);
          done();
        }
      });
    });

    describe('#requestPageContent without type param', function() {
      it('should be string', function(done) {
        ximalaya.search(testKeyword).requestPageContent()
          .then(v => {
            assert.equal(typeof v, "string", "result should be a string");
            done();
          })
          .catch(err => {
            assert.ifError(err);
            done();
          })

      });
    });

  });





});