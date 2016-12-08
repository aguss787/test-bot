require('console-stamp')(console, '[yyyy-mm-dd HH:MM:ss.l]');

var os = require('os');

console.log("INIT MANAGER");

require('./nconf_setup.js')().then(() => {
	var discord = require("discord.js");

	var coreNum = os.cpus().length;
	console.log(coreNum + " core(s) detected");

	if(coreNum < 1)
		coreNum = 1;

	// Create a new manager and spawn 2 shards
	var manager = new discord.ShardingManager("./bot.js", coreNum, true);
	manager.spawn();
}).catch(() => {
	console.error("nconf setup error");
});