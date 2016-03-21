mocha-exports-ui
=====================

This projects lets you write your Mocha tests in the same way as original exports UI but it adds pending and exclusive tests plus shortcuts like `let` and `const` for assigning variables to the context.

Compare BDD interface and mocha-exports-ui interface:

```javascript
// mocha-exports-ui interface:
module.exports = {
  'User': {
    // will add variables to the context but only once (similar to `beforeAll`)
    const: {
      db: function(done){
        connect('some://connection/string', done);
      },
      User: function(){
        return this.db.model('User', UserSchema);
      }
    },
    // same as `const` but runs before each test like `beforeEach`
    let: {
      user: function(cb){
        new this.User({name: 'joe', password: 'qwerty', email: 'joe@gmail.com'}).save(done);
      }
    },
    // a test suite is just an object that can contain other test suites and tests
    '.signup': {
      // a test
      'returns an error if email exists': function(done){
        new this.User({name: 'another_joe', password: 'qwerty', email: 'joe@gmail.com'}).save(function(err){
          expect(err.message).to.contain('email exists');
          done(err);  
        });
      }
    },
    '#save': {
      // adding minus sign will skip the test, this is the same as calling `it.skip`
      '- it hashes password': function(){},
      'omits real password': function(){},
      // exclamation point makes a test or a suite exclusive, it is equivalent to  `it.only` or `describe.only`
      '! returns an error if email is changed to existing one': function(){}
    }
  }
}

// the same using regular BDD interface
describe('User', function(){
  before(function(done){
    const _this = this;
    connect('some://connection/string', function(err, db){
      if(err) return done(err);
      _this.db = db;
      _this.user = db.model('User', UserSchema);
    });  
  });  

  beforeEach(function(done){
    const _this = this;
    new this.User({name: 'joe', password: 'qwerty', email: 'joe@gmail.com'}).save(function(err, user){
      if(err) return done(err);
      _this.user = user;
      done(err);  
    });
  })
  describe.only('.signup', function(){
    it('returns an error if email exists', function(done){
      new this.User({name: 'another_joe', password: 'qwerty', email: 'joe@gmail.com'}).save(function(err){
        expect(err.message).to.contain('email exists');
        done(err);  
      });
    });
  });
  describe('#save', function(){
    it.skip('hashes password', function(){/* some code*/});
    it('doesn\'t save real password',function(){});
    it.only('returns an error if email changed to existing',function(){})
  });
})
```

See the `test/index.js` file in this repo for an example

#Usage

- Install the package: `npm install --save-dev mocha-exports-ui`
- Then just provide the UI name and mocha will automatically require `mocha-exports-ui`:
`mocha --ui mocha-exports-ui test/index.test.js `

###TODO: 
  - should add `let` and `const` to the error output, for instance instead of `"before each" hook for "adds variables to the context"` it should say `"let" hook for "adds variables to the context"`