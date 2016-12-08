var nconf = require('nconf');

var os = require('os');

require('./nconf_setup.js')().then(() => {
	console.log("Manager init.... ");

	var discord = require("discord.js");

	var coreNum = os.cpus().length;
	console.log(coreNum + " core(s) detected");

	if(coreNum < 1)
		coreNum = 1;

	// Create a new manager and spawn 2 shards
	var manager = new discord.ShardingManager("./bot.js", coreNum, true);
	manager.spawn().catch((e) => {
		console.log(e);
	});

	require(nconf.get('path_util') + '/stopSignalConfig.js')((signal) => {return () => {
		manager.respawn = false;
		console.log('MASTER ' + signal); 
		
		manager.shards.forEach((child) => {
			child.process.kill(signal);
		});
		
		console.log('Master exiting....');
		process.exit(0);
	}});

}).catch((e) => {
	console.error("nconf setup error:\n " + e);
});	