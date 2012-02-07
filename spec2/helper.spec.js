
// Running in Node?
if (typeof(global) != "undefined") {

    _ = require('underscore');

    var FiercePlanet = {};
//    ModuleManager = require('./public/javascripts/fp/core/module-manager.js').ModuleManager;
    ModuleManager = require('./../public/javascripts/fp/core/module-manager.js').ModuleManager;
    Lifecycle = require('./../public/javascripts/fp/core/lifecycle.js').Lifecycle;
    Cell = require('./../public/javascripts/fp/core/cell.js').Cell;
    World = require('./../public/javascripts/fp/core/world.js').World;
    Resource = require('./../public/javascripts/fp/core/resource.js').Resource;
    ResourceCategory = require('./../public/javascripts/fp/core/resource.js').ResourceCategory;
    ResourceType = require('./../public/javascripts/fp/core/resource.js').ResourceType;

//    CultureDefaults = require('../public/javascripts/fp/core/agent/defaults/default_cultures.js').CultureDefaults;
    Agent = require('./../public/javascripts/fp/core/agent/agent.js').Agent;
    Memory = require('./../public/javascripts/fp/core/agent/agent.js').Memory;
    MemoryOfAgent = require('./../public/javascripts/fp/core/agent/agent.js').MemoryOfAgent;
    CultureDefaults = require('./../public/javascripts/fp/core/agent/culture.js').CultureDefaults;
    Culture = require('./../public/javascripts/fp/core/agent/culture.js').Culture;
    Chacteristics = require('./../public/javascripts/fp/core/agent/characteristics.js').Chacteristics;
    Beliefs = require('./../public/javascripts/fp/core/agent/beliefs.js').Beliefs;
    Capabilities = require('./../public/javascripts/fp/core/agent/capabilities.js').Capabilities;
    Desires = require('./../public/javascripts/fp/core/agent/desires.js').Desires;
    Plans = require('./../public/javascripts/fp/core/agent/plans.js').Plans;

    var DefaultModule = DefaultModule || {};
    DefaultCultures = require('../public/javascripts/fp/core/agent/defaults/default_cultures.js').DefaultCultures;
    Campaign = require('./../public/javascripts/fp/core/campaign.js').Campaign;
    Tile = require('./../public/javascripts/fp/core/tile.js').Tile;
    DEFAULT_TILE_COLOR = require('./../public/javascripts/fp/core/tile.js').DEFAULT_TILE_COLOR;
    Terrain = require('./../public/javascripts/fp/core/terrain.js').Terrain;
    Universe = require('./../public/javascripts/fp/core/universe.js').Universe;
    Module = require('./../public/javascripts/fp/core/module.js').Module;
    Catastrophe = require('./../public/javascripts/fp/core/catastrophe.js').Catastrophe;
    Notice = require('./../public/javascripts/fp/ui/notice.js').Notice;
    Wave = require('./../public/javascripts/fp/core/wave.js').Wave;
    Statistics = require('./../public/javascripts/fp/core/statistics.js').Statistics;

    ResourceTypes = require('./../public/javascripts/fp/modules/default/resources/resource_types.js').ResourceTypes;
    CoS = require('./../public/javascripts/fp/modules/default/resources/cos.js').CoS;
    TBL = require('./../public/javascripts/fp/modules/default/resources/tbl.js').TBL;
    Basic = require('./../public/javascripts/fp/modules/default/worlds/basic.js').Basic;
    Additional = require('./../public/javascripts/fp/modules/default/worlds/additional.js').Additional;
    DefaultModule = require('./../public/javascripts/fp/modules/default/default-module.js').DefaultModule;

    PredatorPreyCultures = require('./../public/javascripts/fp/modules/pp/agents/pp-agent-types.js').PredatorPreyCultures;
    PredatorPreyWorlds = require('./../public/javascripts/fp/modules/pp/worlds/pp-worlds.js').PredatorPreyWorlds;
    PredatorPreyModule = require('./../public/javascripts/fp/modules/pp/predator-prey-module.js').PredatorPreyModule;
//jstat = require('./../public/javascripts/jstat-1.0.0/js/jstat-1.0.0.js').jstat;
//NormalDistribution = require('./../public/javascripts/jstat-1.0.0/js/jstat-1.0.0.js').NormalDistribution;
    jStat = require('./../public/javascripts/jstat-1.0.0/js/jstat.js').jStat;

    /*
    jsdom = require('jsdom').jsdom
        , myWindow = jsdom().createWindow()
        , $ = require('jquery')
        , jq = require('jquery').create()
        , jQuery = require('jquery').create(myWindow)
        ;
    */

}

(function() {
    PredatorPreyModule.init();
    Universe.settings.agentsCanAdjustWander = false;
    Universe.settings.noGameOver = true;

})();