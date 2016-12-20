var yt = require('ytdl-core');

module.exports = function(message) {
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