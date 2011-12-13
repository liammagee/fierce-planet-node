var levelCounter = 1;

World = require('./public/javascripts/fp/core/world.js').World;
Level = require('./public/javascripts/fp/core/level.js').Level;
require('./public/javascripts/fp/core/agent/agent.js');
require('./public/javascripts/fp/core/resource.js');
require('./public/javascripts/fp/core/tile.js');

var Profile = require('./public/javascripts/fp/profile/profile.js').Profile;



var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var username, password;

FPProvider = function(name, host, port, username, password, callback){
  this.db = new Db(name, new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(err, db){
      if (err) {
          console.log(err)
          callback(err);
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
FPProvider.prototype.levels = [];


FPProvider.prototype.getCollection= function(callback) {
    this.db.collection('levels', function(error, level_collection) {
      if( error ) callback(error);
      else callback(null, level_collection);
    });
};

FPProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, level_collection) {
      if( error ) callback(error)
      else {
        level_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });};

FPProvider.prototype.findAllByUser = function(user, callback) {
    this.getCollection(function(error, level_collection) {
      if( error ) callback(error)
      else {
//        level_collection.find({user_id: level_collection.db.bson_serializer.ObjectID.createFromHexString(user._id)}).toArray(function(error, results) {
        level_collection.find({user_id: user._id}).toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });};

FPProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, level_collection) {
      if( error ) callback(error)
      else {
        level_collection.findOne({_id: level_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });};

FPProvider.prototype.deleteById = function(id, callback) {
    this.getCollection(function(error, level_collection) {
      if( error ) callback(error)
      else {
          level_collection.remove({_id: level_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(err, r) {
            if( error ) callback(error)
            else callback(null, r)
          });
      }
    });};

FPProvider.prototype.updateLevel = function(level, callback) {
    this.getCollection(function(error, level_collection) {
        if( error ) callback(error);
        else {
			console.log("level id: " + level._id)
            if (level._id && typeof(level._id) === 'string')
                level._id = level_collection.db.bson_serializer.ObjectID.createFromHexString(level._id)
	        if (level.user_id && typeof(level.user_id) === 'string')
	                level.user_id = level_collection.db.bson_serializer.ObjectID.createFromHexString(level.user_id)
            level_collection.save(level, {safe:true}, function(error, result) {
                callback(error, result);
            });
        }
    });
};
FPProvider.prototype.loadLevels = function(levels, callback) {
    this.getCollection(function(error, level_collection) {
      if( error ) callback(error)
      else {
        if( typeof(levels.length)=="undefined")
          levels = [levels];

        for( var i =0;i< levels.length;i++ ) {
          level = levels[i];
//          article.created_at = new Date();
//          if( article.comments === undefined ) article.comments = [];
//          for(var j =0;j< article.comments.length; j++) {
//            article.comments[j].created_at = new Date();
//          }
        }

        level_collection.remove({}, function(err, r) {
            level_collection.insert(levels, function() {
              callback(error, levels);
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
    this.getCollection(function(error, level_collection) {
      if( error ) callback(error)
      else {
        level_collection.remove()
                .toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });};

/* Lets bootstrap with dummy data */
//new LevelProvider().save([
//    new Level(1),
//    new Level(2),
//    new Level(3)
//], function(error, levels){
//    console.log(error);
//});


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