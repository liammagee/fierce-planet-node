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
        module.registerResourceSet(TBL);

        module.registerCampaign(Basic);
        module.registerCampaign(Additional);
//        module.registerResourceSet(CoS);
//        FiercePlanet.Game.currentProfile.capabilities = ["farm", "water", "clinic", "legal"];

        var culture = DefaultCultures.MovingStickman;
        culture.healthCategories = module.resourceSet.categories;
        module.registerCulture(DefaultCultures.MovingStickman);

        Universe.settings.scrollingImageVisible = localStorage.universeSettings.scrollingImageVisible = true;
    };
}).apply(DefaultModule);


if (typeof exports !== "undefined")
    exports.DefaultModule = DefaultModule;


