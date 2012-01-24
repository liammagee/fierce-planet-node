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
        module.registerSelf();

        module.registerCampaign(Basic);
        module.registerCampaign(Additional);
        module.registerResourceSet(CoS);
        FiercePlanet.Game.currentProfile.capabilities = ["farm", "water", "clinic", "legal"];
//        module.registerResourceSet(TBL);

        DefaultCultures.init();
        module.registerCulture(DefaultCultures.CITIZEN_AGENT_TYPE);
    };



}).apply(DefaultModule);


if (typeof exports !== "undefined")
    exports.DefaultModule = DefaultModule;


