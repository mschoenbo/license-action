/*
 * detectionizr
 * https://github.com/dotnetCarpenter/npm-detectionizr
 * @author  dotnetCarpenter
 * @version 13.6.1
 * Licensed under the WTFPL license.
 */
function Detect(config) {
	var events = [];
	var api = {};
	var sysPackages = [];
	var numSysCmds = config.sysCmds.length;
	var numTests = 0;	// test counter

	// require detectionizr module(s)
	config.use.forEach(r, api);

	process.on("exit", function cleanup() {
		events.forEach(function(e,i,all) {
			all[i] = null;	// explicitly de-reference
		})
		events.splice(0, events.length);	// empty array
	});

	// public api
	api.require = r;
	api.detect = function(tests) {
		numTests = tests.length;
  		tests.forEach(detect, api);
  		return api;
	}
	api.on = function(event, fn, scope) {
		events.push([event, fn, scope]);
		return api;
	}
	api.overwrite = function(event, fn, scope) {
		events.forEach(function(e,i,all) {
			if(event === e)
				all.splice(i,1);
		});
		return api.on(event, fn, scope);
	}

	api.on("detect", function() {
		if(numTests === 1)
			events.forEach(function(event) {
				if(event[0] === "finally")
					event[1].call(event[2], api);
			});
	});

	return api;

	function detect(package) {
		//console.log(test);
		if(!r(package)) {
			if(api.child_process) {
				sysPackages.push([package, 0]);
				config.sysCmds.forEach(function(cmd) {
					sysProcess(package, cmd);
				});
			} else {
				console.warn("Weird butt nodejs distro - can not test non NPM packages.");
			}
		} else {
			numTests--;	// reduce test counter
			events.forEach(function(event) {
				if(event[0] === "detect")
					event[1].call(event[2], package, true);
			});
		}
	}

	function sysProcess(package, cmd) {
		var proc = api.child_process.spawn(cmd[0], cmd[1] ? [cmd[1], package] : [package]);
		proc.stdout.setEncoding("utf8");
		proc.stdout.on("data", sysHandler);
//		proc.stderr.on("data", sysHandler);
		proc.stdout.on('end', sysCounter);

		function sysHandler(input) {
			//console.log(input);
			if(input.length > 0) api[package] = true;
		}

		function sysCounter() {
			sysPackages.some(function find(syspackage) {
				if( syspackage[0] === package ) {
					syspackage[1]++;
//console.dir(sysPackages)
//console.log("%s has been tested %d times out of %d", package, syspackage[1], numSysCmds);
					if( numSysCmds === syspackage[1] ) {
						events.forEach(function(event) {
							if(event[0] === "detect")
								event[1].call(event[2], package, api[package]);
						});
						numTests--;	// reduce test counter
						return true;	// stop loop
					}
				}
			});
		}
	}

	function r(package) {
		try {
			api[package] = require(package);
		} catch(err) {
			//console.warn(err.toString());
			api[package] = false;
		} finally {
			return api[package];
		}
	}
}

module.exports = new Detect({
    use: ['child_process']
  , sysCmds: [ ["command", "-v"], ["which"] ]
});
