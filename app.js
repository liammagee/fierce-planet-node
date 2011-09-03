
/**
 * Module dependencies.
 */



var express = require('express')
    , everyauth = require('everyauth')
    , conf = require('./conf');

var jsdom = require('jsdom').jsdom
  , myWindow = jsdom().createWindow()
  , $ = require('jquery')
  , jq = require('jquery').create()
  , jQuery = require('jquery').create(myWindow)
  ;

// MongoDB stuff
var FPProvider = require('./FPProviderDB').FPProvider;
var levels = [
    new Level(21),
    new Level(22),
    new Level(23)
];
levels[0].name = 'test level 1';
levels[1].name = 'test level 2';
levels[2].name = 'test level 3';

var fpProvider = new FPProvider('app708577', 'staff.mongohq.com', '10089', 'heroku', '0846c19ac36a5b9e920880bf188dd43e', function(error, res) {
    if( error ) console.log(error);
    else if (res) {
        // Remove existing levels, and add new levels
//        fpProvider.loadLevels(levels, function(error, levels){});
        /*
        var user = { email: 'brian@example.com', password: 'password'};
        var user2 = { email: 'brian2@example.com', password: 'password'};
        fpProvider.saveUsers([user, user2], function(error, res) {
            console.log(error)
            if (res)
                console.log(res)
        });
        */
    }
});



var app = module.exports = express.createServer();

// Everyauth config
everyauth.debug = true;

var usersById = {};
var nextUserId = 0;

function addUser (source, sourceUser) {
  var user;
  if (arguments.length === 1) { // password-based
    user = sourceUser = source;
    user.id = ++nextUserId;
    usersById[nextUserId] = user;
  } else { // non-password-based
    user = usersById[++nextUserId] = {id: nextUserId};
    user[source] = sourceUser;

      // For FaceBook
    if (sourceUser.email)
        user.email = sourceUser.email;
      // For Google
    else if (sourceUser.id)
        user.email = sourceUser.id;
  }

  // Save to MongoDB
    fpProvider.saveUser(user, function(error, res) {
        if (res)
            user = res;
    });
    console.log(user)

  return user;
}
var usersByFbId = {};
var usersByGoogleId = {};
var usersByLogin = {};
everyauth.password.extractExtraRegistrationParams( function (req) {
  return {
      nickname: req.body.nickname
  };
});

everyauth.everymodule
  .findUserById( function (id, callback) {
    callback(null, usersById[id]);
  });
everyauth
  .facebook
    .appId(conf.fb.appId)
    .appSecret(conf.fb.appSecret)
    .findOrCreateUser( function (session, accessToken, accessTokenExtra, fbUserMetadata) {
      return usersByFbId[fbUserMetadata.id] ||
        (usersByFbId[fbUserMetadata.id] = addUser('facebook', fbUserMetadata));
    })
//    .redirectPath('http://cold-autumn-453.heroku.com/');
    .redirectPath('/');
everyauth.google
//  .myHostname('http://cold-autumn-453.heroku.com/')
  .myHostname('http://localhost:3000')
  .appId(conf.google.clientId)
  .appSecret(conf.google.clientSecret)
  .scope('https://www.google.com/m8/feeds/')
  .findOrCreateUser( function (sess, accessToken, extra, googleUser) {
    googleUser.refreshToken = extra.refresh_token;
    googleUser.expiresIn = extra.expires_in;
    return usersByGoogleId[googleUser.id] || (usersByGoogleId[googleUser.id] = addUser('google', googleUser));
  })
  .redirectPath('/');
everyauth
  .password
    .loginWith('email')
    .getLoginPath('/login')
    .postLoginPath('/login')
    .loginView('login.jade')
