/*!
 * Fierce Planet - Resource
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */

/**
 * ResourceCategory class definition
 *
 * @constructor
 * @param name
 */
function ResourceCategory(name, code, color) {
    this.name = name;
    this.code = code;
    this.color = color;
    this.types = [];
    this.evaluateOtherCategoryImpact = function(otherCategory) { return 1.0; };
}
ResourceCategory.prototype.addType = function(type) {
    // To by-pass circular references, clone the type added to the collection
    this.types.push(type.clone());
    type.category = this;
};
ResourceCategory.prototype.clearTypes = function() {
    // To by-pass circular references, clone the type added to the collection
    this.types = [];
};
ResourceCategory.prototype.setEvaluateOtherCategoryImpact = function(f) {this.evaluateOtherCategoryImpact = f;};
ResourceCategory.prototype.doEvaluateOtherCategoryImpact = function(otherCategory) {return this.evaluateOtherCategoryImpact(otherCategory); };




/**
 * ResourceType class definition
 *
 * @constructor
 * @param name
 * @param code
 * @param image
 * @param cost
 * @param upgradeCost
 * @param totalYield
 * @param perAgentYield
 */
function ResourceType(name, code, image, cost, upgradeCost, totalYield, perAgentYield) {
    this.name = name;
    this.code = code;
    this.image = image;
    this.cost = cost;
    this.upgradeCost = upgradeCost;
    this.totalYield = totalYield;
    this.perAgentYield = perAgentYield;

	if (typeof(Image) !== "undefined") {
	    this.actualImage = new Image();
	    this.actualImage.src = image;
	}
}
/**
 * Returns clone of this resource type
 */
ResourceType.prototype.clone = function() {
    return new ResourceType(
            this.name,
            this.code,
            this.image,
            this.cost,
            this.upgradeCost,
            this.totalYield,
            this.perAgentYield);
};


/**
 * Resource class definition
 *
 * @constructor
 * @param type
 * @param x
 * @param y
 */
function Resource(type, x, y) {
    this.setInitialTotalYield = function(initialTotalYield) {
        this.initialTotalYield = initialTotalYield;
        this.totalYield = initialTotalYield;
    };
    this.incrementTotalYield = function(totalYield) { this.totalYield++; };
    this.getPosition = function() { return [this.x, this.y]; };
    this.moveTo = function(x, y) { this.x =x; this.y = y; };
    this.calculateEffect = function(world) {

    };
    this.provideYield = function(agent, resourceEffect, adjustSpeedToYield) {
        if (this.totalYield > this.perAgentYield) {
            var adjustment = 0;
            if (Universe.settings.applyGeneralHealth) {
                // Don't be greedy - only yield a benefit if the agent needs it
                if (agent.health < 100) {
                    adjustment = this.perAgentYield * this.upgradeWorld * resourceEffect;
                    agent.adjustGeneralHealth(adjustment);
                    if (adjustSpeedToYield && Universe.settings.agentsCanAdjustSpeed) {
                        // This lowers the impact of resources on agents' speed - but need delay for 'followers' to get resources of their own.
                        agent.speed = agent.speed;
//                        agent.speed = (agent.speed * (1 + (this.perAgentYield / 100)));
//                        agent.speed = (Math.floor(Math.pow(this.perAgentYield, 0.5)));
//                        agent.speed = (this.perAgentYield);
                    }
                    this.totalYield -= this.perAgentYield;
                }
            }
            else {
                if (agent.getHealthForResource(this) < 100) {
                    var rawAdjustment = this.perAgentYield * this.upgradeWorld * ModuleManager.currentModule.resourceSet.categories.length;
                    adjustment = rawAdjustment * resourceEffect;
                    agent.adjustHealthForResource(adjustment, this);
                    if (adjustSpeedToYield && Universe.settings.agentsCanAdjustSpeed) {
                        // This lowers the impact of resources on agents' speed - but need delay for 'followers' to get resources of their own.
//                        agent.speed = agent.speed;
                        agent.speed = Math.floor(agent.speed * (1 + (this.perAgentYield / 100)));
//                        agent.speed = (Math.floor(Math.pow(this.perAgentYield, 0.5)));
//                        agent.speed = (this.perAgentYield);
                    }

                    if (Universe.settings.resourcesDiminishAtFixedRate) {
                        // Yields decreases reflect upgrade and actual yield to the agent - VERY HARD
                        this.totalYield -= rawAdjustment;
                    }
                    else {
                        // Yields are pegged to actual benefits supplied to agents
                        this.totalYield -= this.perAgentYield;
                    }
                }
            }
        }
    };

    // Kind properties
    this.category = type.category;
    this.color = type.category.color;
    this.kind = type;
    this.resourceName = type.code;
    this.initialTotalYield = type.totalYield;
    this.perAgentYield = type.perAgentYield;
    this.cost = type.cost;
    this.upgradeCost = type.upgradeCost;

    this.totalYield = type.totalYield;
    this.upgradeWorld = 1;
    this.moveTo(x, y);


}

if (typeof exports !== "undefined") {
    exports.ResourceCategory = ResourceCategory;
    exports.ResourceType = ResourceType;
    exports.Resource = Resource;
}
