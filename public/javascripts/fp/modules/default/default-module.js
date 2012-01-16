/*!
 * Fierce Planet
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var DefaultModule = DefaultModule || {};
//FiercePlanet.PresetWorlds = FiercePlanet.PresetWorlds || {};


(function() {

	/**
	 * @constant The number of preset worlds
	 */
	this.MAX_DEFAULT_LEVELS = 1000;

    this.init = function() {
        var module = new Module();
        module.id = 'Default';

        module.registerCampaign(Basic);
        module.registerCampaign(Additional);

        DefaultCultures.init();
//        module.registerAgentSet(DefaultModule.AgentTypes);
        module.registerCulture(DefaultCultures.CITIZEN_AGENT_TYPE);
//        module.registerAgentSet(AgentTypes.PREDATOR_AGENT_TYPE);
//        module.registerAgentSet(AgentTypes.RIVAL_AGENT_TYPE);


        module.registerResourceSet(TBL);
        //module.registerResourceSet(CoS);

        module.register();

		Universe.registerCultures(module.allCultures());
		//        Universe.registerAgentTypes(DefaultModule.AgentTypes.agentTypes);
		Universe.switchResourceSet(TBL);
		/*
        Universe.resourceTypeNamespace = TBL;
//        if (Universe.resourceTypeNamespace.doSetup)
//            Universe.resourceTypeNamespace.doSetup();
        //TBL
        Universe.registerResourceCategories([TBL.ECO_CATEGORY, TBL.ENV_CATEGORY, TBL.SOC_CATEGORY]);
        Universe.registerResourceTypes(TBL.ECONOMIC_RESOURCE_TYPES.concat(TBL.ENVIRONMENTAL_RESOURCE_TYPES.concat(TBL.SOCIAL_RESOURCE_TYPES)));
		*/
        //FiercePlanet.Game.currentProfile.capabilities = ["farm", "water", "clinic"];
        //COS
        /*
        Universe.registerResourceCategories([CoS.ECO_CATEGORY, CoS.ENV_CATEGORY, CoS.POL_CATEGORY, CoS.CUL_CATEGORY]);
        Universe.registerResourceTypes(CoS.ECONOMIC_RESOURCE_TYPES.concat(CoS.ECOLOGICAL_RESOURCE_TYPES.concat(CoS.POLITICAL_RESOURCE_TYPES.concat(CoS.CULTURAL_RESOURCE_TYPES))));
        FiercePlanet.Game.currentProfile.capabilities = ["farm", "water", "clinic", "legal"];
        */



    };



}).apply(DefaultModule);


if (typeof exports !== "undefined")
    exports.DefaultModule = DefaultModule;


