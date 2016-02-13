const run = require('./helpers').runMochaJSON;
const chai = require('chai');
const expect = chai.expect;

module.exports = {
  'exports2 interface for Mocha': {
    'this should work': function(){
      return true;
    },
    'skipping tests': function(done){
      run('skipping.test.js', [], function(err, res){
        if(err) return done(err);
        expect(res.stats.pending).to.be.eql(3);
        expect(res.stats.passes).to.be.eql(1);
        done();
      });
    },
    'failing tests': function(done){
      run('fail.test.js', [], function(err, res){
        if(err) return done(err);
        expect(res.stats.failures).to.be.eql(3);
        done();
      });
    },
    'exclusive tests': function(done){
      run('exclusion.test.js', [], function(err, res){
        if(err) return done(err);
        expect(res.stats.passes).to.be.eql(1);
        expect(res.stats.failures).to.be.eql(0);
        done();
      });
    },
    'exclusive suite tests': function(done){
      run('exclusion.suite.test.js', [], function(err, res){
        if(err) return done(err);
        expect(res.stats.passes).to.be.eql(1);
        expect(res.stats.failures).to.be.eql(0);
        done();
      });
    },
    'let functionality': {
      beforeEach: function(){
        this.beforeEach = 'beforeEach'
      },
      let: {
        promise: function () {
          return new Promise(function(resolve, reject){
            resolve('promise')
          })
        },
        callback: function(done){
          done(null, 'callback')
        }
      },
      'adds variables to the context': function() {
        if(this.beforeEach !== 'beforeEach') throw new Error('beforeEach doesn\'t work');
        if(this.promise !== 'promise') throw new Error('let doesn\'t work');
        if(this.callback !== 'callback') throw new Error('let doesn\'t work');
      }
    }
  }
};