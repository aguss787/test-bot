var https = require('https');
var nconf = require('nconf');	

var command = function(message, suffix) {
	return new Promise((resolve, reject) => {
		var options = 'https://www.googleapis.com/customsearch/v1?';
		options = options + '&key=' + nconf.get('GOOGLE_API_KEY');
		options = options + '&cx='+ nconf.get('GOOGLE_CX');
		options = options + '&num=1';
		options = options + '&searchType=image';		
		options = options + '&q="' + suffix + '"';

		https.get(options, (res) => {
			var output = '';
			
			if(res.statusCode != 200){
				return reject('error code ' + res.statusCode);
			}

	        res.setEncoding('utf8');

	        res.on('data', function (chunk) {
	            output += chunk;
	        });

	        res.on('end', function() {
	            var obj = JSON.parse(output);
	            var items = obj.items;
	            
	            if(!items){
	            	return reject('Image not found :(');
	            }

	            var link = items[0].link;

	            message.channel.sendMessage(link).then(() => {
					return resolve('ok');
				});
	        });
		}).on('error', (e) => {
			return reject(e);
		});
	});
}

help = () => {
	return "Find a picture from imgur";
}

usage = () => {
	return "imgur [keywords]";
}

module.exports = {
	'command': command,
	'info': help,
	'usage': usage
};