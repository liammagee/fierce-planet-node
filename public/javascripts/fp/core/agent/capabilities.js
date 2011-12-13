/*!
 * Fierce Planet - Capabilities
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var Capabilities = Capabilities || {};

Capabilities.ConsumeResourcesCapability = {};
(function() {
    this.exercise = function(agent, level) {
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
}).apply(Capabilities.ConsumeResourcesCapability);
Capabilities.ProduceResourcesCapability = {};
(function() {
    this.exercise = function(agent, level) {
        if (!level.isPositionOccupiedByResource(agent.x, agent.y)) {
            var rt = World.resourceTypes[Math.floor(Math.random() * World.resourceTypes.length)];
            var buildChance = Math.random();
            if (buildChance < 0.1 && level.currentResourceStore > rt.cost) {
                level.addResource(new Resource(rt, agent.x, agent.y));
            }
        }
    };
}).apply(Capabilities.ProduceResourcesCapability);

Capabilities.ShareMemoriesCapability = {};
(function() {
    this.exercise = function(agent, level) {
    };
}).apply(Capabilities.ShareMemoriesCapability);

Capabilities.AdjustHealthCapability = {};
(function() {
    this.exercise = function(agent, level) {
        if (!World.settings.godMode || World.settings.showHealthReductionInGodMode)
            agent.adjustGeneralHealth(World.settings.agentCostPerMove);
    };
}).apply(Capabilities.AdjustHealthCapability);

Capabilities.RegenerateCapability = {};
(function() {
    this.exercise = function(agent, level) {
        if (agent.gender != 'f' || agent.age < agent.culture.reproductionAge)
            return;

        var x = agent.x, y = agent.y;
        var agents = level.currentAgents;
        for (var j = 0; j < agents.length; j++) {
            var a = agents[j];
            var ax = a.x;
            var ay = a.y;
            if (Math.abs(ax - x) <= 1 && Math.abs(ay - y) <= 1) {
                    if (a.gender == 'm' && a.culture.name == agent.culture.name && a.age > agent.culture.reproductionAge) {
                        // Some random chance a new agent is born
                    var birthChance = Math.random();
                    if (birthChance < agent.culture.birthProbability) {
                        if (level.countAgentsAtPosition(x, y) <= 1 && (World.settings.agentsOwnTilesExclusively || level.agentsOwnTilesExclusively)) {
                            var childAgent = new Agent(agent.culture, agent.x, agent.y);
                            childAgent.delay = parseInt(Math.random() * AgentConstants.DEFAULT_SPEED * 5);
                            childAgent.canCommunicateWithOtherAgents = (World.settings.agentsCanCommunicate);
                            childAgent.bornAt = (Lifecycle.levelCounter);
                            childAgent.parents = [agent, a];
                            agent.children.push(childAgent);
                            a.children.push(childAgent);
                            Lifecycle.currentLevel.currentAgents.push(childAgent);
                            Lifecycle.currentLevel.addAgentToContentMap(childAgent);
                            Lifecycle.currentLevel.currentResourceStore += 10;
                        }
                    }
                }
            }
        }
    };
}).apply(Capabilities.RegenerateCapability);

Capabilities.PreyOnOtherAgentsCapability = {};
(function() {
    this.exercise = function(agent, level) {
        var x = agent.x;
        var y = agent.y;
        var agents = level.currentAgents;
        var foundPrey = false;
        for (var j = 0; j < agents.length; j++) {
            var a = agents[j];
            var ax = a.x;
            var ay = a.y;
            if (Math.abs(ax - x) <= 1 && Math.abs(ay - y) <= 1) {
                if (a.culture.name != agent.culture.name) {
                    if (Math.random() < agent.culture.preyProbability) {
                        a.adjustGeneralHealth(agent.culture.preyCost);
                        agent.adjustGeneralHealth(agent.culture.predatorGain);
                        foundPrey = true;
                        break;
                    }

                }
            }
        }
        if (!foundPrey)
            agent.adjustGeneralHealth(agent.culture.moveCost);
    };
}).apply(Capabilities.PreyOnOtherAgentsCapability);


Capabilities.MoveUtilities = {};
(function() {

    /**
     * Generates a random order for the available directions (UP, RIGHT, DOWN, LEFT)
     */
    this.randomDirectionOrder = function() {
        var directions = [];
        var orderedDirections = [0, 1, 2, 3];
        var odl = orderedDirections.length;
        for (var i = 0; i < odl; i++) {
            var remainingLength = orderedDirections.length;
            var pos = Math.floor(Math.random() * remainingLength);
            directions.push(orderedDirections[pos]);
            orderedDirections.splice(pos, 1);
        }
        return directions;
    };

}).apply(Capabilities.MoveUtilities);

