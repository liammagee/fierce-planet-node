/*!
 * Fierce Planet - Dialogs
 * Declares dialogs used in the game
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */



var FiercePlanet = FiercePlanet || {};


/**
 * @namespace Contains dialog functions
 */
FiercePlanet.WorldUI = FiercePlanet.WorldUI || {};

(function() {

    /**
     * Show world editor
     */
    this.listWorlds = function() {
        Lifecycle._stopAgents();
//        Lifecycle.pauseGame();
        $('#world-list-tabs').tabs();
        $('#new-world').click(FiercePlanet.WorldUI.newWorld);
        FiercePlanet.WorldUI.ajaxListWorlds();
    };

    /**
     * Prepare to create a new world
     */
    this.newWorld = function() {
        Lifecycle._stopAgents();
//        Lifecycle.pauseGame();
        FiercePlanet.Dialogs.worldEditorDialog.dialog('close');

        // Create new world
        FiercePlanet.previousWorld = Lifecycle.currentWorld;
        Lifecycle.currentWorld = new World();
		Lifecycle.currentWorldNumber = -1;
		Lifecycle.currentWorldPreset = false;
        Lifecycle.currentWorld.name = '[Enter the world name here]';
		Lifecycle.currentWorld.forbidAgentsOnAllCells();

        // Prepare the world properties form
        FiercePlanet.WorldUI.prepareWorldPropertiesForm();

		// Draw the world
		FiercePlanet.Drawing.drawGame();

        // Show the edit properties dialog
        FiercePlanet.Dialogs.editPropertiesDialog.dialog('open');
    };

    
    /**
     * Shows the world properties dialog
     */
    this.showWorldProperties = function() {
        FiercePlanet.Game.pauseGame();
        FiercePlanet.WorldUI.prepareWorldPropertiesForm();
        FiercePlanet.Dialogs.editPropertiesDialog.dialog('open');
    };


    /**
     * Opens a world
     */
    this.openWorld = function() {
        if ($(this).parent().attr('id')) {
            $.get('/worlds/' + $(this).parent().attr('id'), function(json) {
                FiercePlanet.WorldUI.constructWorld(json);

                FiercePlanet.Editor.setupWorldEditor();

                FiercePlanet.Dialogs.worldEditorDialog.dialog('close');
            });
        }
    };


    /**
     * Opens a world
     */
    this.deleteWorld = function() {
        if ($(this).parent().attr('id')) {
            $.get('/worlds/destroy/' + $(this).parent().attr('id'), function(res) {
                if (res) {
                    $('#existing-worlds').empty();
                    res.forEach(function(item) {
                        $('#existing-worlds').append('<div id="' + item._id + '"><a class="world-editor" href="#">' + item.name + '</a> (<a class="delete-world" href="#">Delete</a>)</div>');
                    });
                    $('.world-editor').click(FiercePlanet.WorldUI.openWorld);
                    $('.delete-world').click(FiercePlanet.WorldUI.deleteWorld);
                }
            });
        }
    };

    /**
     * Save world
     */
    this.saveWorld = function() {
//        if (FiercePlanet.inDesignMode) {
        var world = Lifecycle.currentWorld;

        // Retrieve current dimensions
        var ca = world.cellsAcross;
        var cd = world.cellsDown;

        // Add properties from the properties form
        // Cf. http://stackoverflow.com/questions/1184624/serialize-form-to-json-with-jquery
        var a = $("#world-properties").serializeArray();
        a.forEach(function(item) {
            var val = item.value;
            if (isNaN(val)) {
                world[item.name] = item.value || '';
            }
            else {
                world[item.name] = parseFloat(item.value);
            }
        });

        // If the world has been saved already, and the dimensions have changed, we need to start again
        if (Lifecycle.currentWorld._id && (world.cellsAcross != ca || world.cellsDown != cd)) {
            if (confirm("The world dimensions have changed, and the current maze will be deleted. Should we proceed?")) {
            }
            else {
                // Reset dimensions
                world.cellsAcross = ca;
                world.cellsDown = cd;

                // Initialise the game
                if (!_.isUndefined(Lifecycle.currentWorld.initWorld))
                    Lifecycle.currentWorld.initWorld();
            }
        }
        else if (! Lifecycle.currentWorld._id) {
            // Initialise the game
            if (!_.isUndefined(Lifecycle.currentWorld.initWorld))
                Lifecycle.currentWorld.initWorld();
            world.forbidAgentsOnAllCells();
        }

        // Save the world
        // Redo world dimensions
        FiercePlanet.Orientation.cellsAcross = Lifecycle.currentWorld.cellsAcross;
        FiercePlanet.Orientation.cellsDown = Lifecycle.currentWorld.cellsDown;
        FiercePlanet.Orientation.cellWidth = Math.round(FiercePlanet.Orientation.worldWidth / FiercePlanet.Orientation.cellsAcross);
        FiercePlanet.Orientation.cellHeight = Math.round(FiercePlanet.Orientation.worldHeight / FiercePlanet.Orientation.cellsDown);
        FiercePlanet.Orientation.pieceWidth = Math.round(FiercePlanet.Orientation.cellWidth * 0.5);
        FiercePlanet.Orientation.pieceHeight = Math.round(FiercePlanet.Orientation.cellHeight * 0.5);
        $.post('/worlds/save', { world: JSON.stringify(world) }, function(response) {
            if (response._id && ! Lifecycle.currentWorld._id)
                Lifecycle.currentWorld._id = response._id
            FiercePlanet.Editor.setupWorldEditor();
        });
//        }
    };

    /**
     * Construct current world
     */
    this.constructWorld = function(json) {
        if (json) {
            var tmpWorld = FiercePlanet.Utils.makeFromJSONObject(json, new World());
            if (_.isUndefined(tmpWorld.cells))
                tmpWorld.cells = [];
            if (_.isUndefined(tmpWorld.resources))
                tmpWorld.resources = [];
            /*
            tmpWorld.resources = tmpWorld.resources || [];
            for (var i in tmpWorld.resources) {
                console.log(tmpWorld.resources[i])
                FiercePlanet.Utils.makeFromJSONObject(tmpWorld.resources[i], Resource.prototype);
            }
            */

            // Set the current world number and preset value
            Lifecycle.currentWorldNumber = tmpWorld.id;
            Lifecycle.currentWorldPreset = false;
            Lifecycle.currentWorld = tmpWorld;

            // Prepare the world properties form
            FiercePlanet.WorldUI.prepareWorldPropertiesForm();

            FiercePlanet.Drawing.drawGame();
        }
    };


    /**
     * Prepare current world properties form
     */
    this.prepareWorldPropertiesForm = function() {
        var l = Lifecycle.currentWorld;
        $('#world-object-id').val(l._id);
        $('#world-name').val(l.name);
        $('#world-url').attr('href', '/worlds/share/' + l._id);
        $('#world-url-display').val('http://www.fierce-planet.com/worlds/share/' + l._id);
        $('#world-width').val(l.cellsAcross);
        $('#world-height').val(l.cellsDown);
        $('#world-initial-agent-number').val(l.initialAgentNumber);
        $('#world-wave-number').val(l.waveNumber);
        $('#world-expiry-limit').val(l.expiryLimit);

        $('#world-notice').val(l.notice);
        $('#world-allow-offscreen-cycling').val(l.allowOffscreenCycling);
        $('#world-allow-patches-on-path').val(l.allowResourcesOnPath);

//        $('#world-google_map_type_id').val(l.mapOptions.mapTypeId);
//        $('#world-google_map_lat').val(l.mapOptions.center[0]);
//        $('#world-google_map_long').val(l.mapOptions.center[1]);
//        $('#world-google_map_tilt').val(l.mapOptions.zoom);
//        $('#world-google_map_zoom').val(l.mapOptions.tilt);
    };


    // AJAX methods

    /**
     * Shows the Fierce Planet world editor
     */
    this.ajaxListWorlds = function () {
        $.get('/worlds/list', function(res) {
            if (res) {
                $('#existing-worlds').empty();
                res.forEach(function(item) {
                    $('#existing-worlds').append('<div id="' + item._id + '"><a class="world-editor" href="#">' + item.name + '</a> (<a class="delete-world" href="#">Delete</a>)</div>');
                });
                $('.world-editor').click(FiercePlanet.WorldUI.openWorld);
                $('.delete-world').click(FiercePlanet.WorldUI.deleteWorld);
            }
            FiercePlanet.Dialogs.worldEditorDialog.dialog('open');
        });
    }

    /**
     * Changes the preset world
     */
    this.openWorldFromServer =  function(worldID) {
        // Retrieve world object from server
        $.get('/worlds/' + worldID, function(tmpWorld) {
            if (tmpWorld) {
                FiercePlanet.Utils.makeFromJSONObject(tmpWorld, new World());
                for (var i = 0, l = tmpWorld.resources.length; i < l; i++) {
                    FiercePlanet.Utils.makeFromJSONObject(tmpWorld.resources[i], new Resource());
                }
                tmpWorld.worldResources = tmpWorld.resources;

                Lifecycle.currentWorld = tmpWorld;
                Lifecycle.currentWorldNumber = tmpWorld.id;
                Lifecycle.currentWorldPreset = false;
                Lifecycle.currentWaveNumber = 0;


                // Remember this world, along with other data
                FiercePlanet.ProfileUI.storeProfileData();
                FiercePlanet.Dialogs.worldGalleryDialog.dialog('close');

//                if (!_.isUndefined(Lifecycle.currentWorld.initWorld))
//                    Lifecycle.currentWorld.initWorld();

                Lifecycle.currentWorld.initWorld = undefined;
                Lifecycle.currentWorld.waves = undefined;
                Lifecycle.currentWorld.initialiseWaves(Lifecycle.currentWorld.waveNumber);
                Lifecycle.newWorld();
            }
        });
    };

    /**
     * Changes the preset world
     */
    this.makeWorldFromJSON =  function(tmpWorld) {
        // Retrieve world object from server
        FiercePlanet.Utils.makeFromJSONObject(tmpWorld, new World());
        for (var i = 0, l = tmpWorld.resources.length; i < l; i++) {
            FiercePlanet.Utils.makeFromJSONObject(tmpWorld.resources[i], new Resource());
        }
        tmpWorld.worldResources = tmpWorld.resources;

        Lifecycle.currentWorld = tmpWorld;
        Lifecycle.currentWorldNumber = tmpWorld.id;
        Lifecycle.currentWorldPreset = false;

        // Remember this world, along with other data
        FiercePlanet.ProfileUI.storeProfileData();
        FiercePlanet.Dialogs.worldGalleryDialog.dialog('close');
        Lifecycle.newWorld();
    };

}).apply(FiercePlanet.WorldUI);

