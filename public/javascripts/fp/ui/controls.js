/*!
 * Fierce Planet - GeneralUI
 * General UI functions
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */



var FiercePlanet = FiercePlanet || {};


/**
 * @namespace Contains control-related functions
 */
FiercePlanet.Controls = FiercePlanet.Controls || {};

(function() {

    /**
     * Adds a series of event listeners to UI elements
     */
    this.hookUpUIEventListeners = function() {

        // Set admin functions to previously stored defaults
        FiercePlanet.Utils.getAndRetrieveProperties();

        // Menu functions
        $('#login').click(FiercePlanet.Dialogs.showLogin);
        $('#logout').click(FiercePlanet.ProfileUI.logout);
        $('#welcome-link').click(FiercePlanet.ProfileUI.editProfile);

        // Control panel functions
        $('#playAgents').click(Lifecycle.playGame);
        $('#slowDown').click(Lifecycle.slowDown);
        $('#speedUp').click(Lifecycle.speedUp);
        $('#newGame').click(Lifecycle.newGame);
        $('#restartLevel').click(Lifecycle.restartLevel);
        $('#showResourceGallery').click(FiercePlanet.Dialogs.showResourceGallery);

        // Pan/zoomFunctions
        $('#panUp').click(function() { FiercePlanet.Drawing.pan(0);});
        $('#panDown').click(function() { FiercePlanet.Drawing.pan(1);});
        $('#panLeft').click(function() { FiercePlanet.Drawing.pan(2);});
        $('#panRight').click(function() { FiercePlanet.Drawing.pan(3);});
        $('#panReset').click(function() { FiercePlanet.Drawing.pan(4);});
        $('#zoomIn').click(function() { FiercePlanet.Drawing.zoom(1);});
        $('#zoomOut').click(function() { FiercePlanet.Drawing.zoom(-1);});
        $('#zoomReset').click(function() { FiercePlanet.Drawing.zoom(0);});

        // Canvas dimensions
        $('#contract').click(FiercePlanet.Drawing.contract);
        $('#expand').click(FiercePlanet.Drawing.expand);
        $('#fullscreen').click(FiercePlanet.Orientation.makeFullScreen);

        // Perspective
        $('#3d').click(FiercePlanet.Drawing.toggle3d);
        $('#resetView').click(FiercePlanet.Drawing.resetView);
        $('#tiltUp').click(FiercePlanet.Drawing.tiltUp);
        $('#tiltDown').click(FiercePlanet.Drawing.tiltDown);
        $('#rotateLeft').click(FiercePlanet.Drawing.rotateLeft);
        $('#rotateRight').click(FiercePlanet.Drawing.rotateRight);

        $('#settings').click(FiercePlanet.Dialogs.showSettings);
        $('#credits').click(FiercePlanet.Dialogs.showCredits);
        $('#openLevelGallery').click(FiercePlanet.Dialogs.showLevelGallery);
        $('#editor').click(FiercePlanet.LevelUI.listLevels);


        // Admin functions
        $('#debug').click(Lifecycle.processAgents);
        $('#replay').click(FiercePlanet.Recording.replayWorld);
        $('#story-board').click(FiercePlanet.Storyboard.showStoryboard);
        $('#high-scores').click(FiercePlanet.ProfileUI.showHighScores);


        // Level editor functions
        try {
            $('#show-level-properties').click(FiercePlanet.LevelUI.showLevelProperties);
            $('#refresh-tiles').click(FiercePlanet.Editor.refreshTiles);
            $('#fill-all').click(FiercePlanet.Editor.fillAllTiles);
            $('#undo-action').click(FiercePlanet.Editor.undoAction);
            $('#cancel-level-editor').click(FiercePlanet.Editor.cancelLevelEditor);
            $('#save-level').click(FiercePlanet.LevelUI.saveLevel);
            $('#clear-entry-points').click(FiercePlanet.Editor.clearEntryPoints);
            $('#clear-exit-points').click(FiercePlanet.Editor.clearExitPoints);

            $('#toggle-mode').click(FiercePlanet.Editor.toggleMode);
            $('#edit-map').click(FiercePlanet.Editor.editMap);
            $('#save-map').click(FiercePlanet.Editor.saveMap);
            $('#close-map').click(FiercePlanet.Editor.closeMap);
        }
        catch (err){
            if (typeof console != "undefined")
                console.log(err);
        }


		var opts = {
		  lines: 12, // The number of lines to draw
		  length: 7, // The length of each line
		  width: 5, // The line thickness
		  radius: 10, // The radius of the inner circle
		  color: '#000', // #rbg or #rrggbb
		  speed: 1, // Rounds per second
		  trail: 100, // Afterglow percentage
		  shadow: true // Whether to render a shadow
		};
//		var target = document.getElementById('foo');
		FiercePlanet.Game.spinner = new Spinner(opts); //.spin(target);
		
		$('#spinner')
		    .hide()  // hide it initially
		    .ajaxStart(function() {
		        $(this).show();
				// Spinner version - TODO: needs div styling
				//FiercePlanet.spinner.spin($(this)[0]);
		    })
		    .ajaxStop(function() {
		        $(this).hide();
				//FiercePlanet.spinner.stop();
		    })
		;

        // Trap relevant key strokes
        if (!World.settings.disableKeyboardShortcuts) {
            $(document).unbind("keydown");
            $(document).keydown(FiercePlanet.Keyboard.handleKeyboardShortcuts);
            $('input, textarea, select, form').focus(function() {
                $(document).unbind("keydown");
            }).blur(function() {
                $(document).keydown(FiercePlanet.Keyboard.handleKeyboardShortcuts);
            });
            // Disable any AJAX-loaded forms
            $(document).ajaxComplete(function() {
                $('input, textarea, select').focus(function() {
                    $(document).unbind("keydown");
                }).blur(function() {
                    $(document).keydown(FiercePlanet.Keyboard.handleKeyboardShortcuts);
                });
            });
        }

        // Bind mouse events
        FiercePlanet.Mouse.bindGameMouseEvents();

        // Make elements movable
        FiercePlanet.GeneralUI.makeElementsMovable();

        // Make elements movable
        FiercePlanet.Console.registerEvents();



        // Finally, focus on the console. Good idea?
//        jqconsole.Focus();
    };

}).apply(FiercePlanet.Controls);
