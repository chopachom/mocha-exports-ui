// copied from https://github.com/mochajs/mocha/blob/master/test/integration/helpers.js

var spawn = require('child_process').spawn;
var path  = require('path');
var fs = require('fs');

module.exports = {

  /**
   * Invokes the mocha binary for the given fixture using the JSON reporter,
   * returning the parsed output, as well as exit code.
   *
   * @param {string}   fixturePath
   * @param {array}    args
   * @param {function} fn
   */
  runMochaJSON: function(fixturePath, args, fn) {
    var p;

    p = resolveFixturePath(fixturePath);
    args = args || [];

    invokeMocha(args.concat(['--require', path.join(__dirname, '../exports2.js'), '--ui', 'exports2', '--reporter', 'json', p]), function(err, res) {
      if (err) return fn(err);
      try {
        var result = JSON.parse(res.output);
        result.code = res.code;
      } catch (err) {
        return fn(err);
      }

      fn(null, result);
    });
  }
};

function invokeMocha(args, fn) {
  var output, mocha, listener;

  output = '';
  mocha = spawn('./node_modules/.bin/mocha', args);

  listener = function(data) {
    output += data;
  };

  mocha.stdout.on('data', listener);
  mocha.stderr.on('data', listener);
  mocha.on('error', fn);

  mocha.on('close', function(code) {
    fn(null, {
      output: output.split('\n').join('\n'),
      code: code
    });
  });
}

function resolveFixturePath(fixture) {
  return path.join(__dirname, fixture);
}

function getSummary(res) {
  return ['passing', 'pending', 'failing'].reduce(function(summary, type) {
    var pattern, match;

    pattern = new RegExp('  (\\d+) ' + type + '\\s');
    match = pattern.exec(res.output);
    summary[type] = (match) ? parseInt(match, 10) : 0;

    return summary;
  }, res);
}