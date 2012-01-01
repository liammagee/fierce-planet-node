/*!
 * Fierce Planet - Capabilities
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var Desires = Desires || {};
(function() {
    this.rankDesires = function(agent, level) {
        var desires = agent.culture.desires;
        return desires.sort(function(a, b) {
            if (typeof(a.evaluate) == 'undefined' || typeof(b.evaluate) == 'undefined')
                return 0;
            return  b.evaluate(agent, level) -  a.evaluate(agent, level);
        });
    };
}).apply(Desires);

Desires.ImproveHealth = {};
(function() {
    this.name = 'Improve Health';
    this.dependsOnBeliefs = 'Improve Health';
    this.evaluate = function(agent, level) {
        return 1.0 - (agent.health / AgentConstants.INITIAL_HEALTH);
    };
    this.findSatisfyingObjects = function(agent) {
        if (typeof(agent.memoriesOfResources) === 'undefined')
            return null;
        var satisfyingObjects = [];
        for (var i in agent.memoriesOfResources) {
            if (agent.memoriesOfResources.hasOwnProperty(i)) {
                var belief = agent.memoriesOfResources[i];
                satisfyingObjects.push([belief.x, belief.y]);
            }
        }
        return satisfyingObjects;
    };
    this.satisfy = function(agent, level) {
        Capabilities.ConsumeResourcesCapability.exercise(agent, level);
    };
}).apply(Desires.ImproveHealth);

Desires.ExploreSpace = {};
(function() {
    this.name = 'Explore';
    this.dependsOnBeliefs = 'Improve Health';
    this.evaluate = function(agent, level) {
        return 0.5;
    };
    this.findSatisfyingObjects = function(agent) {
        if (typeof(agent.memoriesOfPathsUntried) === 'undefined')
            return null;
        var satisfyingObjects = [];
        for (var i in agent.memoriesOfPathsUntried) {
            if (agent.memoriesOfPathsUntried.hasOwnProperty(i)) {
                var belief = agent.memoriesOfPathsUntried[i];
                satisfyingObjects.push([belief.x, belief.y]);
            }
        }
        return satisfyingObjects;
    };
    this.satisfy = function(agent, level) {
        // Do nothing - assume desire is satisfied by moving.
    };
}).apply(Desires.ExploreSpace);

Desires.Flee = {};
(function() {
    this.name = 'Flee';
    this.dependsOnBeliefs = 'Improve Health';
    this.evaluate = function(agent, level) {
        var surroundingPositions = level.getVonNeumannNeighbourhood(agent.x, agent.y, true);
        var presenceOfThreat = false;
        surroundingPositions.forEach(function(position) {
            var agents = level.getAgentsAtContentMap(position.x, position.y);
            agents.forEach(function(otherAgent) {
                if (otherAgent.id != agent.id && otherAgent.culture != agent.culture) {
                    otherAgent.capabilities.forEach(function(capability) {
                        if (capability == Capabilities.PreyOnOtherAgentsCapability) {
                            presenceOfThreat = true;
                        }
                    })
                }
            });
        })
        if (presenceOfThreat)
            return 1.0;
        else
            return 0.0;
    };
    this.findSatisfyingObjects = function(agent) {
        if (typeof(agent.memoriesOfAgents) === 'undefined')
            return null;
        var satisfyingObjects = [];
        for (var i in agent.memoriesOfAgents) {
            if (agent.memoriesOfAgents.hasOwnProperty(i)) {
                var belief = agent.memoriesOfAgents[i];
                satisfyingObjects.push([belief.x, belief.y]);
            }
        }
        return satisfyingObjects;
    };
    this.satisfy = function(agent, level) {
        // Do nothing - assume desire is satisfied by moving.
    };

}).apply(Desires.Flee);

Desires.Reproduce = {};
(function() {
    this.name = 'Reproduce';
    this.evaluate = function(agent, level) {
        return 0.1;
    };
    this.findSatisfyingObjects = function(agent) {
        if (typeof(agent.memoriesOfAgents) === 'undefined')
            return null;
        var satisfyingObjects = [];
        for (var i in agent.memoriesOfAgents) {
            if (agent.memoriesOfAgents.hasOwnProperty(i)) {
                var belief = agent.memoriesOfAgents[i];
                satisfyingObjects.push([belief.x, belief.y]);
            }
        }
        return satisfyingObjects;
    };
    this.satisfy = function(agent, level) {
        // Do nothing - assume desire is satisfied by moving.
    };

}).apply(Desires.Reproduce);

if (typeof(exports) != "undefined")
    exports.Desires = Desires;

