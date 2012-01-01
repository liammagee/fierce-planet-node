/*!
 * Fierce Planet - Capabilities
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var Plans = Plans || {};



(function() {

    /**
     * @param level
     * @param withNoRepeat
     * @param withNoCollision
     * @param withOffscreenCycling
     */
    this.findPositionForNearestExit = function(agent, level) {
        var ret = this.getAllPlans(agent, level, agent.x, agent.y);
        var trail = ret.trail;
        return (trail.length > 1 ? trail[1] : trail[0]);
    };


    this.MAX_DEPTH = 1000;


    /**
     * Find the critical path to the nearest exit point
     */
    this.getAllPlans = function(agent, level, points, h) {
        var horizontal = h || true, shortestDistance = -1, shortistTrail, point, x = agent.x, y = agent.y, paths = [];
        for (var i = 0, l = points.length; i < l; i++) {
            var ep = points[i];
            var tx = ep[0], ty = ep[1];
            var result = this.criticalPathToPoint(agent, level, x, y, tx, ty);
            var distance = result.length;
            if (shortestDistance == -1 ||  distance < shortestDistance) {
                shortestDistance = distance;
                shortistTrail = result;
                point = ep;
            }
            paths.push({ distance: distance, trail: result, point: ep}) ;
        }
        return paths;
    };

    /**
     * Find the critical path to the nearest exit point
     */
    this.getBestPlans = function(agent, level, points, h) {
        var plans = this.getAllPlans(agent, level, points, h),
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


    this.criticalPathToPoint = function(agent, level, sx, sy, ex, ey) {
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
            for (var i = 0, l = candidates.length; i < l; i++) {
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

                    // Main difference from capability - ignore if this cell has not been visited
                    if ( typeof(agent.memoriesOfPlacesVisited[newCell]) === 'undefined' &&
                        typeof(agent.memoriesOfPlacesVisitedByOtherAgents[newCell]) === 'undefined' &&
                        typeof(agent.memoriesOfPathsUntried[newCell]) === 'undefined' &&
                        typeof(agent.memoriesOfPathsUntriedByOtherAgents[newCell]) === 'undefined'
                        )
                        continue;


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
                    for (var k = 0, len = candidateTrail.length; k < len; k++) {
                        newCandidateTrail.push(candidateTrail[k]);
                    }
//                    for (var k in candidateTrail) {
//                        newCandidateTrail.push(candidateTrail[k]);
//                    }
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


if (typeof(exports) != "undefined")
    exports.Plans = Plans;

