/*!
 * Fierce Planet
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


FiercePlanet.DefaultModule = FiercePlanet.DefaultModule || {};

(function() {


    this.init = function() {
        var module = new Module();
        module.id = 'Default';

        module.registerLevelSet(FiercePlanet.DefaultModule.Basic);
        module.registerLevelSet(FiercePlanet.DefaultModule.Additional);
        module.registerLevelSet(FiercePlanet.DefaultModule.Experimental);

        module.registerAgentSet(FiercePlanet.DefaultModule.AgentTypes);

        module.registerResourceSet(FiercePlanet.DefaultModule.TBL);
        module.registerResourceSet(FiercePlanet.DefaultModule.CoS);


        World.resourceTypeNamespace = FiercePlanet.DefaultModule.TBL;
        if (World.resourceTypeNamespace.doSetup)
            World.resourceTypeNamespace.doSetup();
        //TBL
        World.registerResourceCategories([FiercePlanet.DefaultModule.TBL.ECO_CATEGORY, FiercePlanet.DefaultModule.TBL.ENV_CATEGORY, FiercePlanet.DefaultModule.TBL.SOC_CATEGORY]);
        World.registerResourceTypes(FiercePlanet.DefaultModule.TBL.ECONOMIC_RESOURCE_TYPES.concat(FiercePlanet.DefaultModule.TBL.ENVIRONMENTAL_RESOURCE_TYPES.concat(FiercePlanet.DefaultModule.TBL.SOCIAL_RESOURCE_TYPES)));
        FiercePlanet.Game.currentProfile.capabilities = ["farm", "water", "clinic"];
        //COS
        /*
        World.registerResourceCategories([FiercePlanet.DefaultModule.CoS.ECO_CATEGORY, FiercePlanet.DefaultModule.CoS.ENV_CATEGORY, FiercePlanet.DefaultModule.CoS.POL_CATEGORY, FiercePlanet.DefaultModule.CoS.CUL_CATEGORY]);
        World.registerResourceTypes(FiercePlanet.DefaultModule.CoS.ECONOMIC_RESOURCE_TYPES.concat(FiercePlanet.DefaultModule.CoS.ECOLOGICAL_RESOURCE_TYPES.concat(FiercePlanet.DefaultModule.CoS.POLITICAL_RESOURCE_TYPES.concat(FiercePlanet.DefaultModule.CoS.CULTURAL_RESOURCE_TYPES))));
        FiercePlanet.Game.currentProfile.capabilities = ["farm", "water", "clinic", "legal"];
        */
        World.registerAgentTypes(FiercePlanet.DefaultModule.AgentTypes.agentTypes);


        module.register();
    };



}).apply(FiercePlanet.DefaultModule);

