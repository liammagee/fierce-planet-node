/*
 * Fierce Planet - Ajax utilities
 * Various utility methods
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */



var FiercePlanet = FiercePlanet || {};

/**
 * @namespace Contains test functions
 */
FiercePlanet.Test = FiercePlanet.Test || {};

// Assign shortcut to FiercePlanet.AjaxUtils
$fp.test = FiercePlanet.Test;


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


}).apply(FiercePlanet.Test);


var FiercePlanet = FiercePlanet || {};
FiercePlanet.Test = FiercePlanet.Test || {};



(function() {

}).apply(FiercePlanet.Test);


