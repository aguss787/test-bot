var nconf = require('nconf');

var command = function(message) {
	return new Promise((resolve, reject) => {
		message.channel.sendMessage('pong Kappa').then(() => {
			return resolve('ok');
		});
	});
}

help = () => {
	return "Pong Kappa";
}

usage = () => {
	return "ping";
}

module.exports = {
	'command': command,
	'info': help,
	'usage': usage
};