/*!
 * Fierce Planet - Params
 * Declares game parameters
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */




var FiercePlanet = FiercePlanet || {};
FiercePlanet.Framework = FiercePlanet.Framework || {};
FiercePlanet.Framework.MazeStrategies = FiercePlanet.Framework.MazeStrategies || {};

(function() {
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


}).apply(FiercePlanet.Framework.MazeStrategies);

if (typeof(exports) != "undefined") {
    exports.FiercePlanet = FiercePlanet;
    exports.FiercePlanet.Framework = FiercePlanet.Framework;
    exports.FiercePlanet.Framework.MazeStrategies = FiercePlanet.Framework.MazeStrategies;

}
