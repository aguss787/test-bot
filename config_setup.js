var exec = require('child_process').exec;
var fs = require('fs');
var config_file = (process.env['DATA_DIR'] || './data') + '/config.js';

solve = (mode, resolve, reject) => {
	var files = require(config_file).files;
	read = (file, key) => {
		console.log(file + ' ' + key);
		var json = require(file);
		return json[key];
	}

	changeAll = (files, key, callback) => {
		proc = (files, i, callback) => {
			if(i >= files.length)return callback();
			var conf = files[i];
			var json = require(conf.file);
			json[conf.key] = conf[key];

			fs.writeFile(conf.file, JSON.stringify(json, null, '\t'), function (err) {
				if (err) {
					console.error(err);
				}
				proc(files, i + 1, callback);
			});
		}
		proc(files, 0, callback);
	}

	var def = [];

	for(var i in files){
		var file = files[i];

		def.push({file: file.file, key: file.key, new: read(file.file, file.key)});
	}

	changeAll(files, mode, () => {resolve()});
}

module.exports = (mode) => {
	return new Promise((resolve, reject) => {		
		console.log("Config file: " + config_file);

		fs.stat(config_file, (err, stat) => {
			if(stat){
				console.log('Config file found');
				solve(mode, resolve, reject);
			}else{
				console.log('Config file not found, no change done');
				return resolve();
			}
		});
	});
}
