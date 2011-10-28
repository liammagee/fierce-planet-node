
/**
 * Module dependencies.
 */

    /*
var directions = [0, 1, 3, 2];
for (var i = 0; i < directions.length; i++) {
    var dir = directions[i];
    if (i < 8)
        directions.push(directions[i]);
    console.log(i);
}
*/

var WS = 10;
var COUNTER = 0;
var cells = [];
for (var i = 0; i < WS; i++) {
    for (var j = 0; j < WS; j++) {
        cells.push([i, j]);

    }
}


delete cells[64];
delete cells[63];
delete cells[53];
delete cells[48];
delete cells[47];
delete cells[43];
delete cells[36];
delete cells[35];
delete cells[34];
delete cells[33];


var start = [5, 5]
var gx = 2, gy = 2
var goal = [gx, gy]

var history = []

function meanDistance(cell){
    var x = cell[0], y = cell[1];
    return Math.abs(gx - x) + Math.abs(gy - y);
}
function isSameCell(c1, c2){
    return (c1 && c2 && c1[0] == c2[0] && c1[1] == c2[1])
}
function isCell(cell){
    for (var i in cells) {
        var testCell = cells[i]
        if (isSameCell(cell, testCell))
            return true;
    }
    return false;
}
function isInHistory(cell){
    for (var i in history) {
        var testCell = history[i]
        if (isSameCell(cell, testCell))
            return true;
    }
    return false;
}
function getDirections(cell){
    var x = cell[0], y = cell[1];
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
}
function evalCell(cell, existingDistances, trail){
    COUNTER++;
    distances = distances || [];
    trail = trail || [];
    history.push(cell)
    if (isSameCell(cell, goal)) {
        trail.push(cell);
        return cell;
    }
    var x = cell[0], y = cell[1];
    var directions = getDirections(cell);
    var candidates = [], distances = [];
    for (var i = 0; i < directions.length; i++) {
        var nx = x, ny = y;
        switch(directions[i]) {
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
        var newCell = [nx, ny]
        if (nx < 0 || nx >= WS || ny < 0 || ny >= WS)
            continue;
        if (!isCell(newCell))
            continue;
        if (isInHistory(newCell))
            continue;
        candidates.push(newCell);
        distances.push(meanDistance(newCell));
    }
    for (var i in candidates) {
        var candidate = candidates[i]
        console.log(distances[i]+":"+candidate)
        var ret = evalCell(candidate, distances, trail)
        if (isSameCell(ret, goal)) {
            trail.push(ret);
            return ret;
        }
    }
    return undefined;
}
var res = evalCell(start);
console.log(res)
console.log(COUNTER)
