var nconf = require('nconf');
require('console-stamp')(console, {patern: '[yyyy-mm-dd HH:MM:ss.l]',
								   metadata: () => {return '[' + process.pid + ']';}
								  });

module.exports = () => {
	return new Promise((resolve) => {
		console.log("Setting up nconf");
		nconf.argv().env();

		var path = [];
		path['path_base'] = `${__dirname}`;
		path['path_commands'] = path['path_base'] + `/commands`;
		path['path_util'] = path['path_base'] + `/util`;

		nconf.add('path', { type: 'literal', store: path});

		resolve();
	});
}