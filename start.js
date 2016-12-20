var nconf = require('nconf');
var async = require('async');
var spawn = require('child_process').spawn;
var os = require('os');

require('./nconf_setup.js')().then(() => {
	require('./config_setup.js')('new').then(() => {
		console.log("Manager init.... ");

		var discord = require("discord.js");

		var coreNum = os.cpus().length;
		console.log(coreNum + " core(s) detected");

		if(coreNum < 1)
			coreNum = 1;

		var manager = new discord.ShardingManager("./bot.js", coreNum, true);
		manager.spawn(coreNum, nconf.get('manager_spawnDelay')).catch((e) => {
			console.log(e);
		});

		var monitor = spawn('node', [nconf.get('path_monitor') + '/monitor.js'], {stdio: 'inherit'});

		require(nconf.get('path_util') + '/stopSignalConfig.js')((signal) => {return () => {
			manager.respawn = false;
			console.log('MASTER ' + signal); 
			
			async.series([
				(callback) => {
					monitor.kill(signal);
					manager.shards.forEach((child) => {
						child.process.kill(signal);
					});
					callback(null);
				},
				(callback) => {
					require('./config_setup.js')('default').then(callback);
				}
			], (e, results) => {
				console.log(e);
				console.log(results);
				console.log('All childs get the signal, master exiting....');
		        process.exit(0);
			});
		}});
	}).catch((e) => {
		console.error("config setup error:\n" + e);
	});	
}).catch((e) => {
	console.error("nconf setup error:\n" + e);
});	
