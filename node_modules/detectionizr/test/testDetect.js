/* MANUAL TEST */
/*
var test = require("../lib/detect");
// be sure to attach event handler before you use detect
test.on("detect", function(name, exist) {
  if(name === "ls" && test.ls)
    console.log("We can use ls on this computer!");
});
// call detect with an array of commands you want to test for
test.detect(["imagemagick", "ls", "punycode"]);

if(test.punycode)
	console.log("We can use test.punycode");
if(test.imagemagick)
	console.log("We can use test.imagemagick");
*/

/*
var test = require("../lib/detect");
function PackageManager() {
    this.available = [];
}
PackageManager.prototype.recieve = function(name, exist) {
    if(exist) this.available.push(name)
}
var pm = new PackageManager();
test.on("detect", pm.recieve, pm);
test.on("finally", function() {
  console.dir(pm);    // { available: [ 'imagemagick', 'rdjpgcom' ] }
  console.dir(test);  /* { child_process: 
                           { fork: [Function],
                             _forkChild: [Function],
                             exec: [Function],
                             execFile: [Function],
                             spawn: [Function] },
                          require: [Function: r],
                          detect: [Function],
                          on: [Function],
                          overwrite: [Function],
                          rdjpgcom: true, <- command line libraries can not be referenced
                          imagemagick: <- but nodejs modules are referenced
                           { identify: { [Function] path: 'identify' },
                             readMetadata: [Function],
                             convert: { [Function] path: 'convert' },
                             resize: [Function],
                             crop: [Function],
                             resizeArgs: [Function] },
                          imgcheck: false }*/
/*
});
test.detect(["rdjpgcom", "imagemagick", "imgcheck"]);
*/
/*
var test = require("../lib/detect");
test.detect(["cluster", "os", "http", "punycode"]);
console.dir(test)
*/
/*var d = require('../lib/detect').detect(['grunt', 'imagemagick'])
d.imagemagick ?                   
  console.log("imagemagick is here") :
    d['grunt'] ?
      console.log("grunt is here") :
      console.error("No grunt and imagemagick") 
*/
/*
var test = require("../lib/detect");
var tests = ["g++","cpp","ar", "ranlib", "exiv2", "c++"];
var numTests = tests.length +3;
test.on("detect", function log(libname, exist) {
    numTests--;
    console.log("%s tests left", numTests)
    if(numTests === 0)
        console.dir(test);      
});
test.detect(tests)*/

