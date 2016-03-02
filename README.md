Exports2 UI for Mocha
=====================

This projects lets you write your Mocha tests in the same way as original exports UI but it adds pending and exclusive tests and shortcuts for assigning variables to the context.

Compare BDD interface and Exports2 interface:

```javascript
// regular BDD interface
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

// and how it would look using exports2 interface:
module.exports = {
  'User': {
    // will initialize variables to the context but only once (similar to `beforeAll`)
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
    '.signup': {
      'returns an error if email exists': function(done){
        new this.User({name: 'another_joe', password: 'qwerty', email: 'joe@gmail.com'}).save(function(err){
          expect(err.message).to.contain('email exists');
          done(err);  
        });
      }
    },
    '#save': {
      '- it hashes password': function(){},
      'omits real password': function(){},
      '! returns an error if email changed to existing': function(){}
    }
  }
}
```

###TODO: 
  - should add `let` and `const` to the error output, for instance instead of `"before each" hook for "adds variables to the context"` it should say `"let" hook for "adds variables to the context"`