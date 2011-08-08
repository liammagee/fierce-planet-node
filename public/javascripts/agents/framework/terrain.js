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

/**
 * Tile class definition
 * @constructor
 */
function Terrain(color) {
    this.color = color || DEFAULT_TERRAIN_COLOR;
}
Terrain.DEFAULT_TERRAIN = new Terrain(DEFAULT_TERRAIN_COLOR);