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
        module.registerResourceSet(TBL);
        module.registerResourceSet(CoS);
        World.resourceTypeNamespace = TBL;
        module.register();
    };



}).apply(FiercePlanet.DefaultModule);

