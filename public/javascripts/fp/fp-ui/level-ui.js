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
FiercePlanet.LevelUI = FiercePlanet.LevelUI || {};

(function() {

    /**
     * Show level editor
     */
    this.listLevels = function() {
        FiercePlanet.Lifecycle.pauseGame();
        $('#level-list-tabs').tabs();
        $('#new-level').click(FiercePlanet.LevelUI.newLevel);
        FiercePlanet.LevelUI.ajaxListLevels();
    };

    /**
     * Prepare to create a new level
     */
    this.newLevel = function() {
        FiercePlanet.Lifecycle.pauseGame();
        FiercePlanet.Dialogs.levelEditorDialog.dialog('close');

        // Create new level
        FiercePlanet.previousLevel = FiercePlanet.currentLevel;
        FiercePlanet.currentLevel = new Level();
		FiercePlanet.currentLevelNumber = -1;
		FiercePlanet.currentLevelPreset = false;
        FiercePlanet.currentLevel.name = '[Enter the level name here]';
		FiercePlanet.currentLevel.fillWithTiles();

        // Prepare the level properties form
        FiercePlanet.LevelUI.prepareLevelPropertiesForm();

		// Draw the level
		FiercePlanet.Drawing.drawGame();

        // Show the edit properties dialog
        FiercePlanet.Dialogs.editPropertiesDialog.dialog('open');
    };

    
    /**
     * Shows the level properties dialog
     */
    this.showLevelProperties = function() {
        FiercePlanet.Lifecycle.pauseGame();
        FiercePlanet.LevelUI.prepareLevelPropertiesForm();
        FiercePlanet.Dialogs.editPropertiesDialog.dialog('open');
    };


    /**
     * Opens a level
     */
    this.openLevel = function() {
        if ($(this).parent().attr('id')) {
            $.get('/levels/' + $(this).parent().attr('id'), function(json) {
                FiercePlanet.LevelUI.constructLevel(json);

                FiercePlanet.Editor.setupLevelEditor();

                FiercePlanet.Dialogs.levelEditorDialog.dialog('close');
            });
        }
    };


    /**
     * Opens a level
     */
    this.deleteLevel = function() {
        console.log($(this).parent())
        console.log($(this).parent().attr('id'))
        if ($(this).parent().attr('id')) {
            $.get('/levels/destroy/' + $(this).parent().attr('id'), function(res) {
                if (res) {
                    $('#existing-levels').empty();
                    res.forEach(function(item) {
                        $('#existing-levels').append('<div id="' + item._id + '"><a class="level-editor" href="#">' + item.name + '</a> (<a class="delete-level" href="#">Delete</a>)</div>');
                    });
                    $('.level-editor').click(FiercePlanet.LevelUI.openLevel);
                    $('.delete-level').click(FiercePlanet.LevelUI.deleteLevel);
                }
            });
        }
    };

    /**
     * Save level 
     */
    this.saveLevel = function() {
//        if (FiercePlanet.inDesignMode) {
        var level = FiercePlanet.currentLevel;

        // Retrieve current dimensions
        var ca = level.cellsAcross;
        var cd = level.cellsDown;

        // Add properties from the properties form
        // Cf. http://stackoverflow.com/questions/1184624/serialize-form-to-json-with-jquery
        var a = $("#level-properties").serializeArray();
        a.forEach(function(item) {
            level[item.name] = item.value || '';
        });

        // If the level has been saved already, and the dimensions have changed, we need to start again
        if (FiercePlanet.currentLevel._id && (level.cellsAcross != ca || level.cellsDown != cd)) {
            if (confirm("The level dimensions have changed, and the current maze will be deleted. Should we proceed?")) {
                // Redo level dimensions
                level.fillWithTiles();
            }
            else {
                // Reset dimensions
                level.cellsAcross = ca;
                level.cellsDown = cd;
            }
        }

        $.post('/levels/save', { level: JSON.stringify(level) }, function(response) {
            if (response._id && ! FiercePlanet.currentLevel._id)
                FiercePlanet.currentLevel._id = response._id
            FiercePlanet.Editor.setupLevelEditor();
        });
//        }
    };

    /**
     * Construct current level
     */
    this.constructLevel = function(json) {
        if (json) {
            var tmpLevel = FiercePlanet.Utils.makeFromJSONObject(json, Level.prototype);
            tmpLevel.resources = [];
            /*
            tmpLevel.resources = tmpLevel.resources || [];
            for (var i in tmpLevel.resources) {
                console.log(tmpLevel.resources[i])
                FiercePlanet.Utils.makeFromJSONObject(tmpLevel.resources[i], Resource.prototype);
            }
            */

//                    var levelTimerId = setInterval("FiercePlanet.LevelUI.saveLevel()", 5000);

            // Set the current level number and preset value
            FiercePlanet.currentLevelNumber = tmpLevel.id;
            FiercePlanet.currentLevelPreset = false;
            FiercePlanet.currentLevel = tmpLevel;

            // Prepare the level properties form
            FiercePlanet.LevelUI.prepareLevelPropertiesForm();
        }
    };


    /**
     * Prepare current level properties form
     */
    this.prepareLevelPropertiesForm = function() {
        var l = FiercePlanet.currentLevel;
        $('#level-object-id').val(l._id);
        $('#level-name').val(l.name);
        $('#level-url').attr('href', '/levels/' + l.id);
        $('#level-width').val(l.cellsAcross);
        $('#level-height').val(l.cellsDown);
        $('#level-initial-agent-number').val(l.initialAgentNumber);
        $('#level-wave-number').val(l.waveNumber);
        $('#level-expiry-limit').val(l.expiryLimit);

        $('#level-notice').val(l.notice);
        $('#level-allow-offscreen-cycling').val(l.allowOffscreenCycling);
        $('#level-allow-patches-on-path').val(l.allowResourcesOnPath);

//        $('#level-google_map_type_id').val(l.mapOptions.mapTypeId);
//        $('#level-google_map_lat').val(l.mapOptions.center[0]);
//        $('#level-google_map_long').val(l.mapOptions.center[1]);
//        $('#level-google_map_tilt').val(l.mapOptions.zoom);
//        $('#level-google_map_zoom').val(l.mapOptions.tilt);
    };


    // AJAX methods

    /**
     * Shows the Fierce Planet level editor
     */
    this.ajaxListLevels = function () {
        $.get('/levels/list', function(res) {
            if (res) {
                $('#existing-levels').empty();
                res.forEach(function(item) {
                    $('#existing-levels').append('<div id="' + item._id + '"><a class="level-editor" href="#">' + item.name + '</a> (<a class="delete-level" href="#">Delete</a>)</div>');
                });
                $('.level-editor').click(FiercePlanet.LevelUI.openLevel);
                $('.delete-level').click(FiercePlanet.LevelUI.deleteLevel);
            }
            FiercePlanet.Dialogs.levelEditorDialog.dialog('open');
        });
    }

}).apply(FiercePlanet.LevelUI);