Capabilities.MoveCapability = {};
(function() {
    this.exercise = function(agent, level) {
        if (level.agentGoToNearestExit || World.settings.agentGoToNearestExit) {
            try {
                Capabilities.MoveTowardsNearestExitCapability.exercise(agent, level);
            }
            catch (e) {
                Capabilities.MoveWithMemoryCapability.exercise(agent, level);
            }
        }
        else {
            Capabilities.MoveWithMemoryCapability.exercise(agent, level);
        }
    };

}).apply(Capabilities.MoveCapability);

Capabilities.MoveUpwardsCapability = {};
(function() {
    this.exercise = function(agent, level) {
        // TODO: Make these parameters of the level

        var options = options || {};
        var withNoRepeat = options ? options["withNoRepeat"] : false;
        var withNoCollision = options ? options["withNoCollision"] : false;
        var withOffscreenCycling = options ? options["withOffscreenCycling"] : false;

        var position = this.findPositionUp(agent, level, withNoRepeat, withNoCollision, withOffscreenCycling)

        // Set the position and add the move to the agent's memory
        agent.moveTo(position[0], position[1]);
    };


    /**
     * @param level
     * @param withNoRepeat
     * @param withNoCollision
     * @param withOffscreenCycling
     */
    this.findPositionUp = function(agent, level, withNoRepeat, withNoCollision, withOffscreenCycling) {
        var x = agent.x, y = agent.y;
        if (y < 0)
            return [x, level.cellsDown];
        else
            return [x, y - 1];
    }



}).apply(Capabilities.MoveUpwardsCapability);


Capabilities.MoveRandomlyCapability = {};
(function() {
    this.exercise = function(agent, level) {
        // TODO: Make these parameters of the level

        var options = options || {};
        var withNoRepeat = options ? options["withNoRepeat"] : false;
        var withNoCollision = options ? options["withNoCollision"] : false;
        var withOffscreenCycling = options ? options["withOffscreenCycling"] : false;

        var position = this.findPositionRandomly(agent, level, withNoRepeat, withNoCollision, withOffscreenCycling)

//        console.log(agent.x + ':' +agent.y + ':' +position[0] + ':' +position[1])
        // Set the position and add the move to the agent's memory
        agent.moveTo(position[0], position[1]);
    };



    /**
     * @param level
     * @param withNoRepeat
     * @param withNoCollision
     * @param withOffscreenCycling
     */
    this.findPositionRandomly = function(agent, level, withNoRepeat, withNoCollision, withOffscreenCycling) {
        var x = agent.x;
        var y = agent.y;
        var newX = x;
        var newY = y;
        var lastX = agent.lastMemory.x;
        var lastY = agent.lastMemory.y;
        var candidateCells = [];
        var directions = Capabilities.MoveUtilities.randomDirectionOrder();
        var waitOnCurrentCell = false;
        for (var i = 0; i < directions.length; i++) {
            newX = x;
            newY = y;
            var dir = directions[i];

            var offScreen1 = 0;
            var offScreenWidth = level.cellsAcross - 1;
            var offScreenHeight = level.cellsDown - 1;
            var offset = 1;
            var toContinue = false;
            switch (dir) {
                case 0:
                    (x == offScreen1 ? (withOffscreenCycling ? newX = offScreenWidth : toContinue = true) : newX = newX - offset);
                    break;
                case 1:
                    (x == offScreenWidth ? (withOffscreenCycling ? newX = offScreen1 : toContinue = true) : newX = newX + offset);
                    break;
                case 2:
                    (y == offScreen1 ? (withOffscreenCycling ? newY = offScreenHeight : toContinue = true) : newY = newY - offset);
                    break;
                case 3:
                    (y == offScreenHeight ? (withOffscreenCycling ? newY = offScreen1 : toContinue = true) : newY = newY + offset);
                    break;
            }
            // If we can't repeat and the candidate cell is the last visited cell, continue
            if (level.isExitPoint(newX, newY))
                return [newX, newY];
            // If we can't repeat and the candidate cell is the last visited cell, continue
            if ((withNoRepeat && lastX == newX && lastY == newY) || toContinue) {
                continue;
            }
            // If the cell is occupied by another agent, don't allow this agent to move there
            if (World.settings.agentsOwnTilesExclusively && level.isPositionOccupiedByAgent(newX, newY)) {
                // Wait till the other agent has moved - don't backtrack if no other cells are available
                waitOnCurrentCell = true;
                continue;
            }
            // If the cell is occupied by a resource, don't allow the agent to move there
            if ((World.settings.resourcesOwnTilesExclusively || level.resourcesOwnTilesExclusively) && level.isPositionOccupiedByResource(newX, newY)) {
                continue;
            }
            // If the candidate cell is valid (part of the path), add it
            if (level.getCell(newX, newY) == undefined) {
                return ([newX, newY]);
            }
        }
        return [x, y];
    }



}).apply(Capabilities.MoveRandomlyCapability);


