
/**
 * Module dependencies.
 */



var express = require('express');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

//    MONGOHQ_URL => mongodb://heroku:e4ac2a0e4c20fe1d1e45d27c3e126186@staff.mongohq.com:10089/app708577
//    app.set('connstring', process.env.MONGOHQ_URL || ('mongodb://' + app.set('m_host') + '/' +    app.set('m_database')));
//    console.log('connstring is: ' + app.set('connstring'));
//    var uri = parseUri(app.set('connstring'));
//    console.log('host is: ' + uri.host);

    // use connect-mongo as session middleware
//    app.use(express.session({
//        secret: 'topsecret',
//        store: new store({ db: app.set('m_database'), host: uri.host })
//    }));
//    // use express logger
//    app.use(express.logger({ format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m :response-time ms' }));

  app.use(express.bodyParser());
    app.use(express.cookieParser());
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


var LevelProvider = require('./LevelProviderDB').LevelProvider;
//var levelProvider = new LevelProvider('127.0.0.1', 27017);
var levels = [
    new Level(21),
    new Level(22),
    new Level(23)
];
levels[0].name = 'test level 1';
levels[1].name = 'test level 2';
levels[2].name = 'test level 3';

var levelProvider = new LevelProvider('app708577', 'staff.mongohq.com', '10089', 'heroku', '0846c19ac36a5b9e920880bf188dd43e', function(error, res) {
    if( error ) console.log(error);
    else if (res) {
        levelProvider.save(levels, function(error, levels){});
    }
});

// Routes
app.get('/', function(req, res){
    res.render('index', {
        title: 'Fierce Planet',
        locals: {}
    });
});

app.get('/levels/gallery', function(req, res){
  levelProvider.findAll(function(error, levels){
      res.render('levels/gallery.jade', { locals: {
          title: 'Levels',
          layout: false,
          levels: levels
          }
      });
//      res.send(levels);
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

app.get('/levels/:id', function(req, res){
    var id = req.params.id;
    if (id) {
        levelProvider.findById(id, function(error, level){
            res.send(level);
        });
    }
});

// User-related routes
app.get('/users/sign_in', function(req, res){
    res.render('users/sign_in.jade');
});


var port = process.env.PORT || 3000;
app.listen(port);

var io = require('socket.io').listen(app);

// Hack for heroku... needs web sockets support
io.configure(function() {
    io.set("transports", ["xhr-polling", "flashsocket", "json-polling"]);
});

io.sockets.on('connection', function(socket) {
  socket.emit('message', ['server', 'Welcome to Fierce Planet']);
  socket.on('message', function(data) {
    socket.broadcast.emit('message', data);
  });
  socket.on('event', function(data) {
    socket.broadcast.emit('event', data);
  });
});

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
