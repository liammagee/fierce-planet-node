/*!
 * Fierce Planet - Culture
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */



/**
 * Defines the type of an agent.
 * The type includes the name, color, initial health, default speed and the drawing function of an agent.
 *
 * @constructor
 * @param name
 * @param color
 */
function Culture(name, color, healthCategories, speed, health, drawFunction, initFunction, updateFunction) {
    this.name = name;
    this.color = color;
    this.healthCategories = healthCategories || [];
    this.speed = speed || AgentConstants.DEFAULT_SPEED;
    this.health = health || AgentConstants.INITIAL_HEALTH;
    this.generateEachWave = true;

    this.characteristics = {};
    this.beliefs = [];
    this.desires = [];
    this.capabilities = [];

    this.drawFunction = drawFunction || function(){};
    this.initFunction = initFunction || function(){};
    this.defaultUpdateFunction = function(agent, level){


        this.capabilities.forEach(function(capability) {
            capability.exercise(agent, level);
            if (typeof(capability.cost) !== 'undefined')
                agent.adjustGeneralHealth(capability.cost);
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


if (typeof(exports) != "undefined")
    exports.Culture = Culture;
