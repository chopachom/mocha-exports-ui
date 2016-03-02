'use strict';
const util  = require('util');
const Mocha = require('mocha');
const Suite = require('mocha/lib/suite');
const Test  = require('mocha/lib/test');
const escapeRe = require('escape-string-regexp');

module.exports = Mocha.interfaces['exports2'] = function(suite){
  const suites = [suite];
  suite.on('require', function(object, file, mocha){
    //inspect(object, file, mocha);
    visit(object, file, mocha);
  });

  function visit(obj, file, mocha){
    for (let key of Object.keys(obj)){
      if(isSuite(key, obj[key])) {
        addSuite(obj, key, file, mocha);
        continue;
      }
      const fn = obj[key];
      switch (key) {
        case 'before':
          before(fn);
          break;
        case 'after':
          after(fn);
          break;
        case 'let':
        case 'beforeEach':
          beforeEach(fn);
          break;
        case 'afterEach':
          afterEach(fn);
          break;
        default:
          for(let s of strategies(file, mocha)){
            if(s(key, fn) === false) continue;
            break;
          }
      }
    }
  }

  function isSuite(key, obj){
    return typeof obj === 'object' && ['let', 'letOnce'].indexOf(key) === -1;
  }

  function addSuite(obj, key, file, mocha){
    const pending = key.startsWith('-');
    const exclusive = key.startsWith('!');
    const title = pending || exclusive? key.slice(1).trim() : key;
    const suite = Suite.create(suites[0], title);
    suites.unshift(suite);
    if(exclusive) mocha.grep(suite.fullTitle());
    suite.pending = pending;
    visit(obj[key], file, mocha);
    suites.shift();
  }

  function strategies(file, mocha){
    return [
      function skip(key, fn){
        const condition = key.charAt(0) === '-' || typeof fn !== 'function';
        if(!condition) return false;
        if(key.charAt(0) === '-') key = key.slice(1).trim();
        const test = new Test(key, fn);
        test.pending = true;
        test.file = file;
        suites[0].addTest(test);
      },
      function only(key, fn) {
        const condition = key.charAt(0) === '!';
        if(!condition) return false;
        const test = new Test(key.slice(1).trim(), fn);
        test.file = file;
        suites[0].addTest(test);
        const reString = '^' + escapeRe(test.fullTitle()) + '$';
        mocha.grep(new RegExp(reString));
      },
      function regular(key, fn){
        const test = new Test(key, fn);
        test.file = file;
        suites[0].addTest(test);
      }
    ]
  }

  function before(fn){
    suites[0].beforeAll(fn);
  }

  function beforeEach(fn){
    // "let"
    if(typeof fn === 'object'){
      const obj = fn;
      Object.keys(obj).map(function(key){
        const fn = obj[key];
        suites[0].beforeEach(function(done) {
          const _this = this;
          // function accepts a callback
          if (fn.length) {
            return fn.call(this, function(err, result){
              if(err) return done(err);
              _this[key] = result;
              done();
            })
          }
          const ret = fn.call(this);
          // if it not a promise
          if(!ret || typeof ret.then !== 'function') {
            _this[key] = ret;
            return done();
          }
          // and the last case if its promise
          ret.then(function(result){
            _this[key] = result;
            done();
          }).catch(done);
        });
        suites[0].afterEach(function(){
          delete this[key];
        })
      });
      return;
    }
    suites[0].beforeEach(fn);
  }

  function after(fn) {
    suites[0].afterAll(fn);
  }

  function afterEach(fn){
    suites[0].afterEach(fn);
  }
};