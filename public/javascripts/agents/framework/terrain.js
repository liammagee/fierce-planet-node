/*!
 * Fierce Planet - Terrain
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */

/**
 * Terrain constants
 */
var DEFAULT_TERRAIN_COLOR = "0FFF1F";
var DEFAULT_TERRAIN_ALPHA = 1.0;

/**
 * Tile class definition
 * @constructor
 */
function Terrain(color, alpha) {
    this.color = color || DEFAULT_TERRAIN_COLOR;
    this.alpha = alpha || DEFAULT_TERRAIN_ALPHA;
}
Terrain.DEFAULT_TERRAIN = new Terrain(DEFAULT_TERRAIN_COLOR);

if (typeof(exports) != "undefined") {
    exports.DEFAULT_TERRAIN_COLOR = DEFAULT_TERRAIN_COLOR;
    exports.DEFAULT_TERRAIN_ALPHA = DEFAULT_TERRAIN_ALPHA;
    exports.Terrain = Terrain;
}
