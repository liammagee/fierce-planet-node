
var FiercePlanet = {};
ModuleManager = require('./../public/javascripts/fp-core/src/models/module-manager.js').ModuleManager;
Lifecycle = require('./../public/javascripts/fp-core/src/models/lifecycle.js').Lifecycle;
Level = require('./public/javascripts/fp/src/models/level.js').Level;
Resource = require('./../public/javascripts/fp-core/src/models/resource.js').Resource;
ResourceCategory = require('./../public/javascripts/fp-core/src/models/resource.js').ResourceCategory;
ResourceType = require('./../public/javascripts/fp-core/src/models/resource.js').ResourceType;
CultureDefaults = require('./../public/javascripts/fp-core/src/models/agent/agent.js').CultureDefaults;
Memory = require('./../public/javascripts/fp-core/src/models/agent/agent.js').Memory;
MemoryOfAgent = require('./../public/javascripts/fp-core/src/models/agent/agent.js').MemoryOfAgent;
Culture = require('./../public/javascripts/fp-core/src/models/agent/culture.js').Culture;
Chacteristics = require('./../public/javascripts/fp-core/src/models/agent/characteristics.js').Chacteristics;
Beliefs = require('./../public/javascripts/fp-core/src/models/agent/beliefs.js').Beliefs;
Capabilities = require('./../public/javascripts/fp-core/src/models/agent/capabilities.js').Capabilities;
Desires = require('./../public/javascripts/fp-core/src/models/agent/desires.js').Desires;
Agent = require('./../public/javascripts/fp-core/src/models/agent/agent.js').Agent;
Campaign = require('./../public/javascripts/fp-core/src/models/campaign.js').Campaign;
Level = require('./../public/javascripts/fp-core/src/models/level.js').Level;
Tile = require('./../public/javascripts/fp-core/src/models/tile.js').Tile;
DEFAULT_TILE_COLOR = require('./../public/javascripts/fp-core/src/models/tile.js').DEFAULT_TILE_COLOR;
Terrain = require('./../public/javascripts/fp-core/src/models/terrain.js').Terrain;
World = require('./../public/javascripts/fp-core/src/models/universe.js').World;
Module = require('./../public/javascripts/fp-core/src/models/module.js').Module;
Catastrophe = require('./../public/javascripts/fp-core/src/models/catastrophe.js').Catastrophe;
Notice = require('./../public/javascripts/fp-core/src/ui/notice.js').Notice;
Wave = require('./../public/javascripts/fp-core/src/models/wave.js').Wave;
Statistics = require('./../public/javascripts/fp-core/src/models/statistics.js').Statistics;

var DefaultModule = DefaultModule || {};
DefaultCultures = require('public/javascripts/fp-modules/default/agents/default_cultures.js').DefaultCultures;
ResourceTypes = require('./../public/javascripts/fp-modules/default/resources/resource_types.js').ResourceTypes;
CoS = require('./../public/javascripts/fp-modules/default/resources/cos.js').CoS;
TBL = require('./../public/javascripts/fp-modules/default/resources/tbl.js').TBL;
Basic = require('./../public/javascripts/fp-modules/default/worlds/basic.js').Basic;
Additional = require('./../public/javascripts/fp-modules/default/worlds/additional.js').Additional;
DefaultModule = require('./../public/javascripts/fp-modules/default/default-module.js').DefaultModule;

PredatorPreyCultures = require('./../public/javascripts/fp-modules/tests/pp/agents/pp-agent-types.js').PredatorPreyCultures;
PredatorPreyLevels = require('./public/javascripts/fp-modules/tests/pp/worlds/pp-levels.js').PredatorPreyLevels;
PredatorPreyModule = require('./../public/javascripts/fp-modules/tests/pp/predator-prey-module.js').PredatorPreyModule;
//jstat = require('./public/javascripts/jstat-1.0.0/js/jstat-1.0.0.js').jstat;
//NormalDistribution = require('./public/javascripts/jstat-1.0.0/js/jstat-1.0.0.js').NormalDistribution;
jStat = require('./../public/javascripts/jstat-1.0.0/js/jstat.js').jStat;





/*
var w = new Wave();
w.agents = ['a'];
console.log(w.agents)
*/
//DefaultModule.init();
PredatorPreyModule.init();
Universe.settings.agentsCanAdjustWander = false;
Universe.settings.noGameOver = true;
Lifecycle.preProcessCallback = function() {
	//console.log('Got here ' + Lifecycle.currentWorld.currentAgents.length);
}
Lifecycle.postProcessCallback = function() {
    //console.log('Got htere');
    console.log('Population: ' + Statistics.populationStats() + ' at ' + Lifecycle.waveCounter)
//    console.log('Life expectancy: ' + Statistics.lifeExpectancyStats())
    /*
	console.log('=========================');
	console.log('Level: ' + Lifecycle.currentLevelNumber)
	console.log('Wave: ' + Lifecycle.currentWaveNumber)
	console.log('Counter: ' + Lifecycle.levelCounter + '; ' + Lifecycle.waveCounter)
	if (Lifecycle.currentWorld.currentAgents && Lifecycle.currentWorld.currentAgents.length > 0) {
		console.log('Population: ' + Statistics.populationStats())
		console.log('Health: ' + Statistics.healthStats())
		console.log('Saved & expired: ' + Statistics.savedAndExpiredStats())
		console.log('Life expectancy: ' + Statistics.lifeExpectancyByAgentCultureStats())
		
	}
	*/
}
Lifecycle.preCompleteWaveCallback = function() {
	console.log('Completed wave')
}
Lifecycle.postNewLevelCallback = function() {
	console.log('Campaign: ' + Lifecycle.currentCampaignID)
	console.log('Level: ' + Lifecycle.currentWorld.name)
}
Lifecycle.currentLevelNumber = 0;
Lifecycle.worldDelay = 0;
Lifecycle.waveDelay = 20;
Lifecycle.interval = 5;
//var cs = ModuleManager.currentModule.allCultures();
//for (var i in cs) {
//    var c = cs[i];
//    console.log(c)
//}
Lifecycle.newLevel();


//console.log(PredatorPreyAgentTypes.PREY_AGENT_TYPE.updateFunction())

//console.log(jStat.normal.sample(0, 1));
//jStat.normal.sample();
/*
var x = jstat.seq(0, 1, 101);
var y = jstat.dbeta(x, 2, 2);
var distribution = new NormalDistribution(0,1);
console.log(distribution.getMean())
console.log(distribution.getSigma())
console.log(distribution.getRange())
console.log(distribution.density(0))
console.log(distribution.cumulativeDensity(0))
*/
//console.log(y)





