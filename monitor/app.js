var app          = require('express')(),
      http         = require('http').Server(app),
      fs           = require('fs'),
      path         = require('path'),
      contentTypes = require('./utils/content-types'),
      sysInfo      = require('./utils/sys-info'),
      env          = process.env,
      nconf        = require('nconf');

app.get('/', function(req, res){
  res.redirect('/index.html');
});

app.get('/health', function(req, res){
    res.writeHead(200);
    res.end();
});

app.get('/info/:thing([a-zA-Z0-9_]+)', function(req, res){
    var url = req.params.thing;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store');
    res.end(JSON.stringify(sysInfo[url]()));
});

app.get('/:url([a-zA-Z0-9_.-]+)', function(req, res){
    var url = req.params.url;
    console.log(url);
    fs.readFile(nconf.get('path_monitor') + '/static/' + url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
      } else {
        var ext = path.extname(url).slice(1);
        res.setHeader('Content-Type', contentTypes[ext]);
        if (ext === 'html') {
          res.setHeader('Cache-Control', 'no-cache, no-store');
        }
        res.end(data);
      }
    });
});

http.listen(env.PORT || env.NODE_PORT || 3000, function () {
  console.log(`Application worker started...`);
});
