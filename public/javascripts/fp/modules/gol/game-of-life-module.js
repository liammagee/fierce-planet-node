/*!
 * Fierce Planet
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var GameOfLifeModule = GameOfLifeModule || {};

(function() {


    this.init = function() {
        GameOfLifeCultures.init();

        var module = new Module();
        module.id = 'GOL';
        module.registerCampaign(GameOfLifeLevels);
        //module.registerAgentSet(AgentTypes.CITIZEN_AGENT_TYPE);
        module.registerCulture(GameOfLifeCultures.CELLULAR_AGENT_TYPE);
//        module.registerCulture(PredatorPreyCultures.TEST_AGENT_TYPE);
        module.registerResourceSet(TBL);
        module.register();

		World.registerCultures(module.allCultures());
		//        World.registerAgentTypes(DefaultModule.AgentTypes.agentTypes);
		World.switchResourceSet(TBL);
		World.settings.skewTiles = false;
        World.settings.agentsCanCommunicate = false;
    };



}).apply(GameOfLifeModule);

if (typeof(exports) != "undefined")
    exports.GameOfLifeModule = GameOfLifeModule;

