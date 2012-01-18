/*!
 * Fierce Planet - Capabilities
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var Beliefs = Beliefs || {};

function Belief() {
    this.time, this.x, this.y, this.source, this.object;

    this.exercise = function(agent, world) {};
}


Beliefs.BeliefsAboutPaths = {};
(function() {
    this.name = 'Beliefs About Paths';
    this.makeBelief = function(agent, world) {
        // Initialise belief variables
        if (_.isUndefined(agent.beliefs))
            agent.beliefs = [];
        if (_.isUndefined(agent.chronologicalMemory))
            agent.chronologicalMemory = [];
        if (_.isUndefined(agent.memoriesOfPlacesVisited))
            agent.memoriesOfPlacesVisited = [];
        if (_.isUndefined(agent.memoriesOfPathsUntried))
            agent.memoriesOfPathsUntried = [];

        var x = agent.x, y = agent.y;

        var memory = null;

        if (!_.isUndefined(agent.memoriesOfPlacesVisited[[x, y]])) {
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

        if (world != undefined) {
            // Add any unvisited path cells to memory
            if (x - 1 >= 0 && world.areAgentsAllowed(x - 1, y) && agent.memoriesOfPlacesVisited[[x - 1, y]] == undefined) {
                // Add path cell to memory
                agent.lastUntriedPathMemory = new Memory(agent.id, agent.age, x - 1, y);
                agent.memoriesOfPathsUntried[[x - 1, y]] = agent.lastUntriedPathMemory;
            }
            if (x + 1 < world.cellsAcross && world.areAgentsAllowed(x + 1, y) && agent.memoriesOfPlacesVisited[[x + 1, y]] == undefined) {
                // Add path cell to memory
                agent.lastUntriedPathMemory = new Memory(agent.id, agent.age, x + 1, y);
                agent.memoriesOfPathsUntried[[x + 1, y]] = agent.lastUntriedPathMemory;
            }
            if (y - 1 >= 0 && world.areAgentsAllowed(x, y - 1) && agent.memoriesOfPlacesVisited[[x, y - 1]] == undefined) {
                // Add path cell to memory
                agent.lastUntriedPathMemory = new Memory(agent.id, agent.age, x, y - 1);
                agent.memoriesOfPathsUntried[[x, y - 1]] = agent.lastUntriedPathMemory;
            }
            if (y + 1 < world.cellsDown && world.areAgentsAllowed(x, y + 1) && agent.memoriesOfPlacesVisited[[x, y + 1]] == undefined) {
                agent.lastUntriedPathMemory = new Memory(agent.id, agent.age, x, y + 1);
                agent.memoriesOfPathsUntried[[x, y + 1]] = agent.lastUntriedPathMemory;
            }
            if (world.allowOffscreenCycling) {
                if (x == 0) {
                    var newX = world.cellsAcross - 1;
                    if (world.areAgentsAllowed(newX, y) && agent.memoriesOfPlacesVisited[[newX, y]] == undefined) {
                        agent.lastUntriedPathMemory = new Memory(agent.id, agent.age, newX, y);
                        agent.memoriesOfPathsUntried[[newX, y]] = agent.lastUntriedPathMemory;
                    }
                }
                else if (x == world.cellsAcross - 1) {
                    var newX = 0;
                    if (world.areAgentsAllowed(newX, y) && agent.memoriesOfPlacesVisited[[newX, y]] == undefined) {
                        agent.lastUntriedPathMemory = new Memory(agent.id, agent.age, newX, y);
                        agent.memoriesOfPathsUntried[[newX, y]] = agent.lastUntriedPathMemory;
                    }
                }
                if (y == 0) {
                    var newY = world.cellsDown - 1;
                    if (world.areAgentsAllowed(x, newY) && agent.memoriesOfPlacesVisited[[x, newY]] == undefined) {
                        agent.lastUntriedPathMemory = new Memory(agent.id, agent.age, x, newY);
                        agent.memoriesOfPathsUntried[[x, newY]] = agent.lastUntriedPathMemory;
                    }
                }
                else if (y == world.cellsDown - 1) {
                    var newY = 0;
                    if (world.areAgentsAllowed(x, newY) && agent.memoriesOfPlacesVisited[[x, newY]] == undefined) {
                        agent.lastUntriedPathMemory = new Memory(agent.id, agent.age, x, newY);
                        agent.memoriesOfPathsUntried[[x, newY]] = agent.lastUntriedPathMemory;
                    }
                }

            }
        }
    };
}).apply(Beliefs.BeliefsAboutPaths);

Beliefs.BeliefsAboutResources = {};
(function() {
    this.name = 'Beliefs About Resources';
    this.makeBelief = function(agent, world) {
        if (_.isUndefined(world))
            return;

        var x = agent.x, y = agent.y;
        if (_.isUndefined(x) || _.isUndefined(y))
            return;

        // Initialise belief variables
        agent.beliefs = agent.beliefs || [];
        agent.memoriesOfResources = agent.memoriesOfResources || [];


        var resources = world.resources;

        // Add neighbouring resources to memory

        var positions = world.getVonNeumannNeighbourhood(x, y, true);
        positions.forEach(function(position) {
            var resources = world.getResourcesAtCell(position.x, position.y);
            // TODO: Can only add one resource to memory
            if (resources && resources.length > 0)
                agent.memoriesOfResources[[x, y]] = resources[0];
        });

        /*
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
        }
        */
    };
}).apply(Beliefs.BeliefsAboutResources);

