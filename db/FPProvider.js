var levelCounter = 1;

Universe = require('./../public/javascripts/fp-core/src/models/universe.js').Universe;
World = require('./../public/javascripts/fp-core/src/models/world.js').World;
require('./../public/javascripts/fp-core/src/models/agent/agent.js');
require('./../public/javascripts/fp-core/src/models/resource.js');
require('./../public/javascripts/fp-core/src/models/tile.js');


var level = new Level();


LevelProvider = function(){};
LevelProvider.prototype.worlds = [];

LevelProvider.prototype.findAll = function(callback) {
  callback( null, this.worlds )
};

LevelProvider.prototype.findById = function(id, callback) {
  var result = null;
  for(var i =0;i<this.worlds.length;i++) {
    if( this.worlds[i]._id == id ) {
      result = this.worlds[i];
      break;
    }
  }
  callback(null, result);
};

LevelProvider.prototype.save = function(levels, callback) {
  var level = null;

  if( typeof(levels.length)=="undefined")
    levels = [levels];

  for( var i =0;i< levels.length;i++ ) {
    level = levels[i];
    level.id = levelCounter++;

//    if( article.comments === undefined )
//      article.comments = [];
//
//    for(var j =0;j< article.comments.length; j++) {
//      article.comments[j].created_at = new Date();
//    }
    this.worlds[this.worlds.length]= level;
  }
  callback(null, levels);
};

/* Lets bootstrap with dummy data */
new LevelProvider().save([
    new Level(1),
    new Level(2),
    new Level(3)
], function(error, levels){
    console.log(error);
});

exports.LevelProvider = LevelProvider;