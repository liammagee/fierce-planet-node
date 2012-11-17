/*!
 * Fierce Planet - GeneralUI
 * General UI functions
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var FiercePlanet = FiercePlanet || {};


/**
 * @namespace Contains parameters functions
 */
FiercePlanet.Parameters = FiercePlanet.Parameters || {};

(function() {

    /**
     */
    this.processParameters = function () {
        var paramElements = $('.world-parameters');
        for (var i = 0; i < paramElements.length; i++) {
            var param = paramElements[i];
            if (param.type && param.type == 'checkbox') {
                FiercePlanet.Parameters[param.name] = param.checked;
            }
            else {
                FiercePlanet.Parameters[param.name] = param.value;
            }
        }
    };


}).apply(FiercePlanet.Parameters);
