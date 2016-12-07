var yt = require('ytdl-core');

module.exports = function(message, suffix) {
	return new Promise((resolve, reject) => {
		var voiceChannel = message.member.voiceChannel;
	    if (!voiceChannel) {
	      return message.reply(`Please be in a voice channel first!`);
	    }
	    if(!suffix){
	    	reject('usage: +play [youtube link]');
	    }
	    var link = suffix.split(' ')[0];
	    console.log(link);
	    voiceChannel.join()
	      .then(connnection => {
	        var stream = yt(link, {audioonly: true});
	        var dispatcher = connnection.playStream(stream);
	        dispatcher.on('end', () => {
	          voiceChannel.leave();
	        });
	      }).catch(err => {
	      	if (voiceChannel) {
		      voiceChannel.leave();
		    }
		    return reject(err);
	      });
	});
}