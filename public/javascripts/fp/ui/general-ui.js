/*!
 * Fierce Planet - GeneralUI
 * General UI functions
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */



var FiercePlanet = FiercePlanet || {};


/**
 * @namespace Contains generic UI functions
 */
FiercePlanet.GeneralUI = FiercePlanet.GeneralUI || {};

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
        $('#playAgents').click(FiercePlanet.Lifecycle.playGame);
        $('#slowDown').click(FiercePlanet.Lifecycle.slowDown);
        $('#speedUp').click(FiercePlanet.Lifecycle.speedUp);
        $('#newGame').click(FiercePlanet.Lifecycle.newGame);
        $('#restartLevel').click(FiercePlanet.Lifecycle.restartLevel);
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
        $('#debug').click(FiercePlanet.Lifecycle.processAgents);
        $('#replay').click(FiercePlanet.Recording.replayWorld);
        $('#story-board').click(FiercePlanet.Dev.showStoryboard);
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
            $(document).keydown(FiercePlanet.GeneralUI.handleKeyboardShortcuts);
            $('input, textarea, select, form').focus(function() {
                $(document).unbind("keydown");
            }).blur(function() {
                $(document).keydown(FiercePlanet.GeneralUI.handleKeyboardShortcuts);
            });
            // Disable any AJAX-loaded forms
            $(document).ajaxComplete(function() {
                $('input, textarea, select').focus(function() {
                    $(document).unbind("keydown");
                }).blur(function() {
                    $(document).keydown(FiercePlanet.GeneralUI.handleKeyboardShortcuts);
                });
            });
        }

        // Bind mouse events
        FiercePlanet.GeneralUI.bindGameMouseEvents();

        // Make elements movable
        FiercePlanet.GeneralUI.makeElementsMovable();

        // Make elements movable
        FiercePlanet.Console.registerEvents();



        // Finally, focus on the console. Good idea?
