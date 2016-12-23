var config = require('./resource/youtube/config.json');
var nconf = require('nconf');

var command = function(message, suffix) {
	return new Promise((resolve, reject) => {
		var YouTube = require('youtube-node');
		var youTube = new YouTube();

		youTube.setKey(config.key);
		youTube.addParam('type', 'video');

		youTube.search(suffix, 1, function(error, result) {
			if (error) {
				reject(error);
			}
			else if(result.items.length <= 0){
				message.channel.sendMessage("No video found :(").then(() => {
					return resolve('no video found');
				});
			}
			else {
				console.log(JSON.stringify(result,null,2));
				var watch_link = config.youtube_watch_prefix + result.items[0].id.videoId;
				message.channel.sendMessage(watch_link).then(() => {
					return resolve('ok');
				});
			}
		});
	});
}

help = () => {
	return "Find a video from youtube";
}

usage = () => {
	return "youtube [keywords]";
}

module.exports = {
	'command': command,
	'info': help,
	'usage': usage
};