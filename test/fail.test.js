module.exports = {
  'failing test suite': {
    'it fails when error is thrown': function(){
      throw new Error();
    },
    'it fails when promise is rejected': function(){
      return new Promise(function(resolve, reject){
        reject(new Error('fail'));
      });
    },
    'it fails if done(err) is called': function(done){
      done(new Error());
    }
  }
};