//        jqconsole.Focus();
    };

    /**
     *  Does all the necessary binding for in-game mouse events
     */
    this.bindGameMouseEvents = function() {
        var topMostCanvas = FiercePlanet.GeneralUI.getTopMostCanvas();

        if (typeof console != "undefined")
            console.log('Binding mouse events');

        topMostCanvas.click(FiercePlanet.GeneralUI.handleNoticeEvents);
        topMostCanvas.click(FiercePlanet.ResourceUI.processResourceCanvasClick);

        topMostCanvas.mousemove(FiercePlanet.GeneralUI.registerMouseMove);
        if (World.settings.allowInlinePanning) {
            topMostCanvas.mousedown(FiercePlanet.GeneralUI.registerMouseDown);
            topMostCanvas.mouseup(FiercePlanet.GeneralUI.registerMouseUp);
        }
        topMostCanvas.bind("contextmenu",function(e){
            return false;
        });
        topMostCanvas.mousewheel(function(event, delta) {
            FiercePlanet.Drawing.zoom(delta);
            event.preventDefault();
            return false; // prevent default
        });
    };

    /**
     *  Does all the necessary binding for in-game mouse events
     */
    this.unbindGameMouseEvents = function() {
        var topMostCanvas = FiercePlanet.GeneralUI.getTopMostCanvas();

        topMostCanvas.unbind('click');
    //    agentCanvas.unbind('click', FiercePlanet.handleNoticeEvents);
    //    agentCanvas.unbind('click', FiercePlanet.processResourceCanvasClick);
        topMostCanvas.unbind('mousedown', FiercePlanet.GeneralUI.registerMouseDown);
        topMostCanvas.unbind('mousemove', FiercePlanet.GeneralUI.registerMouseMove);
        topMostCanvas.unbind('mouseup', FiercePlanet.GeneralUI.registerMouseUp);
//        topMostCanvas.unmousewheel();
        topMostCanvas.unbind("contextmenu");
    };

    /**
     *  Does all the necessary binding for in-game mouse events
     */
    this.getTopMostCanvas = function() {
        return $('#noticeCanvas');
    };



    /**
     *  Register mouse down event
     */
    this.registerMouseDown = function(e) {
        FiercePlanet.Game.isMouseDown = true;
        FiercePlanet.Game.isMouseMoving = false;
        if (e.offsetX || e.offsetX == 0) { // Opera
            FiercePlanet.Game.currentX = e.offsetX;
            FiercePlanet.Game.currentY = e.offsetY;
        }
        else if (e.layerX || e.layerX == 0) { // Firefox
            FiercePlanet.Game.currentX = e.layerX;
            FiercePlanet.Game.currentY = e.layerY;
        }
    };

    /**
     *  Register mouse move event
     */
    this.registerMouseMove = function(e) {
        if (FiercePlanet.Game.isMouseDown && World.settings.allowInlinePanning) {
            FiercePlanet.Game.isMouseMoving = true;
            FiercePlanet.GeneralUI.doMove(e);
        }
    };

    /**
     *  Process mouse moves
     */
    this.doMove = function(e) {
        if (FiercePlanet.Game.isMouseDown) {
            var ex, ey;
            if (e.offsetX || e.offsetX == 0) { // Opera
                ex = e.offsetX;
                ey = e.offsetY;
            }
            else if (e.layerX || e.layerX == 0) { // Firefox
                ex = e.layerX;
                ey = e.layerY;
            }
            var offsetX = ex - FiercePlanet.Game.currentX;
            var offsetY = ey - FiercePlanet.Game.currentY;

			var midX = FiercePlanet.Orientation.halfWorldWidth;
			var midY = FiercePlanet.Orientation.halfWorldHeight;
			var	cx = FiercePlanet.Game.currentX - midX;
			var	cy = FiercePlanet.Game.currentY - midY;
			var	nx = ex - midX;
			var	ny = ey - midY;
			var ct = Math.atan2(cy, cx);
			var nt = Math.atan2(ny, nx);
			var dt = (nt - ct) * ((Math.abs(nx) / midX) + (Math.abs(ny) / midY));

            if ((!World.settings.reverseMouseClickEffects && e.which != 1) || (World.settings.reverseMouseClickEffects && e.which == 1)) {
                FiercePlanet.Orientation.rotationAngle = FiercePlanet.Orientation.rotationAngle + dt;
                FiercePlanet.Orientation.perspectiveAngle = FiercePlanet.Orientation.perspectiveAngle + (offsetY / (FiercePlanet.Orientation.halfWorldHeight));
            }
            else {
                FiercePlanet.Drawing.panByDrag(offsetX, offsetY);
            }
			FiercePlanet.Drawing.drawCanvases();
            FiercePlanet.Game.currentX = ex;
            FiercePlanet.Game.currentY = ey;
        }
    };

    /**
     *  Register mouse up event
     */
    this.registerMouseUp = function(e) {
        if (e.preventDefault)
            e.preventDefault();
        if (FiercePlanet.Game.isMouseDown && FiercePlanet.Game.isMouseMoving) {
            FiercePlanet.GeneralUI.doMove(e);
            FiercePlanet.Game.isMouseDown = false;
        }
        return false;
    };

    /**
     *  Add key handling events
     */
    this.handleKeyboardShortcuts = function(e) {

        if (World.settings.disableKeyboardShortcuts)
            return;

        // Return if command keys are selected
        if (e.ctrlKey || e.altKey || e.metaKey)
            return;


        if (World.settings.firstPerson) {
            var myAgent = FiercePlanet.Game.currentLevel.currentAgents[0];
            if (myAgent) {
                switch (e.which) {
                    // +, -, 0: Zoom functions
                    case 37:
                    case 65:
                        if (myAgent.x > 0) {
                            myAgent.x = myAgent.x - 1;
                            FiercePlanet.Drawing.panByDrag(FiercePlanet.Orientation.cellWidth, 0);
                        }
                        break;
                    case 39:
                    case 68:
                        if (myAgent.x  < FiercePlanet.Orientation.cellsAcross) {
                            myAgent.x = myAgent.x + 1;
                            FiercePlanet.Drawing.panByDrag(-FiercePlanet.Orientation.cellWidth, 0);
                        }
                        break;
                    case 38:
                    case 87:
                        if (myAgent.y > 0) {
                            myAgent.y = myAgent.y - 1;
                            FiercePlanet.Drawing.panByDrag(0, FiercePlanet.Orientation.cellWidth);
                        }
                        break;
                    case 40:
                    case 83:
                        if (myAgent.y  < FiercePlanet.Orientation.cellsDown) {
                            myAgent.y = myAgent.y + 1;
                            FiercePlanet.Drawing.panByDrag(0, -FiercePlanet.Orientation.cellWidth);
                        }
                        break;
                }
//                FiercePlanet.Drawing.panByDrag(- FiercePlanet.Orientation.offsetX / FiercePlanet.Orientation.zoomLevel, - FiercePlanet.Orientation.offsetY / FiercePlanet.Orientation.zoomLevel);

//                FiercePlanet.Drawing.panByDrag(myAgent.x - FiercePlanet.Orientation.cellsAcross / 2, myAgent.y - FiercePlanet.Orientation.cellsDown / 2);
                myAgent.lastMemory.x = myAgent.x;
                myAgent.lastMemory.y = myAgent.y;

                FiercePlanet.Drawing.clearCanvas('#agentCanvas');
                FiercePlanet.Drawing.drawAgents();
            }
        }
        else {
            switch (e.which) {
                // tilda
                case 27:
                    jqconsole.Focus();
                    break;
                // tilda
                case 192:
                    if ($('#notifications').height() > 40) {
//                        $('#console').removeClass('tilda');
                        $('#console').css({height: 20});
                        $('#notifications').height(40);
                    }
                    else {
//                        $('#console').addClass('tilda');
                        $('#console').css({height: 180});
                        $('#notifications').height(200);
                    }

                    break;
                // +, -, 0: Zoom functions
                case 107:
                    FiercePlanet.Drawing.zoom(1);
                    break;
                case 109:
                    FiercePlanet.Drawing.zoom(-1);
                    break;
                case 96:
                    FiercePlanet.Drawing.zoom(0);
                    break;
                // Arrow buttons, 'h': Pan functions
                case 37:
                    FiercePlanet.Drawing.pan(2);
                    break;
                case 38:
                    FiercePlanet.Drawing.pan(0);
                    break;
                case 39:
                    FiercePlanet.Drawing.pan(3);
                    break;
                case 40:
                    FiercePlanet.Drawing.pan(1);
                    break;
                case 72:
                    FiercePlanet.Drawing.pan(4);
                    break;
                // 'p': Play/pause game
                case 80:
                    FiercePlanet.Lifecycle.playGame();
                    break;
                // 'n': New game
                case 78:
                    FiercePlanet.Lifecycle.newGame();
                    break;
                // 'r': Restart game
                case 82:
                    FiercePlanet.Lifecycle.restartLevel();
                    break;
                // 'w': Rewind
                case 87:
                    FiercePlanet.Lifecycle.slowDown();
                    break;
                // 'f': Fast forward
                case 70:
                    FiercePlanet.Lifecycle.speedUp();
                    break;
                // 't': Tutorial
                case 84:
                    $('#tutorial').click();
                    break;
                // 'g': Gallery
                case 71:
                    $('#level-gallery').click();
                    break;
                // 's': Settings
                case 83:
                    FiercePlanet.Dialogs.showSettings();
                    break;
                // 'e': Editor
                case 69:
                    $('#editor').click();
                    break;
                // '$': Resource Gallery
                case 52:
                    if (e.shiftKey)
                        FiercePlanet.Dialogs.showResourceGallery();
                    break;
            }

        }
    };

    /**
     *  Add button effects
     */
    this.addButtonEffects = function(e) {
        var imgSrc = e.src;
        if (imgSrc != undefined) {
            var tmp = imgSrc.split('.');
            tmp.splice(tmp.length - 1, 0, "down");
            var imgSrcDown = tmp.join(".");
            e.addEventListener('mouseover', function() { e.src = imgSrcDown;}, false);
            e.addEventListener('mouseout', function() { e.src = imgSrc;}, false);
            e.addEventListener('mousedown', function() { e.src = imgSrcDown;}, false);
            e.addEventListener('mouseup', function() { e.src = imgSrc;}, false);
        }
    };

    /**
     * Respond to clicks on the notice canvas
     * @param e
     */
    this.handleNoticeEvents = function(e) {
        if (FiercePlanet.Game.currentNotice != null) {
            var notice = FiercePlanet.Game.currentNotice;
            var s = notice.start;
            var d = notice.duration;
            if (s > FiercePlanet.Game.levelCounter || (s + d) < FiercePlanet.Game.levelCounter)
                return;
            var x = notice.x;
            var y = notice.y;
            var w = notice.width;
            var h = notice.height;
            var ex;
            var ey;
            if (e.offsetX || e.offsetX == 0) { // Opera
                ex = e.offsetX;
                ey = e.offsetY;
            }
            else if (e.layerX || e.layerX == 0) { // Firefox
                ex = e.layerX;
                ey = e.layerY;
            }
            if (ex >= x && ex <= x + w && ey >= y && ey <= y + h) {
                FiercePlanet.Game.currentNotice = undefined;
                FiercePlanet.Drawing.clearCanvas('#noticeCanvas');
            }
        }
    };

    /**
     * Get current world coordinates
     * @param e
     */
    this.getWorldCoordinates = function(e) {
        var x;
        var y;
        if (e.offsetX || e.offsetX == 0) { // IE9, Chrome, Safari
            x = e.offsetX;
            y = e.offsetY;
        }
        else if (e.layerX || e.layerX == 0) { // Firefox, Opera
            x = e.layerX;
            y = e.layerY;
        }
        return {x:x, y:y};
    };


    /**
     * Gets the current position of a mouse click
     * @param e
     */
    this.getCurrentPosition = function(e) {
        var __ret = FiercePlanet.GeneralUI.getWorldCoordinates(e);
        var x = __ret.x;
        var y = __ret.y;
        return FiercePlanet.GeneralUI.getCurrentPositionByCoordinates(x, y);
    };


    /**
     * Gets the current position of a mouse click
     * @param e
     */
    this.getCurrentPositionByCoordinates = function(x, y) {
        // Correct for pan offsets
        x -= FiercePlanet.Orientation.offsetX;
        y -= FiercePlanet.Orientation.offsetY;

        // Get midpoints
        var mx = FiercePlanet.Orientation.halfWorldWidth;
        var my = FiercePlanet.Orientation.halfWorldHeight;
        // Get differences
        var dx = x - mx;
        var dy = y - my;

        // Correct for zoom level
        x = mx + (dx / FiercePlanet.Orientation.zoomLevel);
        y = my + (dy / FiercePlanet.Orientation.zoomLevel);
        // Old. TODO: Remove once tested
        // x /= FiercePlanet.Orientation.zoomLevel;
        // y /= FiercePlanet.Orientation.zoomLevel;
        // TODO: Determine if this is still relevant
    //    x /= FiercePlanet.Orientation.externalZoomLevel;
    //    y /= FiercePlanet.Orientation.externalZoomLevel;
        // Correct for border
        x -= (1 / FiercePlanet.Orientation.zoomLevel);
        y -= (1 / FiercePlanet.Orientation.zoomLevel);

        // Correct for rotation
//        if (FiercePlanet.Orientation.rotationAngle != 0) {
            var newPos = FiercePlanet.Orientation.getRotationOffset(x, y);
            x = newPos.x;
            y = newPos.y;
//        }

        // Obtain the current cell based on mouse co-ordinates
        var posX = Math.floor(x / FiercePlanet.Orientation.cellWidth);
        var posY = Math.floor(y / FiercePlanet.Orientation.cellHeight);

        // Adjust for full-screen mode
        var sw = $("#baseCanvas").width();
        var sh = $("#baseCanvas").height();
        posX = Math.floor(posX / (sw / FiercePlanet.Orientation.worldWidth));
        posY = Math.floor(posY / (sh / FiercePlanet.Orientation.worldHeight));

        // Correct for tilt isometric view
        if (World.settings.skewTiles || FiercePlanet.Game.currentLevel.isometric) {
            var point = FiercePlanet.Isometric.normaliseCoordinates(x, y);
            posX = Math.floor(point.x / FiercePlanet.Orientation.cellWidth);
            posY = Math.floor(point.y / FiercePlanet.Orientation.cellHeight);
        }

        // Return the cell position
        return {posX:posX, posY:posY};
    };


    /**
     * Adds a notice to the notification area.
     * @param notice
     */
    this.notify = function(notice) {
//        jqconsole.Write(notice);
        Log.info(notice);
        //$("#notifications")[0].append(notice);
    };


    /**
     *  Makes key elements divs movable (draggable), if the setting is set to true
     */
    this.makeElementsMovable = function() {
        if (World.settings.makeElementsMovable) {
            $('#extended-area, #controls').draggable({cursor: "pointer"});
            $('#gameworld').resizable().draggable({handler: '#handle', cancel: '#world, #console'});
            $('#global-info-panel').draggable({cancel: '#swatch', cursor: "pointer"});
        }
        else {
            $('#extended-area, #controls').draggable('destroy');
            $('#gameworld').draggable('destroy');
            $('#global-info-panel').draggable('destroy');
        }
        $('#gameworld').disableSelection();
        $('.swatch-draggable').css({ zIndex: 1000})
        $('.swatch-instance').css({ zIndex: 1000})
    };


    /**
     * Show level information
     */
    this.levelInfo = function() {
        var levelHTML = "";
        var level = FiercePlanet.Game.currentLevel;
        if (level.image != undefined) {
            levelHTML += '<img src="' + level.image + '" alt="City Image" width="460" height="140">';
            if (level.imageAttribution)
                levelHTML += '<div style="font-size: 0.8em; text-align: right">' + level.imageAttribution + '</div>';
        }
        if (level.name != undefined) {
            levelHTML += "<h3>" + level.name + "</h3>";
        }
        if (level.introduction != undefined) {
            levelHTML += level.introduction;
        }
        FiercePlanet.Dialogs.newLevelDialog.html(levelHTML).dialog('open');
    };


    /**
     * Refresh the swatch area with the current profile capabilities
     */
    this.refreshSwatch = function() {
        // Make all capabilities inactive
        for (var i = 0; i < FiercePlanet.GENIUS_CAPABILITIES.length; i++) {
            var capability = $.trim(FiercePlanet.GENIUS_CAPABILITIES[i]);
            try {
                var el = $('#' + capability);
                el.addClass("inactive");
            }
            catch (err) {
            }
        }
        // Make the current profile's capabilities active
        for (var i = 0; i < FiercePlanet.Game.currentProfile.capabilities.length; i++) {
            var capability = $.trim(FiercePlanet.Game.currentProfile.capabilities[i]);
            try {
                var el = $('#' + capability);
                el.removeClass("inactive");
                $('#' + el.id).draggable({
    //                    appendTo: agentCanvas,
    //                    containment: agentCanvas,
    //                    grid: [FiercePlanet.Orientation.cellWidth, FiercePlanet.Orientation.cellHeight],
                    cursor: "pointer",
                    helper: "clone",
                    start: function(event, ui) {
                        FiercePlanet.Game.currentResourceId = this.id;
                    }
                });
                $('#' + el.id).click(function() {
                    FiercePlanet.Game.currentResourceId = this.id;
                });
            }
            catch (err) {
            }
        }
    };

    /**
     * Changes the preset level
     */
    this.changePresetLevel =  function() {
        var level = $('#levelInput').val();
        FiercePlanet.Game.currentLevelNumber = FiercePlanet.Utils.checkInteger(level);
        FiercePlanet.Game.currentLevelPreset = true;
        // Remember this level, along with other data
        FiercePlanet.ProfileUI.storeProfileData();
    };

    /**
     * Changes the preset level
     */
    this.changePresetLevelDirectly =  function() {
    //    $('.thumbnail').css({color: 'inherit', backgroundColor: 'inherit' });
    //    $(this).animate({
    //        color: "#000",
    //        backgroundColor: "#ffffaa"
    //      }, 500 );
        var level = $(this).attr('id');
        level = level.substring(11);
        FiercePlanet.GeneralUI.highlightGalleryItem(level);
        FiercePlanet.Game.currentLevelNumber = FiercePlanet.Utils.checkInteger(level);
        FiercePlanet.Game.currentLevelPreset = true;
        // Remember this level, along with other data
        FiercePlanet.ProfileUI.storeProfileData();
    };

    /**
     * Changes the preset level
     */
    this.changeLevelDirectly =  function() {
        var level = $(this).attr('id');
        level = level.substring(11);
        FiercePlanet.LevelUI.openLevelFromServer(level);
    };

    
    /**
     * Changes the preset level
     */
    this.highlightGalleryItem =  function(level) {
        $('.thumbnail').css({color: 'inherit', backgroundColor: 'inherit' });
        if (level > 0 && level <= 1000) {
            $('#levelSelect' + level).animate({
                color: "#000",
                backgroundColor: "#ffffaa"
              }, 500 );
        }
    };


    /**
     * Changes the difficulty
     */
    this.changeDifficulty = function () {
        var difficulty = $("input[@name=difficultyInput]:checked").val();
        FiercePlanet.Game.levelOfDifficulty = FiercePlanet.Utils.checkInteger(difficulty);
    };

}).apply(FiercePlanet.GeneralUI);
