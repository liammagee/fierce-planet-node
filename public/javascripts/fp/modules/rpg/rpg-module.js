/*!
 * Fierce Planet
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var RpgModule = RpgModule || {};

(function() {


    this.init = function() {
        GameOfLifeCultures.init();

        var module = new Module();
        module.id = 'GOL';
        module.registerCampaign(GameOfLifeWorlds);
        //module.registerAgentSet(AgentTypes.CITIZEN_AGENT_TYPE);
        module.registerCulture(GameOfLifeCultures.CELLULAR_AGENT_TYPE);
//        module.registerCulture(PredatorPreyCultures.TEST_AGENT_TYPE);
        module.registerResourceSet(TBL);
        module.register();

		Universe.registerCultures(module.allCultures());
		//        Universe.registerAgentTypes(DefaultModule.AgentTypes.agentTypes);
		Universe.switchResourceSet(TBL);
		Universe.settings.skewTiles = false;
        Universe.settings.agentsCanCommunicate = false;
    };



}).apply(RpgModule);

if (typeof exports !== "undefined")
    exports.RpgModule = RpgModule;

