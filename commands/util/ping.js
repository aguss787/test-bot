module.exports = function(message) {
	return new Promise((resolve, reject) => {
		message.channel.sendMessage('pong Kappa').then(() => {
			return resolve('ok');
		});
	});
}