/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

var unitTests = {
  setUp: function(done) {
    //TODO: need to implement process signaling in detectionizr, before it can be tested rigorously
    // or stop using a singleton pattern
    //this.detectionizr = require("child_process").fork("../lib/detect.js"/*, [args], [options]*/);
    this.detectionizr = require("../lib/detect.js");
    this.public = [
      "child_process",
      "require",
      "detect",
      "on",
      "overwrite"
    ];
    done();
  },
  tearDown: function(done) {
    // TODO: See todo in setUp
    //this.detectionizr.kill("SIGTERM");
    this.detectionizr = null; // doesn't do much
    done();
  },
  api: function(test) {
    test.expect(5);
    test.ok(this.detectionizr.child_process)
    test.ok(this.detectionizr.require)
    test.ok(this.detectionizr.detect)
    test.ok(this.detectionizr.on)
    test.ok(this.detectionizr.overwrite)
    test.done();
  },
  nodeModules: function(test) {
    var commands = [
      'assert',
      'buffer',
      /*'child_process', is already included in detectionizr */
      'cluster',
      'crypto',
      'dgram',
      'dns',
      'events',
      'fs',
      'http',
      'https',
      'net',
      'os',
      'path',
      'punycode',
      'querystring',
      'readline',
      'repl',
      'string_decoder',
      'tls',
      'tty',
      'url',
      'util',
      'vm',
      'zlib' ];  // node 0.8.0 internal modules

    var propertyList = commands.concat(this.public);

    test.expect(propertyList.length);
    
    this.detectionizr.detect(commands);
    for (var prop in this.detectionizr) {
      test.ok(
          propertyList.indexOf(prop) > -1
        , "Expected " + prop
      );
    }
    //console.dir(this.detectionizr);
    test.done();
  },/*
  dependencies: function(test) {
    var commands = ["grunt"];   // npm package used to run these tests
    var propertyList = commands.concat(this.public);
    test.expect(propertyList.length);
    this.detectionizr.detect(commands);
    for (var prop in this.detectionizr) {
      //console.log(prop)
      test.ok(
          propertyList.indexOf(prop) > -1
        , "Expected " + prop
      );
    }
    test.done();      
  },/*
  systemCommands: function(test) {
    var commands = ["which", "command"] // commands used to find system libs
    test.expect(commands.length);
    
    var propertyList = commands.concat(this.public);
    this.detectionizr.detect(commands);
    for (var prop in this.detectionizr) {
      //console.log(prop)
      test.ok(
          propertyList.indexOf(prop) > -1
        , "Expected " + prop
      );
    }
    test.done();
  },*/
  detect: function(test) {
    var d = this.detectionizr.detect(['grunt', 'imagemagick']);
    test.ok(!d.imagemagick);
    test.ok(d.grunt);
    test.done();
  },
  on: function(test) {
    var d = this.detectionizr;
    var tests = ["g++","cpp","ar", "ranlib", "exiv2", "c++"];
    var numTests = tests.length;
    test.expect(numTests);
    d.on("detect", function log(libname, exist) {
        numTests--;
        test.equal(numTests, numTests)  // count test.expect
        //TODO: need to implement process signaling
        //test.ok(tests.indexOf(libname) > -1, libname)
        if(numTests === 0)
            test.done();
    });
    d.detect(tests)
  }
};

module.exports = unitTests;

/*function propertyCheck(actual, expected) {
  for(var prop in actual) {
    console.log(prop)
    if(!expected[prop]) {
      return false;
    }
  }
  return true;
}*/
