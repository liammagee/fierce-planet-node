/*!
 * Fierce Planet - Drawing
 * Functions for drawing aspects of the game
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var FiercePlanet = FiercePlanet || {};


/**
 * @namespace Contains drawing functions
 */
FiercePlanet.Drawing = FiercePlanet.Drawing || {};

(function() {
    var plot;
    var plotUpdateInterval;
    var plotIntervalId;

    /**
     * Draws the game
     */
    this.drawGame = function() {
        // Clear canvases
        $('#map_canvas').empty();
        this.clearCanvas('#baseCanvas');
        this.clearCanvas('#resourceCanvas');
        this.clearCanvas('#scrollingCanvas');
        this.clearCanvas('#noticeCanvas');
        this.clearCanvas('#agentCanvas');

        // Draw basic elements
//    if ((FiercePlanet.currentLevel.mapOptions() != undefined && FiercePlanet.currentLevel.mapOptions()['latitude'] != undefined && FiercePlanet.currentLevel.mapOptions()['longitude'] != undefined)
//            || (FiercePlanet.currentLevel.getMapURL() != undefined && $.trim(FiercePlanet.currentLevel.getMapURL()).length > 0)) {
//        FiercePlanet.drawMap();
//        FiercePlanet.drawPath();
//    }
//    else {
//        FiercePlanet.drawTiles();
//        FiercePlanet.drawBackgroundImage();
//        FiercePlanet.drawPath();
//    }
//        if (World.settings.drawMap)
        this.drawMap();
        this.drawPath();

        this.drawEntryPoints();
        this.drawExitPoints();
        this.drawResources();
        this.drawScrollingLayer();
        this.drawScoreboard();
    };

    /**
     * Draws the game
     */
    this.drawMirrorGame = function() {
        // Clear canvases
        $('#alt_map_canvas').empty();
        this.clearCanvas('#alt_baseCanvas');
        this.clearCanvas('#alt_resourceCanvas');
        this.clearCanvas('#alt_scrollingCanvas');
        this.clearCanvas('#alt_noticeCanvas');
        this.clearCanvas('#alt_agentCanvas');

        this.drawMap('#alt_map_canvas');
        this.drawPath('#alt_baseCanvas');

        this.drawEntryPoints('#alt_baseCanvas');
        this.drawExitPoints('#alt_baseCanvas');
        this.drawResources('#alt_resourceCanvas');
        this.drawScrollingLayer('#alt_scrollingCanvas');
    };


    /**
     * Draw just the canvas layers
     */
    this.drawCanvases = function() {
        // Clear canvases
        this.clearCanvas('#baseCanvas');
        this.clearCanvas('#resourceCanvas');
    //    this.clearCanvas('#scrollingCanvas');
    //    this.clearCanvas('#noticeCanvas');
        this.clearCanvas('#agentCanvas');
    
        // Draw basic elements
    //    if ((FiercePlanet.currentLevel.mapOptions() != undefined && FiercePlanet.currentLevel.mapOptions()['latitude'] != undefined && FiercePlanet.currentLevel.mapOptions()['longitude'] != undefined)
    //            || (FiercePlanet.currentLevel.getMapURL() != undefined && $.trim(FiercePlanet.currentLevel.getMapURL()).length > 0)) {
    //        this.drawPath();
    //    }
    //    else {
    //        this.drawTiles();
    //        this.drawBackgroundImage();
    //        this.drawPath();
    //    }


        this.drawPath();
    
        this.drawEntryPoints();
        this.drawExitPoints();
        this.drawResources();
        this.drawAgents();
    };
    
    /**
     * Draws all the tiles on the map
     */
    this.drawTiles = function() {
        var tiles = FiercePlanet.currentLevel.tiles;
        for (var i = 0; i < tiles.length; i += 1) {
            if (tiles[i] != undefined)
                this.drawTile(tiles[i]);
        }
    };
    
    /**
     * Draws a tile
     * @param tile
     */
    this.drawTile = function(tile) {
        var canvas = $('#baseCanvas')[0];
        var ctx = canvas.getContext('2d');
    
        var x = tile.x * FiercePlanet.Orientation.cellWidth;
        var y = tile.y * FiercePlanet.Orientation.cellHeight;
        ctx.clearRect(x + 1, y + 1, FiercePlanet.Orientation.cellWidth - 1, FiercePlanet.Orientation.cellHeight - 1);
        if (tile.y == 0 || FiercePlanet.currentLevel.getTile(tile.x, tile.y - 1) == undefined) {
            var my_gradient = ctx.createLinearGradient(x, y, x, y + FiercePlanet.Orientation.cellHeight / 4);
            my_gradient.addColorStop(0, "#060");
            my_gradient.addColorStop(1, "#" + tile.color);
            ctx.fillStyle = my_gradient;
        }
        else {
            ctx.fillStyle = "#" + tile.color;
        }
        ctx.fillRect(x, y, FiercePlanet.Orientation.cellWidth, FiercePlanet.Orientation.cellHeight);
        ctx.strokeStyle = "#fff";
        ctx.strokeRect(x, y, FiercePlanet.Orientation.cellWidth, FiercePlanet.Orientation.cellHeight);
    };
    
    /**
     * Draws the current level path
     */
    this.drawPath = function(altCanvasName) {
        var canvasName = altCanvasName || '#baseCanvas';
        var canvas = $(canvasName)[0];
        var ctx = canvas.getContext('2d');
//        this.clearCanvas('baseCanvas');
//        ctx.clearRect(0, 0, FiercePlanet.Orientation.worldWidth, FiercePlanet.Orientation.worldHeight );
        var pathTiles = FiercePlanet.currentLevel.pathway;


        // Rotation logic here - TODO: Refactor out
        var midTilePosX = FiercePlanet.Orientation.halfWorldWidth;
        var midTilePosY = FiercePlanet.Orientation.halfWorldHeight;
        ctx.save();
        ctx.translate(midTilePosX, midTilePosY);
        ctx.rotate(FiercePlanet.Orientation.rotationAngle);

        for (var i = 0; i < pathTiles.length; i += 1) {
            var pathTile = pathTiles[i];

            var xPos = pathTile[0];
            var yPos = pathTile[1];
            var x = xPos * FiercePlanet.Orientation.cellWidth;
            var y = yPos * FiercePlanet.Orientation.cellHeight;

//            ctx.clearRect(x + 1, y + 1, FiercePlanet.Orientation.cellWidth - 1, FiercePlanet.Orientation.cellHeight - 1);

            var terrain = FiercePlanet.currentLevel.terrainMap[pathTile];
            var pathColor = terrain ? this.insertAlpha(terrain.color, terrain.alpha) : "#fff";

            if ((World.settings.skewTiles || FiercePlanet.currentLevel.isometric)) {
                var newOrigin = FiercePlanet.Isometric.doIsometricOffset(xPos, yPos);
                var originXp = newOrigin.x + FiercePlanet.Orientation.cellWidth / 2;
                var originYp = newOrigin.y + FiercePlanet.Orientation.cellHeight;
                originXp = originXp - (FiercePlanet.Orientation.worldWidth) / 2;
                originYp = originYp - (FiercePlanet.Orientation.worldHeight) / 2;
                FiercePlanet.Isometric.draw3DTile(ctx, [originXp, originYp], FiercePlanet.Orientation.cellHeight);

//                    var my_gradient = ctx.createLinearGradient(originXp, originYp, originXp, originYp + FiercePlanet.Orientation.cellHeight / 4);
//                    my_gradient.addColorStop(0, "#ccc");
//                    my_gradient.addColorStop(1, pathColor);
//                    ctx.fillStyle = my_gradient;
                if (!World.settings.hidePath) {
                    ctx.fillStyle = pathColor;
                    ctx.fill();
                }
                if (!World.settings.hidePathBorder) {
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = '#ccc'; //pathColor;
                    ctx.stroke();
                }
            }
            else {
                // Rotation logic here - TODO: Refactor out
                x = x - FiercePlanet.Orientation.halfWorldWidth;
                y = y - FiercePlanet.Orientation.halfWorldHeight;

                if (!World.settings.hidePath) {
                    if (yPos == 0 || FiercePlanet.currentLevel.getTile(xPos, yPos - 1) != undefined) {
                        var my_gradient = ctx.createLinearGradient(x, y, x, y + FiercePlanet.Orientation.cellHeight / 4);
                        my_gradient.addColorStop(0, "#ccc");
                        my_gradient.addColorStop(1, pathColor);
                        ctx.fillStyle = my_gradient;
                    }
                    else {
                        ctx.fillStyle = pathColor;
                    }
                    ctx.fillRect(x, y, FiercePlanet.Orientation.cellWidth, FiercePlanet.Orientation.cellHeight);
                }
                if (!World.settings.hidePathBorder) {
//                        ctx.border = "2px #eee solid";
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = '#ccc'; //pathColor;
                    ctx.strokeRect(x, y, FiercePlanet.Orientation.cellWidth, FiercePlanet.Orientation.cellHeight);
                }
            }
        }
        ctx.restore();

    };
    
    /**
     * Draws the background image, if one exists
     */
    this.drawBackgroundImage = function() {
        if (FiercePlanet.currentLevel.backgroundImage != undefined) {
            var canvas = $('#baseCanvas')[0];
            var ctx = canvas.getContext('2d');
            ctx.drawImage(FiercePlanet.currentLevel.image, 0, 0);
        }
    };
    
    /**
     * Callback method for Google Maps
     */
    this.drawMap = function(altCanvasName) {
        var canvasName = altCanvasName || '#map_canvas';
    //    if (FiercePlanet.googleMap == undefined)
        if (FiercePlanet.currentLevel != undefined) {
            var mapOptions = FiercePlanet.GoogleMapUtils.defaultOptions();
            $.extend(mapOptions, FiercePlanet.currentLevel.mapOptions);
    
            // Handle built-in zoom
            if (FiercePlanet.Orientation.zoomLevel > 1)
                mapOptions['zoom'] = mapOptions['zoom'] + Math.log(FiercePlanet.Orientation.zoomLevel) / Math.log(1.5);
    
            FiercePlanet.googleMap = FiercePlanet.GoogleMapUtils.createMap(mapOptions, canvasName);

            FiercePlanet.mapOptions = mapOptions;
    //        if (FiercePlanet.currentLevel.mapOptions()['tilt'] != undefined && FiercePlanet.currentLevel.mapOptions()['tilt'] != 'no')
    //            FiercePlanet.googleMap.setTilt(45);
        }
        else {
            FiercePlanet.googleMap = new google.maps.Map($(canvasName)[0], mapOptions);
        }
    };
    
    
    /**
     * Draws exit points on the map
     */
    this.drawExitPoints = function(altCanvasName) {
        var canvasName = altCanvasName || '#baseCanvas';
        var canvas = $(canvasName)[0];
        var ctx = canvas.getContext('2d');

        // Rotation logic here - TODO: Refactor out
        var midTilePosX = (FiercePlanet.Orientation.worldWidth) / 2;
        var midTilePosY = (FiercePlanet.Orientation.worldHeight) / 2;


        ctx.save();
        ctx.translate(midTilePosX, midTilePosY);
        ctx.rotate(FiercePlanet.Orientation.rotationAngle);

        for (var i = 0; i < FiercePlanet.currentLevel.exitPoints.length; i++) {
            var point = FiercePlanet.currentLevel.exitPoints[i];
            var xPos = point[0];
            var yPos = point[1];
            var x = xPos * FiercePlanet.Orientation.cellWidth + FiercePlanet.Orientation.cellWidth / 2;
            var y = yPos * FiercePlanet.Orientation.cellHeight + FiercePlanet.Orientation.cellHeight / 2;
            if ((World.settings.skewTiles || FiercePlanet.currentLevel.isometric)) {
                var newOrigin = FiercePlanet.Isometric.doIsometricOffset(point[0], point[1]);
                x = newOrigin.x + FiercePlanet.Orientation.cellWidth / 2;
                y = newOrigin.y + FiercePlanet.Orientation.cellWidth / 2;
            }
            // Rotation logic here - TODO: Refactor out
            x = x - (FiercePlanet.Orientation.worldWidth) / 2;
            y = y - (FiercePlanet.Orientation.worldHeight) / 2;
            var width = (FiercePlanet.Orientation.pieceWidth / 2);

            // Draw circle
            ctx.beginPath();
            ctx.arc(x, y, width, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.strokeStyle = "#000";
            ctx.stroke();
            ctx.fillStyle = "#fff";
            ctx.fill();
    
            // Draw progress
            var progressRatio = (FiercePlanet.currentWave - 1) / FiercePlanet.currentLevel.waveNumber;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.arc(x, y, width, - Math.PI / 2, - Math.PI / 2 + Math.PI * 2 * progressRatio, false);
            ctx.closePath();
            ctx.strokeStyle = "#000";
            ctx.stroke();
            ctx.fillStyle = "#93C83E";
            ctx.fill();
        }
        ctx.restore();
    };
    
    
    /**
     * Draws entry points on the map
     */
    this.drawEntryPoints = function(altCanvasName) {
        var canvasName = altCanvasName || '#baseCanvas';
        var canvas = $(canvasName)[0];
        var ctx = canvas.getContext('2d');


        // Rotation logic here - TODO: Refactor out
        var midTilePosX = (FiercePlanet.Orientation.worldWidth) / 2;
        var midTilePosY = (FiercePlanet.Orientation.worldHeight) / 2;
        ctx.save();
        ctx.translate(midTilePosX, midTilePosY);
        ctx.rotate(FiercePlanet.Orientation.rotationAngle);

        for (var i = 0; i < FiercePlanet.currentLevel.entryPoints.length; i++) {
            var point = FiercePlanet.currentLevel.entryPoints[i];
            var xPos = point[0];
            var yPos = point[1];
            var x = xPos * FiercePlanet.Orientation.cellWidth + FiercePlanet.Orientation.cellWidth / 2;
            var y = yPos * FiercePlanet.Orientation.cellHeight + FiercePlanet.Orientation.cellHeight / 2;
            if ((World.settings.skewTiles || FiercePlanet.currentLevel.isometric)) {
                var newOrigin = FiercePlanet.Isometric.doIsometricOffset(point[0], point[1]);
                x = newOrigin.x + FiercePlanet.Orientation.cellWidth / 2;
                y = newOrigin.y + FiercePlanet.Orientation.cellWidth / 2;
            }
            // Rotation logic here - TODO: Refactor out
            x = x - (FiercePlanet.Orientation.worldWidth) / 2;
            y = y - (FiercePlanet.Orientation.worldHeight) / 2;

            var width = (FiercePlanet.Orientation.pieceWidth / 2);


            // Draw circle
            ctx.beginPath();
            ctx.arc(x, y, width, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.strokeStyle = "#000";
            ctx.stroke();
            ctx.fillStyle = "#93C83E";
            ctx.fill();
    
            // Draw progress
            var progressRatio = (FiercePlanet.currentWave - 1) / FiercePlanet.currentLevel.waveNumber;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.arc(x, y, width, - Math.PI / 2, - Math.PI / 2 + Math.PI * 2 * progressRatio, false);
            ctx.closePath();
            ctx.strokeStyle = "#000";
            ctx.stroke();
            ctx.fillStyle = "#fff";
            ctx.fill();
        }
    
        ctx.restore();
    };
    
    
    /**
     * Draws the current notice
     *
     * @param notice
     */
    this.drawNotice = function(notice) {
        if (FiercePlanet.currentNotice != null) {
            this.clearCanvas('#noticeCanvas');
            var canvas = $('#noticeCanvas')[0];
            var ctx = canvas.getContext('2d');
    
    
            // Get parameters of the notice
            var text = FiercePlanet.currentNotice.text;
            var start = FiercePlanet.currentNotice.start;
            var duration = FiercePlanet.currentNotice.duration;
            var strengthOfNotice = (duration - (FiercePlanet.levelCounter - start)) / duration;
            var startingTransparency = 0.1;
            var alphaLevel = Math.pow(strengthOfNotice - startingTransparency, 0.5);
    
    
            // Notice dimensions
            var x = FiercePlanet.currentNotice.x;
            var y = FiercePlanet.currentNotice.y;
            var width = FiercePlanet.currentNotice.width;
            var height = FiercePlanet.currentNotice.height;
    
            // Styles
            var foregroundColor = this.insertAlpha(FiercePlanet.currentNotice.foregroundColor, alphaLevel);
            var backgroundColor = this.insertAlpha(FiercePlanet.currentNotice.backgroundColor, alphaLevel);
            var lineWidth = FiercePlanet.currentNotice.lineWidth;
            var font = FiercePlanet.currentNotice.font;
    
    
            // Draw the notice
            ctx.font = font;
            ctx.lineWidth = lineWidth;
    
            var roundedEdge = 10;
            ctx.clearRect(x - 1, y - 1, width + 2, height + 2);
    
            // Don't draw any more, if the notice is expired
            if (start > FiercePlanet.levelCounter || start + duration < FiercePlanet.levelCounter)
                return;
    
            ctx.beginPath();
            ctx.moveTo(x + roundedEdge, y);
            ctx.lineTo(x + width - roundedEdge, y);
            ctx.arcTo(x + width, y, x + width, y + roundedEdge, roundedEdge);
            ctx.lineTo(x + width, y + height - roundedEdge);
            ctx.arcTo(x + width, y + height, x + width - roundedEdge, y + height, roundedEdge);
            ctx.lineTo(x + roundedEdge, y + height);
            ctx.arcTo(x, y + height, x, y + height - roundedEdge, roundedEdge);
            ctx.lineTo(x, y + roundedEdge);
            ctx.arcTo(x, y, x + roundedEdge, y, roundedEdge);
            ctx.closePath();
    
            ctx.strokeStyle = foregroundColor;
            ctx.stroke();
            ctx.fillStyle = backgroundColor;
            ctx.fill();
    
            // Draw the text lines
            var lines = this.getTextLines(ctx, text, width - 20);
            ctx.fillStyle = foregroundColor;
            for (var i = 0; i < lines.length; i++) {
                ctx.fillText(lines[i], x + 10, y + (20 * (i + 1)));
            }
        }
    };
    
    /**
     * Calculates the text lines for notices displayed on the map
     * @param context
     * @param text
     * @param targetWidth
     */
    this.getTextLines = function(context, text, targetWidth) {
        var w = context.measureText(text).width;
        if (w < targetWidth)
            return [text];
        var numberOfLines = Math.ceil(w / targetWidth);
        var l = text.length / numberOfLines;
        var lines = [];
        var simpleTokens = text.split(' ');
        var line = '';
    
        for (var j = 0; j < simpleTokens.length; j++) {
            var token = simpleTokens[j];
            if (context.measureText(line + token + ' ').width < targetWidth) {
                line += token + ' ';
            }
            else if (line.length == 0 && context.measureText(token).width >= l) {
                var wt = context.measureText(token).width;
                var numberOfTokenLines = Math.ceil(wt / targetWidth);
                var tokenMarker = token.length / numberOfTokenLines;
                line += token.substring(0, tokenMarker - 1) + '-';
                var newToken = token.substring(tokenMarker, token.length);
                simpleTokens.splice(j, 0, newToken);
                lines.push(line);
                line = '';
            }
            else {
                lines.push(line);
                line = token + ' ';
            }
        }
        lines.push(line);
        return lines;
    };
    
    /**
     * Inserts an alpha value into a color string.
     * @param color
     * @param alphaLevel
     */
    this.insertAlpha = function(color, alphaLevel) {
        var newColor = color;

        if (color.length == 7 || color.length == 4)
            color = color.substring(1);

        // Is the color a six digit hexadecimal?
        if (color.length == 6) {
            var r = color.substring(0, 2);
            var g = color.substring(2, 4);
            var b = color.substring(4, 6);
            newColor = 'rgba(' + parseInt(r, 16) + ', ' + parseInt(g, 16) + ', ' + parseInt(b, 16) + ', ' + alphaLevel + ')';
        }
        // Is the color a six digit hexadecimal?
        else if (color.length == 3) {
            var r = color.substring(0, 1) + 'f';
            var g = color.substring(1, 2) + 'f';
            var b = color.substring(2, 3) + 'f';
            newColor = 'rgba(' + parseInt(r, 16) + ', ' + parseInt(g, 16) + ', ' + parseInt(b, 16) + ', ' + alphaLevel + ')';
        }
        // Otherwise assume it is rgba() format
        else {
            newColor = color.split(')').join(', ' + alphaLevel + ')');
        }
        return newColor;
    };
    
    
    /**
     * Draw all of the resources
     */
    this.drawResources = function(altCanvasName, altResources) {
        var canvasName = altCanvasName || '#resourceCanvas';

        var resources = altResources || FiercePlanet.currentLevel.resources;

        if ((World.settings.skewTiles || FiercePlanet.currentLevel.isometric) && World.settings.showResourcesAsBoxes) {
            this.clearCanvas(canvasName);
            var len = FiercePlanet.Orientation.cellsAcross;
            resources.sort(function(a, b) {
                return (((a.y * len) - a.x > (b.y * len) - b.x) ? 1 : ((a.y * len) - a.x < (b.y * len) - b.x) ? -1 : 0);
            });
        }

//        for (var i = 0; i < resources.length; i += 1) {
//            this.drawResource(resources[i]);
//        }

        // Inlined version
        var canvas = $(canvasName)[0];
        var ctx = canvas.getContext('2d');

        ctx.save();
        ctx.translate(FiercePlanet.Orientation.halfWorldWidth, FiercePlanet.Orientation.halfWorldHeight);
        ctx.rotate(FiercePlanet.Orientation.rotationAngle);

        for (var i = 0; i < resources.length; i += 1) {
            var resource = resources[i];

            // Variables
            var x = resource.x * FiercePlanet.Orientation.cellWidth;
            var y = resource.y * FiercePlanet.Orientation.cellHeight;
            var s = (resource.totalYield / resource.initialTotalYield) * 100;
            var c = resource.color;
            // Determine drawing colours and offsets
            var newColor = this.diluteColour(s, s, s, c);

            // Create a gradient to fill the cell from the bottom up
            var yOffset = (((FiercePlanet.Orientation.cellHeight) * (1.0 - (s / 100))) / 1.2) | 0;
            var resourceGradient = ctx.createLinearGradient(x, y + yOffset, x, y + FiercePlanet.Orientation.cellHeight);
//            resourceGradient.addColorStop(0, "#fff");
            resourceGradient.addColorStop(0, "#" + c);
            resourceGradient.addColorStop(0.5, "#" + c);
            resourceGradient.addColorStop(1, "#" + c);

            if ((World.settings.skewTiles || FiercePlanet.currentLevel.isometric)) {
                var tileOffset = FiercePlanet.Isometric.offsets3DPoint([FiercePlanet.Orientation.cellHeight, 0, 0]);
                var newOrigin = FiercePlanet.Isometric.doIsometricOffset(resource.x, resource.y);
                var originXp = newOrigin.x + FiercePlanet.Orientation.cellWidth / 2;
                var originYp = newOrigin.y + FiercePlanet.Orientation.cellHeight;

                // Rotation logic here - TODO: Refactor out
                originXp = originXp - (FiercePlanet.Orientation.halfWorldWidth);
                originYp = originYp - (FiercePlanet.Orientation.halfWorldHeight);

                ctx.fillStyle = "#fff";
                FiercePlanet.Isometric.draw3DTile(ctx, [originXp, originYp], FiercePlanet.Orientation.cellHeight);
                ctx.fill();

                var boxHeight = 0;
                ctx.lineWidth = 1;
                // Use box style - computationally expensive
                if (World.settings.showResourcesAsBoxes) {
                    boxHeight = (s / 100) * 20;
                    ctx.fillStyle = "#" + c;
                    ctx.strokeStyle = "#eee";
                    FiercePlanet.Isometric.box(ctx, originXp, originYp, 0, 0, 0, FiercePlanet.Orientation.cellHeight, boxHeight, FiercePlanet.Orientation.cellHeight);
                    ctx.fill();
                    ctx.stroke();
                }
                else {
                    resourceGradient = ctx.createLinearGradient(originXp, originYp - FiercePlanet.Orientation.cellHeight + yOffset, originXp, originYp);
                    resourceGradient.addColorStop(0, "#fff");
                    resourceGradient.addColorStop(0.5, "#" + c);
                    resourceGradient.addColorStop(1, "#" + c);
                    ctx.fillStyle = resourceGradient;
                    FiercePlanet.Isometric.draw3DTile(ctx, [originXp, originYp], FiercePlanet.Orientation.cellHeight);
                    ctx.fill();
                }

                // Draw resource-specific representation here
                if (resource.kind.image) {
                    var imgOffsetX = originXp - tileOffset.x / 2;
                    var imgOffsetY = originYp + tileOffset.y / 2 - boxHeight;
                    var resImage = new Image();
                    resImage.src = resource.kind.image;
                    ctx.drawImage(resImage, imgOffsetX, imgOffsetY, tileOffset.x, tileOffset.y);
                }
            }
            else {

                // Rotation logic here - TODO: Refactor out
                x = x - (FiercePlanet.Orientation.worldWidth) / 2;
                y = y - (FiercePlanet.Orientation.worldHeight) / 2;


                // Clear and fill the resource tile with a white background
                ctx.clearRect(x, y, FiercePlanet.Orientation.cellWidth, FiercePlanet.Orientation.cellHeight);
                ctx.fillStyle = "#fff";
                ctx.fillRect(x, y, FiercePlanet.Orientation.cellWidth, FiercePlanet.Orientation.cellHeight);

                ctx.fillStyle = resourceGradient;
                ctx.strokeStyle = "#333";
                ctx.fillRect(x, y + yOffset, FiercePlanet.Orientation.cellWidth, (FiercePlanet.Orientation.cellHeight - yOffset));

                ctx.lineWidth = 4;
                ctx.strokeStyle = "#" + newColor;

                // Draw resource-specific representation here
                if (resource.kind.image) {
                    var resImage = new Image();
                    resImage.src = resource.kind.image;
                    ctx.drawImage(resImage, x + 4, y + 4, FiercePlanet.Orientation.cellWidth - 8, FiercePlanet.Orientation.cellHeight - 8);
                }
            }
        }

        ctx.restore();


    };
    
    /**
     * Draw an individual resource
     * @param resource
     */
    this.drawResource = function(resource, altCanvasName) {
        var canvasName = altCanvasName || '#resourceCanvas';
        var canvas = $(canvasName)[0];
        var ctx = canvas.getContext('2d');
    
        ctx.save();
        ctx.translate(FiercePlanet.Orientation.halfWorldWidth, FiercePlanet.Orientation.halfWorldHeight);
        ctx.rotate(FiercePlanet.Orientation.rotationAngle);

        // Variables
        var x = resource.x * FiercePlanet.Orientation.cellWidth;
        var y = resource.y * FiercePlanet.Orientation.cellHeight;
        var s = (resource.totalYield / resource.initialTotalYield) * 100;
        var c = resource.color;
        // Determine drawing colours and offsets
        var newColor = this.diluteColour(s, s, s, c);

        // Create a gradient to fill the cell from the bottom up
        var yOffset = (((FiercePlanet.Orientation.cellHeight) * (1.0 - (s / 100))) / 1.2) | 0;
        var resourceGradient = ctx.createLinearGradient(x, y + yOffset, x, y + FiercePlanet.Orientation.cellHeight);
//        resourceGradient.addColorStop(0, "#fff");
        resourceGradient.addColorStop(0, "#" + c);
        resourceGradient.addColorStop(0.5, "#" + c);
        resourceGradient.addColorStop(1, "#" + c);

        if ((World.settings.skewTiles || FiercePlanet.currentLevel.isometric)) {
            var tileOffset = FiercePlanet.Isometric.offsets3DPoint([FiercePlanet.Orientation.cellHeight, 0, 0]);
            var newOrigin = FiercePlanet.Isometric.doIsometricOffset(resource.x, resource.y);
            var originXp = newOrigin.x + FiercePlanet.Orientation.cellWidth / 2;
            var originYp = newOrigin.y + FiercePlanet.Orientation.cellHeight;

            // Rotation logic here - TODO: Refactor out
            originXp = originXp - (FiercePlanet.Orientation.worldWidth) / 2;
            originYp = originYp - (FiercePlanet.Orientation.worldHeight) / 2;

            ctx.fillStyle = "#fff";
            FiercePlanet.Isometric.draw3DTile(ctx, [originXp, originYp], FiercePlanet.Orientation.cellHeight);
            ctx.fill();

            var boxHeight = 0;
            ctx.lineWidth = 1;
            // Use box style - computationally expensive
            if (World.settings.showResourcesAsBoxes) {
                boxHeight = (s / 100) * 20;
                ctx.fillStyle = "#" + c;
                ctx.strokeStyle = "#eee";
                FiercePlanet.Isometric.box(ctx, originXp, originYp, 0, 0, 0, FiercePlanet.Orientation.cellHeight, boxHeight, FiercePlanet.Orientation.cellHeight);
                ctx.fill();
                ctx.stroke();
            }
            else {
                resourceGradient = ctx.createLinearGradient(originXp, originYp - FiercePlanet.Orientation.cellHeight + yOffset, originXp, originYp);
                resourceGradient.addColorStop(0, "#fff");
                resourceGradient.addColorStop(0.5, "#" + c);
                resourceGradient.addColorStop(1, "#" + c);
                ctx.fillStyle = resourceGradient;
                FiercePlanet.Isometric.draw3DTile(ctx, [originXp, originYp], FiercePlanet.Orientation.cellHeight);
                ctx.fill();
            }

            // Draw resource-specific representation here
            if (resource.kind.image) {
                var imgOffsetX = originXp - tileOffset.x / 2;
                var imgOffsetY = originYp + tileOffset.y / 2 - boxHeight;
            }
        }
        else {

            // Rotation logic here - TODO: Refactor out
            x = x - (FiercePlanet.Orientation.worldWidth) / 2;
            y = y - (FiercePlanet.Orientation.worldHeight) / 2;


            // Clear and fill the resource tile with a white background
            ctx.clearRect(x, y, FiercePlanet.Orientation.cellWidth, FiercePlanet.Orientation.cellHeight);
            ctx.fillStyle = "#fff";
            ctx.fillRect(x, y, FiercePlanet.Orientation.cellWidth, FiercePlanet.Orientation.cellHeight);

            ctx.fillStyle = resourceGradient;
            ctx.strokeStyle = "#333";
            ctx.fillRect(x, y + yOffset, FiercePlanet.Orientation.cellWidth, (FiercePlanet.Orientation.cellHeight - yOffset));

            ctx.lineWidth = 4;
            ctx.strokeStyle = "#" + newColor;

            // Draw resource-specific representation here
            if (resource.kind.image) {
                var resImage = new Image();
                resImage.src = resource.kind.image;
                ctx.drawImage(resImage, x + 4, y + 4, FiercePlanet.Orientation.cellWidth - 8, FiercePlanet.Orientation.cellHeight - 8);
            }
        }
        ctx.restore();
    };
    
    
    /**
     * Clears an individual resource
     * @param resource
     */
    this.clearResource = function(resource) {
        var canvas = $('#resourceCanvas')[0];
        var ctx = canvas.getContext('2d');

        // Rotation logic here - TODO: Refactor out
        var midTilePosX = (FiercePlanet.Orientation.worldWidth) / 2;
        var midTilePosY = (FiercePlanet.Orientation.worldHeight) / 2;
        ctx.save();
        ctx.translate(midTilePosX, midTilePosY);
        ctx.rotate(FiercePlanet.Orientation.rotationAngle);

        var x = resource.x * FiercePlanet.Orientation.cellWidth;
        var y = resource.y * FiercePlanet.Orientation.cellHeight;

        if ((World.settings.skewTiles || FiercePlanet.currentLevel.isometric)) {
            var newOrigin = FiercePlanet.Isometric.doIsometricOffset(resource.x, resource.y);
            x = newOrigin.x + FiercePlanet.Orientation.cellWidth / 2;
            y = newOrigin.y + FiercePlanet.Orientation.cellHeight;
        }

        // Rotation logic here - TODO: Refactor out
        x = x - (FiercePlanet.Orientation.worldWidth) / 2;
        y = y - (FiercePlanet.Orientation.worldHeight) / 2;

        ctx.clearRect(x, y, FiercePlanet.Orientation.cellWidth, FiercePlanet.Orientation.cellHeight);

        ctx.restore();
    };
    
    /**
     * Clears a canvas
     * @param canvasID
     */
    this.clearCanvas = function(canvasID) {
        var canvas = $(canvasID)[0];
        var ctx = canvas.getContext('2d');
        var w = canvas.width;
        var h = canvas.height;
        ctx.clearRect(-w, -h, 3 * w, 3 * h);
//        canvas.width = canvas.width;
//        canvas.width = 1;
//        canvas.width = w;

    };
    
    /**
     * Clear all active agents
     */
    this.clearAgents = function() {
        this.clearAgentGroup(FiercePlanet.currentLevel.currentAgents);
    };
    
    /**
     * Clear the agent group
     */
    this.clearAgentGroup = function(agents) {
        var canvas = $('#agentCanvas')[0];
        var ctx = canvas.getContext('2d');

        // Rotation logic here - TODO: Refactor out
        var midTilePosX = (FiercePlanet.Orientation.worldWidth) / 2;
        var midTilePosY = (FiercePlanet.Orientation.worldHeight) / 2;
        ctx.save();
        ctx.translate(midTilePosX, midTilePosY);
        ctx.rotate(FiercePlanet.Orientation.rotationAngle);

        if (FiercePlanet.waveCounter > 0) {
            for (var i = 0; i < agents.length; i += 1) {
                var agent = agents[i];
                var wx = agent.wanderX;
                var wy = agent.wanderY;
                var __ret = this.getDrawingPosition(agent, FiercePlanet.waveCounter - 1);
                var xPos = __ret.intX;
                var yPos = __ret.intY;
                var x = xPos * FiercePlanet.Orientation.cellWidth + wx + 1;
                var y = yPos * FiercePlanet.Orientation.cellHeight + wy + 1;
                if ((World.settings.skewTiles || FiercePlanet.currentLevel.isometric)) {
                    var newOrigin = FiercePlanet.Isometric.doIsometricOffset(xPos, yPos);
                    x = newOrigin.x + wx + 1;// - FiercePlanet.Orientation.cellWidth / 2;
                    y = newOrigin.y + wy + 1;// - FiercePlanet.Orientation.cellHeight / 2;
                }

                // Rotation logic here - TODO: Refactor out
                x = x - (FiercePlanet.Orientation.worldWidth) / 2;
                y = y - (FiercePlanet.Orientation.worldHeight) / 2;

                ctx.clearRect(x, y, FiercePlanet.Orientation.cellWidth + wx + 1, FiercePlanet.Orientation.cellHeight + wy + 1);
                if (World.settings.agentTracing) {
                    ctx.beginPath();
                    ctx.arc(x + FiercePlanet.Orientation.cellWidth / 2, y + FiercePlanet.Orientation.cellHeight * 1.2, 2, 0, Math.PI * 2, false);
                    ctx.closePath();
                    ctx.strokeStyle = "#000";
                    ctx.stroke();
                    ctx.fillStyle = "#000";
                    ctx.fill();
                }
    
            }
        }
        ctx.restore();
    };
    
    
    /**
     * Dilutes (whitens) the colour of an element, given its strength (some value between 0 and 100)
     * @param rStrength
     * @param gStrength
     * @param bStrength
     * @param colour
     */
    this.diluteColour = function(rStrength, gStrength, bStrength, colour) {
        colour = colour || 'fff';
        var charOffset = (colour.length == 3 ? 1 : 2);
        var multiplier = (charOffset == 1 ? 1 : 16);
        var dilutionBase = 10;
        var maxValue = Math.pow(16, charOffset);
        var r = parseInt(colour.slice(0, 1 * charOffset), 16);
        var g = parseInt(colour.slice(1 * charOffset, 2 * charOffset), 16);
        var b = parseInt(colour.slice(2 * charOffset, 3 * charOffset), 16);
    
        var ro = Math.floor((100 - rStrength) / 100 * (maxValue - r));
        var go = Math.floor((100 - gStrength) / 100 * (maxValue - g));
        var bo = Math.floor((100 - bStrength) / 100 * (maxValue - b));
        var rOffset = (r + ro < maxValue ? r + ro : maxValue - 1).toString(16);
        var gOffset = (g + go < maxValue ? g + go : maxValue - 1).toString(16);
        var bOffset = (b + bo < maxValue ? b + bo : maxValue - 1).toString(16);
        rOffset = (rOffset.length < charOffset ? rOffset + "0" : rOffset);
        gOffset = (gOffset.length < charOffset ? gOffset + "0" : gOffset);
        bOffset = (bOffset.length < charOffset ? bOffset + "0" : bOffset);
        var newColor = rOffset + gOffset + bOffset;
        return newColor;
    };
    
    /**
     * Returns the direction for a given agent - '0' for horizontal, '1' for vertical
     * @param agent
     */
    this.getAgentDirection = function(agent) {
        var lastX = agent.lastMemory.x;
        var lastY = agent.lastMemory.y;
        var x = agent.x;
        var y = agent.y;
        if (lastX < x) {
            return 0;
        }
        else {
            return 1;
        }
    };
    
    
    /**
     * Retrieves the drawing position for an agent
     *
     * @param agent
     * @param counter
     */
    this.getDrawingPosition = function(agent, counter) {
        var lastX = agent.lastMemory.x;
        var lastY = agent.lastMemory.y;
        var x = agent.x;
        var y = agent.y;
        var wx = agent.wanderX;
        var wy = agent.wanderY;
        var speed = agent.speed;
        var delay = agent.delay;
        var countdown = agent.countdownToMove;
        var incrementTest = (speed - (counter - agent.delay) % speed) / speed;
        var increment = (speed - countdown) / speed;
    
        var offsetX = (x - lastX) * (increment);
        var offsetY = (y - lastY) * (increment);
        var intX = (x - offsetX);
        var intY = (y - offsetY);

        if (FiercePlanet.currentLevel.allowOffscreenCycling) {
            var halfWay = (increment < 0.5);
            if (x == FiercePlanet.Orientation.cellsAcross - 1 && lastX == 0) {
                if (halfWay) {
                    offsetX = (x - FiercePlanet.Orientation.cellsAcross) * (increment);
                    intX = (x - offsetX);
                }
                else {
                    offsetX = 1 - increment;
                    intX = offsetX;
                }
            }
            else if (x == 0 && lastX == FiercePlanet.Orientation.cellsAcross - 1) {
                if (halfWay) {
                    offsetX = increment;
                    intX = (0 - offsetX);
                }
                else {
                    offsetX = (FiercePlanet.Orientation.cellsAcross - lastX) * (increment);
                    intX = (FiercePlanet.Orientation.cellsAcross - offsetX);
                }
            }
            else if (y == FiercePlanet.Orientation.cellsDown - 1 && lastY == 0) {
                if (halfWay) {
                    offsetY = (y - FiercePlanet.Orientation.cellsDown) * (increment);
                    intY = (y - offsetY);
                }
                else {
                    offsetY = 1 - increment;
                    intY = offsetY;
                }
            }
            else if (y == 0 && lastY == FiercePlanet.Orientation.cellsDown - 1) {
                if (halfWay) {
                    offsetY = increment;
                    intY = (0 - offsetY);
                }
                else {
                    offsetY = (FiercePlanet.Orientation.cellsDown - lastY) * (increment);
                    intY = (FiercePlanet.Orientation.cellsDown - offsetY);
                }
            }
        }
        return {intX:intX, intY:intY};
    };
    
    /**
     * Draw agents on the agent canvas
     */
    this.drawAgents = function(altCanvasName, altAgents) {
        var canvasName = altCanvasName || '#agentCanvas';
        var canvas = $(canvasName)[0];
        var ctx = canvas.getContext('2d');


        // Rotation logic here - TODO: Refactor out
        var midTilePosX = (FiercePlanet.Orientation.worldWidth) / 2;
        var midTilePosY = (FiercePlanet.Orientation.worldHeight) / 2;

        ctx.save();
        ctx.translate(midTilePosX, midTilePosY);
        ctx.rotate(FiercePlanet.Orientation.rotationAngle);

        var agents = altAgents || FiercePlanet.currentLevel.currentAgents;
        for (var i = 0; i < agents.length; i += 1) {
            var agent = agents[i];
    
            // Don't process agents we want to block
            if (! World.settings.rivalsVisible && agent.agentType.name == AgentTypes.RIVAL_AGENT_TYPE.name)
                continue;
            if (! World.settings.predatorsVisible && agent.agentType.name == AgentTypes.PREDATOR_AGENT_TYPE.name)
                continue;
    
            // Get co-ordinates
            var wx = agent.wanderX;
            var wy = agent.wanderY;
            var __ret = this.getDrawingPosition(agent, FiercePlanet.waveCounter);
            var xPos = __ret.intX;
            var yPos = __ret.intY;

            var x = xPos * FiercePlanet.Orientation.cellWidth + wx + FiercePlanet.Orientation.cellWidth / 2;
            var y = yPos * FiercePlanet.Orientation.cellHeight + wy + FiercePlanet.Orientation.cellHeight / 4;

            if ((World.settings.skewTiles || FiercePlanet.currentLevel.isometric)) {
                var newOrigin = FiercePlanet.Isometric.doIsometricOffset(xPos, yPos);
                x = newOrigin.x + wx + FiercePlanet.Orientation.cellWidth / 2;
                y = newOrigin.y + wy + FiercePlanet.Orientation.cellHeight / 4;
            }
            
            // Rotation logic here - TODO: Refactor out
            x = x - (FiercePlanet.Orientation.worldWidth) / 2;
            y = y - (FiercePlanet.Orientation.worldHeight) / 2;

            var direction = this.getAgentDirection(agent);

    
            var blueH = agent.healthCategoryStats[World.resourceCategories[0].code];
            var greenH = agent.healthCategoryStats[World.resourceCategories[1].code];
            var redH = agent.healthCategoryStats[World.resourceCategories[2].code];
            var c = agent.color.toString();
            var newColor = this.diluteColour(redH, greenH, blueH, c);
            if (agent.isHit)
                newColor = "f00";
    
            try {
                eval(agent.agentType.drawFunction)(ctx, agent, x, y, FiercePlanet.Orientation.pieceWidth, FiercePlanet.Orientation.pieceHeight, newColor, FiercePlanet.waveCounter, direction);
            } catch(e) {
                eval(AgentTypes.CITIZEN_AGENT_TYPE.drawFunction)(ctx, agent, x, y, FiercePlanet.Orientation.pieceWidth, FiercePlanet.Orientation.pieceHeight, newColor, FiercePlanet.waveCounter, direction);
            }
    
        }

        ctx.restore();
    };
    
    /**
     * Draw agents on the agent canvas
     */
    this.drawExpiredAgent = function(agent, altCanvasName) {
        var canvasName = altCanvasName || '#scrollingCanvas';
        var canvas = $(canvasName)[0];
        var ctx = canvas.getContext('2d');


        // Rotation logic here - TODO: Refactor out
        var midTilePosX = (FiercePlanet.Orientation.worldWidth) / 2;
        var midTilePosY = (FiercePlanet.Orientation.worldHeight) / 2;

        ctx.save();
        ctx.translate(midTilePosX, midTilePosY);
        ctx.rotate(FiercePlanet.Orientation.rotationAngle);

        // Get co-ordinates
        var wx = agent.wanderX;
        var wy = agent.wanderY;
        var __ret = this.getDrawingPosition(agent, FiercePlanet.waveCounter);
        var xPos = __ret.intX;
        var yPos = __ret.intY;

        var x = xPos * FiercePlanet.Orientation.cellWidth + wx + FiercePlanet.Orientation.cellWidth / 2;
        var y = yPos * FiercePlanet.Orientation.cellHeight + wy + FiercePlanet.Orientation.cellHeight / 4;

        if ((World.settings.skewTiles || FiercePlanet.currentLevel.isometric)) {
            var newOrigin = FiercePlanet.Isometric.doIsometricOffset(xPos, yPos);
            x = newOrigin.x + wx + FiercePlanet.Orientation.cellWidth / 2;
            y = newOrigin.y + wy + FiercePlanet.Orientation.cellHeight / 4;
        }
    
        // Rotation logic here - TODO: Refactor out
        x = x - (FiercePlanet.Orientation.worldWidth) / 2;
        y = y - (FiercePlanet.Orientation.worldHeight) / 2;

        var direction = this.getAgentDirection(agent);
        var newColor = "f00";

        if (agent.agentType.drawExpired)
            agent.agentType.drawExpired(ctx, agent, x, y, FiercePlanet.Orientation.pieceWidth, FiercePlanet.Orientation.pieceHeight, newColor, FiercePlanet.waveCounter, direction);

        ctx.restore();
    };
    
    /**
     * Draw the scrolling layer
     */
    this.drawScrollingLayer = function(altCanvasName) {
        if (World.settings.scrollingImageVisible) {
            var canvasName = altCanvasName || '#scrollingCanvas';
            this.clearCanvas(canvasName);
            var canvas = $(canvasName)[0];
            var ctx = canvas.getContext('2d');
    
            // Add logic for catastrophe here
    
            if (World.settings.catastrophesVisible && FiercePlanet.currentLevel.catastrophe != undefined) {
                var catastrophe = FiercePlanet.currentLevel.catastrophe;
                if (catastrophe.notice.start <= FiercePlanet.levelCounter && (catastrophe.start + catastrophe.duration) >= FiercePlanet.levelCounter) {
                    FiercePlanet.currentNotice = catastrophe.notice;
                }
                if (catastrophe.start <= FiercePlanet.levelCounter && (catastrophe.start + catastrophe.duration) >= FiercePlanet.levelCounter) {
                    // Apply catastrophe effects
                    if (FiercePlanet.levelCounter >= (catastrophe.start + catastrophe.duration / 2)) {
                        catastrophe.strike();
                    }
    
                    // Get effect dimensions
                    var increments = catastrophe.duration / FiercePlanet.Orientation.worldWidth;
                    var leadIncrement = (FiercePlanet.levelCounter - catastrophe.start) / increments * 2;
                    var trailIncrement = ((catastrophe.start + catastrophe.duration) - FiercePlanet.levelCounter) / increments * 2;
                    var x = FiercePlanet.Orientation.worldWidth - leadIncrement;
                    var y = 0;
                    var w = trailIncrement;
                    var h = FiercePlanet.Orientation.worldHeight;
                    ctx.fillStyle = this.insertAlpha(catastrophe.kind.color, 0.5);
                    ctx.fillRect(x, y, w, h);
                    return;
                }
            }
    
            if ((FiercePlanet.scrollingImageX + FiercePlanet.scrollingImageOffset) < (480 - FiercePlanet.scrollingImageOffset)) {
                FiercePlanet.scrollingImageX += FiercePlanet.scrollingImageOffset;
            }
            else {
                FiercePlanet.scrollingImageX = 1;
            }
            // Need exception handling for Safari
            try {
                ctx.drawImage(FiercePlanet.scrollingImage, FiercePlanet.scrollingImageX, 1, 480, 400, 0, 0, 480, 400);
            }
            catch(err) {
            }
        }
    };
    
    /**
     * Draw the current level
     */
    this.drawLevel = function() {
        var e = $('#level-display')[0];
        e.innerHTML = FiercePlanet.currentLevel.id;
    };
    
    /**
     * Draw the current profile class
     */
    this.drawProfileClass = function() {
        var e = $('#profile-class-display')[0];
        if (e != undefined)
            e.innerHTML = FiercePlanet.currentProfile.profileClass;
    };
    
    /**
     * Update the current score
     */
    this.drawScore = function() {
        var e = $('#score-display')[0];
        e.innerHTML = FiercePlanet.Utils.zeroFill(FiercePlanet.currentProfile.currentScore, 5);
    };
    
    /**
     * Update the highest score
     */
    this.drawHighestScore = function() {
        var e = $('#highest-score-display')[0];
        var hs = FiercePlanet.currentProfile.highestScore;
        if (hs == undefined)
            hs = 0;
        e.innerHTML = hs.toString();
    };
    
    /**
     * Update resources in store
     */
    this.drawResourcesInStore = function() {
        var e = $('#goodness-display')[0];
        e.innerHTML = FiercePlanet.currentProfile.currentLevelResourcesInStore.toString();
    };
    
    /**
     * Update the number of expired agents
     */
    this.drawExpired = function() {
    //    var e = $('#expired-display')[0];
    //    e.innerHTML = FiercePlanet.expiredAgentCount.toString() + " out of " + FiercePlanet.currentLevel.expiryLimit;
        var e = $('#expired-citizens')[0];
        var expiredHTML = '';
        for (var i = 0, len = FiercePlanet.currentLevel.expiryLimit; i < len; i++) {
            if (i < FiercePlanet.currentProfile.currentLevelExpired)
                expiredHTML += '<div id="expired-citizen"></div>';
            else
                expiredHTML += '<div id="healthy-citizen"></div>';
        }
        e.innerHTML = expiredHTML;
    };
    
    /**
     * Update the number of saved agents
     */
    this.drawSaved = function() {
        var e = $('#saved-display')[0];
        var saved = FiercePlanet.currentProfile.currentLevelSaved.toString();
        var totalSaveable = FiercePlanet.currentLevel.getTotalSaveableAgents();
        e.innerHTML = saved + " out of " + totalSaveable;
    };
    
    /**
     * Update the current wave number
     */
    this.drawWaves = function() {
        var e = $('#waves-display')[0];
        e.innerHTML = FiercePlanet.currentWave.toString() + " out of " + FiercePlanet.currentLevel.waveNumber;
    };
    
    
    /**
     * Update the scoreboard
     */
    this.drawScoreboard = function() {
        this.drawLevel();
    //    FiercePlanet.drawProfileClass();
        this.drawScore();
        this.drawHighestScore();
        this.drawWaves();
        this.drawSaved();
        this.drawExpired();
        this.drawResourcesInStore();
    };
    
    
    /**
     * Pan around the current level
     *
     * @param offsetX
     * @param offsetY
     */
    this.panByDrag = function(offsetX, offsetY) {
    //    var canvases = $('canvas');
        var canvases = $('.scrollable-canvas');
        for (var i = 0; i < canvases.length; i++) {
            var canvas = canvases[i];
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.translate(offsetX, offsetY);
        }
        FiercePlanet.Orientation.offsetY += offsetY * FiercePlanet.Orientation.zoomLevel;
        FiercePlanet.Orientation.offsetX += offsetX * FiercePlanet.Orientation.zoomLevel;
        if (FiercePlanet.googleMap) {
            FiercePlanet.googleMap.panBy(- offsetX * FiercePlanet.Orientation.zoomLevel, - offsetY * FiercePlanet.Orientation.zoomLevel);
        }
        this.drawCanvases();
    };
    
    
    /**
     * Pan around the current level
     *
     * @param direction
     */
    this.pan = function(direction) {
        var offset = 10;
        switch (direction) {
            case 0:
                this.panByDrag(0, offset);
                break;
            case 1:
                this.panByDrag(0, -offset);
                break;
            case 2:
                this.panByDrag(offset, 0);
                break;
            case 3:
                this.panByDrag(-offset, 0);
                break;
            case 4:
                this.panByDrag(- FiercePlanet.Orientation.offsetX / FiercePlanet.Orientation.zoomLevel, - FiercePlanet.Orientation.offsetY / FiercePlanet.Orientation.zoomLevel);
                break;
        }
    };
    
    /**
     * Zoom in or out of the current level
     *
     * @param direction
     */
    this.zoom = function(direction) {
        var canvases = $('.scrollable-canvas');
        var existingZoom = FiercePlanet.Orientation.zoomLevel;
        var zoomChanged = false;
        for (var i = 0; i < canvases.length; i++) {
            var canvas = canvases[i];
            var ctx = canvas.getContext('2d');
            ctx.translate(FiercePlanet.Orientation.halfWorldWidth, FiercePlanet.Orientation.halfWorldHeight);
            switch (direction) {
                case -1:
                    if (FiercePlanet.Orientation.zoomLevel > 0.1) {
                        ctx.scale(1 / FiercePlanet.Orientation.zoomMagnificationFactor, 1 / FiercePlanet.Orientation.zoomMagnificationFactor);
                    }
                    break;
                case 0:
                    ctx.scale(1 / FiercePlanet.Orientation.zoomLevel, 1 / FiercePlanet.Orientation.zoomLevel);
                    break;
                case 1:
                    if (FiercePlanet.Orientation.zoomLevel < 10) {
                        ctx.scale(FiercePlanet.Orientation.zoomMagnificationFactor, FiercePlanet.Orientation.zoomMagnificationFactor);
                    }
                    break;
            }
            ctx.translate(- FiercePlanet.Orientation.halfWorldWidth, - FiercePlanet.Orientation.halfWorldHeight);
        }
        switch (direction) {
            case -1:
                if (FiercePlanet.Orientation.zoomLevel > 0.1) {
                    FiercePlanet.Orientation.zoomLevel *= 1 / FiercePlanet.Orientation.zoomMagnificationFactor;
                }
                break;
            case 0:
                FiercePlanet.Orientation.zoomLevel = 1;
                break;
            case 1:
                if (FiercePlanet.Orientation.zoomLevel < 10) {
                    FiercePlanet.Orientation.zoomLevel *= FiercePlanet.Orientation.zoomMagnificationFactor;
                }
                break;
        }
        if (FiercePlanet.googleMap) {
            var gZoom = FiercePlanet.googleMap.getZoom();
            var newZoom = FiercePlanet.Orientation.zoomLevel;
            var normalisedExistingZoom = Math.log(existingZoom) / Math.log(FiercePlanet.Orientation.zoomMagnificationFactor);
            var normalisedNewZoom = Math.log(newZoom) / Math.log(FiercePlanet.Orientation.zoomMagnificationFactor);
            var gZoomChange = normalisedNewZoom - normalisedExistingZoom;
            var newGZoom = ((gZoom + gZoomChange) < 1 ? 1 : ((gZoom + gZoomChange) > 20 ? 20 : gZoom + gZoomChange));
            FiercePlanet.googleMap.setZoom(newGZoom);
    
        }
        this.drawCanvases();
    };
    
    /**
     * Animates new level
     */
    this.animateLevel = function () {
        var canvases = $('#map_canvas, #baseCanvas, #scrollingCanvas, #noticeCanvas');
        var world = $('#world');
        var rwl = world.position().left;
        var rwt = world.position().top;
        var ww = world.width();
        var wh = world.height();
        var rw = rwl + Math.floor(Math.random() * ww);
        var rh = rwt + Math.floor(Math.random() * wh);
        world.css({'width': 0, 'height' : 0, 'left': rw, 'top': rh});
        world.animate({'width': ww, 'height': wh, 'left': rwl, 'top': rwt}, 1000);
        canvases.css({'width': 0, 'height' : 0});
        canvases.animate({'width': ww, 'height': wh}, 1000);
    };

    /**
     * Contract canvas
     */
    this.contract = function () {
        FiercePlanet.Orientation.adjustParameters(480,400);
        FiercePlanet.Drawing.drawCanvases();
    };

    /**
     * Expand canvas
     */
    this.expand = function () {
        FiercePlanet.Orientation.adjustParameters(600,400);
        FiercePlanet.Drawing.drawCanvases();
    };

    /**
     * Toggle 3d
     */
    this.toggle3d = function () {
        if (World.settings.skewTiles) {
            World.settings.skewTiles = false;
            $('#resourceCanvas').css({zIndex: 5});
            $('#agentCanvas').css({zIndex: 6});
            $('#3d')[0].innerHTML = 'View 3D';
        }
        else {
            World.settings.skewTiles = true;
            $('#resourceCanvas').css({zIndex: 6});
            $('#agentCanvas').css({zIndex: 5});
            $('#3d')[0].innerHTML = 'View 2D';
        }
        FiercePlanet.Drawing.drawCanvases();
    };

    /**
     * Reset view
     */
    this.resetView = function () {
        FiercePlanet.Drawing.zoom(0);
        FiercePlanet.Drawing.panByDrag(- FiercePlanet.Orientation.offsetX / FiercePlanet.Orientation.zoomLevel, - FiercePlanet.Orientation.offsetY / FiercePlanet.Orientation.zoomLevel);
        FiercePlanet.Orientation.reset();
        FiercePlanet.Drawing.drawGame();
    };

    /**
     * Tilt up
     */
    this.tiltUp = function () {
        FiercePlanet.Drawing.tilt(-0.05);
    };

    /**
     * Tilt down
     */
    this.tiltDown = function () {
        FiercePlanet.Drawing.tilt(0.05);
    };

    /**
     * Tilt 
     */
    this.tilt = function (amount) {
        FiercePlanet.Orientation.perspectiveAngle = FiercePlanet.Orientation.perspectiveAngle + amount;
        FiercePlanet.Drawing.drawCanvases();
    };

    /**
     * Rotate left
     */
    this.rotateLeft = function () {
        FiercePlanet.Drawing.rotate(-Math.PI / 8);
    };

    /**
     * Rotate down
     */
    this.rotateRight = function () {
        FiercePlanet.Drawing.rotate(Math.PI / 8);
    };

    /**
     * Rotate 
     */
    this.rotate = function (amount) {
        FiercePlanet.Orientation.rotationAngle = FiercePlanet.Orientation.rotationAngle + amount;
        FiercePlanet.Drawing.drawCanvases();
    };


    /**
     * Resets the flot graph
     */
    this.drawGraph = function () {
        if ($("#world-graph")[0]) {
            $("#world-graph").show();
            this.refreshGraph();
//        var options = {
//            series: { shadowSize: 0 }, // drawing is faster without shadows
//            yaxis: { min: 0, max: FiercePlanet.currentLevel.getTotalSaveableAgents() }
//        };
//        plot = $.plot($("#world-graph"),
//                [ { data: [[0, 0]], lines: { show: true } }, {data: [[0, 0]], lines: { show: true }} ],
//                options);
            plotUpdateInterval = 250;
            this.updateGraph();
        }
    };

    /**
     * Resets the flot graph
     */
    this.refreshGraph = function () {
        if ($("#world-graph")[0]) {
//            var totalSaveable = FiercePlanet.currentLevel ? FiercePlanet.currentLevel.getTotalSaveableAgents() : 55;
            var totalSaveable = 100;
            var options = {
                series: { shadowSize: 0 }, // drawing is faster without shadows
                yaxis: { min: 0, max: totalSaveable }
            };
			var seedData = [];
			for (var i in World.resourceCategories) {
                var cat = World.resourceCategories[i];
				seedData.push({ color: cat.color, data: [[0, 0]], lines: { show: true } });
			}
			seedData.push({ data: [[0, 0]], lines: { show: true } });

            plot = $.plot($("#world-graph"),
                    seedData,
                    options);
        }
    };

    /**
     * Closes the flot graph
     */
    this.clearGraph = function () {
        if ($("#world-graph")[0]) {
            $("#world-graph").hide();
            plot = null;
            plotUpdateInterval = 250;
            clearTimeout(plotIntervalId);
        }
    };
    
    /**
     * Updates the flot graph
     */
    this.updateGraph = function() {
        if ($("#world-graph")[0] && World.settings.showGraph) {
            if (FiercePlanet.inPlay) {
//                var savedData = plot.getData()[0].data;
//                var expiredData = plot.getData()[1].data;
				var data = plot.getData();
                if (FiercePlanet.levelCounter > 0) {
					//data = [];
					var stats = FiercePlanet.currentLevel.currentAgentHealthStats();
					var j = 0;
					for (var i in stats) {
						var d = [FiercePlanet.levelCounter, stats[i]];
						data[j].data.push(d);
						j++;
					}
					//data[j].data.push([FiercePlanet.levelCounter, stats.total])
                    //savedData.push([FiercePlanet.levelCounter, FiercePlanet.currentProfile.currentLevelSaved]);
                    //expiredData.push([FiercePlanet.levelCounter, FiercePlanet.currentProfile.currentLevelExpired]);
                }
				plot.setData(data);
/*
                plot.setData([
                    { data: savedData, lines: { show: true } },
                    {data: expiredData, lines: { show: true }}
                ]);
*/
                plot.setupGrid();
                plot.draw();
            }
            plotIntervalId = setTimeout(FiercePlanet.Drawing.updateGraph, plotUpdateInterval);
        }
    };
    
    
    /**
     * Tries to draw all of the canvases as a consolidated thumbnail
     * TODO: needs to be posted back to the server
     */
    this.drawThumbnail = function() {
        var imageCanvas = $('#imageCanvas')[0];
        var baseCanvas = $('#baseCanvas')[0];
        var resourceCanvas = $('#resourceCanvas')[0];
        var scrollingCanvas = $('#scrollingCanvas')[0];
        var noticeCanvas = $('#noticeCanvas')[0];
        var agentCanvas = $('#agentCanvas')[0];
        imageCanvas.getContext('2d').drawImage(baseCanvas, 0, 0);
        imageCanvas.getContext('2d').drawImage(resourceCanvas, 0, 0);
        imageCanvas.getContext('2d').drawImage(scrollingCanvas, 0, 0);
        imageCanvas.getContext('2d').drawImage(noticeCanvas, 0, 0);
        imageCanvas.getContext('2d').drawImage(agentCanvas, 0, 0);
        var imageData = imageCanvas.toDataURL();
        $.post('/levels/' + FiercePlanet.currentLevel.id + '/save_thumbnail',
        {thumbnail: imageData},
                function(data) {
                    alert('data posted')
                }
                );
    };


    /**
     *  Process mouse moves
     */
    this.highlightCell = function(e) {
		var x = e.pageX - FiercePlanet.Dialogs.calculateWorldLeft();
		var y = e.pageY - FiercePlanet.Dialogs.calculateWorldTop();

            // var __ret = FiercePlanet.GeneralUI.getCurrentPosition(e);
			var __ret = FiercePlanet.GeneralUI.getCurrentPositionByCoordinates(x, y);
            var xPos = __ret.posX;
            var yPos = __ret.posY;
            this.clearCanvas('#noticeCanvas');
			if (FiercePlanet.currentLevel.isInPath(xPos, yPos) > -1)
				return;

            var scrollingCanvas = $('#noticeCanvas')[0];
            var ctx = scrollingCanvas.getContext('2d');

            ctx.save();
            ctx.translate(FiercePlanet.Orientation.halfWorldWidth, FiercePlanet.Orientation.halfWorldHeight);
            ctx.rotate(FiercePlanet.Orientation.rotationAngle);

            var x = xPos * FiercePlanet.Orientation.cellWidth;
            var y = yPos * FiercePlanet.Orientation.cellHeight;


            if ((World.settings.skewTiles || FiercePlanet.currentLevel.isometric)) {
                var newOrigin = FiercePlanet.Isometric.doIsometricOffset(xPos, yPos);
                var originXp = newOrigin.x + FiercePlanet.Orientation.cellWidth / 2;
                var originYp = newOrigin.y + FiercePlanet.Orientation.cellHeight;
                originXp = originXp - (FiercePlanet.Orientation.worldWidth) / 2;
                originYp = originYp - (FiercePlanet.Orientation.worldHeight) / 2;
                FiercePlanet.Isometric.draw3DTile(ctx, [originXp, originYp], FiercePlanet.Orientation.cellHeight);

                ctx.lineWidth = 4;
                ctx.strokeStyle = '#f00'; //pathColor;
                ctx.stroke();
            }
            else {
                // Rotation logic here - TODO: Refactor out
                x = x - FiercePlanet.Orientation.halfWorldWidth;
                y = y - FiercePlanet.Orientation.halfWorldHeight;
                ctx.lineWidth = 4;
                ctx.strokeStyle = '#f00'; //pathColor;
                ctx.strokeRect(x, y, FiercePlanet.Orientation.cellWidth, FiercePlanet.Orientation.cellHeight);
            }

            ctx.restore();
    };

}).apply(FiercePlanet.Drawing);
