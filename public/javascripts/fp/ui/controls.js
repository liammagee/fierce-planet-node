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
        $('#about').click(function() { window.open('http://blog.fierce-planet.com')});

        // Control panel functions
        $('#playAgents').click(FiercePlanet.Game.playGame);
        $('#slowDown').click(FiercePlanet.Game.slowDown);
        $('#speedUp').click(FiercePlanet.Game.speedUp);
        $('#newGame').click(Lifecycle.newGame);
        $('#restartWorld').click(Lifecycle.restartWorld);
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
        $('#openWorldGallery').click(FiercePlanet.Dialogs.showWorldGallery);
        $('#editor').click(FiercePlanet.WorldUI.listWorlds);

        $('#debug').click(Lifecycle.processAgents);


        // Admin functions
        $('#replay').click(FiercePlanet.Recording.replayUniverse);
        $('#story-board').click(FiercePlanet.Storyboard.showStoryboard);
        $('#high-scores').click(FiercePlanet.ProfileUI.showHighScores);

        $('#world-information-link').click(function() {
            var info = (_.isUndefined(Lifecycle.currentWorld.information) ? Lifecycle.currentWorld.introduction : Lifecycle.currentWorld.information)
                worldInformation = '';
            if (!_.isUndefined(Lifecycle.currentWorld.location))
                worldInformation += '<h3>Location</h3><div>' + Lifecycle.currentWorld.location + '</div>';
            worldInformation += '<h3>Information</h3><div>' + info + '</div>';
            $('#world-information').html(worldInformation);
        });

        // World editor functions
        try {
            $('#show-world-properties').click(FiercePlanet.WorldUI.showWorldProperties);
            $('#refresh-tiles').click(FiercePlanet.Editor.refreshTiles);
            $('#fill-all').click(FiercePlanet.Editor.fillAllTiles);
            $('#undo-action').click(FiercePlanet.Editor.undoAction);
            $('#cancel-world-editor').click(FiercePlanet.Editor.cancelWorldEditor);
            $('#save-world').click(FiercePlanet.WorldUI.saveWorld);
            $('#clear-entry-points').click(FiercePlanet.Editor.clearEntryPoints);
            $('#clear-exit-points').click(FiercePlanet.Editor.clearExitPoints);

            $('#toggle-mode').click(FiercePlanet.Editor.toggleMode);
            $('#edit-map').click(FiercePlanet.Editor.editMap);
            $('#save-map').click(FiercePlanet.Editor.saveMap);
            $('#close-map').click(FiercePlanet.Editor.closeMap);
        }
        catch (err){
            if (!_.isUndefined(console))
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
        if (!Universe.settings.disableKeyboardShortcuts) {
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

    };

}).apply(FiercePlanet.Controls);
