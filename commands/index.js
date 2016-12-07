var glob = require('glob');
var R = require('ramda');
var path = require('path');

var glob_options = {
  realpath: true,
  nodir: true
};

var command_files = R.uniq(R.flatten([
  glob.sync(`${__dirname}/*(!(index.js))`, glob_options),
  glob.sync(`${__dirname}/*(!(resource))/*.js`, glob_options)
]));

// Merge all the commands objecs together and export.

var commands = [];
for(var i = 0 ; i < command_files.length ; i ++){
	var command_name = path.basename(command_files[i], '.js');
	commands[command_name] = require(command_files[i]);
}

module.exports = commands;
