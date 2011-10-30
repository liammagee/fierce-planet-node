/*
 * Fierce Planet - Ajax utilities
 * Various utility methods
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */



var FiercePlanet = FiercePlanet || {};

/**
 * @namespace Contains ajax functions
 */
FiercePlanet.AjaxUtils = FiercePlanet.AjaxUtils || {};

// Assign shortcut to FiercePlanet.AjaxUtils
$fp.ajax = FiercePlanet.AjaxUtils;


(function(){

    /**
     * Loads optional scripts dynamically
     */
    this.loadScripts = function() {
        // TODO: Add settings checks to test for which scripts need to be loaded
        var scripts = ['/javascripts/fp/utils/test.js'];
        try {
            $.getScript(scripts[0], function() {
                console.log(FiercePlanet.Test.initialised);
            });
        }
        catch (e) {}
    };

    /**
     * Authenticates a user
     */
    this.authenticate = function() {
        try {
            $.getScript(scripts[0], function() {
                console.log(FiercePlanet.Test.initialised);
            });
        }
        catch (e) {}
    };


}).apply(FiercePlanet.Ajax);

