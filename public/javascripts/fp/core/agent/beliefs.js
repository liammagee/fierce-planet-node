/*!
 * Fierce Planet - Capabilities
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var Beliefs = Beliefs || {};

Beliefs.BeliefsAboutPaths = {};
(function() {
    this.name = 'Beliefs About Paths';
    this.makeBelief = function(agent, level) {
        // Initialise belief variables
        if (typeof(agent.chronologicalMemory) == 'undefined')
            agent.chronologicalMemory = [];
        if (typeof(agent.memoriesOfPlacesVisited) == 'undefined')
            agent.memoriesOfPlacesVisited = [];
        if (typeof(agent.memoriesOfPathsUntried) == 'undefined')
            agent.memoriesOfPathsUntried = [];

        var x = agent.x, y = agent.y;

        var memory = null;
        if (agent.memoriesOfPlacesVisited[[x, y]] != undefined) {
            memory = agent.memoriesOfPlacesVisited[[x, y]];
            memory.addVisit(agent.id, agent.age);
        }
        else {
            memory = new Memory(agent.id, agent.age, x, y);
            agent.memoriesOfPlacesVisited[[x, y]] = memory;
        }

        if (agent.memoriesOfPathsUntried[[x, y]] != undefined) {
            delete agent.memoriesOfPathsUntried[[x, y]];
        }
        if (agent.lastUntriedPathMemory != undefined)
            memory.distanceFromLastUntriedPath = (agent.age - agent.lastUntriedPathMemory.age);
        agent.lastMemory = memory;
        // Add to ordered memory
        agent.chronologicalMemory[agent.age] = memory;

        if (level != undefined) {
            // Add any unvisited path cells to memory
            if (x - 1 >= 0 && level.getTile(x - 1, y) == undefined && agent.memoriesOfPlacesVisited[[x - 1, y]] == undefined) {
                // Add path cell to memory
                agent.lastUntriedPathMemory = new Memory(agent.id, agent.age, x - 1, y);
                agent.memoriesOfPathsUntried[[x - 1, y]] = agent.lastUntriedPathMemory;
            }
            if (x + 1 < level.cellsAcross && level.getTile(x + 1, y) == undefined && agent.memoriesOfPlacesVisited[[x + 1, y]] == undefined) {
                // Add path cell to memory
                agent.lastUntriedPathMemory = new Memory(agent.id, agent.age, x + 1, y);
                agent.memoriesOfPathsUntried[[x + 1, y]] = agent.lastUntriedPathMemory;
            }
            if (y - 1 >= 0 && level.getTile(x, y - 1) == undefined && agent.memoriesOfPlacesVisited[[x, y - 1]] == undefined) {
                // Add path cell to memory
                agent.lastUntriedPathMemory = new Memory(agent.id, agent.age, x, y - 1);
                agent.memoriesOfPathsUntried[[x, y - 1]] = agent.lastUntriedPathMemory;
            }
            if (y + 1 < level.cellsDown && level.getTile(x, y + 1) == undefined && agent.memoriesOfPlacesVisited[[x, y + 1]] == undefined) {
                // Add path cell to memory
                agent.lastUntriedPathMemory = new Memory(agent.id, agent.age, x, y + 1);
                agent.memoriesOfPathsUntried[[x, y + 1]] = agent.lastUntriedPathMemory;
            }
        }
    };
}).apply(Beliefs.BeliefsAboutPaths);

Beliefs.BeliefsAboutResources = {};
(function() {
    this.name = 'Beliefs About Resources';
    this.makeBelief = function(agent, level) {
        if (level == undefined)
            return;

        // Initialise belief variables
        if (typeof(agent.memoriesOfResources) == 'undefined')
            agent.memoriesOfResources = [];

        var x = agent.x, y = agent.y;

        var resources = level.resources;

        // Add neighbouring resources to memory
        for (var j = 0; j < resources.length; j++) {
            var resource = resources[j];
            var resourceX = resource.x;
            var resourceY = resource.y;
            // Is the resource next to our current position?
            var diffX = Math.abs(resourceX - x);
            var diffY = Math.abs(resourceY - y);
            var diff = diffX * diffY;
            if (diff <= 1) {
                // Add resource to memory
                agent.memoriesOfResources[[x, y]] = resource;
            }
        }    };
}).apply(Beliefs.BeliefsAboutResources);

Beliefs.BeliefsAboutOtherAgents = {};
(function() {
    this.name = 'Beliefs About Other Agents';
    this.makeBelief = function(agent, level) {
        if (level == undefined)
            return;

        // Initialise belief variables
        if (typeof(agent.memoriesOfAgents) == 'undefined')
            agent.memoriesOfAgents = [];

        var x = agent.x, y = agent.y;

        var agents = level.agemts;

        // Add neighbouring resources to memory
        for (var j = 0; j < agents.length; j++) {
            var otherAgent = agents[j];
            var aX = otherAgent.x;
            var aY = otherAgent.y;
            // Is the resource next to our current position?
            var diffX = Math.abs(aX - x);
            var diffY = Math.abs(aY - y);
            var diff = diffX * diffY;
            if (diff <= 1) {
                // Add resource to memory
                agent.memoriesOfAgents[otherAgent.id] = new MemoryOfAgent(agent.id, agent.age, x, y, otherAgent.id);
//                agent.memoriesOfAgents[[x, y]] = otherAgent;
            }
        }    };
}).apply(Beliefs.BeliefsAboutOtherAgents);

Beliefs.BeliefsBasedOnOtherAgentsBeliefs = {};
(function() {
    this.name = 'Beliefs Based On Other Agents\' Beliefs';
    this.makeBelief = function(agent, level) {
        if (level == undefined)
            return;

        // Initialise belief variables
        if (typeof(agent.memoriesOfPlacesVisitedByOtherAgents) == 'undefined')
            agent.memoriesOfPlacesVisitedByOtherAgents = [];
        if (typeof(agent.memoriesOfPathsUntriedByOtherAgents) == 'undefined')
            agent.memoriesOfPathsUntriedByOtherAgents = [];

        var x = agent.x, y = agent.y;

        // Add agents on this tile to memory
        var agents = level.currentAgents;
        for (var i = 0; i < agents.length; i++) {
            var otherAgent = agents[i];
            if (otherAgent.id == agent.id)
                continue;
            var agentX = otherAgent.x;
            var agentY = otherAgent.y;
//                if (agentX == x && agentY == y && (agent.lastPosition().x != agent.lastPosition().x || agent.lastPosition().y != agent.lastPosition().y)) {
            // TODO: agent is very slow - consider ways to optimise
            if ((otherAgent.lastMemory.x != agent.lastMemory.x || otherAgent.lastMemory.y != agent.lastMemory.y) && (Math.abs(agentX - x) <= 1 && Math.abs(agentY - y) <= 1)) {

                // Premature optimisation...
                /*
                 if (agent.memoriesOfPlacesVisitedByOtherAgents.length > 10)
                 agent.memoriesOfPlacesVisitedByOtherAgents = [];
                 if (agent.memoriesOfPathsUntriedByOtherAgents.length > 10)
                 agent.memoriesOfPathsUntriedByOtherAgents = [];
                 */

                // Add agent to memory
                agent.memoriesOfAgents[otherAgent.id] = new MemoryOfAgent(agent.id, agent.age, x, y, otherAgent.id);
                var mpv = [];
                for (var j in otherAgent.memoriesOfPlacesVisited) {
                    var m = otherAgent.memoriesOfPlacesVisited[j];
                    if (m != undefined)
                        mpv[[m.x, m.y]] = new Memory(m.agentID, m.age, m.x, m.y);
                }
                agent.memoriesOfPlacesVisitedByOtherAgents[otherAgent.id] = mpv;
                var mpu = [];
                for (var j in otherAgent.memoriesOfPathsUntried) {
                    var m = otherAgent.memoriesOfPathsUntried[j];
                    if (m != undefined)
                        mpu[[m.x, m.y]] = new Memory(m.agentID, m.age, m.x, m.y);
                }
                agent.memoriesOfPathsUntriedByOtherAgents[otherAgent.id] = mpu;

                // Add memories to other agent
                // TODO: No longer necessary?
//                    agent._memoriesOfAgents[agent.id] = new MemoryOfAgent(agent.id, agent.age, x, y, agent.id) ;
//                    mpv = [];
//                    for (var j in agent.memoriesOfPlacesVisited) {
//                        var m = agent.memoriesOfPlacesVisited[j];
//                        if (m != undefined)
//                            mpv[[m.x, m.y]] = new Memory(m.agentID, m.age, m.x, m.y);
//                    }
//                    agent._memoriesOfPlacesVisitedByOtherAgents[agent.id] = mpv;
//                    mpu = [];
//                    for (var j in agent.memoriesOfPathsUntried) {
//                        var m = agent.memoriesOfPathsUntried[j];
//                        if (m != undefined)
//                            mpu[[m.x, m.y]] = new Memory(m.agentID, m.age, m.x, m.y);
//                    }
//                    agent._memoriesOfPathsUntriedByOtherAgents[agent.id] = mpu;

            }
        }
    };
}).apply(Beliefs.BeliefsBasedOnOtherAgentsBeliefs);



if (typeof(exports) != "undefined")
    exports.Beliefs = Beliefs;

