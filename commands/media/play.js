var yt = require('ytdl-core');

var command = function(message, suffix) {
	return new Promise((resolve, reject) => {
		var voiceChannel = message.member.voiceChannel;
	    if (!voiceChannel) {
	      return message.reply(`Please be in a voice channel first!`);
	    }
	    if(!suffix){
	    	reject('usage: +play [youtube link]');
	    }
	    var link = suffix.split(' ')[0];
	    voiceChannel.join()
	      .then(connnection => {
	        try{
		        var stream = yt(link, {audioonly: true});
		        var dispatcher = connnection.playStream(stream);
		        dispatcher.on('end', () => {
		          voiceChannel.leave();
		        });
		        return resolve('played');
	    	} catch (e) {
	    		return reject(e);
	    	}
	      }).catch(err => {
	      	if (voiceChannel) {
		      voiceChannel.leave();
		    }
		    return reject(err);
	      });
	});
}

module.exports = {
	'command': command
}