/*!
 * Fierce Planet
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


FiercePlanet.PredatorPreyModule = FiercePlanet.PredatorPreyModule || {};
FiercePlanet.PresetLevels = FiercePlanet.PresetLevels || {};
/**
 * @constant The number of preset levels
 */
FiercePlanet.PresetLevels.MAX_DEFAULT_LEVELS = 1000;

(function() {


    this.init = function() {
        var module = new Module();
        module.id = 'PredatorPrey';

        module.registerCampaign(FiercePlanet.PredatorPreyModule.Experimental);

        FiercePlanet.DefaultModule.AgentTypes.init();
        FiercePlanet.PredatorPreyModule.AgentTypes.init();
        module.registerAgentSet(AgentTypes.CITIZEN_AGENT_TYPE);
        module.registerAgentSet(AgentTypes.PREDATOR_AGENT_TYPE);

        World.registerAgentTypes(module.allAgentSets());

        module.registerResourceSet(FiercePlanet.DefaultModule.TBL);
        World.resourceTypeNamespace = FiercePlanet.DefaultModule.TBL;
        if (World.resourceTypeNamespace.doSetup)
            World.resourceTypeNamespace.doSetup();

        //TBL
        World.registerResourceCategories([FiercePlanet.DefaultModule.TBL.ECO_CATEGORY, FiercePlanet.DefaultModule.TBL.ENV_CATEGORY, FiercePlanet.DefaultModule.TBL.SOC_CATEGORY]);
        World.registerResourceTypes(FiercePlanet.DefaultModule.TBL.ECONOMIC_RESOURCE_TYPES.concat(FiercePlanet.DefaultModule.TBL.ENVIRONMENTAL_RESOURCE_TYPES.concat(FiercePlanet.DefaultModule.TBL.SOCIAL_RESOURCE_TYPES)));
        FiercePlanet.Game.currentProfile.capabilities = ["farm", "water", "clinic"];

        module.register();
    };



}).apply(FiercePlanet.PredatorPreyModule);

