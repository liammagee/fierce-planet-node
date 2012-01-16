/*!
 * Fierce Planet
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var PredatorPreyModule = PredatorPreyModule || {};

(function() {


    this.init = function() {
        PredatorPreyCultures.init();

        var module = new Module();
        module.id = 'PredatorPrey';
        module.registerCampaign(PredatorPreyWorlds);
        //module.registerAgentSet(AgentTypes.CITIZEN_AGENT_TYPE);
        module.registerCulture(PredatorPreyCultures.PREDATOR_AGENT_TYPE);
        module.registerCulture(PredatorPreyCultures.PREY_AGENT_TYPE);
//        module.registerCulture(PredatorPreyCultures.TEST_AGENT_TYPE);
        module.registerResourceSet(TBL);
        module.register();

		Universe.registerCultures(module.allCultures());
		//        Universe.registerAgentTypes(DefaultModule.AgentTypes.agentTypes);
		Universe.switchResourceSet(TBL);
		Universe.settings.skewTiles = false;
        Universe.settings.agentsCanCommunicate = false;
        AgentConstants.DEFAULT_SPEED = 1;
        Lifecycle.interval = 100;
        Lifecycle.currentCampaignID = 'Predator-Prey';
        var localStorage = localStorage || {};
        Lifecycle.currentWorldNumber = localStorage.currentWorldNumber = 0;
        Lifecycle.currentWorldPreset = true;
        Universe.settings.showGraph = true;
        Lifecycle.NEW_WORLD_DELAY = 3000;
    };



}).apply(PredatorPreyModule);

if (typeof exports !== "undefined")
    exports.PredatorPreyModule = PredatorPreyModule;

