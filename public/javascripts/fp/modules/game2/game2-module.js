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
        module.id = 'Game2';
        module.registerSelf();
        module.registerResourceSet(TBL);

        module.registerCampaign(Basic);
        module.registerCampaign(Additional);
        module.currentCampaignID = 'Basic';
//        module.registerResourceSet(CoS);
//        FiercePlanet.Game.currentProfile.capabilities = ["farm", "water", "clinic", "legal"];

        var culture = DefaultCultures.MovingStickman;
        culture.healthCategories = module.resourceSet.categories;
        module.registerCulture(DefaultCultures.MovingStickman);

        Universe.settings.animateWorldAtStart = true;

    };
}).apply(DefaultModule);


if (typeof exports !== "undefined")
    exports.DefaultModule = DefaultModule;


