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
     *  Does all the necessary binding for in-game mouse events
     */
    this.getTopMostCanvas = function() {
        return $('#noticeCanvas');
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
            if (s > Lifecycle.levelCounter || (s + d) < Lifecycle.levelCounter)
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
        if (World.settings.skewTiles || Lifecycle.currentLevel.isometric) {
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
            $('#graph-area, #controls').draggable({cursor: "pointer"});
            $('#gameworld').resizable().draggable({handler: '#handle', cancel: '#world, #console'});
            $('#global-info-panel').draggable({cancel: '#swatch', cursor: "pointer"});
        }
        else {
            $('#graph-area, #controls').draggable('destroy');
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
        var level = Lifecycle.currentLevel;
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
        if (FiercePlanet.Game.currentProfile.capabilities) {
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
        }
    };

}).apply(FiercePlanet.GeneralUI);
