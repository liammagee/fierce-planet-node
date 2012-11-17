/*!
 * Fierce Planet - Cell
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */

/**
 * Cell class definition
 * @constructor
 */
function Cell(x, y) {
    this.x = x, this.y = y;
    this.agents = [];
    this.resources = [];
    this.terrain = Terrain.DEFAULT_TERRAIN;
    this.agentsAllowed = true;
    this.resourcesAllowed = false;
    this.isEntryPoint = false;
    this.isExitPoint = false;
}

if (typeof exports !== "undefined")
    exports.Cell = Cell;
