console.log("INIT MANAGER");
var discord = require("discord.js");
// Create a new manager and spawn 2 shards
var manager = new discord.ShardingManager("./bot.js",1,true);
manager.spawn();