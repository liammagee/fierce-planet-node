var levelCounter = 1;

World = require('./public/javascripts/agents/framework/world.js').World;
Level = require('./public/javascripts/agents/framework/level.js').Level;
require('./public/javascripts/agents/framework/agent.js');
require('./public/javascripts/agents/framework/resource.js');
require('./public/javascripts/agents/framework/tile.js');


var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var username, password;

LevelProvider = function(name, host, port, username, password, callback){
  this.db = new Db(name, new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(err, db){
      // Authenticate
    db.authenticate(username, password, function(error, res) {
        if( error ) callback(error);
        else callback(null, res);
    });
  });
};
LevelProvider.prototype.levels = [];


LevelProvider.prototype.getCollection= function(callback) {
    this.db.collection('levels', function(error, level_collection) {
      if( error ) callback(error);
      else callback(null, level_collection);
    });
};

LevelProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, level_collection) {
      if( error ) callback(error)
      else {
        level_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });};

LevelProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, level_collection) {
      if( error ) callback(error)
      else {
        level_collection.findOne({_id: level_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });};

LevelProvider.prototype.save = function(levels, callback) {
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
LevelProvider.prototype.deleteAll = function(callback) {
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

exports.LevelProvider = LevelProvider;