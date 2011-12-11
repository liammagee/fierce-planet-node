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
        module.registerCampaign(PredatorPreyLevels);
        //module.registerAgentSet(AgentTypes.CITIZEN_AGENT_TYPE);
        module.registerCulture(PredatorPreyCultures.PREDATOR_AGENT_TYPE);
        module.registerCulture(PredatorPreyCultures.PREY_AGENT_TYPE);
//        module.registerCulture(PredatorPreyCultures.TEST_AGENT_TYPE);
        module.registerResourceSet(TBL);
        module.register();

		World.registerCultures(module.allCultures());
		//        World.registerAgentTypes(DefaultModule.AgentTypes.agentTypes);
		World.switchResourceSet(TBL);
		World.settings.skewTiles = false;
        World.settings.agentsCanCommunicate = false;
    };



}).apply(PredatorPreyModule);

if (typeof(exports) != "undefined")
    exports.PredatorPreyModule = PredatorPreyModule;