Capabilities.MoveTowardsNearestExitCapability = {};
(function() {
    this.exercise = function(agent, level) {
        // TODO: Make these parameters of the level

        var options = options || {};
        var withNoRepeat = options ? options["withNoRepeat"] : false;
        var withNoCollision = options ? options["withNoCollision"] : false;
        var withOffscreenCycling = options ? options["withOffscreenCycling"] : false;

        var position = this.findPositionForNearestExit(agent, level, withNoRepeat, withNoCollision, withOffscreenCycling)

        // Set the position and add the move to the agent's memory
        agent.moveTo(position[0], position[1]);
    };


    /**
     * @param level
     * @param withNoRepeat
     * @param withNoCollision
     * @param withOffscreenCycling
     */
    this.findPositionForNearestExit = function(agent, level, withNoRepeat, withNoCollision, withOffscreenCycling) {
        var ret = this.criticalPath(level, agent.x, agent.y);
        var trail = ret.trail;
        return (trail.length > 1 ? trail[1] : trail[0]);
    };


    this.MAX_DEPTH = 1000;

    /**
     * Find the critical path to the nearest exit point
     */
    this.criticalPath = function(level, x, y, h) {
        var horizontal = h || true;

        var shortestDistance = -1, shortistTrail;
        for (var i in level.exitPoints) {
            var ep = level.exitPoints[i];
            var tx = ep[0], ty = ep[1];
            var result = this.criticalPathToExitPoint(level, x, y, tx, ty);
            var distance = result.length;
            if (shortestDistance == -1 ||  distance < shortestDistance) {
                shortestDistance = distance;
                shortistTrail = result;
            }
        }
        return { res: shortistTrail.length, trail: shortistTrail};
    };


    this.criticalPathToExitPoint = function(level, sx, sy, ex, ey) {
        var cell = [sx, sy], goal = [ex, ey];
        var history = [];
        var trails = {};
        var depth = 0;
        history.push(cell);
        trails[sy * level.cellsAcross + sx] = [cell];
        var candidates = [];
        candidates.push(cell);
        while (depth++ < this.MAX_DEPTH) {
            var newCandidates = [];
            for (var i in candidates) {
                var candidate = candidates[i];
                var x = candidate[0], y = candidate[1];
                if (level.isSameCell(candidate, goal)) {
                    return trails[y * level.cellsAcross + x];
                }
                var directions = this.getDirections(candidate, goal);
                for (var j = 0; j < directions.length; j++) {
                    var nx = x, ny = y;
                    switch(directions[j]) {
                        case 0:
                            nx++;
                            break;
                        case 1:
                            ny++;
                            break;
                        case 2:
                            nx--;
                            break;
                        case 3:
                            ny--;
                            break;
                    }
                    var newCell = [nx, ny];
                    if (nx < 0 || nx >= level.cellsAcross || ny < 0 || ny >= level.cellsDown)
                        continue;
                    if (!level.isCell(newCell))
                        continue;
                    if (level.isInHistory(newCell, history))
                        continue;
                    // Exclude cells occupied exclusively by resources
                    if ((World.settings.resourcesOwnTilesExclusively || level.resourcesOwnTilesExclusively) && level.isPositionOccupiedByResource(nx, ny))
                        continue;

                    newCandidates.push(newCell);
                    history.push(newCell)

                    var candidateKey = y * level.cellsAcross + x;
                    var candidateTrail = trails[candidateKey]
                    var newCandidateKey = ny * level.cellsAcross + nx;
                    var newCandidateTrail = []
                    for (var k in candidateTrail) {
                        newCandidateTrail.push(candidateTrail[k]);
                    }
                    newCandidateTrail.push(newCell);
                    trails[newCandidateKey] = newCandidateTrail;
                }
            }
            candidates = [];
            for (var i in newCandidates) {
                candidates.push(newCandidates[i]);
            }
        }

    };

    this.getDirections = function (cell, goal){
        var x = cell[0], y = cell[1];
        var gx = goal[0], gy = goal[1];
        var dx = gx - x, dy = gy - y;
        var directions = [];
        if (Math.abs(dx) < Math.abs(dy)) {
            if (dx < 0)
                directions = (dy < 0) ? [2, 3, 1, 0] : [2, 1, 3, 0];
            else
                directions = (dy < 0) ? [0, 3, 1, 2] : [0, 1, 3, 2];
        }
        else {
            if (dy < 0)
                directions = (dx < 0) ? [3, 2, 0, 1] : [3, 0, 2, 1];
            else
                directions = (dx < 0) ? [1, 2, 0, 3] : [1, 0, 2, 3];
        }
        return directions;
    };

}).apply(Capabilities.MoveTowardsNearestExitCapability);