//    .loginLocals({
//      title: 'Login'
//    })
//    .loginLocals(function (req, res) {
//      return {
//        title: 'Login'
//      }
//    })
    .loginLocals( function (req, res, done) {
      setTimeout( function () {
        done(null, {
          title: 'Async login'
        });
      }, 200);
    })
    .authenticate( function (login, password) {
        var promise = this.Promise();
      var errors = [];
      if (!login) errors.push('Missing login');
      if (!password) errors.push('Missing password');
        if (errors.length) return promise.fulfill(errors)

      // Add mongo lookup here
      fpProvider.authenticateUser(login, password, function(error, user) {
        if (error) return promise.fulfill([error])
          if (!user.id) user.id = user._id;
          usersById[user.id] = user;
        promise.fulfill(user);
      });
        return promise;
    })

    .getRegisterPath('/register')
    .postRegisterPath('/register')
    .registerView('register.jade')
//    .registerLocals({
//      title: 'Register'
//    })
//    .registerLocals(function (req, res) {
//      return {
//        title: 'Sync Register'
//      }
//    })
    .registerLocals( function (req, res, done) {
      setTimeout( function () {
        done(null, {
          title: 'Async Register'
        });
      }, 200);
    })
    .validateRegistration( function (newUserAttrs, errors) {
      var login = newUserAttrs.login;
      if (usersByLogin[login]) errors.push('Login already taken');
      return errors;
    })
    .registerUser( function (newUserAttrs) {
        var promise = this.Promise();

      // Add mongo lookup here
        fpProvider.saveUser(newUserAttrs, function(error, user) {
            if (error) return promise.fulfill([error]);
//            var user = users[0];
            if (!user.id) user.id = user._id;
            usersById[user.id] = user;
            promise.fulfill(user);
        });
        return promise;
    })

    .loginSuccessRedirect('/')
    .registerSuccessRedirect('/');


// Configuration stuff
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

//    MONGOHQ_URL => mongodb://heroku:e4ac2a0e4c20fe1d1e45d27c3e126186@staff.mongohq.com:10089/app708577
//    app.set('connstring', process.env.MONGOHQ_URL || ('mongodb://' + app.set('m_host') + '/' +    app.set('m_database')));
//    console.log('connstring is: ' + app.set('connstring'));
//    var uri = parseUri(app.set('connstring'));
//    console.log('host is: ' + uri.host);


  app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: "very fierce planet" }));
    // Use mongo alternative?
//    app.use(express.session({ store: mongostore(app.set('connstring')), secret: 'topsecret' }));
    // use connect-mongo as session middleware
//    app.use(express.session({
//        secret: 'topsecret',
//        store: new store({ db: app.set('m_database'), host: uri.host })
//    }));
    app.use(everyauth.middleware());
//    app.use(mongooseAuth.middleware());
    app.use(express.methodOverride());

        // IMPORTANT!!!!!!! Do not add app.router, to your middleware chain
        // explicitly, or you will run into problems accessing `req.user`
        // i.e., do not use app.use(app.router). Let express do this for you
        // automatically for you upon your first app.get or app.post.
    app.use(app.router);

  // use express logger
//  app.use(express.logger({ format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m :response-time ms' }));
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});



// Now.js stuff - fails on Windows, Node 0.5.4
//var everyone = require("now").initialize(app);

// Everyauth stuff
everyauth.helpExpress(app);


// Routes
app.get('/', function(req, res){
    res.render('index', {
        title: 'Fierce Planet',
        locals: {}
    });
});

