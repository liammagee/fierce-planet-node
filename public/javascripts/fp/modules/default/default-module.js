/*!
 * Fierce Planet
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var DefaultModule = DefaultModule || {};

(function() {

    this.init = function() {
        var module = new Module();
        module.id = 'Default';
        module.registerSelf();

        module.registerCampaign(Basic);
        module.registerCampaign(Additional);
//        module.registerResourceSet(CoS);
//        FiercePlanet.Game.currentProfile.capabilities = ["farm", "water", "clinic", "legal"];
        module.registerResourceSet(TBL);

        DefaultCultures.init();
        module.registerCulture(DefaultCultures.CITIZEN_AGENT_TYPE);
    };
}).apply(DefaultModule);


if (typeof exports !== "undefined")
    exports.DefaultModule = DefaultModule;


