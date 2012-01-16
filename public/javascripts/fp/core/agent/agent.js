/*!
 * Fierce Planet - Agent
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */

/**
 * Agent constants
 */
var AgentConstants = AgentConstants || {};
(function() {
	this.INITIAL_HEALTH = 100;
	this.DEFAULT_SPEED = 10;

	this.VERY_UNLIKELY = 0;
	this.UNLIKELY = 1;
	this.MODERATELY_LIKELY = 2;
	this.EVEN_CHANCE = 3;
	this.PROBABILITY_STRATEGY_TO_DEVIATE = this.UNLIKELY;
	
}).apply(AgentConstants);


/**
 * Models the memory of an agent of a location it has visited.
 *
 * @constructor
 * @param agentID
 * @param age
 * @param x
 * @param y
 */
function Memory(agentID, age, x, y) {
    this.agentID = agentID;
    this.age = age;
    this.mostRecentVisit = age;
    this.visits = 1;
    this.x = x, this.y = y, this.distanceFromLastUntriedPath = -1;
}
Memory.prototype.addVisit = function(agentID, age) {
    this.agentID = agentID;
    this.mostRecentVisit = age;
    this.visits++;
};


MemoryOfAgent.prototype = new Memory();
MemoryOfAgent.prototype.constructor = MemoryOfAgent;
/**
 * Models the memory one agent has of another.
 *
 * @constructor
 * @param agentID
 * @param age
 * @param x
 * @param y
 * @param otherAgentID
 */
function MemoryOfAgent(agentID, age, x, y, otherAgentID) {
    this.agentID = agentID;
    this.age = age;
    this.x = x;
    this.y = y;
    this.visits = 1;
    this.otherAgentID = otherAgentID;
    this.distanceFromLastUntriedPath = -1;
}




/**
<div>Defines the agent - the core class of the agent modelling system.</div>
<div>Agents have the following properties:
<ul>
    <li>They to a particular type.</li>
     <li>They have a current location in a given level, and a history of prior locations.</li>
     <li>They move at a given speed, and can 'wander' relative to the center of the tiles they occupy.</li>
     <li>They can have multiple kinds of 'health' or 'capabilities': for example, economic, environmental and social.</li>
     <li>Without enough of any kind of health, they are unable to function, and die.</li>
     <li>They have an internal representation of the 'world', established by:</li>
     <ul>
             <li>preceding generations</li>
             <li>experience</li>
             <li>communication with other agents</li>
     </ul>
</ul>
</div>

 * @constructor
 * @param culture
 * @param x
 * @param y
 */