Capabilities.MoveWithMemoryCapability = {};
(function() {
    this.exercise = function(agent, level) {
        // TODO: Make these parameters of the level

        var options = options || {};
        var withNoRepeat = options ? options["withNoRepeat"] : false;
        var withNoCollision = options ? options["withNoCollision"] : false;
        var withOffscreenCycling = options ? options["withOffscreenCycling"] : false;

        var position = this.findPositionWithFreeNavigation(agent, level, withNoRepeat, withNoCollision, withOffscreenCycling)

        // Set the position and add the move to the agent's memory
        agent.moveTo(position[0], position[1]);
    };


    /**
     <div>
     Uses a series of heuristics to find an available adjacent cell to move to:
     </div>

     <div>
     <ol>
     <li>Find all adjacent candidate (non-tile) cells, excluding the last visited cell. The order of the candidate
     cells (which maximally include the cells immediately above, right, below and left to the current cell) is randomised,
     to ensure no prejudice in the selected direction, all else being equal.</li>
     <li>If the previously visited cell is the only viable alternative, i.e. there are no candidates, move to that cell.
     <li>If one of the candidate (non-tile) cells is an exit point, move to that cell.</li>
     <li>Create a refined candidate list based on whether any cells have not yet been visited by this agent.
     If the 'level.agentsCanCommunicate' property is true, then the memories of other agents met by this agent (AS AT THE TIME THEY MET)
     are also shared. (Hereafter, when this property is true, additional conditions are included in square brackets).</li>
     <li>The refined candidate list, including just those cells not in this [or other met] agent's memory is then searched.
     If any of these candidates in turn have a neighbouring resource, then the first of those candidates is selected.
     Otherwise the first of the whole refined candidate list is returned.</li>
     <li>If no match has been found so far, then the *unrefined* candidate list is re-processed.
     The last visited cell is added back to the list.</li>
     <li>The memories of these candidates of this agent [and of other met agents] are compiled into a new list.</li>
     <li>For each candidate, the memory list is then iterated through.
     For each memory, the most recent visit to the memorised cell is then compared with the *age* of all memories of *unvisited* cells
     of this agent [and of other met agents].
     The candidate with the shortest distance between this agent's [or a met agent's] memory of it and its memory of an unvisited cell
     is then selected. [If other agents' memory paths are shorter than this agent's, their candidate is preferred].</li>
     <li>If no candidate cells have a shortest distance to an unvisited cell for this agent [or any other met agent],
     the first candidate cell is selected.</li>
     </ol>
     </div>
     *
     * @param level
     * @param withNoRepeat
     * @param withNoCollision
     * @param withOffscreenCycling
     */
    this.findPositionWithFreeNavigation = function(agent, level, withNoRepeat, withNoCollision, withOffscreenCycling) {
        var x = agent.x, y = agent.y;
        var newX = x, newY = y;
        var lastX = agent.lastMemory.x, lastY = agent.lastMemory.y;
        var candidateCells = [];
        var directions = Capabilities.MoveUtilities.randomDirectionOrder();
        var waitOnCurrentCell = false;
        for (var i = 0; i < directions.length; i++) {
            newX = x, newY = y;
            var dir = directions[i];

            var offscreenLeft = 0, offscreenTop = 0;
            var offScreenWidth = level.cellsAcross - 1, offScreenHeight = level.cellsDown - 1;
            var offset = 1;
            var toContinue = false;
            switch (dir) {
                case 0:
                    (x == offscreenLeft ? (withOffscreenCycling ? newX = offScreenWidth : toContinue = true) : newX = newX - offset);
                    break;
                case 1:
                    (x == offScreenWidth ? (withOffscreenCycling ? newX = offscreenTop : toContinue = true) : newX = newX + offset);
                    break;
                case 2:
                    (y == offscreenTop ? (withOffscreenCycling ? newY = offScreenHeight : toContinue = true) : newY = newY - offset);
                    break;
                case 3:
                    (y == offScreenHeight ? (withOffscreenCycling ? newY = offscreenTop : toContinue = true) : newY = newY + offset);
                    break;
            }
            // If we can't repeat and the candidate cell is the last visited cell, continue
            if (level.isExitPoint(newX, newY))
                return [newX, newY];

            // If we can't repeat and the candidate cell is the last visited cell, continue
            if ((withNoRepeat && lastX == newX && lastY == newY) || toContinue) {
                continue;
            }
            // If the cell is occupied by another agent, don't allow this agent to move there
            if (World.settings.agentsOwnTilesExclusively && level.isPositionOccupiedByAgent(newX, newY)) {
                // Wait till the other agent has moved - don't backtrack if no other cells are available
                waitOnCurrentCell = true;
                continue;
            }
            // If the cell is occupied by a resource, don't allow the agent to move there
            if ((World.settings.resourcesOwnTilesExclusively || level.resourcesOwnTilesExclusively) && level.isPositionOccupiedByResource(newX, newY)) {
                continue;
            }
            // If the candidate cell is valid (part of the path), add it
            if (level.getCell(newX, newY) == undefined) {
                candidateCells.push([newX, newY]);
            }
        }

        // Allow for back-tracking, if there is no way forward
        if (candidateCells.length == 0) {
            if (waitOnCurrentCell)
                return [x, y];
            else
                return [lastX, lastY];
        }


        // Here try to see if any agents encountered have zero unvisited cells in their memory, that the current agent also does not have in *its* memory.
        // If not, backtrack


        // Find the first candidate which is either the goal, or not in the history.
        var candidatesNotInHistory = [];
        for (var i = 0; i < candidateCells.length; i++) {
            var candidate = candidateCells[i];

            if (agent.memoriesOfPlacesVisited[candidate] == undefined) {
                var placeVisitedByOtherAgents = false;
                if (agent.canCommunicateWithOtherAgents) {
                    for (var agentID in agent.memoriesOfPlacesVisitedByOtherAgents) {
                        var agentMemoryOfPlacesVisited = agent.memoriesOfPlacesVisitedByOtherAgents[agentID];
                        if (agentMemoryOfPlacesVisited[candidate] != undefined) {
                            placeVisitedByOtherAgents = true;
                        }
                    }
                }
                if (!placeVisitedByOtherAgents) {
                    candidatesNotInHistory.push(candidate);
                }
            }
        }

        // Try to find a neighbouring resource, if it exists
        if (candidatesNotInHistory.length > 0) {
            var bestCandidate = candidatesNotInHistory[0];
            for (var i = 0; i < candidatesNotInHistory.length; i++) {
                var candidate = candidatesNotInHistory[i];
                var neighbour = agent.hasNeighbouringResources(level, candidate[0], candidate[1]);
                if (neighbour != null) {
                    bestCandidate = candidate;
                    break;
                }
            }
            return bestCandidate;
        }


        // But first add back the last visited cell as a candidate - it might be the best option
        if (x != lastX || y != lastY)
            candidateCells.push([lastX, lastY]);
        if (candidateCells.length > 1) {
            // Try to head in a direction where an unvisited tile can be found

            var shortestAgeDifference = -1;
            var bestCandidate = null;

            var shortestAgeDifferenceForThisAgent = -1;
            var bestCandidateForThisAgent = null;

            // Merge all visited places in memory - expensive, but saves later loops
            var allPlacesVisited = [];
            for (var key in agent.memoriesOfPlacesVisited) {
                var memory = agent.memoriesOfPlacesVisited[key];
                allPlacesVisited[key] = memory;
            }
            if (agent.canCommunicateWithOtherAgents) {
                for (var key in this.memoriesOfPlacesVisitedByOtherAgents) {
                    var x = agent.memoriesOfPlacesVisitedByOtherAgents[key];
                    for (var y in x) {
                        var z = x[y];
                        allPlacesVisited[y] = z;
                    }
                }
            }


            // If we get here, we need to search all candidate cells.
            for (var i = 0; i < candidateCells.length; i++) {
                var candidate = candidateCells[i];
                var mostRecentMemoryOfCandidate = agent.memoriesOfPlacesVisited[candidate];
                var shortestAgeDifferenceToCandidate = -1;
                var shortestAgeDifferenceToCandidateForThisAgent = -1;
                var counter = 0;
                if (mostRecentMemoryOfCandidate != undefined) {
                    var age = mostRecentMemoryOfCandidate.age;
                    var mostRecentVisit = mostRecentMemoryOfCandidate.mostRecentVisit;

                    for (var j in agent.memoriesOfPathsUntried) {
                        var unvisited = agent.memoriesOfPathsUntried[j];

                        if (unvisited != undefined) {

                            // Fixes bug with endless back-and-forth cycle, due to proximity of unvisited (and unvisitable) resource cells
                            if ((World.settings.resourcesOwnTilesExclusively || level.resourcesOwnTilesExclusively) && level.isPositionOccupiedByResource(unvisited.x, unvisited.y))
                                continue;

                            var inOtherAgentsMemory = false;
                            if (agent.canCommunicateWithOtherAgents) {
                                for (var agentID in agent.memoriesOfPlacesVisitedByOtherAgents) {
                                    var agentMemoryOfPlacesVisited = agent.memoriesOfPlacesVisitedByOtherAgents[agentID];
                                    if (agentMemoryOfPlacesVisited[j] != undefined) {
                                        inOtherAgentsMemory = true;
                                        break;
                                    }
                                }
                            }
                            var unvisitedAge = unvisited.age;
                            var diff = Math.abs(mostRecentVisit - unvisitedAge);
//                        var diff = Math.abs(age - unvisitedAge);
                            if (shortestAgeDifferenceToCandidateForThisAgent == -1 || diff < shortestAgeDifferenceToCandidateForThisAgent) {
                                shortestAgeDifferenceToCandidateForThisAgent = diff;
                            }
                            if (! inOtherAgentsMemory) {
                                if (shortestAgeDifferenceToCandidate == -1 || diff < shortestAgeDifferenceToCandidate) {
                                    shortestAgeDifferenceToCandidate = diff;
                                }
                            }
                        }
                        counter++;
                    }
                }
                if (agent.canCommunicateWithOtherAgents) {
                    for (var agentID in agent.memoriesOfPlacesVisitedByOtherAgents) {
                        var agentMemoryOfPlacesVisited = agent.memoriesOfPlacesVisitedByOtherAgents[agentID];
                        var agentMemoryOfPathsUntried = agent.memoriesOfPathsUntriedByOtherAgents[agentID];
                        if (agentMemoryOfPathsUntried != undefined && agentMemoryOfPlacesVisited != undefined && agentMemoryOfPlacesVisited[candidate] != undefined) {

                            var mostRecentMemoryOfCandidateByAgent = agentMemoryOfPlacesVisited[candidate];

                            var ageOfOtherAgentMemory = mostRecentMemoryOfCandidateByAgent.age;

                            for (var j in agentMemoryOfPathsUntried) {
                                var agentUnvisitedMemory = agentMemoryOfPathsUntried[j];

                                // Fixes bug with endless back-and-forth cycle, due to proximity of unvisited (and unvisitable) resource cells
                                if ((World.settings.resourcesOwnTilesExclusively || level.resourcesOwnTilesExclusively) && level.isPositionOccupiedByResource(agentUnvisitedMemory.x, agentUnvisitedMemory.y))
                                    continue;

                                if (allPlacesVisited[j] == undefined) {
                                    var unvisitedAge = agentUnvisitedMemory.age;
                                    var diff = Math.abs(ageOfOtherAgentMemory - unvisitedAge);

                                    if (shortestAgeDifferenceToCandidate == -1 || diff < shortestAgeDifferenceToCandidate) {
                                        if (mostRecentMemoryOfCandidate != undefined) {
                                            // Assume if this candidate has been more recently visited, and has been visited several times, it is not a good candidate
                                            var mostRecentVisit = mostRecentMemoryOfCandidate.mostRecentVisit;
                                            var numberOfVisits = mostRecentMemoryOfCandidate.visits;
                                            if (mostRecentVisit > ageOfOtherAgentMemory && numberOfVisits > 3)
                                                continue;
                                        }
                                        shortestAgeDifferenceToCandidate = diff;
                                    }
                                }
                            }
                        }
                    }
                }


                //
                if (shortestAgeDifferenceToCandidateForThisAgent > -1 && (shortestAgeDifferenceForThisAgent == -1 || shortestAgeDifferenceToCandidateForThisAgent < shortestAgeDifferenceForThisAgent)) {
                    shortestAgeDifferenceForThisAgent = shortestAgeDifferenceToCandidateForThisAgent;
                    bestCandidateForThisAgent = candidate;
                }
                if (shortestAgeDifferenceToCandidate > -1 && (shortestAgeDifference == -1 || shortestAgeDifferenceToCandidate < shortestAgeDifference)) {
                    shortestAgeDifference = shortestAgeDifferenceToCandidate;
                    bestCandidate = candidate;
                }
                if (bestCandidate == undefined && bestCandidateForThisAgent != undefined) {
                    bestCandidate = bestCandidateForThisAgent;
                }
            }

            // Try any unvisited cells at this point
            if (bestCandidate == undefined) {
                // Try any unvisited cells at this point
                for (var i = 0; i < candidateCells.length; i++) {
                    var candidate = candidateCells[i];
                    if (agent.memoriesOfPathsUntried[candidate] != undefined) {
                        bestCandidate = candidate;
                        break;
                    }
                }
            }


            // Now try the best candidate for this agent
            if (bestCandidate == undefined) {
                if (bestCandidateForThisAgent != undefined) {
                    bestCandidate = bestCandidateForThisAgent;
                }
//            else {
//                bestCandidate = candidateCells[0];
//
//            }
            }

            // Now try the best candidate based
            if (bestCandidate == undefined) {
                // Try any unvisited cells at this point
                for (var k = 0; k < candidateCells.length; k++) {
                    var resourceCandidate = candidateCells[k];
                    var neighbourResource = agent.hasNeighbouringResources(level, resourceCandidate[0], resourceCandidate[1]);
                    if (neighbourResource != null) {
                        bestCandidate = resourceCandidate;
                        break;
                    }
                }
            }

            if (bestCandidate == undefined) {
                bestCandidate = candidateCells[0];
            }


            // Now try the oldest candidate
            // TODO: Revisit this logic
            /*
             if (shortestAgeDifference == -1) {
             var ageInMemory = -1;
             for (var i = 1; i < candidateCells.length; i++) {
             var candidate = candidateCells[i];

             var mostRecentMemoryOfCandidate = this.memoriesOfPlacesVisited[candidate];

             if (mostRecentMemoryOfCandidate != undefined && (ageInMemory == -1 || mostRecentMemoryOfCandidate.age < ageInMemory)) {
             ageInMemory = mostRecentMemoryOfCandidate;
             bestCandidate = candidate;
             }
             }
             }
             */

            // Return the best candidate we can find
            return bestCandidate;
        }

        // Use the first candidate cell if we get through to here
        return candidateCells[0];
    };


}).apply(Capabilities.MoveWithMemoryCapability);

if (typeof(exports) != "undefined")
    exports.Capabilities = Capabilities;

