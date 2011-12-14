/*!
 * Fierce Planet - Capabilities
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var Desires = Desires || {};
(function() {
    this.rankDesires = function(agent) {
        var desires = agent.culture.desires;
        return desires.sort(function(a, b) {
            if (typeof(a.evaluate) == 'undefined' || typeof(b.evaluate) == 'undefined')
                return 0;
            return  b.evaluate(agent) -  a.evaluate(agent);
        });
    };
}).apply(Desires);

Desires.ImproveHealth = {};
(function() {
    this.name = 'Improve Health';
    this.evaluate = function(agent) {
        return 1.0 - (agent.health / AgentConstants.INITIAL_HEALTH);
    };
}).apply(Desires.ImproveHealth);

Desires.ExploreSpace = {};
(function() {
    this.name = 'Explore';
    this.evaluate = function(agent, level) {
        return 0.5;
    };
}).apply(Desires.ExploreSpace);

Desires.Flee = {};
(function() {
    this.name = 'Flee';
    this.evaluate = function(agent, level) {
        var surroundingPositions = level.getSurroundingPositions(agent.x, agent.y, true);
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
}).apply(Desires.Flee);

if (typeof(exports) != "undefined")
    exports.Desires = Desires;