function Agent(culture, x, y) {
    // Privileged fields and methods
    this.id = function() {
        return Math.floor(Math.random() * Math.pow(10, 10));
    }();


    /**
     * Generates a normalised health adjustment amount (not below zero, not above the INITIAL_HEALTH amount).
     *
     * @param existingHealthValue
     * @param adjustment
     */
    this.makeHealthAdjustment = function(existingHealthValue, adjustment) {
        var newHealth = existingHealthValue + adjustment;
        if (newHealth > 0 && newHealth < AgentConstants.INITIAL_HEALTH)
            return newHealth;
        else if (newHealth > 0)
            return AgentConstants.INITIAL_HEALTH;
        else
            return 0;
    };

    /**
     * Recalibrates overall health based on specific statistics.
     */
    this.recalibrateOverallHealth = function() {
        var overallHealth = 0;
        var len = this.culture.healthCategories.length;
        var hasZeroHealth = false;
        for (var i = 0; i < len; i++) {
            var category = this.culture.healthCategories[i];
            var categoryHealth = this.healthCategoryStats[category.code];
            if (categoryHealth == 0)
                hasZeroHealth = true;
            overallHealth += categoryHealth;
        }
        // Set health to zero if any of the specific types of health are zero
        overallHealth = hasZeroHealth ? 0 : overallHealth / len;

        this.health = overallHealth;
    };

    /**
     * Updates the agent
     */
    this.update = function(level) {
        // Determines the current needs and desires of the agent


        // Develops a list of plans, based on desires and capabilities


        // Executes plans
        if (this.culture.updateFunction)
            this.culture.updateFunction(this, level);
    };

    /**
     Determines current capabilities
     */
    this.currentCapabilities = function(level) {
        var myCapabilities = [];
        var that = this;
        this.culture.capabilities.forEach(function(capability) {
            var actualCapabilities = capability.getCapabilities(that, level);
            var capability = actualCapabilities.capability;
            var args = actualCapabilities.arguments;
            args.forEach(function(arg) {
                var myCapability = {capability: capability};
                myCapability.arguments = arg;
                myCapabilities.push(myCapability)
            })
        });
        return myCapabilities;
    };

    /**
     * Memorises the current position of the agent, and if the level parameter is present,
     * surrounding cells, agents and other resources
     *
     * @param level
     */
    this.reviseBeliefs = function(level) {

        var agent = this;
        this.culture.beliefs.forEach(function(belief) {
            if (!_.isUndefined(belief) && !_.isUndefined(belief.makeBelief))
                belief.makeBelief(agent, level);
        });
    };

    /**
     * Gets the current position (x and y co-ordinates) of the agent
     */
    this.getPosition = function() { return [this.x, this.y]; };
    /**
     *
     * @param x
     * @param y
     */
    this.moveTo = function(x, y) {
        var lastX = this.x, lastY = this.y;
        this.x = x; this.y = y;
        this.incrementMoves();
        Lifecycle.currentLevel.changeAgentInContentMap(this, lastX, lastY);
    };

    /**
     * Initialises health statistics for an agent, based all resource categories.
     */
    this.registerHealthStats = function() {
        for (var i = 0; i < this.culture.healthCategories.length; i++) {
            var category = this.culture.healthCategories[i];
            this.healthCategoryStats[category.code] = AgentConstants.INITIAL_HEALTH;
        }
        // Add length accessor here, to easily determine number of categories
        this.healthCategoryStats.length = this.culture.healthCategories.length;
    };
    /**
     * Adjusts all categories of health by the adjustment amount.
     *
     * @param adjustment
     */
    this.adjustGeneralHealth = function(adjustment) {
        var len = this.culture.healthCategories.length;
        for (var i = 0; i < len; i++) {
            var category = this.culture.healthCategories[i];
            var categoryHealth = this.healthCategoryStats[category.code];
            this.healthCategoryStats[category.code] = this.makeHealthAdjustment(categoryHealth, adjustment);
        }
        this.recalibrateOverallHealth();
    };
    /**
     * Adjusts health based on a given resource.
     *
     * @param adjustment
     * @param resource
     */
    this.adjustHealthForResource = function(adjustment, resource) {
        this.adjustHealthForResourceCategory(adjustment, resource.category);
    };
    /**
     * Adjusts health based on a given resource category.
     *
     * @param adjustment
     * @param resource
     */
    this.adjustHealthForResourceCategory = function(adjustment, resourceCategory) {
        var categoryCode = resourceCategory.code;
        var categoryHealth = this.healthCategoryStats[categoryCode];
        this.healthCategoryStats[categoryCode] = this.makeHealthAdjustment(categoryHealth, adjustment);
        this.recalibrateOverallHealth();
    };
    /**
     * Retrieves health for a given resource category.
     *
     * @param resource
     */
    this.getHealthForResource = function(resource) {
        return this.getHealthForResourceCategory(resource.category)
    };
    /**
     * Retrieves health for a given resource category.
     *
     * @param resource
     */
    this.getHealthForResourceCategory = function(category) {
        var categoryCode = category.code;
        var categoryHealth = this.healthCategoryStats[categoryCode];
        return categoryHealth;
    };


    /**
     * Adjusts the degree of wander of the agent
     * @param cellWidth
     * @param pieceWidth
     */
    this.adjustWander = function(cellWidth, pieceWidth) {
        var wx = this.wanderX;
        var wy = this.wanderY;
//    var limit = cellWidth - pieceWidth;
        var limit = cellWidth / 2 - pieceWidth / 2;
        var rx = Math.floor(Math.random() * 3 - 1);
        var ry = Math.floor(Math.random() * 3 - 1);
        wx = wx + rx;
        wy = wy + ry;

        if (limit - Math.abs(wx) >= 0)
            this.wanderX = wx;

        if (limit - Math.abs(wy) >= 0)
            this.wanderY = wy;
    };

    /**
     * Increments the countdown to move variable
     */
    this.incrementCountdownToMove = function() { this.countdownToMove ++; };
    /**
     * Resets the countdown to move variable
     */
    this.resetCountdownToMove = function() { this.countdownToMove = 0; };

    /**
     * Tests whether the agent is ready to move
     */
    this.readyToMove = function() { return this.countdownToMove == 0; };

    /**
     * Increments the moves/age of the agent
     */
    this.incrementMoves = function() { this.age++; };


    /**
     <div>
     This function adjusts the speed of an agent, based on the following algorithm:
     </div>

     <ul>
     <li>Firstly, the variance, the absolute difference between the agent's current and default speed, is calculated.</li>
     <li>Then, a probability that the agent's speed will change is derived by taking the square of the variance plus one.</li>
     <li>A random value is then generated between -1 and the probability value  - 1. This value ensures
     that it is likely the speed adjustment comes closer to the default speed, but with always some probability it will
     deviate further away.
     </li>

     <li>
     Separately, the square root of the variance, the adjustment value, is taken as the amount to actually adjust the speed by.
     </li>
     <li>
     The impact of these values means that when the current speed is very different from the default, both the probability that it will regress to
     the default, and the extent of the regression, are relatively high.
     </li>
     <li>
     The actual adjustment is then normalised based on the direction (up or down) of the variance.
     </li>
     <li>The actual adjustment is then added to the current speed.</li>
     </ul>

     <div>
     The net effect is that for zero or low variances from the default speed, the current speed has a good probability
     of moving away as well as returning to the default speed. As an example, if the current speed differs from the default speed
     by 2, then the odds of returning towards the default as opposed to moving away are 8 (2 + 1 to the power of 2) to 1.
     The extent of the move is the rounded root of the difference, i.e. 1.
     </div>

     <div>
     One important consequence is that proximity to resources artificially deviates an agent's speed from its default speed
     (making it slower, because it takes time to utilise the resource).
     This automatic adjustment, which should be called at each 'tick'
     in the processing loop, has the effect of regressing this deviance back towards the default.
     In the meantime however, other agents have the opportunity to 'leap frog' the current agent, and progress
     more quickly towards the next resource.
     </div>
     */
    this.adjustSpeed = function() {
        var tmpSpeed = this.speed;
        var variance = this.speed - AgentConstants.DEFAULT_SPEED;

        // Calculate probability of adjustment
        var prob = 0;
        switch (AgentConstants.PROBABILITY_STRATEGY_TO_DEVIATE) {
            case AgentConstants.VERY_UNLIKELY:
                // Makes movement away from MOVE_INCREMENTS very unlikely: EXP(N, N)
                prob = Math.pow(Math.abs(variance), Math.abs(variance)) + 2;
                break;
            case AgentConstants.UNLIKELY:
                // Makes movement away from MOVE_INCREMENTS unlikely
                prob = Math.pow(Math.abs(variance) + 1, 2) + 2;
                break;
            case AgentConstants.MODERATELY_LIKELY:
                //    Makes movement away from MOVE_INCREMENTS moderately likely
                prob = Math.abs(variance) + 2;
                break;
            case AgentConstants.EVEN_CHANCE:
                // Makes movement away from MOVE_INCREMENTS an even chance
                prob = 1 + 1 + 1;
                break;
        }


        var randomSpeedChange = Math.floor(Math.random() * prob) - 1;

        // Adjust by the square root of the current variance
        var adjustmentValue = Math.pow(Math.abs(variance), 0.5) + 0.5 | 0;

        // Force a change in the increment
        adjustmentValue = (adjustmentValue == 0 ? 1 : adjustmentValue);

        // Set the speed to ab¡ove, equal or below the current speed
        var change = (randomSpeedChange < 0 ? -adjustmentValue : (randomSpeedChange > 0 ? adjustmentValue : 0));
        // Change direction if the speed is already negative
        change = (variance > 0 ? -change : change);


        // Add a multiplier to the change
//    var multiplier = Math.ceil(Math.random() * 3);
        var multiplier = 1;

        tmpSpeed = this.speed + change * multiplier;

        if (tmpSpeed > 0)
            this.speed = tmpSpeed;
    };





    /**
     * Returns whether there is a neighbouring cell on a given level, at the given position.
     *
     * @param level
     * @param x
     * @param y
     */
    this.hasNeighbouringResources = function(level, x, y) {
        var resources = level.resources;
        for (var j = 0, len = resources.length; j < len; j++) {
            var resource = resources[j];
            var px = resource.x;
            var py = resource.y;
            if (Math.abs(px - x) <= 1 && Math.abs(py - y) <= 1) {
                // TODO: Add hook here for evaluating relative health of neighbouring resources
//            var h = p.getHealth();
                return resource;
            }
        }
        return null;
    };

    /**
     * Wipes the agent's memory
     */
    this.wipeMemory = function() {
        this.chronologicalMemory = [];
        this.memoriesOfPlacesVisited = [];
        this.memoriesOfPathsUntried = [];
        this.memoriesOfPlacesVisitedByOtherAgents = [];
        this.memoriesOfPathsUntriedByOtherAgents = [];
        this.memoriesOfResources = [];
        this.memoriesOfAgents = [];
//    this.lastMemory = null;
        this.lastUntriedPathMemory = null;
    };

    /**
     */
    this.developPlan = function(level) {
        var agent = this,
            rankedDesires = Desires.rankDesires(agent, level);
        if (rankedDesires && rankedDesires.length > 0) {
            var rankedDesires = Desires.rankDesires(agent, level),
                desireToExplore = rankedDesires[0],
                satisfyingObjects = desireToExplore.findSatisfyingObjects(agent);
            var plans = Plans.getBestPlans(agent, level, satisfyingObjects),
                len = plans.length,
                index = Math.floor(Math.random() * len);

            this.currentPlan = plans[index];
            this.currentPlanStep = 1;

            // TODO: Need more planning here
            /*
            rankedDesires.forEach(function(desire) {
                // Now get beliefs
                //desire.findSatisfyingObjects(agent);
            });
            */
        }
    };


    /**
     */
    this.executePlan = function(level) {
        if (_.isUndefined(this.currentPlan) || this.currentPlanStep >= this.currentPlan.distance)
            this.developPlan(level);
        if (_.isUndefined(this.currentPlan) || this.currentPlanStep >= this.currentPlan.distance)
            return;
        var point = this.currentPlan.trail[this.currentPlanStep];
        this.moveTo(point[0], point[1]);
        this.currentPlanStep++;
    };



    /**
     */
    this.scopeOfWorld = function() {
        var agent = this;
        var rankedDesires = Desires.rankDesires(agent, level);
        if (rankedDesires && rankedDesires.length > 0) {
            rankedDesires.forEach(function(desire) {
                // Now get beliefs
                //desire.findSatisfyingObjects(agent);
            });
        }
    };

    /**
     * Calls the agent type initialise function
     */
    this.init = function(level) {
        // TODO: Put this in the initialisation logic
        for (var characteristic in this.culture.characteristics) {
            if (this.culture.characteristics.hasOwnProperty(characteristic))
                this[characteristic] = this.culture.characteristics[characteristic];
        }
        this.speed = _.isUndefined(this.culture.speed) ? this.speed : this.culture.speed;
        if (this.culture.initFunction)
            this.culture.initFunction(this, level);
    };



    this.culture = culture;
    this.color = culture.color;

    // Position-related
    this.x = x, this.y = y;


    // REVISED MODEL

    // Need alternative theories of mind
    this.characteristics = {};
    this.beliefs = [];
    this.desires = [];
    this.capabilities = [];

    // Current age of the agent
    this.age = 0, this.bornAt = 0, this.diedAt = 0, this.alive = true;

    // CHARACTERISTICS

    // Speed-related
    this.delay = 0;
    this.speed = AgentConstants.DEFAULT_SPEED;
    this.countdownToMove = 0;
    this.wanderX = 0, this.wanderY = 0;

    // Health related
    this.health = AgentConstants.INITIAL_HEALTH;
    this.healthCategoryStats = {};

    this.canCommunicateWithOtherAgents = true;


    // BELIEFS - TODO: Check if redundant now
    this.lastMemory = new Memory(this.id, this.age, x, y);
    this.lastUntriedPathMemory = null;
    this.chronologicalMemory = [];
    this.memoriesOfPlacesVisited = [];
    this.memoriesOfPathsUntried = [];
    this.memoriesOfResources = [];
    this.memoriesOfAgents = [];
    this.memoriesOfPlacesVisitedByOtherAgents = [];
    this.memoriesOfPathsUntriedByOtherAgents = [];


    // PLANNING
    this.currentPlan, this.currentPlanStep, this.needToRevisePlan;

    // IMPORTED ABM FEATURES - EXPERIMENTAL
    /* Gender: UNSPECIFIED: 0, MALE: -1; FEMALE:1 */
    this.gender = 0;
    this.children = [];
    this.parents = [];
    this.currentPartner = [];


    // Initialise the agent here, to handle custom type behaviour
    this.registerHealthStats();
    this.reviseBeliefs(undefined);
    this.init();
}




