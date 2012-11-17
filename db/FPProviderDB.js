var worldCounter = 1;

Universe = require('./../public/javascripts/fp-core/src/models/universe.js').Universe;
World = require('./../public/javascripts/fp-core/src/models/world.js').World;
require('./../public/javascripts/fp-core/src/models/agent/agent.js');
require('./../public/javascripts/fp-core/src/models/resource.js');
require('./../public/javascripts/fp-core/src/models/tile.js');

var Profile = require('./../public/javascripts/fp-core/src/profile/profile.js').Profile;



var Db = require('mongodb').Db,
    connect = require('mongodb').connect;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
//var mongo = require('mongoskin');
var username, password;

FPProvider = function(name, host, port, callback, u, p){
//FPProvider = function(url, callback){
  this.db = new Db(name, new Server(host, parseInt(port), {auto_reconnect: true}, {}));
    username = u, password = p;
//    var that = this;
//    connect(url, function(err, db) {
//    this.db = mongo.db(url);
    this.db.open(function(err, db){
      if (err) {
          console.log(err)
          callback(err);
      }
       else {
          callback(null, db);
      }

      // Authenticate
      if (username && password) {
          db.authenticate(username, password, function(error, res) {
            if( error ) callback(error);
            else callback(null, res);
        });
      }
  });
};
FPProvider.prototype.worlds = [];


FPProvider.prototype.getCollection= function(callback) {
    this.db.collection('worlds', function(error, world_collection) {
      if( error ) callback(error);
      else callback(null, world_collection);
    });
};

FPProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, world_collection) {
      if( error ) callback(error)
      else {
        world_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });};

FPProvider.prototype.findAllByUser = function(user, callback) {
    this.getCollection(function(error, world_collection) {
      if( error ) callback(error)
      else {
//        world_collection.find({user_id: world_collection.db.bson_serializer.ObjectID.createFromHexString(user._id)}).toArray(function(error, results) {
        world_collection.find({user_id: user._id}).toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });};

FPProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, world_collection) {
      if( error ) callback(error)
      else {
        world_collection.findOne({_id: world_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });};

FPProvider.prototype.deleteById = function(id, callback) {
    this.getCollection(function(error, world_collection) {
      if( error ) callback(error)
      else {
          world_collection.remove({_id: world_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(err, r) {
            if( error ) callback(error)
            else callback(null, r)
          });
      }
    });};

FPProvider.prototype.updateWorld = function(world, callback) {
    this.getCollection(function(error, world_collection) {
        if( error ) callback(error);
        else {
			console.log("world id: " + world._id)
            if (world._id && typeof(world._id) === 'string')
                world._id = world_collection.db.bson_serializer.ObjectID.createFromHexString(world._id)
	        if (world.user_id && typeof(world.user_id) === 'string')
	                world.user_id = world_collection.db.bson_serializer.ObjectID.createFromHexString(world.user_id)
            world_collection.save(world, {safe:true}, function(error, result) {
                callback(error, result);
            });
        }
    });
};
FPProvider.prototype.loadWorlds = function(worlds, callback) {
    this.getCollection(function(error, world_collection) {
      if( error ) callback(error)
      else {
        if( typeof(worlds.length)=="undefined")
          worlds = [worlds];

        for( var i =0;i< worlds.length;i++ ) {
          var world = worlds[i];
//          article.created_at = new Date();
//          if( article.comments === undefined ) article.comments = [];
//          for(var j =0;j< article.comments.length; j++) {
//            article.comments[j].created_at = new Date();
//          }
        }

        world_collection.remove({}, function(err, r) {
            world_collection.insert(worlds, function() {
              callback(error, worlds);
            });
        });
      }
    });
};

FPProvider.prototype.findHighScores = function(callback) {
    this.getCollection(function(error, user_collection) {
      if( error ) callback(error)
      else {
          // TODO: MongoDB order by / limit
          user_collection.find().toArray(function(error, results) {
            if( error ) callback(error)
            else {
                callback(null, results)
            }
          });
      }
    });
};

FPProvider.prototype.deleteAll = function(callback) {
    this.getCollection(function(error, world_collection) {
      if( error ) callback(error)
      else {
        world_collection.remove()
                .toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });};



FPProvider.prototype.getUserCollection= function(callback) {
    this.db.collection('users', function(error, user_collection) {
      if( error ) callback(error);
      else callback(null, user_collection);
    });
};

FPProvider.prototype.getUserById = function(user_id, callback) {
    this.getUserCollection(function(error, user_collection) {
      if( error ) callback(error);
      else {
          user_collection.findOne({id: user_id}, function(error, result) {
            if( error ) callback(error)
            else if (!result) {
                user_collection.findOne({_id: user_collection.db.bson_serializer.ObjectID.createFromHexString(user_id)}, function(error, result2) {
                    if( error ) callback(error)
                    else callback(null, result2)
                });
            }
            else callback(null, result)
          });
      }
    });
};

FPProvider.prototype.updateUser = function(user, callback) {
    this.getUserCollection(function(error, user_collection) {
        if( error ) callback(error);
        else {
            user_collection.save(user,{safe:true}, function(error, result) {
                callback(error, result);
            });
        }
    });
};

FPProvider.prototype.saveUser = function(user, callback) {
//    console.log(sourceUser)
    this.getUserCollection(function(error, user_collection) {
        if( error ) callback(error);
        else {
            user_collection.findOne({email: user.email}, function(error, result) {
              if( error ) callback(error)
              // If user is not found, save it here
              else {
                // Make sure the user has a profile and a nickname
                if (user.profile == undefined) {
                    user.profile = new Profile();
                    user.profile.nickname = user.profile.nickname || user.nickname || user.email;
                }
                user_collection.save(user, function(e, u) {
                  callback(e, u);
                });
              }
            });
        }
    });
};

FPProvider.prototype.saveUsers = function(users, callback) {
//    console.log(sourceUser)
    this.getUserCollection(function(error, user_collection) {
        if( error ) callback(error);
        else {
            user_collection.insert(users, function(e, u) {
              callback(e, u);
            });
        }
    });
};

FPProvider.prototype.authenticateUser = function(email, password, callback) {
    this.getUserCollection(function(error, user_collection) {
        if( error ) callback(error);
        else {
            user_collection.findOne({email: email}, function(error, result) {
              if( error ) callback(error)
              // If user is not found, save it here
              else if (result == undefined) {
                // Make sure the user has a profile and a nickname
                  callback("Could not authenticate - no user found with email of " + email)
              }
              else {
                  if (result.password == password) {
                      callback(null, result);
                      return;
                  }
                  else {
                      callback("Could not authenticate - no user found with email of " + email)
                  }
              }
            });
        }
    });
};


exports.FPProvider = FPProvider;