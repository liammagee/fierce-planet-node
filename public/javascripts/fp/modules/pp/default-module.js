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

        module.registerLevelSet(FiercePlanet.PredatorPreyModule.Experimental);

        FiercePlanet.PredatorPreyModule.AgentTypes.init();
        module.registerAgentSet(AgentTypes.CITIZEN_AGENT_TYPE);
        module.registerAgentSet(AgentTypes.PREDATOR_AGENT_TYPE);

        World.registerAgentTypes(module.allAgentSets());

        module.registerResourceSet(FiercePlanet.PredatorPreyModule.TBL);
        World.resourceTypeNamespace = FiercePlanet.PredatorPreyModule.TBL;
        if (World.resourceTypeNamespace.doSetup)
            World.resourceTypeNamespace.doSetup();

        //TBL
        World.registerResourceCategories([FiercePlanet.PredatorPreyModule.TBL.ECO_CATEGORY, FiercePlanet.PredatorPreyModule.TBL.ENV_CATEGORY, FiercePlanet.PredatorPreyModule.TBL.SOC_CATEGORY]);
        World.registerResourceTypes(FiercePlanet.PredatorPreyModule.TBL.ECONOMIC_RESOURCE_TYPES.concat(FiercePlanet.PredatorPreyModule.TBL.ENVIRONMENTAL_RESOURCE_TYPES.concat(FiercePlanet.PredatorPreyModule.TBL.SOCIAL_RESOURCE_TYPES)));
        FiercePlanet.Game.currentProfile.capabilities = ["farm", "water", "clinic"];

        module.register();
    };



}).apply(FiercePlanet.PredatorPreyModule);

