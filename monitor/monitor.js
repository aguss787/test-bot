var nconf = require('nconf');
var os = require('os');
var cluster = require('cluster');

var identity;

if(cluster.isMaster){
  identity = 'Monitor master';
}else{
  identity = 'Monitor worker';
}

require('./../nconf_setup.js')().then(() => {
  console.log(`${identity} init...`);

  var stopping = false;
  var production = process.env.NODE_ENV == 'production';

  cluster.on('disconnect', function(worker) {
    if (production) {
      if (!stopping) {
        cluster.fork();
        console.log('Worker respawning');
      }else{
        console.log('Worker exiting');
      }
    } else {
      console.log('Worker exiting');
      process.exit(1);
    }
  });

  if (cluster.isMaster) {
    var workerCount = process.env.NODE_CLUSTER_WORKERS || os.cpus().length;
    console.log(`Starting ${workerCount} workers...`);
    /*for (var i = 0; i < workerCount; i++) {
      cluster.fork();
    }*/
    var currentWorker = 0;
    var interval = setInterval(() => {
      cluster.fork();
      currentWorker ++;
      if (currentWorker >= workerCount) {
        clearInterval(interval);
      }
    }, nconf.get('monitor_spawnDelay'));

    if (production) {
      require(nconf.get('path_util') + '/stopSignalConfig.js')((signal) => {return () => {
          console.log(`Got ${signal}, stopping workers...`);
          stopping = true;
          cluster.disconnect(function () {
            console.log('All workers stopped, exiting.');
            process.exit(0);
          });
      }});
    }
  } else {
    require('./app.js');
  }

});