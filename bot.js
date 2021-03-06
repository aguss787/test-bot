var nconf = require('nconf');

require('./nconf_setup.js')().then(() => {
  console.log("Worker init....");

  const config = require('./config.json');

  // import the discord.js module
  const Discord = require('discord.js');

  // create an instance of a Discord Client, and call it bot
  const bot = new Discord.Client();

  // the token of your bot - https://discordapp.com/developers/applications/me
  const token = nconf.get('DISCORD_TOKEN'); 

  //prefix for commands
  const prefix = config.prefix;

  //command list
  var commands = require('./commands/index.js');

  // the ready event is vital, it means that your bot will only start reacting to information
  // from Discord _after_ ready is emitted.
  bot.on('ready', () => {
    console.log('Worker ready!');
  });

  // create an event listener for messages
  bot.on('message', message => {
    console.log("Message received => " + message.id);
    var start_time = new Date().getTime();

    if(message.content[0] !== prefix) return;

    var command = message.content.toLowerCase().split(' ')[0].substring(1);
    var suffix = message.content.substring(command.length + 2);

    console.log("Command detected: " + command + ' => "' + suffix + '" => ' + message.id);

    if(commands[command]){
      console.log("Command found! => " + message.id);
    	commands[command].command(message, suffix).then((msg) => {
    		execution_time = new Date().getTime() - start_time;
    		console.log('Command finished in ' + execution_time + ' => ' + msg + ' => ' + message.id) ;
    	}).catch( (msg) => {
    		console.error("Error: " + msg + ' => ' + message.id);
    		message.channel.sendMessage("Error: " + msg);
    	});
    } 
  });

  require(nconf.get('path_util') + '/stopSignalConfig.js')((signal) => {return () => {
      console.log('WORKER ' + signal); 
      process.exit(0);
    }});

  //rejection prevention
  process.on("unhandledRejection", err => {
    console.error("Uncaught Promise Error: \n" + err.stack);
  });

  // log our bot in
  bot.login(token).catch((e) => {
    console.error(e);
  });
});