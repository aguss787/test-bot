require('console-stamp')(console, '[yyyy-mm-dd HH:MM:ss.l]');

console.log("INIT MANAGER");

require('./nconf_setup.js')().then(() => {
	var discord = require("discord.js");
	// Create a new manager and spawn 2 shards
	var manager = new discord.ShardingManager("./bot.js",1,true);
	manager.spawn();
}).catch(() => {
	console.error("nconf setup error");
});