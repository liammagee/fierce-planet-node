/*!
 * Fierce Planet - World Editor
 * World editor functions
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
//            Lifecycle.currentWorld.getCell(FiercePlanet.Game.currentX, FiercePlanet.Game.currentY).agentsAllowed = true;
            Lifecycle.currentWorld.forbidAgentOnCell(FiercePlanet.Game.currentX, FiercePlanet.Game.currentY);
            Lifecycle.currentWorld.generatePath();
            FiercePlanet.Dialogs.designFeaturesDialog.dialog('close');
            FiercePlanet.Drawing.drawCanvases();
        });

        $("#add-exit-point").click(function(e) {
            Lifecycle.currentWorld.addExitPoint(FiercePlanet.Game.currentX, FiercePlanet.Game.currentY);
            FiercePlanet.Dialogs.designFeaturesDialog.dialog('close');
            FiercePlanet.Drawing.drawCanvases();
        });

        $("#add-entry-point").click(function(e) {
            Lifecycle.currentWorld.removeEntryPoint(0, 0);
            Lifecycle.currentWorld.addEntryPoint(FiercePlanet.Game.currentX, FiercePlanet.Game.currentY);
            FiercePlanet.Dialogs.designFeaturesDialog.dialog('close');
            FiercePlanet.Drawing.drawCanvases();
        });


        $("#remove-entry-point").click(function(e) {
            Lifecycle.currentWorld.removeEntryPoint(FiercePlanet.Game.currentX, FiercePlanet.Game.currentY);
            FiercePlanet.Dialogs.designFeaturesDialog.dialog('close');
            FiercePlanet.Drawing.drawCanvases();
        });

        $("#remove-exit-point").click(function(e) {
            Lifecycle.currentWorld.removeExitPoint(FiercePlanet.Game.currentX, FiercePlanet.Game.currentY);
            FiercePlanet.Dialogs.designFeaturesDialog.dialog('close');
            FiercePlanet.Drawing.drawCanvases();
        });

        $("#remove-resource").click(function(e) {
            Lifecycle.currentWorld.removeResourceByPosition(FiercePlanet.Game.currentX, FiercePlanet.Game.currentY);
            FiercePlanet.Dialogs.designFeaturesDialog.dialog('close');
            FiercePlanet.Drawing.drawCanvases();
        });


        FiercePlanet.Dialogs.designFeaturesDialog.dialog('open');
    };

    /**
     * Set up the world editor
     */
    this.setupWorldEditor = function() {

        // Set up dialogs
        $('#delete-upgrade').hide();
//    $('#swatch').hide();


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
        Universe.settings.isometricView = false;

//        $('#model-tabs').tabs('add', $('#world-editor'), 'Editor')
        $('#world-editor').show();
    };

    /**
     * Handle mouse down event in the editor
     * @param e
     */
    this.handleEditorMouseDown = function(e) {
        FiercePlanet.Game.oldCells = Lifecycle.currentWorld.cells.slice();
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

            // Return if the co-ordinates are outside the world bounds
            if (currentPoint.posX < 0 || currentPoint.posX >= Lifecycle.currentWorld.cellsAcross || currentPoint.posY < 0 || currentPoint.posY >= Lifecycle.currentWorld.cellsDown)
                return;

            if (FiercePlanet.Editor.clearMode) {
                var agentsAllowed = Lifecycle.currentWorld.areAgentsAllowed(currentPoint.posX, currentPoint.posY);
                if (agentsAllowed) {
                    var cell = Lifecycle.currentWorld.getCell(currentPoint.posX, currentPoint.posY);
                    cell.agentsAllowed = false;
                }
            }
            else {
                var cell = Lifecycle.currentWorld.getCell(currentPoint.posX, currentPoint.posY);
                cell.agentsAllowed = true;
            }
            Lifecycle.currentWorld.generatePath();
            Lifecycle.currentWorld.cells.forEach(function(cell) {
                if (cell.agentsAllowed) {
                    cell.terrain = new Terrain(one.color('#aaa').alpha(0.8).cssa());
                }
                else {
                    cell.terrain = Terrain.DEFAULT_TERRAIN;
                }
            })

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

        // Return if the co-ordinates are outside the world bounds
        if (currentPoint.posX < 0 || currentPoint.posX >= Lifecycle.currentWorld.cellsAcross || currentPoint.posY < 0 || currentPoint.posY >= Lifecycle.currentWorld.cellsDown)
            return;

        FiercePlanet.Game.currentX = currentPoint.posX;
        FiercePlanet.Game.currentY = currentPoint.posY;

        var agentsAllowed = Lifecycle.currentWorld.areAgentsAllowed(FiercePlanet.Game.currentX, FiercePlanet.Game.currentY);
        if (FiercePlanet.Editor.clearMode) {
            if (agentsAllowed) {
                var cell = Lifecycle.currentWorld.getCell(currentPoint.posX, currentPoint.posY);
                cell.agentsAllowed = false;
                FiercePlanet.Drawing.drawCanvases();
            }
        }
        else {
            if (agentsAllowed && !FiercePlanet.Game.isMouseMoving) {
                FiercePlanet.Editor.showDesignFeaturesDialog(e);
            }
            else {
                var cell = Lifecycle.currentWorld.getCell(currentPoint.posX, currentPoint.posY);
                cell.agentsAllowed = true;
                FiercePlanet.Drawing.drawCanvases();
            }
        }

        FiercePlanet.Game.isMouseDown = false;

        return false;
    };

    /**
     * Cancels the world editor
     */
    this.cancelWorldEditor = function() {
        FiercePlanet.Game.inDesignMode = false;
        FiercePlanet.Editor.closeMap();
        var canvas = FiercePlanet.GeneralUI.getTopMostCanvas();
        //var canvas = $('#scrollingCanvas');
        canvas.unbind('mousedown', FiercePlanet.Editor.handleEditorMouseDown);
        canvas.unbind('mousemove', FiercePlanet.Editor.handleEditorMouseMove);
        canvas.unbind('mouseup', FiercePlanet.Editor.handleEditorMouseUp);
        FiercePlanet.Mouse.bindGameMouseEvents();
        FiercePlanet.Console.maximise();
        $('#world-editor').hide();
        $('#swatch').show();
    };

    /**
     * Undoes the last action
     */
    this.undoAction = function() {
        Lifecycle.currentWorld.cells = (FiercePlanet.Game.oldCells);
        FiercePlanet.Drawing.drawCanvases();
    };

    /**
     * Refreshes the world with tiles
     */
    this.refreshTiles = function() {
        Lifecycle.currentWorld.forbidAgentsOnAllCells();
        Lifecycle.currentWorld.addEntryPoint(0, 0);
        FiercePlanet.Drawing.drawCanvases();
    };

    /**
     * Clears the world of tiles
     */
    this.fillAllTiles = function() {
        Lifecycle.currentWorld.allowAgentsOnAllCells();
        Lifecycle.currentWorld.addEntryPoint(0, 0);
        FiercePlanet.Drawing.drawCanvases();
    };

    /**
     * Clears all entry points from the world
     */
    this.clearEntryPoints = function() {
        Lifecycle.currentWorld.resetEntryPoints();
        FiercePlanet.Drawing.drawCanvases();
    };

    /**
     * Clears all exit points from the world
     */
    this.clearExitPoints = function() {
        Lifecycle.currentWorld.resetExitPoints();
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
        $.extend(mapOptions, Lifecycle.currentWorld.mapOptions);
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
        Lifecycle.currentWorld.mapOptions = {
            center: center,
            tilt: tilt,
            zoom: zoom,
            mapTypeId: mapTypeId
        };
		FiercePlanet.WorldUI.saveWorld();
    };

    /**
     * Allows the map to be editable
     */
    this.closeMap = function() {
        FiercePlanet.Game.editingMap = false;
        $('#map_canvas').css({zIndex: 2});
        $('canvas').show();
        var mapOptions = FiercePlanet.GoogleMapUtils.defaultOptions();
        $.extend(mapOptions, Lifecycle.currentWorld.mapOptions);
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
