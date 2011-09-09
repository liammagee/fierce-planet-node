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
            var tile = new Tile(DEFAULT_TILE_COLOR, FiercePlanet.currentX, FiercePlanet.currentY);
            FiercePlanet.currentLevel.addTile(tile);
            FiercePlanet.Dialogs.designFeaturesDialog.dialog('close');
            FiercePlanet.Drawing.drawGame();
        });

        $("#add-exit-point").click(function(e) {
            FiercePlanet.currentLevel.addExitPoint(FiercePlanet.currentX, FiercePlanet.currentY);
            FiercePlanet.Dialogs.designFeaturesDialog.dialog('close');
            FiercePlanet.Drawing.drawGame();
        });

        $("#add-entry-point").click(function(e) {
            FiercePlanet.currentLevel.removeEntryPoint(0, 0);
            FiercePlanet.currentLevel.addEntryPoint(FiercePlanet.currentX, FiercePlanet.currentY);
            FiercePlanet.Dialogs.designFeaturesDialog.dialog('close');
            FiercePlanet.Drawing.drawGame();
        });


        $("#remove-entry-point").click(function(e) {
            FiercePlanet.currentLevel.removeEntryPoint(FiercePlanet.currentX, FiercePlanet.currentY);
            FiercePlanet.Dialogs.designFeaturesDialog.dialog('close');
            FiercePlanet.Drawing.drawGame();
        });

        $("#remove-exit-point").click(function(e) {
            FiercePlanet.currentLevel.removeExitPoint(FiercePlanet.currentX, FiercePlanet.currentY);
            FiercePlanet.Dialogs.designFeaturesDialog.dialog('close');
            FiercePlanet.Drawing.drawGame();
        });

        $("#remove-resource").click(function(e) {
            FiercePlanet.currentLevel.removeResourceByPosition(FiercePlanet.currentX, FiercePlanet.currentY);
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

        // Set up user interaction
        var canvas = $('#scrollingCanvas');
        canvas.unbind('click');
        canvas.unbind('mousedown');
        canvas.unbind('mousemove');
        canvas.unbind('mouseup');
//    canvas.click(function() {return false;});
        canvas.mousedown(FiercePlanet.Editor.handleEditorMouseDown);
        canvas.mousemove(FiercePlanet.Editor.handleEditorMouseMove);
        canvas.mouseup(FiercePlanet.Editor.handleEditorMouseUp);

        // Modify settings
        FiercePlanet.inDesignMode = true;
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
        FiercePlanet.oldTiles = FiercePlanet.currentLevel.tiles.slice();
        FiercePlanet.isMouseDown = true;
        FiercePlanet.isMouseMoving = false;
        return false;
    };

    /**
     * Handle mouse move event in the editor
     * @param e
     */
    this.handleEditorMouseMove = function(e) {
        if (e.preventDefault) e.preventDefault(); // allows us to drop
        if (FiercePlanet.isMouseDown) {
            FiercePlanet.isMouseMoving = true;
            var currentPoint = FiercePlanet.GeneralUI.getCurrentPosition(e);
            if (FiercePlanet.Editor.clearMode) {
                var currentTile = FiercePlanet.currentLevel.getTile(currentPoint.posX, currentPoint.posY);
                if (currentTile == undefined ) {
                    var tile = new Tile(DEFAULT_TILE_COLOR, currentPoint.posX, currentPoint.posY);
                    FiercePlanet.currentLevel.addTile(tile);
                    FiercePlanet.Drawing.drawCanvases();
                }
            }
            else {
                FiercePlanet.currentLevel.removeTile(currentPoint.posX, currentPoint.posY);
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
        FiercePlanet.currentX = currentPoint.posX;
        FiercePlanet.currentY = currentPoint.posY;

        var currentTile = FiercePlanet.currentLevel.getTile(FiercePlanet.currentX, FiercePlanet.currentY);
        if (FiercePlanet.Editor.clearMode) {
            if (currentTile == undefined) {
                var tile = new Tile(DEFAULT_TILE_COLOR, FiercePlanet.currentX, FiercePlanet.currentY);
                FiercePlanet.currentLevel.addTile(tile);
                FiercePlanet.Drawing.drawCanvases();
            }
        }
        else {
            if (currentTile == undefined && !FiercePlanet.isMouseMoving) {
                FiercePlanet.Editor.showDesignFeaturesDialog(e);
            }
            else {
                FiercePlanet.currentLevel.removeTile(FiercePlanet.currentX, FiercePlanet.currentY);
                FiercePlanet.Drawing.drawCanvases();
            }
        }

        FiercePlanet.isMouseDown = false;

        return false;
    };

    /**
     * Cancels the level editor
     */
    this.cancelLevelEditor = function() {
        FiercePlanet.inDesignMode = false;
        FiercePlanet.Editor.closeMap();
        var canvas = $('#scrollingCanvas');
        canvas.unbind('mousedown', FiercePlanet.Editor.handleEditorMouseDown);
        canvas.unbind('mousemove', FiercePlanet.Editor.handleEditorMouseMove);
        canvas.unbind('mouseup', FiercePlanet.Editor.handleEditorMouseUp);
        FiercePlanet.GeneralUI.bindGameMouseEvents();
        FiercePlanet.Console.maximise();
        $('#level-editor').hide();
        $('#swatch').show();
    };

    /**
     * Undoes the last action
     */
    this.undoAction = function() {
        FiercePlanet.currentLevel.tiles = (FiercePlanet.oldTiles);
        FiercePlanet.Drawing.drawCanvases();
    };

    /**
     * Refreshes the level with tiles
     */
    this.refreshTiles = function() {
        FiercePlanet.currentLevel.fillWithTiles();
        FiercePlanet.currentLevel.addEntryPoint(0, 0);
        FiercePlanet.Drawing.drawCanvases();
    };

    /**
     * Clears the level of tiles
     */
    this.fillAllTiles = function() {
        FiercePlanet.currentLevel.removeAllTiles();
        FiercePlanet.currentLevel.addEntryPoint(0, 0);
        FiercePlanet.Drawing.drawCanvases();
    };

    /**
     * Clears all entry points from the level
     */
    this.clearEntryPoints = function() {
        FiercePlanet.currentLevel.resetEntryPoints();
        FiercePlanet.Drawing.drawCanvases();
    };

    /**
     * Clears all exit points from the level
     */
    this.clearExitPoints = function() {
        FiercePlanet.currentLevel.resetExitPoints();
        FiercePlanet.Drawing.drawCanvases();
    };

    /**
     * Enter fill mode
     */
    this.toggleMode = function() {
        if (! FiercePlanet.Editor.clearMode) {
            $('#toggle-mode').html('Fill Mode');
            FiercePlanet.Editor.clearMode = true;
            console.log(FiercePlanet.Editor.clearMode)
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
        FiercePlanet.editingMap = true;
        $('#map_canvas').css({zIndex: 8});
        $('canvas').hide();
//        $('#map_canvas').mousedown(FiercePlanet.GeneralUI.registerMouseDown);
//        $('#map_canvas').mousemove(FiercePlanet.GeneralUI.registerMouseMove);
//        $('#map_canvas').mouseup(FiercePlanet.GeneralUI.registerMouseUp);

        var mapOptions = FiercePlanet.GoogleMapUtils.defaultOptions();
        $.extend(mapOptions, FiercePlanet.currentLevel.mapOptions);
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
        FiercePlanet.googleMap = FiercePlanet.GoogleMapUtils.createMap(mapOptions);
    };

    /**
     * Allows the map to be editable
     */
    this.saveMap = function() {
        var center = [FiercePlanet.googleMap.getCenter().lat(), FiercePlanet.googleMap.getCenter().lng()];
        var tilt = FiercePlanet.googleMap.getTilt();
        var zoom = FiercePlanet.googleMap.getZoom();
        var mapTypeId = FiercePlanet.googleMap.getMapTypeId();
        FiercePlanet.currentLevel.mapOptions = {
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
        FiercePlanet.editingMap = false;
        $('#map_canvas').css({zIndex: 2});
        $('canvas').show();
        var mapOptions = FiercePlanet.GoogleMapUtils.defaultOptions();
        $.extend(mapOptions, FiercePlanet.currentLevel.mapOptions);
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
        FiercePlanet.googleMap = FiercePlanet.GoogleMapUtils.createMap(mapOptions);

        FiercePlanet.Drawing.drawCanvases();
    };

}).apply(FiercePlanet.Editor);