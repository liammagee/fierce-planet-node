/*!
 * Fierce Planet - Capabilities
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var Plans = Plans || {};



(function() {

    /**
     * @param world
     * @param withNoRepeat
     * @param withNoCollision
     * @param withOffscreenCycling
     */
    this.findPositionForNearestExit = function(agent, world) {
        var ret = this.getAllPlans(agent, world, agent.x, agent.y);
        var trail = ret.trail;
        return (trail.length > 1 ? trail[1] : trail[0]);
    };


    this.MAX_DEPTH = 1000;


    /**
     * Find the critical path to the nearest exit point
     */
    this.getAllPlans = function(agent, world, points, h) {
        var horizontal = h || true, shortestDistance = -1, shortistTrail, point, x = agent.x, y = agent.y, paths = [];
        for (var i = 0, l = points.length; i < l; i++) {
            var ep = points[i];
            var tx = ep[0], ty = ep[1];
            var result = this.criticalPathToPoint(agent, world, x, y, tx, ty);
            if (!_.isUndefined(result)) {
                var distance = result.length;
                paths.push({ distance: distance, trail: result, point: ep}) ;
            }
        }
        return paths;
    };

    /**
     * Find the critical path to the nearest exit point
     */
    this.getBestPlans = function(agent, world, points, h) {
        var plans = this.getAllPlans(agent, world, points, h),
            bestPlans = [],
            shortestPlan = -1;

        for (var i = 0; i < plans.length; i++) {
            var plan = plans[i];
            if (shortestPlan == -1 || plan.distance < shortestPlan)
                shortestPlan = plan.distance;
        }
        for (var i = 0; i < plans.length; i++) {
            var plan = plans[i];
            if (plan.distance == shortestPlan)
                bestPlans.push(plan);
        }


        return bestPlans;
    };


    this.criticalPathToPoint = function(agent, world, sx, sy, ex, ey) {
        var cell = [sx, sy], goal = [ex, ey];
        var history = [];
        var trails = {};
        var depth = 0;
        history.push(cell);
        trails[sy * world.cellsAcross + sx] = [cell];
        var candidates = [];
        candidates.push(cell);
        while (depth++ < this.MAX_DEPTH) {
            var newCandidates = [];
            for (var i = 0, l = candidates.length; i < l; i++) {
                var candidate = candidates[i];
                var x = candidate[0], y = candidate[1];
                if (world.isSameCell(candidate, goal)) {
                    return trails[y * world.cellsAcross + x];
                }
                var directions = this.getDirections(candidate, goal);
                for (var j = 0; j < directions.length; j++) {
                    var nx = x, ny = y;
                    switch(directions[j]) {
                        case 0:
                            nx = (x == world.cellsAcross - 1 && world.allowOffscreenCycling) ? 0 : nx + 1;
                            break;
                        case 1:
                            ny = (y == world.cellsDown - 1 && world.allowOffscreenCycling) ? 0 : ny + 1;
                            break;
                        case 2:
                            nx = (x == 0 && world.allowOffscreenCycling) ? world.cellsAcross - 1 : nx - 1;
                            break;
                        case 3:
                            ny = (y == 0 && world.allowOffscreenCycling) ? world.cellsDown - 1 : ny - 1;
                            break;
                    }
                    var newCell = [nx, ny];

                    // Main difference from capability - ignore if this cell has not been visited or viewed by this agent (or an agent it has met)
                    var memoryNotFound = true;

                    if (!_.isUndefined(agent.memoriesOfPlacesVisited[newCell]) ||
                        !_.isUndefined(agent.memoriesOfPathsUntried[newCell]))
                        memoryNotFound = false;
                    // Check if other agents' memories contain this cell
                    if (memoryNotFound) {
                        if (!_.isUndefined(agent.memoriesOfPlacesVisitedByOtherAgents)) {
                            for (var k in agent.memoriesOfPlacesVisitedByOtherAgents) {
                                if (agent.memoriesOfPlacesVisitedByOtherAgents.hasOwnProperty(k)) {
                                    var otherAgentsMemories = agent.memoriesOfPlacesVisitedByOtherAgents[k];
                                    if (!_.isUndefined(otherAgentsMemories[newCell]))
                                        memoryNotFound = false;
                                }
                            }
                        }
                        if (!_.isUndefined(agent.memoriesOfPathsUntriedByOtherAgents)) {
                            for (var k in agent.memoriesOfPathsUntriedByOtherAgents) {
                                if (agent.memoriesOfPathsUntriedByOtherAgents.hasOwnProperty(k)) {
                                    var otherAgentsMemories = agent.memoriesOfPathsUntriedByOtherAgents[k];
                                    if (!_.isUndefined(otherAgentsMemories[newCell]))
                                        memoryNotFound = false;
                                }
                            }
                        }
                    }
                    if (memoryNotFound)
                        continue;


                    if (nx < 0 || nx >= world.cellsAcross || ny < 0 || ny >= world.cellsDown)
                        continue;
                    if (!world.areAgentsAllowed(newCell[0], newCell[1]))
                        continue;
                    if (world.isInHistory(newCell, history))
                        continue;
                    // Exclude cells occupied exclusively by resources
                    if ((Universe.settings.resourcesOwnTilesExclusively || world.resourcesOwnTilesExclusively) && world.isPositionOccupiedByResource(nx, ny))
                        continue;

                    newCandidates.push(newCell);
                    history.push(newCell)

                    var candidateKey = y * world.cellsAcross + x;
                    var candidateTrail = trails[candidateKey]
                    var newCandidateKey = ny * world.cellsAcross + nx;
                    var newCandidateTrail = []
                    for (var k = 0, len = candidateTrail.length; k < len; k++) {
                        newCandidateTrail.push(candidateTrail[k]);
                    }
                    newCandidateTrail.push(newCell);
                    trails[newCandidateKey] = newCandidateTrail;
                }
            }
            candidates = [];
            for (var i = 0, l = newCandidates.length; i < l; i++) {
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

}).apply(Plans);


if (typeof exports !== "undefined")
    exports.Plans = Plans;

