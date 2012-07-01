/*!
 * Fierce Planet - Terrain
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */

/**
 * Terrain constants
 */
var DEFAULT_TERRAIN_COLOR = "#0FFF1F";
var DEFAULT_TERRAIN_ALPHA = 0.0;

/**
 * Tile class definition
 * @constructor
 */
function Terrain(color) {
    if (!_.isUndefined(color.cssa)) {
        this.color = color.cssa();
    }
    else {
        this.color = color || DEFAULT_TERRAIN_COLOR;
    }
}
Terrain.DEFAULT_TERRAIN = new Terrain(one.color(DEFAULT_TERRAIN_COLOR).alpha(DEFAULT_TERRAIN_ALPHA));

if (typeof exports !== "undefined") {
    exports.DEFAULT_TERRAIN_COLOR = DEFAULT_TERRAIN_COLOR;
    exports.DEFAULT_TERRAIN_ALPHA = DEFAULT_TERRAIN_ALPHA;
    exports.Terrain = Terrain;
}
