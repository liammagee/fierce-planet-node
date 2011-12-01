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
    this.isHitable = false;
    this.canHit = false;
    this.generateEachWave = true;
    this.drawFunction = drawFunction || function(){};
    this.initFunction = initFunction || function(){};
    this.updateFunction = updateFunction || function(agent, level){

        // Hook for detecting 'active' resources
        this.processNeighbouringResources(agent, level);

        // Hook for detecting other agents
        this.processNeighbouringAgents(agent, level);

        if (!World.settings.godMode || World.settings.showHealthReductionInGodMode)
            agent.adjustGeneralHealth(World.settings.agentCostPerMove);
    };

    /**
     * Processes neighbouring resources
     *
     * TODO: Add tests
     */
    this.processNeighbouringResources = function(agent, level) {
        var x = agent.x;
        var y = agent.y;
        for (var j = 0; j < level.resources.length; j++) {
            var resource = level.resources[j];
            var rx = resource.x;
            var ry = resource.y;
            if (Math.abs(rx - x) <= 1 && Math.abs(ry - y) <= 1) {
                var resourceEffect = level.calculateResourceEffect(resource);
                resource.provideYield(agent, resourceEffect, !level.noSpeedChange);
            }
        }
    };


    /**
     * Processes neighbouring agents
     *
     * TODO: Add tests
     */
    this.processNeighbouringAgents = function(agent, level) {
        if (World.settings.godMode || !World.settings.predatorsVisible)
            return;

        var x = agent.x;
        var y = agent.y;
        agent.isHit = false;
        var agents = level.currentAgents;
        for (var j = 0; j < agents.length; j++) {
            var a = agents[j];
            var ax = a.x;
            var ay = a.y;
            if (Math.abs(ax - x) <= 1 && Math.abs(ay - y) <= 1) {
                if (!World.settings.godMode && World.settings.predatorsVisible && agent.culture.isHitable && a.culture.canHit) {
                    agent.isHit = true;
                }
            }
        }
        if (agent.isHit)
            agent.adjustGeneralHealth(-10);
    };
}


/**
 * Defines a culture.
 * The type includes the name, color, initial health, default speed and the drawing function of an agent.
 *
 * @constructor
 * @param name
 * @param color
function Culure(name, color, baseSize, speed, health, drawFunction) {
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
