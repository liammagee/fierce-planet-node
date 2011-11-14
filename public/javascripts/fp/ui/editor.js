/*!
 * Fierce Planet - Level Editor
 * Level editor functions
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var FiercePlanet = FiercePlanet || {};


/**
 * @namespace Contains editor functions
 */
FiercePlanet.Editor = FiercePlanet.Editor || {};


(function() {

    /**
     *
     * @param e
     */
    this.showDesignFeaturesDialog = function(e) {
        $("#make-tile").click(function(e) {
            var tile = new Tile(DEFAULT_TILE_COLOR, FiercePlanet.Game.currentX, FiercePlanet.Game.currentY);
            FiercePlanet.Game.currentLevel.addTile(tile);
            FiercePlanet.Dialogs.designFeaturesDialog.dialog('close');
            FiercePlanet.Drawing.drawGame();
        });

        $("#add-exit-point").click(function(e) {
            FiercePlanet.Game.currentLevel.addExitPoint(FiercePlanet.Game.currentX, FiercePlanet.Game.currentY);
            FiercePlanet.Dialogs.designFeaturesDialog.dialog('close');
            FiercePlanet.Drawing.drawGame();
        });

        $("#add-entry-point").click(function(e) {
            FiercePlanet.Game.currentLevel.removeEntryPoint(0, 0);
            FiercePlanet.Game.currentLevel.addEntryPoint(FiercePlanet.Game.currentX, FiercePlanet.Game.currentY);
            FiercePlanet.Dialogs.designFeaturesDialog.dialog('close');
            FiercePlanet.Drawing.drawGame();
        });


        $("#remove-entry-point").click(function(e) {
            FiercePlanet.Game.currentLevel.removeEntryPoint(FiercePlanet.Game.currentX, FiercePlanet.Game.currentY);
            FiercePlanet.Dialogs.designFeaturesDialog.dialog('close');
            FiercePlanet.Drawing.drawGame();
        });

        $("#remove-exit-point").click(function(e) {
            FiercePlanet.Game.currentLevel.removeExitPoint(FiercePlanet.Game.currentX, FiercePlanet.Game.currentY);
            FiercePlanet.Dialogs.designFeaturesDialog.dialog('close');
            FiercePlanet.Drawing.drawGame();
        });

        $("#remove-resource").click(function(e) {
            FiercePlanet.Game.currentLevel.removeResourceByPosition(FiercePlanet.Game.currentX, FiercePlanet.Game.currentY);
            FiercePlanet.Dialogs.designFeaturesDialog.dialog('close');
            FiercePlanet.Drawing.drawGame();
        });


        FiercePlanet.Dialogs.designFeaturesDialog.dialog('open');
    };

    /**
     * Set up the level editor
     */
    this.setupLevelEditor = function() {

        // Set up dialogs
        $('#delete-upgrade').hide();
//    $('#swatch').hide();
        $('#level-editor').show();


        var canvas = FiercePlanet.GeneralUI.getTopMostCanvas();
        //var canvas = $('#scrollingCanvas');
        canvas.unbind('click');
        canvas.unbind('mousedown');
        canvas.unbind('mousemove');
        canvas.unbind('mouseup');
//    canvas.click(function() {return false;});
        canvas.mousedown(FiercePlanet.Editor.handleEditorMouseDown);
        canvas.mousemove(FiercePlanet.Editor.handleEditorMouseMove);
        canvas.mouseup(FiercePlanet.Editor.handleEditorMouseUp);

        // Modify settings
        FiercePlanet.Game.inDesignMode = true;
        World.settings.skewTiles = false;

        // Minimise console
        FiercePlanet.Console.minimise();

        // Initialise the game
        FiercePlanet.Lifecycle._initialiseGame();
    };

    /**
     * Handle mouse down event in the editor
     * @param e
     */
    this.handleEditorMouseDown = function(e) {
        FiercePlanet.Game.oldTiles = FiercePlanet.Game.currentLevel.tiles.slice();
        FiercePlanet.Game.isMouseDown = true;
        FiercePlanet.Game.isMouseMoving = false;
        return false;
    };

    /**
     * Handle mouse move event in the editor
     * @param e
     */
    this.handleEditorMouseMove = function(e) {
        if (e.preventDefault) e.preventDefault(); // allows us to drop
        if (FiercePlanet.Game.isMouseDown) {
            FiercePlanet.Game.isMouseMoving = true;
            var currentPoint = FiercePlanet.GeneralUI.getCurrentPosition(e);

            // Return if the co-ordinates are outside the level bounds
            if (currentPoint.posX < 0 || currentPoint.posX >= FiercePlanet.Game.currentLevel.cellsAcross || currentPoint.posY < 0 || currentPoint.posY >= FiercePlanet.Game.currentLevel.cellsDown)
                return;

            if (FiercePlanet.Editor.clearMode) {
                var currentTile = FiercePlanet.Game.currentLevel.getTile(currentPoint.posX, currentPoint.posY);
                if (currentTile == undefined ) {
                    var tile = new Tile(DEFAULT_TILE_COLOR, currentPoint.posX, currentPoint.posY);
                    FiercePlanet.Game.currentLevel.addTile(tile);
                    FiercePlanet.Drawing.drawCanvases();
                }
            }
            else {
                FiercePlanet.Game.currentLevel.removeTile(currentPoint.posX, currentPoint.posY);
            }
            FiercePlanet.Drawing.drawCanvases();
        }
        return false;
    };

    /**
     * Handle mouse up event in the editor
     * @param e
     */
    this.handleEditorMouseUp = function(e) {
        if (e.preventDefault) e.preventDefault(); // allows us to drop
        var currentPoint = FiercePlanet.GeneralUI.getCurrentPosition(e);

        // Return if the co-ordinates are outside the level bounds
        if (currentPoint.posX < 0 || currentPoint.posX >= FiercePlanet.Game.currentLevel.cellsAcross || currentPoint.posY < 0 || currentPoint.posY >= FiercePlanet.Game.currentLevel.cellsDown)
            return;

        FiercePlanet.Game.currentX = currentPoint.posX;
        FiercePlanet.Game.currentY = currentPoint.posY;

        var currentTile = FiercePlanet.Game.currentLevel.getTile(FiercePlanet.Game.currentX, FiercePlanet.Game.currentY);
        if (FiercePlanet.Editor.clearMode) {
            if (currentTile == undefined) {
                var tile = new Tile(DEFAULT_TILE_COLOR, FiercePlanet.Game.currentX, FiercePlanet.Game.currentY);
                FiercePlanet.Game.currentLevel.addTile(tile);
                FiercePlanet.Drawing.drawCanvases();
            }
        }
        else {
            if (currentTile == undefined && !FiercePlanet.Game.isMouseMoving) {
                FiercePlanet.Editor.showDesignFeaturesDialog(e);
            }
            else {
                FiercePlanet.Game.currentLevel.removeTile(FiercePlanet.Game.currentX, FiercePlanet.Game.currentY);
                FiercePlanet.Drawing.drawCanvases();
            }
        }

        FiercePlanet.Game.isMouseDown = false;

        return false;
    };

    /**
     * Cancels the level editor
     */
    this.cancelLevelEditor = function() {
        FiercePlanet.Game.inDesignMode = false;
        FiercePlanet.Editor.closeMap();
        var canvas = FiercePlanet.GeneralUI.getTopMostCanvas();
        //var canvas = $('#scrollingCanvas');
        canvas.unbind('mousedown', FiercePlanet.Editor.handleEditorMouseDown);
        canvas.unbind('mousemove', FiercePlanet.Editor.handleEditorMouseMove);
        canvas.unbind('mouseup', FiercePlanet.Editor.handleEditorMouseUp);
        FiercePlanet.Mouse.bindGameMouseEvents();
        FiercePlanet.Console.maximise();
        $('#level-editor').hide();
        $('#swatch').show();
    };

    /**
     * Undoes the last action
     */
    this.undoAction = function() {
        FiercePlanet.Game.currentLevel.tiles = (FiercePlanet.Game.oldTiles);
        FiercePlanet.Drawing.drawCanvases();
    };

    /**
     * Refreshes the level with tiles
     */
    this.refreshTiles = function() {
        FiercePlanet.Game.currentLevel.fillWithTiles();
        FiercePlanet.Game.currentLevel.addEntryPoint(0, 0);
        FiercePlanet.Drawing.drawCanvases();
    };

    /**
     * Clears the level of tiles
     */
    this.fillAllTiles = function() {
        FiercePlanet.Game.currentLevel.removeAllTiles();
        FiercePlanet.Game.currentLevel.addEntryPoint(0, 0);
        FiercePlanet.Drawing.drawCanvases();
    };

    /**
     * Clears all entry points from the level
     */
    this.clearEntryPoints = function() {
        FiercePlanet.Game.currentLevel.resetEntryPoints();
        FiercePlanet.Drawing.drawCanvases();
    };

    /**
     * Clears all exit points from the level
     */
    this.clearExitPoints = function() {
        FiercePlanet.Game.currentLevel.resetExitPoints();
        FiercePlanet.Drawing.drawCanvases();
    };

    /**
     * Enter fill mode
     */
    this.toggleMode = function() {
        if (! FiercePlanet.Editor.clearMode) {
            $('#toggle-mode').html('Fill Mode');
            FiercePlanet.Editor.clearMode = true;
        }
        else {
            $('#toggle-mode').html('Clear Mode');
            FiercePlanet.Editor.clearMode = false;
        }
    };

    /**
     * Allows the map to be editable
     */
    this.editMap = function() {
        FiercePlanet.Game.editingMap = true;
        $('#map_canvas').css({zIndex: 8});
        $('canvas').hide();
//        $('#map_canvas').mousedown(FiercePlanet.GeneralUI.registerMouseDown);
//        $('#map_canvas').mousemove(FiercePlanet.GeneralUI.registerMouseMove);
//        $('#map_canvas').mouseup(FiercePlanet.GeneralUI.registerMouseUp);

        var mapOptions = FiercePlanet.GoogleMapUtils.defaultOptions();
        $.extend(mapOptions, FiercePlanet.Game.currentLevel.mapOptions);
        $.extend(mapOptions, {
                disableDefaultUI: false,
                mapTypeControl: true,
                overviewMapControl: true,
                panControl: true,
                rotateControl: true,
                scaleControl: true,
                streetViewControl: true,
                zoomControl: true
            });
        FiercePlanet.Game.googleMap = FiercePlanet.GoogleMapUtils.createMap(mapOptions);
    };

    /**
     * Allows the map to be editable
     */
    this.saveMap = function() {
        var center = [FiercePlanet.Game.googleMap.getCenter().lat(), FiercePlanet.Game.googleMap.getCenter().lng()];
        var tilt = FiercePlanet.Game.googleMap.getTilt();
        var zoom = FiercePlanet.Game.googleMap.getZoom();
        var mapTypeId = FiercePlanet.Game.googleMap.getMapTypeId();
        FiercePlanet.Game.currentLevel.mapOptions = {
            center: center,
            tilt: tilt,
            zoom: zoom,
            mapTypeId: mapTypeId
        };
		FiercePlanet.LevelUI.saveLevel();
    };

    /**
     * Allows the map to be editable
     */
    this.closeMap = function() {
        FiercePlanet.Game.editingMap = false;
        $('#map_canvas').css({zIndex: 2});
        $('canvas').show();
        var mapOptions = FiercePlanet.GoogleMapUtils.defaultOptions();
        $.extend(mapOptions, FiercePlanet.Game.currentLevel.mapOptions);
        $.extend(mapOptions, {
            disableDefaultUI: true,
            mapTypeControl: false,
            overviewMapControl: false,
            panControl: false,
            rotateControl: false,
            scaleControl: false,
            streetViewControl: false,
            zoomControl: false
            });
        FiercePlanet.Game.googleMap = FiercePlanet.GoogleMapUtils.createMap(mapOptions);

        FiercePlanet.Drawing.drawCanvases();
    };

}).apply(FiercePlanet.Editor);
