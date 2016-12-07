//System information
const sysInfo = require('./resource/info/sys-info.js');

module.exports = function(message) {
	return new Promise((resolve, reject) => {
		var msg = '**System information : **\n`';

		var gen = sysInfo['gen']();
		for(var i = 0 ; i < gen.length ; i ++){
			msg += '\n' + gen[i].name + ' ' + gen[i].value;
		}

		var gen = sysInfo['poll']();
		for(var i = 0 ; i < gen.length ; i ++){
			msg += '\n' + gen[i].name + ' ' + gen[i].value;
		}
		msg += '`';
		message.channel.sendMessage(msg).then(() => {
			return resolve('ok');
		});
	});
}