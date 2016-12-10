var files = require(process.env['DATA_DIR'] + '/config.js').files;
var exec = require('child_process').exec;
var fs = require('fs');

console.log(`${__dirname}`);
console.log(process.env['DATA_DIR'] + '/config.js');
console.log(files);

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
			if (err) return console.log(err);
			console.log(i + ' : ' + JSON.stringify(json, null, 4));
			console.log('writing to ' + conf.file);
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

if(process.argv.length < 3)
	changeAll(files, 'new', () => {});
else
	changeAll(files, process.argv[2], () => {});

