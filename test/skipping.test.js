module.exports = {
  'it should pass': function(){
    return true;
  },
  '-it should skip this': function(){
    return true
  },
  'as well as this': false,
  '- also should skip entire suites': {
    'should fail': function(){
      throw new Error()
    }
  }
};