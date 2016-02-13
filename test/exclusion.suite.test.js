module.exports = {
  'this shouldn\'t run': function(){
    throw new Error();
  },
  '!should run entire subsuite': {
    'should pass': function(){
      return true;
    }
  },
  'other subsuites are ignored': {
    'this shouldn\'t run': function(){
      throw new Error();
    },
    'this too': function(){
      throw new Error();
    }
  }
};