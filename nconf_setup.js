var nconf = require('nconf');
require('console-stamp')(console, {patern: '[yyyy-mm-dd HH:MM:ss.l]',
								   metadata: () => {return '[' + process.pid + ']';}
								  });

module.exports = () => {
	return new Promise((resolve) => {
		console.log("Setting up nconf");
		nconf.argv().env();

		config = require('./config.json');

		var path = [];
		path['path_base'] = `${__dirname}`;
		path['path_commands'] = path['path_base'] + `/commands`;
		path['path_util'] = path['path_base'] + `/util`;
		path['path_monitor'] = path['path_base'] + `/monitor`;

		var monitor = [];
		monitor['monitor_spawnDelay'] = config.spawnDelay || 500;

		var manager = [];
		manager['manager_spawnDelay'] = config.spawnDelay || 500;

		nconf.add('path', { type: 'literal', store: path});
		nconf.add('monitor', { type: 'literal', store: monitor});
		nconf.add('DISCORD_GOOGLE', { type: 'literal', store: config});
		// nconf.add('DISCORD_TOKEN', { type: 'literal', store: config.discordToken});
		// nconf.add('GOOGLE_API_KEY', { type: 'literal', store: config.googleApiKey});
		// nconf.add('GOOGLE_CX', { type: 'literal', store: config.googleApiCx});

		resolve();
	});
}