Beliefs.BeliefsAboutOtherAgents = {};
(function() {
    this.name = 'Beliefs About Other Agents';
    this.makeBelief = function(agent, world) {
        if (_.isUndefined(world))
            return;

        var x = agent.x, y = agent.y;
        if (_.isUndefined(x) || _.isUndefined(y))
            return;

        // Initialise belief variables
        agent.beliefs = agent.beliefs || [];
        agent.memoriesOfAgents = agent.memoriesOfAgents || [];



        // Add neighbouring resources to memory
        var positions = world.getVonNeumannNeighbourhood(x, y, true);
        positions.forEach(function(position) {
            var agents = world.getAgentsAtCell(position.x, position.y);
            // TODO: Can only add one resource to memory
            if (agents && agents.length > 0) {
                agents.forEach(function(otherAgent) {
                    agent.memoriesOfAgents[otherAgent.id] = new MemoryOfAgent(agent.id, agent.age, x, y, otherAgent.id);
                });
            }
        });

        /*
        var agents = world.currentAgents;
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
        }
        */
   };
}).apply(Beliefs.BeliefsAboutOtherAgents);

Beliefs.BeliefsBasedOnOtherAgentsBeliefs = {};
(function() {
    this.name = 'Beliefs Based On Other Agents\' Beliefs';
    this.makeBelief = function(agent, world) {
        if (_.isUndefined(world))
            return;

        var x = agent.x, y = agent.y;
        if (_.isUndefined(x) || _.isUndefined(y))
            return;

        // Initialise belief variables
        agent.beliefs = agent.beliefs || [];
        agent.memoriesOfAgents = agent.memoriesOfAgents || [];



        // Add agents on this tile to memory
//        /*
        var neighbouringAgents = [];
        var positions = world.getVonNeumannNeighbourhood(x, y, true);
//        var positions = [{x: x, y: y}];
        positions.forEach(function(position) {
            var agents = world.getAgentsAtCell(position.x, position.y);
            if (agents && agents.length > 0) {
                agents.forEach(function(otherAgent) {
                    if (otherAgent.id != agent.id && otherAgent.age > 0 && otherAgent.alive)
                        neighbouringAgents.push(otherAgent);
                });
            }
        });

        neighbouringAgents.forEach(function(otherAgent) {
            if ((otherAgent.lastMemory.x != agent.lastMemory.x || otherAgent.lastMemory.y != agent.lastMemory.y)) {
                // Premature optimisation...
//                         if (agent.memoriesOfPlacesVisitedByOtherAgents.length > 10)
//                         agent.memoriesOfPlacesVisitedByOtherAgents = [];
//                         if (agent.memoriesOfPathsUntriedByOtherAgents.length > 10)
//                         agent.memoriesOfPathsUntriedByOtherAgents = [];

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
        });
//*/

        /*
        var agents = world.currentAgents;
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
//                 if (agent.memoriesOfPlacesVisitedByOtherAgents.length > 10)
//                 agent.memoriesOfPlacesVisitedByOtherAgents = [];
//                 if (agent.memoriesOfPathsUntriedByOtherAgents.length > 10)
//                 agent.memoriesOfPathsUntriedByOtherAgents = [];

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
        */
    };
}).apply(Beliefs.BeliefsBasedOnOtherAgentsBeliefs);



if (typeof exports !== "undefined")
    exports.Beliefs = Beliefs;

