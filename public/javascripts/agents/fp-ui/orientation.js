/*!
 * Fierce Planet - Drawing
 * Functions for drawing aspects of the game
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var FiercePlanet = FiercePlanet || {};


/**
 * @namespace Contains orientation properties and methods
 */
FiercePlanet.Orientation = FiercePlanet.Orientation || {};

(function() {
    // Adapted from Danko Kozar, http://www.flashperfection.com/tutorials/Isometric-Transformations-15818.html

    this.DEFAULT_WORLD_WIDTH = 480;
    this.DEFAULT_WORLD_HEIGHT = 400;

    this.DEFAULT_ROTATION_ANGLE = 0;
    // "0.46365 (radians) - it's a “classic” 1:2 isometric angle which lays up perfectly into pixel grid of the computer screen. "
    this.DEFAULT_PERSPECTIVE_ANGLE = 0.46365;
//    this.DEFAULT_PERSPECTIVE_ANGLE = 0.3;

    this.worldWidth = this.DEFAULT_WORLD_WIDTH;
    this.worldHeight = this.DEFAULT_WORLD_HEIGHT;
    this.halfWorldWidth = this.worldWidth / 2;
    this.halfWorldHeight = this.worldHeight / 2;
    this.cellsAcross = 14;
    this.cellsDown = 11;
    this.cellWidth = 0;
    this.cellHeight = 0;
    this.pieceWidth = 0;
    this.pieceHeight = 0;

    this.reset = function() {
        this.offsetX = 0;
        this.offsetY = 0;

        this.zoomLevel = 1;
        this.externalZoomLevel = 1;
        this.zoomMagnificationFactor = 1.5;

        this.rotationAngle = this.DEFAULT_ROTATION_ANGLE;
        this.perspectiveAngle = this.DEFAULT_PERSPECTIVE_ANGLE;
    };

    this.recalibrateParameters = function() {
        this.halfWorldWidth = this.worldWidth / 2;
        this.halfWorldHeight = this.worldHeight / 2;
        this.cellWidth = FiercePlanet.Orientation.worldWidth / FiercePlanet.cellsAcross;
        this.cellHeight = FiercePlanet.Orientation.worldHeight / FiercePlanet.cellsDown;
        this.pieceWidth = this.cellWidth * 0.5;
        this.pieceHeight = this.cellHeight * 0.5;
    };

    this.getRotationOffset = function(x, y) {
        var midX = FiercePlanet.Orientation.halfWorldWidth;
        var midY = FiercePlanet.Orientation.halfWorldHeight;
        var xCenter = x - midX;
        var yCenter = y - midY;
        var hypotenuse = Math.sqrt(Math.pow(xCenter, 2) + Math.pow(yCenter, 2));
        var d1 = Math.atan2(yCenter, xCenter);
        var d2 = d1 - FiercePlanet.Orientation.rotationAngle;
        var newX = midX + Math.cos(d2) * hypotenuse;
        var newY = midY + Math.sin(d2) * hypotenuse;
        return {x: newX, y: newY};
    };

    this.reset();



}).apply(FiercePlanet.Orientation);
