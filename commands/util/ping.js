module.exports = function(message) {
	return new Promise((resolve, reject) => {
		message.channel.sendMessage('pong :MoonMoon:').then(() => {
			return resolve('ok');
		});
	});
}