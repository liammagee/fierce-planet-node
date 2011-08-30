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

        this.adjustParameters(this.DEFAULT_WORLD_WIDTH, this.DEFAULT_WORLD_HEIGHT);
    };

    this.recalibrateParameters = function() {
        this.halfWorldWidth = this.worldWidth / 2;
        this.halfWorldHeight = this.worldHeight / 2;
        this.cellWidth = FiercePlanet.Orientation.worldWidth / FiercePlanet.cellsAcross;
        this.cellHeight = FiercePlanet.Orientation.worldHeight / FiercePlanet.cellsDown;
        this.pieceWidth = this.cellWidth * 0.5;
        this.pieceHeight = this.cellHeight * 0.5;
    };


    this.adjustParameters = function(width, height) {
        try {
            this.worldWidth = parseInt(width);
            this.worldHeight = parseInt(height);
        }
        catch (e) {
            // Likely to be incorrect formatting
            Log.warn(e);
        }
        this.resizeWorld();
        this.recalibrateParameters();
    };

    this.resizeWorld = function() {
        try {
            var canvases = $('#world, #imageCanvas, #map_canvas, #baseCanvas, #noticeCanvas, #agentCanvas, #resourceCanvas, #scrollingCanvas');
            //, #alt_map_canvas
            $('#map_canvas')[0].width = this.worldWidth;
            $('#map_canvas')[0].height = this.worldHeight;
            $('#baseCanvas')[0].width = this.worldWidth;
            $('#baseCanvas')[0].height = this.worldHeight;
            $('#noticeCanvas')[0].width = this.worldWidth;
            $('#noticeCanvas')[0].height = this.worldHeight;
            $('#agentCanvas')[0].width = this.worldWidth;
            $('#agentCanvas')[0].height = this.worldHeight;
            $('#resourceCanvas')[0].width = this.worldWidth;
            $('#resourceCanvas')[0].height = this.worldHeight;
            $('#scrollingCanvas')[0].width = this.worldWidth;
            $('#scrollingCanvas')[0].height = this.worldHeight;
            canvases.css({width: this.worldWidth, height: this.worldHeight});
            canvases.width(this.worldWidth);
            canvases.height(this.worldHeight);
            $('#wrapper').css({width: 1570 - this.worldWidth});
            $('#controls').css({left: 385 - this.worldWidth});
            $('#world').css({left: 480 - this.worldWidth});
            $('#notifications').css({left: 480 - this.worldWidth, top: 117 + this.worldHeight, width: this.worldWidth});
            $('#level-editor').css({left: 480 - this.worldWidth, top: 190 + this.worldHeight, width: this.worldWidth});
    //        $('#extended-area').css({left: 480 - this.worldWidth, top: 190 + this.worldHeight, width: this.worldWidth});
        }
        catch (e) {}
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
