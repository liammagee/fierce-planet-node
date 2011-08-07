
/**
 * Module dependencies.
 */



var express = require('express');

var app = module.exports = express.createServer();
var LevelProvider = require('./LevelProviderDB').LevelProvider;

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

var levelProvider = new LevelProvider('127.0.0.1', 27017);
// Routes
/*
levelProvider.save([
    new Level(1),
    new Level(2),
    new Level(3)
], function(error, levels){
    console.log(error);
});
*/

app.get('/', function(req, res){

//  res.render('index', {
//    title: 'Express'
//  });
    res.render('index', {
        title: 'Fierce Planet',
        locals: {}
    });
});

app.get('/levels/list', function(req, res){
  levelProvider.findAll(function(error, levels){
      res.render('levels/index.jade', { locals: {
          title: 'Levels',
          levels: levels
          }
      });
//      res.send(levels);
  });
});


var port = process.env.PORT || 3000;
app.listen(port);

var io = require('socket.io').listen(app);
io.sockets.on('connection', function (socket) {
  socket.emit('message', ['server', 'Welcome to Fierce Planet']);
  socket.on('message', function (data) {
    io.sockets.emit('message', data);
  });
});

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
