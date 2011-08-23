var levelCounter = 1;

World = require('./public/javascripts/fp/framework/world.js').World;
Level = require('./public/javascripts/fp/framework/level.js').Level;
require('./public/javascripts/fp/framework/agent.js');
require('./public/javascripts/fp/framework/resource.js');
require('./public/javascripts/fp/framework/tile.js');


console.log(World);
console.log(module.exports);
console.log(module.exports.Level);
var level = new Level();
console.log(level);
console.log('got here');


LevelProvider = function(){};
LevelProvider.prototype.levels = [];

LevelProvider.prototype.findAll = function(callback) {
  callback( null, this.levels )
};

LevelProvider.prototype.findById = function(id, callback) {
  var result = null;
  for(var i =0;i<this.levels.length;i++) {
    if( this.levels[i]._id == id ) {
      result = this.levels[i];
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
    this.levels[this.levels.length]= level;
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