var https = require('https');
var nconf = require('nconf');	

var command = function(message, suffix) {
	return new Promise((resolve, reject) => {
		var options = 'https://www.randomlists.com/data/video-games.json';

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
	            var items = obj.data;

	            var len = items.length;

				var arr = []
				while(arr.length < 10){
				    var randomnumber = Math.floor(Math.random()*100);
				    if(arr.indexOf(randomnumber) > -1) continue;
				    arr[arr.length] = randomnumber;
				}
	            
	            var res = "Hope you like it :)\n";
	            for(var i = 0 ; i < 10 ; i ++) {
	            	res += items[arr[i]].name + "\n";
	            }

	            message.channel.sendMessage(res).then(() => {
					return resolve('ok');
				});
	        });
		}).on('error', (e) => {
			return reject(e);
		});
	});
}

help = () => {
	return "Sugest 10 random games";
}

usage = () => {
	return "games";
}

module.exports = {
	'command': command,
	'info': help,
	'usage': usage
};