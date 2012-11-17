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

    this.DEFAULT_WORLD_WIDTH = 600, this.DEFAULT_WORLD_HEIGHT = 400;

    this.DEFAULT_ROTATION_ANGLE = 0;
    // "0.46365 (radians) - it's a “classic” 1:2 isometric angle which lays up perfectly into pixel grid of the computer screen. "
    this.DEFAULT_PERSPECTIVE_ANGLE = 0.46365;
    this.DEFAULT_MAP_ROTATION_ANGLE = -0.78540;
    this.DEFAULT_MAP_PERSPECTIVE_ANGLE = 0.33161;

    this.worldWidth = this.DEFAULT_WORLD_WIDTH, this.worldHeight = this.DEFAULT_WORLD_HEIGHT;
    this.halfWorldWidth = this.worldWidth / 2, this.halfWorldHeight = this.worldHeight / 2;
    this.cellsAcross = 14, this.cellsDown = 11;
    this.cellWidth = 0, this.cellHeight = 0;
    this.pieceWidth = 0, this.pieceHeight = 0;
    this.offsetX = 0, this.offsetY = 0;
    this.zoomWorld = 1, this.externalZoomWorld = 1, this.zoomMagnificationFactor = 1.5;
    this.rotationAngle = this.DEFAULT_ROTATION_ANGLE, this.perspectiveAngle = this.DEFAULT_PERSPECTIVE_ANGLE;
    this.mapRotationAngle = this.DEFAULT_MAP_ROTATION_ANGLE, this.mapPerspectiveAngle = this.DEFAULT_MAP_PERSPECTIVE_ANGLE;

    
    this.reset = function() {
        this.offsetX = 0, this.offsetY = 0;
        this.zoomWorld = 1, this.externalZoomWorld = 1, this.zoomMagnificationFactor = 1.5;
        this.rotationAngle = this.DEFAULT_ROTATION_ANGLE, this.perspectiveAngle = this.DEFAULT_PERSPECTIVE_ANGLE;
        this.adjustParameters(this.DEFAULT_WORLD_WIDTH, this.DEFAULT_WORLD_HEIGHT);
    };

    this.initialiseParameters = function(width, height) {
        if (Universe.settings.isometricView) {
            this.mapRotationAngle = this.DEFAULT_MAP_ROTATION_ANGLE;
            this.mapPerspectiveAngle = this.DEFAULT_MAP_PERSPECTIVE_ANGLE;
        }
        else {
            this.mapRotationAngle = 0;
            this.mapPerspectiveAngle = 0;
        }
        this.adjustParameters(width, height)
    };

    this.recalibrateParameters = function() {
        this.halfWorldWidth = this.worldWidth / 2;
        this.halfWorldHeight = this.worldHeight / 2;
        this.cellWidth = FiercePlanet.Orientation.worldWidth / FiercePlanet.Orientation.cellsAcross;
        this.cellHeight = FiercePlanet.Orientation.worldHeight / FiercePlanet.Orientation.cellsDown;
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
            //#world-container,
            var canvases = $('#imageCanvas, #map_canvas,#baseCanvas, #guideCanvas, #noticeCanvas, #agentCanvas, #resourceCanvas, #scrollingCanvas');
//
            //, #alt_map_canvas
            $('#map_canvas')[0].width = this.worldWidth;
            $('#map_canvas')[0].height = this.worldHeight;
            $('#baseCanvas')[0].width = this.worldWidth;
            $('#baseCanvas')[0].height = this.worldHeight;
            $('#noticeCanvas')[0].width = this.worldWidth;
            $('#noticeCanvas')[0].height = this.worldHeight;
            $('#guideCanvas')[0].width = this.worldWidth;
            $('#guideCanvas')[0].height = this.worldHeight;
            $('#agentCanvas')[0].width = this.worldWidth;
            $('#agentCanvas')[0].height = this.worldHeight;
            $('#resourceCanvas')[0].width = this.worldWidth;
            $('#resourceCanvas')[0].height = this.worldHeight;
            $('#scrollingCanvas')[0].width = this.worldWidth;
            $('#scrollingCanvas')[0].height = this.worldHeight;
            canvases.width(this.worldWidth);
            canvases.height(this.worldHeight);

            $('#actual_map').css({width: (this.worldWidth * 1), height: (this.worldHeight * 1) });
//            $('#actual_map').css({width: (this.worldWidth * 2), height: (this.worldHeight * 2), 'margin-top': -this.worldHeight, 'margin-left': -this.worldWidth });
            if (! Universe.settings.mobile) {
//                $('#wrapper').css({width: 490 + this.worldWidth});
//                $('#global-info-panel').css({left: this.worldWidth - 90});
//                $('#notifications').css({top: 117 + this.worldHeight, width: this.worldWidth});
//                $('#world-editor').css({top: 190 + this.worldHeight, width: this.worldWidth});
            }
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


    /**
     * Make full screen
     */
    this.makeFullScreen = function () {
        if (fullScreenApi.supportsFullScreen) {
            if (fullScreenApi.isFullScreen())
                fullScreenApi.cancelFullScreen();
            else
                fullScreenApi.requestFullScreen(document.getElementsByTagName('html')[0]);
        }
        /*
        var sw = $("body").width();
        var sh = $("body").height();

        FiercePlanet.Orientation.adjustParameters(sw - 160, sh - 400);
        */
    };

//    this.reset();



}).apply(FiercePlanet.Orientation);
