/*!
 * Fierce Planet - Tile
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */

/**
 * Tile constants
 */
var DEFAULT_TILE_COLOR = "0FFF1F";

/**
 * Tile class definition
 * @constructor
 */
function Tile(color, x, y) {
    this.color = color || DEFAULT_TILE_COLOR;
    this.x = x || 0;
    this.y = y || 0;
    this.terrain = Terrain.DEFAULT_TERRAIN;
}
Tile.prototype.getPosition = function() { return [this.x, this.y]; };
Tile.prototype.moveTo = function(x, y) { this.x = x; this.y = y; };

if (typeof exports !== "undefined") {
    exports.DEFAULT_TILE_COLOR = DEFAULT_TILE_COLOR;
    exports.Tile = Tile;
}
