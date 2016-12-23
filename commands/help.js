var fs = require('fs');
var nconf = require('nconf');

concateAll = (commands, param) => {
	return new Promise((resolve, reject) => {
		var msg = 'Command list: \n ```';

		var promises = commands.map((item) => {
			return new Promise((resolve, reject) => {
				var tmp = "";

				tmp += '\n' + item.name + ': ';
				if(item.info !== "") 
					tmp += item.info + '\n';
				else tmp += 'No description\n';

				if(item.usage !== "")
					tmp += 'usage: ' + item.usage + '\n';

				if(item.info !== "" || item.usage !== "" || (param&1) > 0)
					msg += tmp;

				resolve();
			});
		});

		Promise.all(promises).then(() => {
			resolve(msg + '```');
		});
	});
}

var setParam = (suffix) => {
	if(suffix === "all")
		return 1;
	return 0;
}

var command = function(message, suffix) {
	return new Promise((resolve, reject) => {
		var commands = require('./index.js');
		var res = [];

		var promises = Object.keys(commands).map((command) => {
			return new Promise((resolve, reject) => {
				var help_obj = {name: "", info: "", usage: ""};
				help_obj.name = command;
				if(commands[command].info)
					help_obj.info = commands[command].info();
				if(commands[command].usage)
					help_obj.usage = commands[command].usage();
				res.push(help_obj);
				resolve();
			});
		});

		Promise.all(promises).then(() => {
			var param = setParam(suffix);
			concateAll(res, param).then((msg) => {
				message.channel.sendMessage(msg);
				resolve('ok');
			}).catch((msg) => {
				reject(msg);
			})
		}).catch(() => {
			reject('error');
		});
	});
}

help = () => {
	return "View avaiable commands";
}

usage = () => {
	return "help";
}

module.exports = {
	'command': command,
	'info': help,
	'usage': usage
};