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
        module.registerSelf();
        module.registerCampaign(PredatorPreyWorlds);
        //module.registerAgentSet(AgentTypes.CITIZEN_AGENT_TYPE);
        module.registerCulture(PredatorPreyCultures.PREDATOR_AGENT_TYPE);
        module.registerCulture(PredatorPreyCultures.PREY_AGENT_TYPE);
//        module.registerCulture(PredatorPreyCultures.TEST_AGENT_TYPE);
        module.registerResourceSet(TBL);

		Universe.settings.isometricView = false;
        Universe.settings.showGraph = true;
        Lifecycle.interval = 100;
        Lifecycle.currentCampaignID = 'Predator-Prey';
        var localStorage = localStorage || {};
        Lifecycle.currentWorldNumber = localStorage.currentWorldNumber = 0;
        Lifecycle.currentWorldPreset = true;
        Lifecycle.worldDelay = 3000;
    };



}).apply(PredatorPreyModule);

if (typeof exports !== "undefined")
    exports.PredatorPreyModule = PredatorPreyModule;

