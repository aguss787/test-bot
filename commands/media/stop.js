var yt = require('ytdl-core');

var command = function(message) {
	return new Promise((resolve, reject) => {
		var voiceChannel = message.member.voiceChannel;
	    if (voiceChannel) {
	    	console.log('asdasd');
	      voiceChannel.leave();
	      return resolve();
	    }else{
	    	return resolve();
	    }
	});
}

module.exports = {
	'command': command
}