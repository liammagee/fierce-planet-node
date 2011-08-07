var levelCounter = 1;

World = require('./public/javascripts/agents/framework/world.js').World;
Level = require('./public/javascripts/agents/framework/level.js').Level;
require('./public/javascripts/agents/framework/agent.js');
require('./public/javascripts/agents/framework/resource.js');
require('./public/javascripts/agents/framework/tile.js');


//console.log(World);
//console.log(module.exports);
//console.log(module.exports.Level);
//var level = new Level();
//console.log(level);
//console.log('got here');

var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

LevelProvider = function(host, port){
  this.db= new Db('node-mongo-fp', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});
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
            console.log(results);
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });};

LevelProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, level_collection) {
      if( error ) callback(error)
      else {
        level_collection.findOne({id: level_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
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

        level_collection.insert(levels, function() {
          callback(null, levels);
        });
      }
    });
};

/* Lets bootstrap with dummy data */
//new LevelProvider().save([
//    new Level(1),
//    new Level(2),
//    new Level(3)
//], function(error, levels){
//    console.log(error);
//});

exports.LevelProvider = LevelProvider;