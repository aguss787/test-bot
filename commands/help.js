fs = require('fs');

concateAll = (commands) => {
	return new Promise((resolve, reject) => {
		var msg = 'Command list: \n';

		var promises = commands.map((item) => {
			return new Promise((resolve, reject) => {
				msg += '\n' + item.name + ': ' + item.help + '\n';
				resolve();
			});
		});

		Promise.all(promises).then(() => {
			resolve(msg);
		});
	});
}

module.exports = function(message, suffix) {
	return new Promise((resolve, reject) => {
		var commands = require('./index.js');
		var res = [];

		var promises = Object.keys(commands).map((command) => {
			return new Promise((resolve, reject) => {
				var helpFile = `${__dirname}/help/` + command + '.txt';
				fs.stat(helpFile, (err, stat) => {
					if(stat){
						fs.readFile(helpFile, (err, data) => {
							if(!err){
								help = data.toString();
								res.push({name: command, help: help});
							}
							resolve();
						});
					}else{
						resolve();
					}
				});
			});
		});

		Promise.all(promises).then(() => {
			concateAll(res).then((msg) => {
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