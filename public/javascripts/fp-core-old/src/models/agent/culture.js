/*!
 * Fierce Planet - Culture
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */

/**
 * Agent constants
 */
var CultureDefaults = CultureDefaults || {};
(function() {
    this.DEFAULT_INITIAL_HEALTH = 100;
    this.DEFAULT_INITIAL_SPEED = 100;
    this.DEFAULT_MOVE_COST = -3;
    this.DEFAULT_RUN_SPEED = 150;

}).apply(CultureDefaults);


/**
 * Probability constants
 */
var ProbabilityFlags = ProbabilityFlags || {};
(function() {
    this.VERY_UNLIKELY = 0;
    this.UNLIKELY = 1;
    this.MODERATELY_LIKELY = 2;
    this.EVEN_CHANCE = 3;
    this.PROBABILITY_STRATEGY_TO_DEVIATE = this.UNLIKELY;

}).apply(ProbabilityFlags);

/**
 * Defines the type of an agent.
 * The type includes the name, color, initial health, default speed and the drawing function of an agent.
 *
 * @constructor
 * @param name
 * @param color
 */
function Culture(name, color, healthCategories, initialSpeed, initialHealth, drawFunction, initFunction, updateFunction) {
    this.name = name;
    this.color = color;
    this.initialSpeed = initialSpeed || CultureDefaults.DEFAULT_INITIAL_SPEED;
    this.initialHealth = initialHealth || CultureDefaults.DEFAULT_INITIAL_HEALTH;
    this.moveCost = CultureDefaults.DEFAULT_MOVE_COST;
    this.healthCategories = healthCategories || [];
    this.generateEachWave = true;

    this.characteristics = {};
    this.beliefs = [];
    this.desires = [];
    this.capabilities = [];

    this.drawFunction = drawFunction || function(){};
    this.initFunction = initFunction || function(){};
    this.defaultUpdateFunction = function(agent, world){
        agent.executePlan(world);

        this.capabilities.forEach(function(capability) {
            capability.exercise(agent, world);
            if (!_.isUndefined(capability.cost)) {
                agent.adjustGeneralHealth(capability.cost);
            }
        })
    };
    this.updateFunction = this.updateFunction || this.defaultUpdateFunction;
}


/**
 * Defines a culture.
 * The type includes the name, color, initial health, default speed and the drawing function of an agent.
 *
 * @constructor
 * @param name
 * @param color
function Culture(name, color, baseSize, speed, health, drawFunction) {
    this.name = name;
    this.color = color;
    this.baseSize = baseSize;
    this.childbirthAgeMean = 0;
    this.childbirthAgeStdDev = 0;
    this.fertilityAgeMean = 0;
    this.fertilityAgeStdDev = 0;
    this.fertilityAdjustmentIncrements = 0;
    this.fertilityAdjustmentFactor = 1;
    this.lifeExpectancyMean = 0;
    this.lifeExpectancyStdDev = 0;
    this.initialHealthMean = 0;
    this.initialHealthStdDev = 0;
    this.memoryLostMean = 0.9;
    this.memoryLostStdDev = 0;
    this.killChance = 0;
    this.species = null;
    this.desires = [];
    this.agents = [];
}
 */


if (typeof exports !== "undefined") {
    exports.CultureDefaults = CultureDefaults;
    exports.Culture = Culture;

}