/**
 * Mock agent - intentionally simplified for network transmission
 * @param culture
 * @param x
 * @param y
 * @param color
 * @param health
 * @param speed
 */
function SimpleAgent(culture, x, y, color, speed, health, wanderX, wanderY, lastMemory, delay, countdownToMove, healthCategoryStats) {
    this.culture = culture;
    this.x = x;
    this.y = y;
    this.color = color;
    this.health = health;
    this.speed = AgentConstants.DEFAULT_SPEED;
    this.wanderX = wanderX;
    this.wanderY = wanderY;
    this.lastMemory = new Memory(0, 0, x, y);
    this.delay = 0;
    this.countdownToMove = 0;
    this.healthCategoryStats = healthCategoryStats;
    this.age = 0, this.bornAt = 0, this.diedAt = 0, this.alive = true;
    this.reviseBeliefs = function() {};
    this.incrementCountdownToMove = function() { this.countdownToMove ++; };
    this.resetCountdownToMove = function() { this.countdownToMove = 0; };
    this.executePlan = function(level) {};
    /**
     * Calls the agent type initialise function
     */
    this.init = function(level) {
        for (var characteristic in culture.characteristics) {
            if (culture.characteristics.hasOwnProperty(characteristic))
                this[characteristic] = culture.characteristics[characteristic];
        }
        if (this.culture.initFunction)
            this.culture.initFunction(this, level);
    };

    /**
     * Updates the agent
     */
    this.update = function(level) {
        if (this.culture.updateFunction)
            this.culture.updateFunction(this, level);
    };
    this.init()
}

if (typeof exports !== "undefined") {
    exports.Agent = Agent;
    exports.Memory = Memory;
    exports.MemoryOfAgent = MemoryOfAgent;
	exports.AgentConstants = AgentConstants;
}
