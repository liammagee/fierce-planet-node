/*!
 * Fierce Planet
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var RpgModule = RpgModule || {};

(function() {


    this.init = function() {
        GameOfLifeCultures.init();

        var module = new Module();
        module.id = 'GOL';
        module.registerSelf();
        module.registerCampaign(GameOfLifeWorlds);
        module.registerCulture(GameOfLifeCultures.CELLULAR_AGENT_TYPE);
        module.registerResourceSet(TBL);

		Universe.settings.isometricView = false;
    };



}).apply(RpgModule);

if (typeof exports !== "undefined")
    exports.RpgModule = RpgModule;