app.get('/levels/gallery', function(req, res){
  fpProvider.findAll(function(error, levels){
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
  fpProvider.findAllByUser(req.user, function(error, levels){
      res.send(levels);
  });
});

app.get('/levels/:id', function(req, res){
    var id = req.params.id;
    if (id) {
        fpProvider.findById(id, function(error, level){
            res.send(level);
        });
    }
});

app.get('/levels/destroy/:id', function(req, res){
    var id = req.params.id;
    if (id) {
        fpProvider.findById(id, function(error, level){
            res.send(level);
        });
    }
});

app.post('/levels/update', function(req, res){
    if (req.body.level && req.user) {
        var level = JSON.parse(req.body.level);
        level.user_id = req.user._id;
        fpProvider.updateLevel(level, function(error, result){
            res.send(result.toString());
        });
    }
});

app.post('/levels/new', function(req, res){
    if (req.body) {
        var level = JSON.parse(req.body.level);
        fpProvider.updateLevel(level, function(error, result){
            res.send(result);
        });
    }
});

app.get('/profiles/high_scores', function(req, res){
    fpProvider.findHighScores(id, function(error, results){
        res.send(results);
    });
});

app.get('/profile/get', function(req, res){
    res.send(req.user);
});

app.get('/chat', function (req, res) {
  res.render('chat', { layout: false });
});


app.post('/profile/update', function(req, res){
    if (req.user && req.body.profile) {
        var user = req.user;
        user.profile = JSON.parse(req.body.profile);
        fpProvider.updateUser(user, function(error, result){
            res.send(result.toString());
        });
    }
});



// Run express
var port = process.env.PORT || 3000;
app.listen(port);


// Socket IO stuff
var sio = require('socket.io');
var io = sio.listen(app);
var nicknames = {};
var duels = {};


io.configure(function(){
    io.set("transports", ["xhr-polling"]);
    io.set("polling duration", 10);
//  io.set('log level', 0);
});

// Hack for heroku... needs web sockets support
io.configure('production', function(){
  io.enable('browser client etag');
  io.set('log level', 1);

  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
//  io.set('transports', [
//  , 'flashsocket'
//  , 'htmlfile'
//  , 'xhr-polling'
//  , 'jsonp-polling'
//  ]);
});

// For development
//io.configure('development', function(){
//  io.set('transports', [
//    'websocket'
//  , 'flashsocket'
//  , 'htmlfile'
//  , 'xhr-polling'
//  , 'jsonp-polling'
//  ]);
//    io.set("polling duration", 10);
//});



io.sockets.on('connection', function (socket) {
  socket.on('user message', function (msg) {
    socket.broadcast.emit('user message', socket.nickname, msg);
  });

  socket.on('nickname', function (nick, fn) {
    if (nicknames[nick]) {
      fn(true);
    } else {
      fn(false);
      nicknames[nick] = socket.nickname = nick;
      socket.broadcast.emit('announcement', nick + ' connected');
      io.sockets.emit('nicknames', nicknames);
    }
  });

  socket.on('initiate duel', function(rival, data) {
    socket.broadcast.emit('event', socket.nickname, data);
  });

  socket.on('list users', function(rival, data) {
    sockets.emit('nicknames', nicknames);
  });

  socket.on('lifecycle event', function(eventType, data) {
    socket.broadcast.emit('lifecycle event', socket.nickname, eventType, data);
  });

  socket.on('disconnect', function () {
    if (!socket.nickname) return;

    delete nicknames[socket.nickname];
    socket.broadcast.emit('announcement', socket.nickname + ' disconnected');
    socket.broadcast.emit('nicknames', nicknames);
  });
});


//
//io.sockets.on('connection', function(socket) {
////  socket.emit('announcement', 'server', 'Welcome to Fierce Planet');
//
//    socket.on('user message', function (msg) {
//      socket.broadcast.emit('user message', socket.nickname, msg);
//    });
//
//    socket.on('nickname', function (nick, fn) {
//      if (nicknames[nick]) {
//        fn(true);
//      } else {
//        fn(false);
//        nicknames[nick] = socket.nickname = nick;
//        socket.broadcast.emit('announcement', nick + ' connected');
//        io.sockets.emit('nicknames', nicknames);
//      }
//    });
//
//  socket.on('message', function(data) {
//    socket.broadcast.emit('message', socket.nickname, data);
//  });
//  socket.on('event', function(data) {
//    socket.broadcast.emit('event', socket.nickname, data);
//  });
//
//    socket.on('disconnect', function () {
//      if (!socket.nickname) return;
//
//      delete nicknames[socket.nickname];
//      socket.broadcast.emit('announcement', socket.nickname + ' disconnected');
//      socket.broadcast.emit('nicknames', nicknames);
//    });
//});

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
