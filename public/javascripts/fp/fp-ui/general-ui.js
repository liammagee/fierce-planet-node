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
        $('#playAgents').click(FiercePlanet.playGame);
        $('#slowDown').click(FiercePlanet.slowDown);
        $('#speedUp').click(FiercePlanet.speedUp);
        $('#newGame').click(FiercePlanet.newGame);
        $('#restartLevel').click(FiercePlanet.restartLevel);
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

        $('#settings').click(FiercePlanet.Dialogs.showSettings);
        $('#credits').click(FiercePlanet.Dialogs.showCredits);
        $('#openLevelGallery').click(FiercePlanet.Dialogs.showLevelGallery);
        $('#editor').click(FiercePlanet.Dialogs.showLevelEditor);
        $('#3d').click(FiercePlanet.Drawing.toggle3d);

        $('#resetView').click(FiercePlanet.Drawing.resetView);
        $('#tiltUp').click(FiercePlanet.Drawing.tiltUp);
        $('#tiltDown').click(FiercePlanet.Drawing.tiltDown);
        $('#rotateLeft').click(FiercePlanet.Drawing.rotateLeft);
        $('#rotateRight').click(FiercePlanet.Drawing.rotateRight);

        // Admin functions
        $('#debug').click(FiercePlanet.processAgents);
        $('#replay').click(FiercePlanet.Recording.replayWorld);
        $('#story-board').click(FiercePlanet.Dev.showStoryboard);


        // Level editor functions
        try {
            $('#show-level-properties').click(FiercePlanet.Editor.showLevelProperties);
            $('#refresh-tiles').click(FiercePlanet.Editor.refreshTiles);
            $('#fill-all').click(FiercePlanet.Editor.fillAllTiles);
            $('#undo-action').click(FiercePlanet.Editor.undoAction);
            $('#cancel-level-editor').click(FiercePlanet.Editor.cancelLevelEditor);
            $('#save-level').click(FiercePlanet.Dialogs.saveLevel);
            $('#clear-entry-points').click(FiercePlanet.Editor.clearEntryPoints);
            $('#clear-exit-points').click(FiercePlanet.Editor.clearExitPoints);

            $('#edit-map').click(FiercePlanet.Editor.editMap);
            $('#save-map').click(FiercePlanet.Editor.saveMap);
            $('#close-map').click(FiercePlanet.Editor.closeMap);
        }
        catch (err){
            if (typeof console != "undefined")
                console.log(err);
        }

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

        FiercePlanet.GeneralUI.bindGameMouseEvents();

        $('#extended-area, #controls').draggable({cursor: "pointer"});
        $('#gameworld').resizable().draggable({handler: '#handle', cancel: '#world, #console'});
        $('#gameworld').disableSelection();
        $('#global-info-panel').draggable({cancel: '#swatch', cursor: "pointer"});
        $('.swatch-draggable').css({ zIndex: 1000})
        $('.swatch-instance').css({ zIndex: 1000})

        jqconsole.Focus();

    };

    /**
     *  Does all the necessary binding for in-game mouse events
     */
    this.bindGameMouseEvents = function() {
        var topMostCanvas = $('#scrollingCanvas');

        if (typeof console != "undefined")
            console.log('Binding mouse events');

        topMostCanvas.click(FiercePlanet.handleNoticeEvents);
        topMostCanvas.click(FiercePlanet.ResourceUI.processResourceCanvasClick);
        if (World.settings.allowInlinePanning) {
            topMostCanvas.mousedown(FiercePlanet.GeneralUI.registerMouseDown);
            topMostCanvas.mousemove(FiercePlanet.GeneralUI.registerMouseMove);
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
        var topMostCanvas = $('#scrollingCanvas');

        topMostCanvas.unbind('click');
    //    agentCanvas.unbind('click', FiercePlanet.handleNoticeEvents);
    //    agentCanvas.unbind('click', FiercePlanet.processResourceCanvasClick);
        topMostCanvas.unbind('mousedown', FiercePlanet.GeneralUI.registerMouseDown);
        topMostCanvas.unbind('mousemove', FiercePlanet.GeneralUI.registerMouseMove);
        topMostCanvas.unbind('mouseup', FiercePlanet.GeneralUI.registerMouseUp);
        topMostCanvas.unmousewheel();
        topMostCanvas.unbind("contextmenu");
    };

    /**
     *  Register mouse down event
     */
    this.registerMouseDown = function(e) {
        FiercePlanet.isMouseDown = true;
        FiercePlanet.isMouseMoving = false;
        if (e.offsetX || e.offsetX == 0) { // Opera
            FiercePlanet.currentX = e.offsetX;
            FiercePlanet.currentY = e.offsetY;
        }
        else if (e.layerX || e.layerX == 0) { // Firefox
            FiercePlanet.currentX = e.layerX;
            FiercePlanet.currentY = e.layerY;
        }
    };

    /**
     *  Register mouse move event
     */
    this.registerMouseMove = function(e) {
        if (FiercePlanet.isMouseDown) {
            FiercePlanet.isMouseMoving = true;
            FiercePlanet.GeneralUI.doMove(e);
        }
    };

    /**
     *  Process mouse moves
     */
    this.doMove = function(e) {
        if (FiercePlanet.isMouseDown) {
            var ex, ey;
            if (e.offsetX || e.offsetX == 0) { // Opera
                ex = e.offsetX;
                ey = e.offsetY;
            }
            else if (e.layerX || e.layerX == 0) { // Firefox
                ex = e.layerX;
                ey = e.layerY;
            }
            var offsetX = ex - FiercePlanet.currentX;
            var offsetY = ey - FiercePlanet.currentY;

			var midX = FiercePlanet.Orientation.halfWorldWidth;
			var midY = FiercePlanet.Orientation.halfWorldHeight;
			var	cx = FiercePlanet.currentX - midX;
			var	cy = FiercePlanet.currentY - midY;
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
            FiercePlanet.currentX = ex;
            FiercePlanet.currentY = ey;
        }
    };

    /**
     *  Register mouse up event
     */
    this.registerMouseUp = function(e) {
        if (e.preventDefault)
            e.preventDefault();
        if (FiercePlanet.isMouseDown && FiercePlanet.isMouseMoving) {
            FiercePlanet.GeneralUI.doMove(e);
            FiercePlanet.isMouseDown = false;
        }
        return false;
    };

    /**
     *  Add key handling events
     */
    this.handleKeyboardShortcuts = function(e) {

        console.log(e.which)
        
        if (World.settings.disableKeyboardShortcuts)
            return;

        // Return if command keys are selected
        if (e.ctrlKey || e.altKey || e.metaKey)
            return;


        if (World.settings.firstPerson) {
//            console.log(e.which);
            var myAgent = FiercePlanet.currentLevel.currentAgents[0];
            if (myAgent) {
                switch (e.which) {
                    // +, -, 0: Zoom functions
                    case 37:
                    case 65:
                        myAgent.x = myAgent.x - 1;
                        break;
                    case 39:
                    case 68:
                        myAgent.x = myAgent.x + 1;
                        break;
                    case 38:
                    case 87:
                        myAgent.y = myAgent.y - 1;
                        break;
                    case 40:
                    case 83:
                        myAgent.y = myAgent.y + 1;
                        break;
                }
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
                    FiercePlanet.playGame();
                    break;
                // 'n': New game
                case 78:
                    FiercePlanet.newGame();
                    break;
                // 'r': Restart game
                case 82:
                    FiercePlanet.restartLevel();
                    break;
                // 'w': Rewind
                case 87:
                    FiercePlanet.slowDown();
                    break;
                // 'f': Fast forward
                case 70:
                    FiercePlanet.speedUp();
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
                        FiercePlanet.showResourceGallery();
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
        if (FiercePlanet.currentNotice != null) {
            var notice = FiercePlanet.currentNotice;
            var s = notice.start;
            var d = notice.duration;
            if (s > FiercePlanet.levelCounter || (s + d) < FiercePlanet.levelCounter)
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
                FiercePlanet.currentNotice = undefined;
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
        x -= FiercePlanet.Orientation.offsetX;
        y -= FiercePlanet.Orientation.offsetY;
        x /= FiercePlanet.Orientation.zoomLevel;
        y /= FiercePlanet.Orientation.zoomLevel;
    //    x /= FiercePlanet.Orientation.externalZoomLevel;
    //    y /= FiercePlanet.Orientation.externalZoomLevel;

        // Compensate for border
        x -= (1 / FiercePlanet.Orientation.zoomLevel);
        y -= (1 / FiercePlanet.Orientation.zoomLevel);

        // Correct for rotation
//        if (FiercePlanet.Orientation.rotationAngle != 0) {
            var newPos = FiercePlanet.Orientation.getRotationOffset(x, y);
            x = newPos.x;
            y = newPos.y;
//        }

        var posX = Math.floor(x / FiercePlanet.Orientation.cellWidth);
        var posY = Math.floor(y / FiercePlanet.Orientation.cellHeight);


        // Adjust for full-screen mode
        var sw = $("#baseCanvas").width();
        var sh = $("#baseCanvas").height();
        posX = Math.floor(posX / (sw / FiercePlanet.Orientation.worldWidth));
        posY = Math.floor(posY / (sh / FiercePlanet.Orientation.worldHeight));

        // Correct for tilt isometric view
        if (World.settings.skewTiles || FiercePlanet.currentLevel.isometric) {
            var point = Isometric.normaliseCoordinates(x, y);
            posX = Math.floor(point.x / FiercePlanet.Orientation.cellWidth);
            posY = Math.floor(point.y / FiercePlanet.Orientation.cellHeight);
        }

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
     * Adds a notice to the level information area.
     * @param notice
     */
    this.levelInfo = function() {
        var levelHTML = "";
        var level = FiercePlanet.currentLevel;
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
        for (var i = 0; i < FiercePlanet.currentProfile.capabilities.length; i++) {
            var capability = $.trim(FiercePlanet.currentProfile.capabilities[i]);
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
                        FiercePlanet.currentResourceId = this.id;
                    }
                });
                $('#' + el.id).click(function() {
                    FiercePlanet.currentResourceId = this.id;
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
        FiercePlanet.currentLevelNumber = FiercePlanet.Utils.checkInteger(level);
        FiercePlanet.currentLevelPreset = true;
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
        FiercePlanet.currentLevelNumber = FiercePlanet.Utils.checkInteger(level);
        FiercePlanet.currentLevelPreset = true;
        // Remember this level, along with other data
        FiercePlanet.ProfileUI.storeProfileData();
    };

    /**
     * Changes the preset level
     */
    this.changeLevelDirectly =  function() {
        var level = $(this).attr('id');
        level = level.substring(11);

        // Retrieve level object from server
        $.get('/levels/' + level, function(tmpLevel) {
            if (tmpLevel) {
                FiercePlanet.Utils.makeFromJSONObject(tmpLevel, Level.prototype);
                for (var i in tmpLevel.resources) {
                    FiercePlanet.Utils.makeFromJSONObject(tmpLevel.resources[i], Resource.prototype);
                }
                tmpLevel.levelResources = tmpLevel.resources;

                FiercePlanet.currentLevel = tmpLevel;
                FiercePlanet.currentLevelNumber = tmpLevel.id;
                FiercePlanet.currentLevelPreset = false;

                // Remember this level, along with other data
                FiercePlanet.ProfileUI.storeProfileData();
                FiercePlanet.Dialogs.levelGalleryDialog.dialog('close');
                FiercePlanet.newLevel();
            }
        });
    };

    /**
     * Changes the preset level
     */
    this.highlightGalleryItem =  function(level) {
        $('.thumbnail').css({color: 'inherit', backgroundColor: 'inherit' });
        if (level > 0 && level <= 11) {
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
        FiercePlanet.levelOfDifficulty = FiercePlanet.Utils.checkInteger(difficulty);
    };

    /**
     * Make full screen
     */
    this.makeFullScreen = function () {
        var sw = $("body").width();
        var sh = $("body").height();

        // Clear canvases
    //    $('#content-pane').offset({left: 0, top: -110, width: sw, height: sh});
        $('#content-pane').css({left: 0, top: -110, width: sw, height: sh});
//        $('#map_canvas, #baseCanvas, #resourceCanvas, #scrollingCanvas, #noticeCanvas, #agentCanvas').css({left: 0, top: 0, width: sw, height: sh});
    //    $('#map_canvas').css({left: 0, top: 0, width: sw, height: sh});
    //    $('#baseCanvas, #resourceCanvas, #scrollingCanvas, #noticeCanvas, #agentCanvas').width(600);
    //    $('#baseCanvas').css({left: 0, top: 0, width: sw, height: sh});
    //    $('#baseCanvas').width(sw / 2);
        $('#controls').css({left: 0, top: 210, zIndex: 1});
        $('#swatch').css({left: sw - 160, top: sh - 400, zIndex: 1});

        FiercePlanet.drawGame();

    };

}).apply(FiercePlanet.GeneralUI);