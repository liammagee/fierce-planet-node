/*!
 * Fierce Planet - Capabilities
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var Desires = Desires || {};
(function() {
    this.rankDesires = function(agent, world) {
        var desires = agent.culture.desires;
        return desires.sort(function(a, b) {
            if (_.isUndefined(a.evaluate) || _.isUndefined(b.evaluate))
                return 0;
            return  b.evaluate(agent, world) -  a.evaluate(agent, world);
        });
    };
}).apply(Desires);

Desires.ImproveHealth = {};
(function() {
    this.name = 'Improve Health';
    this.dependsOnBeliefs = 'Improve Health';
    this.evaluate = function(agent, world) {
        return 1.0 - (agent.health / agent.culture.initialHealth);
    };
    this.findSatisfyingObjects = function(agent) {
        if (_.isUndefined(agent.memoriesOfResources))
            return null;
        var satisfyingObjects = [];
        for (var i in agent.memoriesOfResources) {
            if (agent.memoriesOfResources.hasOwnProperty(i)) {
                var belief = agent.memoriesOfResources[i];
                satisfyingObjects.push(Lifecycle.currentWorld.deindexify(parseInt(i)));
            }
        }
        return satisfyingObjects;
    };
    this.satisfy = function(agent, world) {
        Capabilities.ConsumeResourcesCapability.exercise(agent, world);
    };
}).apply(Desires.ImproveHealth);

Desires.ExploreSpace = {};
(function() {
    this.name = 'Explore';
    this.dependsOnBeliefs = 'Improve Health';
    this.evaluate = function(agent, world) {
        return 0.5;
    };
    this.findSatisfyingObjects = function(agent) {
        if (_.isUndefined(agent.memoriesOfPathsUntried))
            return null;
        var satisfyingObjects = [];
        for (var i in agent.memoriesOfPathsUntried) {
            if (agent.memoriesOfPathsUntried.hasOwnProperty(i)) {
                var belief = agent.memoriesOfPathsUntried[i];
                if (!_.isUndefined(belief.x) && !_.isUndefined(belief.y))
                    satisfyingObjects.push([belief.x, belief.y]);
            }
        }
        for (var i in agent.memoriesOfPathsUntriedByOtherAgents) {
            if (agent.memoriesOfPathsUntriedByOtherAgents.hasOwnProperty(i)) {
                var otherAgentsBeliefs = agent.memoriesOfPathsUntriedByOtherAgents[i];
                for (var j in otherAgentsBeliefs) {
                    if (otherAgentsBeliefs.hasOwnProperty(j)) {
                        var belief = otherAgentsBeliefs[j];
                        if (!_.isUndefined(belief.x) && !_.isUndefined(belief.y) && !(belief.x == agent.x && belief.y == agent.y))
                            satisfyingObjects.push([belief.x, belief.y]);
                    }
                }
            }
        }
        satisfyingObjects.sort(function(obj1, obj2) {
            if (obj1[1] != obj2[1])
                return obj1[1] - obj2[1];
            return obj1[0] - obj2[0];
        });
        for (var i = 1; i < satisfyingObjects.length; i ++) {
            if ( satisfyingObjects[i][0] === satisfyingObjects[ i - 1 ][0] &&  satisfyingObjects[i][1] === satisfyingObjects[ i - 1 ][1]) {
                satisfyingObjects.splice( i--, 1 );
            }
        }
        for (var i in agent.memoriesOfPlacesVisited) {
            if (agent.memoriesOfPlacesVisited.hasOwnProperty(i)) {
                var belief = agent.memoriesOfPlacesVisited[i],
                    index = -1;
                satisfyingObjects.forEach(function(obj, i) {
                    if (obj[0] == belief.x && obj[1] == belief.y)
                        index = i;
                });
                if (index > -1)
                    satisfyingObjects.splice(index, 1)
            }
        }
        for (var i in agent.memoriesOfPlacesVisitedByOtherAgents) {
            if (agent.memoriesOfPlacesVisitedByOtherAgents.hasOwnProperty(i)) {
                var otherAgentsBeliefs = agent.memoriesOfPlacesVisitedByOtherAgents[i];
                for (var j in otherAgentsBeliefs) {
                    if (otherAgentsBeliefs.hasOwnProperty(j)) {
                        var belief = otherAgentsBeliefs[j],
                            index = -1;
                        satisfyingObjects.forEach(function(obj, i) {
                            if (obj[0] == belief.x && obj[1] == belief.y)
                                index = i;
                        });
                        if (index > -1)
                            satisfyingObjects.splice(index, 1)
                    }
                }
            }
        }
        return satisfyingObjects;
    };
    this.satisfy = function(agent, world) {
        // Do nothing - assume desire is satisfied by moving.
    };
}).apply(Desires.ExploreSpace);

Desires.Flee = {};
(function() {
    this.name = 'Flee';
    this.dependsOnBeliefs = 'Improve Health';
    this.evaluate = function(agent, world) {
        var surroundingPositions = world.getVonNeumannNeighbourhood(agent.x, agent.y, true);
        var presenceOfThreat = false;
        surroundingPositions.forEach(function(position) {
            var agents = world.getAgentsAtCell(position.x, position.y);
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
        if (_.isUndefined(agent.memoriesOfAgents))
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
    this.satisfy = function(agent, world) {
        // Do nothing - assume desire is satisfied by moving.
    };

}).apply(Desires.Flee);

Desires.Reproduce = {};
(function() {
    this.name = 'Reproduce';
    this.evaluate = function(agent, world) {
        return 0.1;
    };
    this.findSatisfyingObjects = function(agent) {
        if (_.isUndefined(agent.memoriesOfAgents))
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
    this.satisfy = function(agent, world) {
        // Do nothing - assume desire is satisfied by moving.
    };

}).apply(Desires.Reproduce);

if (typeof exports !== "undefined")
    exports.Desires = Desires;

