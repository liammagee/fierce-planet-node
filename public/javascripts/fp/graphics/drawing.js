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

    /**
     * Draws the game
     */
    this.drawGame = function() {
        // Clear canvases
        $('#actual_map').empty();
        this.clearCanvas('#baseCanvas');
        this.clearCanvas('#resourceCanvas');
        this.clearCanvas('#scrollingCanvas');
        this.clearCanvas('#noticeCanvas');
        this.clearCanvas('#agentCanvas');

        // Draw basic elements
        if (!_.isUndefined(Lifecycle.currentWorld.backgroundTerrain) && Lifecycle.currentWorld.backgroundTerrain != null) {
            this.drawBackgroundTerrain();
            this.drawPath();
        }
        else {
            this.drawMap();
            this.drawPath();
        }
        this.drawEntryPoints();
        this.drawExitPoints();
        this.drawResources();
        this.drawScrollingLayer();
        this.drawScoreboard();
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

        if (!_.isUndefined(Lifecycle.currentWorld.backgroundTerrain) && Lifecycle.currentWorld.backgroundTerrain != null) {
            this.drawBackgroundTerrain();
            this.drawPath();
        }
        else {
            this.drawPath();
        }

        this.drawEntryPoints();
        this.drawExitPoints();
        this.drawResourceAndAgents();
//        this.drawResources();
//        this.drawAgents();
    };
    
    /**
     * Draws all the tiles on the map
     */
    this.drawBackgroundTerrain = function(altCanvasName) {
        var canvasName = altCanvasName || '#baseCanvas';
        var canvas = $(canvasName)[0];
        var ctx = canvas.getContext('2d');
        var terrain = Lifecycle.currentWorld.backgroundTerrain;
        var pathColor = terrain ? terrain.color.cssa() : "#fff";

        ctx.fillStyle = pathColor;
        ctx.fillRect(0, 0, FiercePlanet.Orientation.worldWidth, FiercePlanet.Orientation.worldHeight);
    };

    /**
     * Draws the current world path
     */
    this.drawPath = function(altCanvasName) {
        var canvasName = altCanvasName || '#baseCanvas';
        var canvas = $(canvasName)[0];
        var ctx = canvas.getContext('2d');
        var world = Lifecycle.currentWorld;
        var pathCells = ( (!_.isUndefined(world.drawAllCells) && world.drawAllCells) ?
            _.map(world.cells, function(cell) {return [cell.x, cell.y]}) :
            world.pathway);

        // Rotation logic here - TODO: Refactor out
        var midTilePosX = FiercePlanet.Orientation.halfWorldWidth;
        var midTilePosY = FiercePlanet.Orientation.halfWorldHeight;
        ctx.save();
//        ctx.scale(0.33, 0.33);
        ctx.translate(midTilePosX, midTilePosY);
        ctx.rotate(FiercePlanet.Orientation.rotationAngle);

        if (pathCells) {
            for (var i = 0; i < pathCells.length; i += 1) {
                var pathTile = pathCells[i];

                var xPos = pathTile[0];
                var yPos = pathTile[1];
                // INLINED SCALE
                var x = xPos * FiercePlanet.Orientation.cellWidth * FiercePlanet.Orientation.zoomWorld;
                var y = yPos * FiercePlanet.Orientation.cellHeight * FiercePlanet.Orientation.zoomWorld;
//                var x = xPos * FiercePlanet.Orientation.cellWidth;
//                var y = yPos * FiercePlanet.Orientation.cellHeight;

                var terrain = Lifecycle.currentWorld.getCell(xPos, yPos).terrain;
                var pathColor = terrain ? terrain.color.cssa() : "#000";

                if ((Universe.settings.isometricView || Lifecycle.currentWorld.isometricView)) {
                    var newOrigin = FiercePlanet.Isometric.doIsometricOffset(xPos, yPos);
                    // INLINED SCALE
                    var originXp = newOrigin.x + FiercePlanet.Orientation.cellWidth / 2;
                    var originYp = newOrigin.y + FiercePlanet.Orientation.cellHeight;
                    originXp = (originXp - FiercePlanet.Orientation.halfWorldWidth) * FiercePlanet.Orientation.zoomWorld;
                    originYp = (originYp - FiercePlanet.Orientation.halfWorldHeight) * FiercePlanet.Orientation.zoomWorld;
                    FiercePlanet.Isometric.draw3DTile(ctx, [originXp, originYp], FiercePlanet.Orientation.cellHeight * FiercePlanet.Orientation.zoomWorld);
//                    var originXp = newOrigin.x + FiercePlanet.Orientation.cellWidth / 2;
//                    var originYp = newOrigin.y + FiercePlanet.Orientation.cellHeight;
//                    originXp = originXp - (FiercePlanet.Orientation.worldWidth) / 2;
//                    originYp = originYp - (FiercePlanet.Orientation.worldHeight) / 2;
//                    FiercePlanet.Isometric.draw3DTile(ctx, [originXp, originYp], FiercePlanet.Orientation.cellHeight);
                    if (!Universe.settings.hidePath) {
                        ctx.fillStyle = pathColor;
                        ctx.fill();
                    }
                    if (!Universe.settings.hidePathBorder) {
                        ctx.lineWidth = 1 / FiercePlanet.Orientation.zoomWorld;
                        ctx.strokeStyle = one.color('#ccc').hex(); //pathColor;
                        ctx.stroke();
                    }
                }
                else {
                    // INLINED SCALE
                    x = x - FiercePlanet.Orientation.halfWorldWidth * FiercePlanet.Orientation.zoomWorld;
                    y = y - FiercePlanet.Orientation.halfWorldHeight * FiercePlanet.Orientation.zoomWorld;
//                    x = x - FiercePlanet.Orientation.halfWorldWidth;
//                    y = y - FiercePlanet.Orientation.halfWorldHeight;

                    if (!Universe.settings.hidePath) {
//                        if (yPos == 0 || !Lifecycle.currentWorld.areAgentsAllowed(xPos, yPos - 1)) {
                        if (yPos == 0) {
                            var my_gradient = ctx.createLinearGradient(x, y, x, y + FiercePlanet.Orientation.cellHeight / 4);
                            my_gradient.addColorStop(0, "#ccc");
                            try {
                                my_gradient.addColorStop(1, pathColor);
                            }
                            catch (err) {
                                if (console !== undefined)
                                    console.log(pathColor)
                            }
                            ctx.fillStyle = my_gradient;
                        }
                        else {
                            ctx.fillStyle = pathColor;
                        }

                        // INLINED SCALE
                        ctx.fillRect(x, y, FiercePlanet.Orientation.cellWidth * FiercePlanet.Orientation.zoomWorld, FiercePlanet.Orientation.cellHeight * FiercePlanet.Orientation.zoomWorld);
//                        ctx.fillRect(x, y, FiercePlanet.Orientation.cellWidth, FiercePlanet.Orientation.cellHeight);
                    }
                    if (!Universe.settings.hidePathBorder) {
//                        ctx.border = "2px #eee solid";
                        ctx.lineWidth = 1 / FiercePlanet.Orientation.zoomWorld;
                        ctx.strokeStyle = '#ccc'; //pathColor;
                        ctx.strokeRect(x, y, FiercePlanet.Orientation.cellWidth, FiercePlanet.Orientation.cellHeight);
                    }
                }

            }
        }
        ctx.restore();

    };
    
    /**
     * Draws the background image, if one exists
     */
    this.drawBackgroundImage = function() {
        if (Lifecycle.currentWorld.backgroundImage != undefined) {
            var canvas = $('#baseCanvas')[0];
            var ctx = canvas.getContext('2d');
            ctx.drawImage(Lifecycle.currentWorld.image, 0, 0);
        }
    };
    
    /**
     * Callback method for Google Maps
     */
    this.drawMap = function() {
        var canvasName = '#actual_map';

        if (Lifecycle.currentWorld != undefined && !Lifecycle.currentWorld.noMap) {
            FiercePlanet.GoogleMapUtils.loadScript();
            var mapOptions = FiercePlanet.GoogleMapUtils.defaultOptions();
            if (Lifecycle.currentWorld.mapOptions)
                $.extend(mapOptions, Lifecycle.currentWorld.mapOptions);

            // Handle built-in zoom
            if (FiercePlanet.Orientation.zoomWorld > 1)
                mapOptions['zoom'] = mapOptions['zoom'] + Math.log(FiercePlanet.Orientation.zoomWorld) / Math.log(1.5);

            if (Universe.settings.isometricView) {
                mapOptions['tilt'] = 45;
            }
            else {
                mapOptions['tilt'] = 0;
            }

            FiercePlanet.Game.googleMap = FiercePlanet.GoogleMapUtils.createMap(mapOptions, canvasName);
            FiercePlanet.Game.mapOptions = mapOptions;
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

        var exitPoints = Lifecycle.currentWorld.getExitPoints();
        for (var i = 0; i < exitPoints.length; i++) {
            var point = exitPoints[i];
            var xPos = point.x;
            var yPos = point.y;
            var x = xPos * FiercePlanet.Orientation.cellWidth + FiercePlanet.Orientation.cellWidth / 2;
            var y = yPos * FiercePlanet.Orientation.cellHeight + FiercePlanet.Orientation.cellHeight / 2;
            if ((Universe.settings.isometricView || Lifecycle.currentWorld.isometricView)) {
                var newOrigin = FiercePlanet.Isometric.doIsometricOffset(point[0], point[1]);
                x = newOrigin.x + FiercePlanet.Orientation.cellWidth / 2;
                y = newOrigin.y + FiercePlanet.Orientation.cellHeight / 2;
            }
            // INLINE SCALE
            x = (x - FiercePlanet.Orientation.halfWorldWidth) * FiercePlanet.Orientation.zoomWorld;
            y = (y - FiercePlanet.Orientation.halfWorldHeight) * FiercePlanet.Orientation.zoomWorld;
//            x = (x - (FiercePlanet.Orientation.worldWidth) / 2) * FiercePlanet.Orientation.zoomWorld;
//            y = (y - (FiercePlanet.Orientation.worldHeight) / 2) * FiercePlanet.Orientation.zoomWorld;
            var radius = (FiercePlanet.Orientation.pieceHeight / 2);

            // Draw circle
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.strokeStyle = "#000";
            ctx.stroke();
            ctx.fillStyle = "#fff";
            ctx.fill();
    
            // Draw progress
            var progressRatio = (FiercePlanet.Game.currentWave - 1) / Lifecycle.currentWorld.waveNumber;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.arc(x, y, radius, - Math.PI / 2, - Math.PI / 2 + Math.PI * 2 * progressRatio, false);
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

        var entryPoints = Lifecycle.currentWorld.getEntryPoints();
        for (var i = 0; i < entryPoints.length; i++) {
            var cell = entryPoints[i];
            var xPos = cell.x;
            var yPos = cell.y;
            var x = xPos * FiercePlanet.Orientation.cellWidth + FiercePlanet.Orientation.cellWidth / 2;
            var y = yPos * FiercePlanet.Orientation.cellHeight + FiercePlanet.Orientation.cellHeight / 2;
            if ((Universe.settings.isometricView || Lifecycle.currentWorld.isometricView)) {
                var newOrigin = FiercePlanet.Isometric.doIsometricOffset(cell[0], cell[1]);
                x = newOrigin.x + FiercePlanet.Orientation.cellWidth / 2;
                y = newOrigin.y + FiercePlanet.Orientation.cellHeight / 2;
            }
            // INLINE SCALE
            x = (x - FiercePlanet.Orientation.halfWorldWidth) * FiercePlanet.Orientation.zoomWorld;
            y = (y - FiercePlanet.Orientation.halfWorldHeight) * FiercePlanet.Orientation.zoomWorld;
//            x = (x - (FiercePlanet.Orientation.worldWidth) / 2) * FiercePlanet.Orientation.zoomWorld;
//            y = (y - (FiercePlanet.Orientation.worldHeight) / 2) * FiercePlanet.Orientation.zoomWorld;

            var radius = (FiercePlanet.Orientation.pieceHeight / 2);

            // Draw circle
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.strokeStyle = "#000";
            ctx.stroke();
            ctx.fillStyle = "#93C83E";
            ctx.fill();
    
            // Draw progress
            var progressRatio = (FiercePlanet.Game.currentWave - 1) / Lifecycle.currentWorld.waveNumber;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.arc(x, y, radius, - Math.PI / 2, - Math.PI / 2 + Math.PI * 2 * progressRatio, false);
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
        if (FiercePlanet.Game.currentNotice != null) {

            // Get parameters of the notice
            var text = FiercePlanet.Game.currentNotice.text;
            var start = FiercePlanet.Game.currentNotice.start;
            var duration = FiercePlanet.Game.currentNotice.duration;
            var strengthOfNotice = (duration - (Lifecycle.worldCounter - start)) / duration;
            var startingTransparency = 0.1;
            var alpha = Math.pow(strengthOfNotice - startingTransparency, 0.5);


            // Notice dimensions
            var x = FiercePlanet.Game.currentNotice.x;
            var y = FiercePlanet.Game.currentNotice.y;
            var width = FiercePlanet.Game.currentNotice.width;
            var height = FiercePlanet.Game.currentNotice.height;

            // Styles
            var foregroundColor = this.insertAlpha(FiercePlanet.Game.currentNotice.foregroundColor, alpha);
            var backgroundColor = this.insertAlpha(FiercePlanet.Game.currentNotice.backgroundColor, alpha);
            var lineWidth = FiercePlanet.Game.currentNotice.lineWidth;
            var font = FiercePlanet.Game.currentNotice.font;



            // Don't draw any more, if the notice is expired
            if (start > Lifecycle.worldCounter || start + duration < Lifecycle.worldCounter) {
                if (!_.isUndefined(this.noticeDialog)) {
                    this.noticeDialog.dialog('close');
                    this.noticeDialog = undefined;
                }
            }
            else {
                if (_.isUndefined(this.noticeDialog)) {
                    this.noticeDialog = $('<div></div>')
                        .html(text)
                        .dialog({
                            autoOpen: false,
                            modal: false,
                            title: 'Fierce Planet Notice!',
                            buttons: {
                                "Close": function() {
                                    $( this ).dialog( "close" );
                                    Lifecycle._startAgents();
                                }
                            }

                        });
                    this.noticeDialog.dialog('open');
                }
            }

            /*
            this.noticeDialog = $('<div></div>')
                .html(text)
                .dialog({
                    autoOpen: true,
                    modal: false,
                    title: 'Fierce Planet Notice!',
                    buttons: {
                        "Continue": function() {
                            $( this ).dialog( "close" );
                            Lifecycle._startAgents();
                        }
                    }

                });
                */



            // Direct drawing to Canvas version
            /*
             // Draw the notice
             ctx.font = font;
             ctx.lineWidth = lineWidth;

             var roundedEdge = 10;
             ctx.clearRect(x - 1, y - 1, width + 2, height + 2);
             this.clearCanvas('#noticeCanvas');
            var canvas = $('#noticeCanvas')[0];
            var ctx = canvas.getContext('2d');
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
            */
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
     * @param alphaWorld
     */
    this.insertAlpha = function(color, alphaWorld) {
        var newColor = color;

        if (color.length == 7 || color.length == 4)
            color = color.substring(1);

        // Is the color a six digit hexadecimal?
        if (color.length == 6) {
            var r = color.substring(0, 2);
            var g = color.substring(2, 4);
            var b = color.substring(4, 6);
            newColor = 'rgba(' + parseInt(r, 16) + ', ' + parseInt(g, 16) + ', ' + parseInt(b, 16) + ', ' + alphaWorld + ')';
        }
        // Is the color a six digit hexadecimal?
        else if (color.length == 3) {
            var r = color.substring(0, 1) + 'f';
            var g = color.substring(1, 2) + 'f';
            var b = color.substring(2, 3) + 'f';
            newColor = 'rgba(' + parseInt(r, 16) + ', ' + parseInt(g, 16) + ', ' + parseInt(b, 16) + ', ' + alphaWorld + ')';
        }
        // Otherwise assume it is rgba() format
        else {
            newColor = color.split(')').join(', ' + alphaWorld + ')');
        }
        return newColor;
    };
    
    
    /**
     * Draw all of the resources
     */
    this.drawResourceAndAgents = function(altCanvasName, altResources) {
        var canvasName = altCanvasName || '#resourceCanvas';

        var world = Lifecycle.currentWorld,
            resources = world.resources,
            agents = world.getCurrentAgents();
        var start = Date.now();

//        if (_.isUndefined(world.dontClearCanvas) || ! world.dontClearCanvas)
//            this.clearCanvas(canvasName);
        var len = FiercePlanet.Orientation.cellsAcross;

        // Inlined version
        var canvas = $(canvasName)[0];
        var ctx = canvas.getContext('2d');
        ctx.save();
        ctx.translate(FiercePlanet.Orientation.halfWorldWidth, FiercePlanet.Orientation.halfWorldHeight);
        ctx.rotate(FiercePlanet.Orientation.rotationAngle);

        // Handle this special case by merging/sorting resources and agents, so top-most entities are not rendered with overlap
        this.clearAgentsInline(ctx);
        if ((Universe.settings.isometricView || world.isometricView) && resources.length > 0) {
            var entities = _.union(resources, agents)
                .sort(function(a, b) {
                    return (((a.y * len) - a.x > (b.y * len) - b.x) ? 1 : ((a.y * len) - a.x < (b.y * len) - b.x) ? -1 : 0);
                });
            for (var i = 0; i < entities.length; i += 1) {
                var entity = entities[i];

                if (/(\w+)\(/.exec(entity.constructor.toString())[1] == 'Resource') {
                    FiercePlanet.Drawing.drawJustResource(ctx, entity);
                }
                else {
                    var x = entity.x, y = entity.y;
                    var neighbouringResources = world.getNeighbouringResources(x, y);
                    neighbouringResources.forEach(function(resource) {
                        FiercePlanet.Drawing.drawResourceAgentInteraction(ctx, resource, entity);
                    });
                    FiercePlanet.Drawing.drawAgent(ctx, entity);
                }
            }
        }
        else {
            resources.forEach(function(resource) {
                FiercePlanet.Drawing.drawJustResource(ctx, resource);
            })
            agents.forEach(function(agent) {
                var x = agent.x, y = agent.y;
                var neighbouringResources = world.getNeighbouringResources(x, y);
                neighbouringResources.forEach(function(resource) {
                    FiercePlanet.Drawing.drawResourceAgentInteraction(ctx, resource, agent);
                });
                FiercePlanet.Drawing.drawAgent(ctx, agent);

            })

        }

//        console.log(Date.now() - start)

        ctx.restore();
    };


    /**
     * Draw all of the resources
     */
    this.drawResources = function(altCanvasName, altResources) {
        var canvasName = altCanvasName || '#resourceCanvas';
        var resources = altResources || Lifecycle.currentWorld.resources;

        if ((Universe.settings.isometricView || Lifecycle.currentWorld.isometricView) && Universe.settings.showResourcesAsBoxes) {
            this.clearCanvas(canvasName);
            var len = FiercePlanet.Orientation.cellsAcross;
            resources.sort(function(a, b) {
                return (((a.y * len) - a.x > (b.y * len) - b.x) ? 1 : ((a.y * len) - a.x < (b.y * len) - b.x) ? -1 : 0);
            });
        }

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
            // INLINE SCALE
            yOffset = yOffset * FiercePlanet.Orientation.zoomWorld;
            var rgx =  - FiercePlanet.Orientation.halfWorldWidth * FiercePlanet.Orientation.zoomWorld + x * FiercePlanet.Orientation.zoomWorld;
            var rgys = - FiercePlanet.Orientation.halfWorldHeight * FiercePlanet.Orientation.zoomWorld + y * FiercePlanet.Orientation.zoomWorld + yOffset;
            var rgye = - FiercePlanet.Orientation.halfWorldHeight * FiercePlanet.Orientation.zoomWorld + y * FiercePlanet.Orientation.zoomWorld + FiercePlanet.Orientation.cellHeight * FiercePlanet.Orientation.zoomWorld;
            var resourceGradient = ctx.createLinearGradient(rgx, rgys, rgx, rgye);
            resourceGradient.addColorStop(0, "#fff");
            resourceGradient.addColorStop(0.5, c);
            resourceGradient.addColorStop(1, c);

            if ((Universe.settings.isometricView || Lifecycle.currentWorld.isometricView)) {
                var tileOffset = FiercePlanet.Isometric.offsets3DPoint([FiercePlanet.Orientation.cellHeight, 0, 0]);
                var newOrigin = FiercePlanet.Isometric.doIsometricOffset(resource.x, resource.y);
                var originXp = newOrigin.x + FiercePlanet.Orientation.cellWidth / 2;
                var originYp = newOrigin.y + FiercePlanet.Orientation.cellHeight;

                // INLINED SCALE
                originXp = (originXp - FiercePlanet.Orientation.halfWorldWidth) * FiercePlanet.Orientation.zoomWorld;
                originYp = (originYp - FiercePlanet.Orientation.halfWorldHeight) * FiercePlanet.Orientation.zoomWorld;
//                originXp = originXp - (FiercePlanet.Orientation.halfWorldWidth);
//                originYp = originYp - (FiercePlanet.Orientation.halfWorldHeight);

                ctx.fillStyle = "#fff";
                FiercePlanet.Isometric.draw3DTile(ctx, [originXp, originYp], FiercePlanet.Orientation.cellHeight * FiercePlanet.Orientation.zoomWorld);
                ctx.fill();

                var boxHeight = 0;
                ctx.lineWidth = 1 / FiercePlanet.Orientation.zoomWorld;
                // Use box style - computationally expensive
                if (Universe.settings.showResourcesAsBoxes) {
                    boxHeight = (s / 100) * 20;
                    ctx.fillStyle = c;
                    ctx.strokeStyle = "#eee";
                    FiercePlanet.Isometric.box(ctx, originXp, originYp, 0, 0, 0, FiercePlanet.Orientation.cellHeight, boxHeight, FiercePlanet.Orientation.cellHeight);
                    ctx.fill();
                    ctx.stroke();
                }
                else {
                    resourceGradient = ctx.createLinearGradient(originXp, originYp - FiercePlanet.Orientation.cellHeight + yOffset, originXp, originYp);
                    resourceGradient.addColorStop(0, "#fff");
                    resourceGradient.addColorStop(0.5, c);
                    resourceGradient.addColorStop(1, c);
                    ctx.fillStyle = resourceGradient;
                    FiercePlanet.Isometric.draw3DTile(ctx, [originXp, originYp], FiercePlanet.Orientation.cellHeight);
                    ctx.fill();
                }

                // Draw resource-specific representation here
                if (resource.kind.image) {
                    var imgOffsetX = originXp - tileOffset.x / 2;
                    var imgOffsetY = originYp + tileOffset.y / 2 - boxHeight;
                    try {
                        ctx.drawImage(resource.kind.actualImage, imgOffsetX, imgOffsetY, tileOffset.x, tileOffset.y);
                    }
                    catch (e) {}
                }
            }
            else {

                // INLINED SCALE
                x = (x - FiercePlanet.Orientation.halfWorldWidth) * FiercePlanet.Orientation.zoomWorld;
                y = (y - FiercePlanet.Orientation.halfWorldHeight) * FiercePlanet.Orientation.zoomWorld;
//                    x = x - FiercePlanet.Orientation.halfWorldWidth;
//                    y = y - FiercePlanet.Orientation.halfWorldHeight;


                // Clear and fill the resource tile with a white background
                ctx.clearRect(x, y, FiercePlanet.Orientation.cellWidth * FiercePlanet.Orientation.zoomWorld, FiercePlanet.Orientation.cellHeight * FiercePlanet.Orientation.zoomWorld);
                ctx.fillStyle = "#fff";
                ctx.fillRect(x, y, FiercePlanet.Orientation.cellWidth * FiercePlanet.Orientation.zoomWorld, FiercePlanet.Orientation.cellHeight * FiercePlanet.Orientation.zoomWorld);

                ctx.fillStyle = resourceGradient;
                ctx.strokeStyle = "#333";
                ctx.fillRect(x, y + yOffset, FiercePlanet.Orientation.cellWidth * FiercePlanet.Orientation.zoomWorld, (FiercePlanet.Orientation.cellHeight) * FiercePlanet.Orientation.zoomWorld - yOffset);

                ctx.lineWidth = 4 / FiercePlanet.Orientation.zoomWorld;
                ctx.strokeStyle = newColor;


                // Draw resource-specific representation here
                if (resource.kind.image) {
                    try {
                        ctx.drawImage(resource.kind.actualImage, x + 4, y + 4, (FiercePlanet.Orientation.cellWidth * FiercePlanet.Orientation.zoomWorld - 8), (FiercePlanet.Orientation.cellHeight * FiercePlanet.Orientation.zoomWorld - 8));
                    }
                    catch (e) {}
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
        // INLINE SCALE
        yOffset = yOffset * FiercePlanet.Orientation.zoomWorld;
        var rgx =  - FiercePlanet.Orientation.halfWorldWidth * FiercePlanet.Orientation.zoomWorld + x * FiercePlanet.Orientation.zoomWorld;
        var rgys = - FiercePlanet.Orientation.halfWorldHeight * FiercePlanet.Orientation.zoomWorld + y * FiercePlanet.Orientation.zoomWorld + yOffset;
        var rgye = - FiercePlanet.Orientation.halfWorldHeight * FiercePlanet.Orientation.zoomWorld + y * FiercePlanet.Orientation.zoomWorld + FiercePlanet.Orientation.cellHeight * FiercePlanet.Orientation.zoomWorld;
        var resourceGradient = ctx.createLinearGradient(rgx, rgys, rgx, rgye);
        resourceGradient.addColorStop(0, "#fff");
        resourceGradient.addColorStop(0.5, c);
        resourceGradient.addColorStop(1, c);

        if ((Universe.settings.isometricView || Lifecycle.currentWorld.isometricView)) {
            var tileOffset = FiercePlanet.Isometric.offsets3DPoint([FiercePlanet.Orientation.cellHeight, 0, 0]);
            var newOrigin = FiercePlanet.Isometric.doIsometricOffset(resource.x, resource.y);
            var originXp = newOrigin.x + FiercePlanet.Orientation.cellWidth / 2;
            var originYp = newOrigin.y + FiercePlanet.Orientation.cellHeight;

            // INLINED SCALE
            originXp = (originXp - FiercePlanet.Orientation.halfWorldWidth) * FiercePlanet.Orientation.zoomWorld;
            originYp = (originYp - FiercePlanet.Orientation.halfWorldHeight) * FiercePlanet.Orientation.zoomWorld;
////                originXp = originXp - (FiercePlanet.Orientation.halfWorldWidth);
////                originYp = originYp - (FiercePlanet.Orientation.halfWorldHeight);

            ctx.fillStyle = "#fff";
            FiercePlanet.Isometric.draw3DTile(ctx, [originXp, originYp], FiercePlanet.Orientation.cellHeight * FiercePlanet.Orientation.zoomWorld);
            ctx.fill();

            var boxHeight = 0;
            ctx.lineWidth = 1;
            // Use box style - computationally expensive
            if (Universe.settings.showResourcesAsBoxes) {
                boxHeight = (s / 100) * 20;
                ctx.fillStyle = c;
                ctx.strokeStyle = "#eee";
                FiercePlanet.Isometric.box(ctx, originXp, originYp, 0, 0, 0, FiercePlanet.Orientation.cellHeight, boxHeight, FiercePlanet.Orientation.cellHeight);
                ctx.fill();
                ctx.stroke();
            }
            else {
                resourceGradient = ctx.createLinearGradient(originXp, originYp - FiercePlanet.Orientation.cellHeight + yOffset, originXp, originYp);
                resourceGradient.addColorStop(0, "#fff");
                resourceGradient.addColorStop(0.5, c);
                resourceGradient.addColorStop(1, c);
                ctx.fillStyle = resourceGradient;
                FiercePlanet.Isometric.draw3DTile(ctx, [originXp, originYp], FiercePlanet.Orientation.cellHeight);
                ctx.fill();
            }

            // Draw resource-specific representation here
            if (resource.kind.image) {
                var imgOffsetX = originXp - tileOffset.x / 2;
                var imgOffsetY = originYp + tileOffset.y / 2 - boxHeight;
//                    var resImage = new Image();
//                    resImage.src = resource.kind.image;
//                    ctx.drawImage(resImage, imgOffsetX, imgOffsetY, tileOffset.x, tileOffset.y);
                ctx.drawImage(resource.kind.actualImage, imgOffsetX, imgOffsetY, tileOffset.x, tileOffset.y);
            }
        }
        else {

            // INLINED SCALE
            x = (x - FiercePlanet.Orientation.halfWorldWidth) * FiercePlanet.Orientation.zoomWorld;
            y = (y - FiercePlanet.Orientation.halfWorldHeight) * FiercePlanet.Orientation.zoomWorld;
//                    x = x - FiercePlanet.Orientation.halfWorldWidth;
//                    y = y - FiercePlanet.Orientation.halfWorldHeight;


            // Clear and fill the resource tile with a white background
            ctx.clearRect(x, y, FiercePlanet.Orientation.cellWidth * FiercePlanet.Orientation.zoomWorld, FiercePlanet.Orientation.cellHeight * FiercePlanet.Orientation.zoomWorld);
            ctx.fillStyle = "#fff";
            ctx.fillRect(x, y, FiercePlanet.Orientation.cellWidth * FiercePlanet.Orientation.zoomWorld, FiercePlanet.Orientation.cellHeight * FiercePlanet.Orientation.zoomWorld);

            ctx.fillStyle = resourceGradient;
            ctx.strokeStyle = "#333";
            ctx.fillRect(x, y + yOffset, FiercePlanet.Orientation.cellWidth * FiercePlanet.Orientation.zoomWorld, (FiercePlanet.Orientation.cellHeight) * FiercePlanet.Orientation.zoomWorld - yOffset);

            ctx.lineWidth = 4;
            ctx.strokeStyle = newColor;

            // Draw resource-specific representation here
            if (resource.kind.image) {
//                var resImage = new Image();
//                resImage.src = resource.kind.image;
//                ctx.drawImage(resImage, x + 4, y + 4, FiercePlanet.Orientation.cellWidth - 8, FiercePlanet.Orientation.cellHeight - 8);
                ctx.drawImage(resource.kind.actualImage, x + 4, y + 4, (FiercePlanet.Orientation.cellWidth * FiercePlanet.Orientation.zoomWorld - 8), (FiercePlanet.Orientation.cellHeight * FiercePlanet.Orientation.zoomWorld - 8));
            }
        }
        ctx.restore();
    };

    /**
     * Draw an individual resource
     * @param resource
     */
    this.drawJustResource = function(ctx, resource) {

        // Variables
        var x = resource.x * FiercePlanet.Orientation.cellWidth;
        var y = resource.y * FiercePlanet.Orientation.cellHeight;
        var s = (resource.totalYield / resource.initialTotalYield) * 100;
        var c = resource.color;
        // Determine drawing colours and offsets
        var newColor = this.diluteColour(s, s, s, c);

        // Create a gradient to fill the cell from the bottom up
        var yOffset = (((FiercePlanet.Orientation.cellHeight) * (1.0 - (s / 100))) / 1.2) | 0;
        // INLINE SCALE
        yOffset = yOffset * FiercePlanet.Orientation.zoomWorld;
        var rgx =  - FiercePlanet.Orientation.halfWorldWidth * FiercePlanet.Orientation.zoomWorld + x * FiercePlanet.Orientation.zoomWorld;
        var rgys = - FiercePlanet.Orientation.halfWorldHeight * FiercePlanet.Orientation.zoomWorld + y * FiercePlanet.Orientation.zoomWorld + yOffset;
        var rgye = - FiercePlanet.Orientation.halfWorldHeight * FiercePlanet.Orientation.zoomWorld + y * FiercePlanet.Orientation.zoomWorld + FiercePlanet.Orientation.cellHeight * FiercePlanet.Orientation.zoomWorld;
        var resourceGradient = ctx.createLinearGradient(rgx, rgys, rgx, rgye);
        resourceGradient.addColorStop(0, "#fff");
        resourceGradient.addColorStop(0.5, c);
        resourceGradient.addColorStop(1, c);

        if ((Universe.settings.isometricView || Lifecycle.currentWorld.isometricView)) {
            var tileOffset = FiercePlanet.Isometric.offsets3DPoint([FiercePlanet.Orientation.cellHeight, 0, 0]);
            var newOrigin = FiercePlanet.Isometric.doIsometricOffset(resource.x, resource.y);
            var originXp = newOrigin.x + FiercePlanet.Orientation.cellWidth / 2;
            var originYp = newOrigin.y + FiercePlanet.Orientation.cellHeight;

            // INLINED SCALE
            originXp = (originXp - FiercePlanet.Orientation.halfWorldWidth) * FiercePlanet.Orientation.zoomWorld;
            originYp = (originYp - FiercePlanet.Orientation.halfWorldHeight) * FiercePlanet.Orientation.zoomWorld;
//            originXp = originXp - (FiercePlanet.Orientation.worldWidth) / 2;
//            originYp = originYp - (FiercePlanet.Orientation.worldHeight) / 2;

            ctx.fillStyle = "#fff";
            FiercePlanet.Isometric.draw3DTile(ctx, [originXp, originYp], FiercePlanet.Orientation.cellHeight * FiercePlanet.Orientation.zoomWorld);
            ctx.fill();

            var boxHeight = 0;
            ctx.lineWidth = 1;
            // Use box style - computationally expensive
            if (Universe.settings.showResourcesAsBoxes) {
                boxHeight = (s / 100) * 20;
                ctx.fillStyle = c;
                ctx.strokeStyle = "#eee";
                FiercePlanet.Isometric.box(ctx, originXp, originYp, 0, 0, 0, FiercePlanet.Orientation.cellHeight, boxHeight, FiercePlanet.Orientation.cellHeight);
                ctx.fill();
                ctx.stroke();
            }
            else {
                resourceGradient = ctx.createLinearGradient(originXp, originYp - FiercePlanet.Orientation.cellHeight + yOffset, originXp, originYp);
                resourceGradient.addColorStop(0, "#fff");
                resourceGradient.addColorStop(0.5, c);
                resourceGradient.addColorStop(1, c);
                ctx.fillStyle = resourceGradient;
                FiercePlanet.Isometric.draw3DTile(ctx, [originXp, originYp], FiercePlanet.Orientation.cellHeight);
                ctx.fill();
            }

            // Draw resource-specific representation here
            if (resource.kind.image) {
                var imgOffsetX = originXp - tileOffset.x / 2;
                var imgOffsetY = originYp + tileOffset.y / 2 - boxHeight;
//                    var resImage = new Image();
//                    resImage.src = resource.kind.image;
//                    ctx.drawImage(resImage, imgOffsetX, imgOffsetY, tileOffset.x, tileOffset.y);
                try {
                    ctx.drawImage(resource.kind.actualImage, imgOffsetX, imgOffsetY, tileOffset.x, tileOffset.y);
                }
                catch (e){}
            }
        }
        else {

            // INLINED SCALE
            x = (x - FiercePlanet.Orientation.halfWorldWidth) * FiercePlanet.Orientation.zoomWorld;
            y = (y - FiercePlanet.Orientation.halfWorldHeight) * FiercePlanet.Orientation.zoomWorld;
//                    x = x - FiercePlanet.Orientation.halfWorldWidth;
//                    y = y - FiercePlanet.Orientation.halfWorldHeight;


            // Clear and fill the resource tile with a white background
            ctx.clearRect(x, y, FiercePlanet.Orientation.cellWidth * FiercePlanet.Orientation.zoomWorld, FiercePlanet.Orientation.cellHeight * FiercePlanet.Orientation.zoomWorld);
            ctx.fillStyle = "#fff";
            ctx.fillRect(x, y, FiercePlanet.Orientation.cellWidth * FiercePlanet.Orientation.zoomWorld, FiercePlanet.Orientation.cellHeight * FiercePlanet.Orientation.zoomWorld);

            ctx.fillStyle = resourceGradient;
            ctx.strokeStyle = "#333";
            ctx.fillRect(x, y + yOffset, FiercePlanet.Orientation.cellWidth * FiercePlanet.Orientation.zoomWorld, (FiercePlanet.Orientation.cellHeight) * FiercePlanet.Orientation.zoomWorld - yOffset);

            ctx.lineWidth = 4;
            ctx.strokeStyle = newColor;

            // Draw resource-specific representation here
            if (resource.kind.image) {
//                var resImage = new Image();
//                resImage.src = resource.kind.image;
//                ctx.drawImage(resImage, x + 4, y + 4, FiercePlanet.Orientation.cellWidth - 8, FiercePlanet.Orientation.cellHeight - 8);
                try {
                    ctx.drawImage(resource.kind.actualImage, x + 4, y + 4, (FiercePlanet.Orientation.cellWidth * FiercePlanet.Orientation.zoomWorld - 8), (FiercePlanet.Orientation.cellHeight * FiercePlanet.Orientation.zoomWorld - 8));
                }
                catch (e){}
            }
        }
    };

    /**
     * Draw an individual resource
     * @param resource
     */
    this.drawResourceAgentInteraction = function(ctx, resource, agent) {
        // Variables
        var x = resource.x * FiercePlanet.Orientation.cellWidth + FiercePlanet.Orientation.cellWidth / 2;
        var y = resource.y * FiercePlanet.Orientation.cellHeight + FiercePlanet.Orientation.cellHeight / 2;

        // Get co-ordinates
        var wx = agent.wanderX;
        var wy = agent.wanderY;
        var __ret = this.getDrawingPosition(agent, Lifecycle.waveCounter);
        var xPos = __ret.intX;
        var yPos = __ret.intY;

        if (Math.abs(xPos - resource.x) > 1 || Math.abs(yPos - resource.y) > 1)
            return;

        var ax = xPos * FiercePlanet.Orientation.cellWidth + wx + FiercePlanet.Orientation.cellWidth / 2;
        var ay = yPos * FiercePlanet.Orientation.cellHeight + wy + FiercePlanet.Orientation.cellHeight / 4;

        if ((Universe.settings.isometricView || Lifecycle.currentWorld.isometricView)) {
            var newOrigin = FiercePlanet.Isometric.doIsometricOffset(resource.x, resource.y);
            x = newOrigin.x + FiercePlanet.Orientation.cellWidth / 2;
            y = newOrigin.y + FiercePlanet.Orientation.cellHeight / 2;

            var newAOrigin = FiercePlanet.Isometric.doIsometricOffset(xPos, yPos);
            ax = newAOrigin.x + wx + FiercePlanet.Orientation.cellWidth / 2;
            ay = newAOrigin.y + wy + FiercePlanet.Orientation.cellHeight / 4;
        }
        // INLINED SCALE
        x = (x - FiercePlanet.Orientation.halfWorldWidth) * FiercePlanet.Orientation.zoomWorld;
        y = (y - FiercePlanet.Orientation.halfWorldHeight) * FiercePlanet.Orientation.zoomWorld;
//                    x = x - FiercePlanet.Orientation.halfWorldWidth;
//                    y = y - FiercePlanet.Orientation.halfWorldHeight;
        ax = (ax - FiercePlanet.Orientation.halfWorldWidth) * FiercePlanet.Orientation.zoomWorld;
        ay = (ay - FiercePlanet.Orientation.halfWorldHeight) * FiercePlanet.Orientation.zoomWorld;

        var s = (resource.totalYield / resource.initialTotalYield) * 100;
        var c = one.color(resource.color);
//        var alpha = resource.perAgentYield / 100;
        var h = agent.getHealthForResourceCategory(resource.category);
        var a = one.color(resource.color).alpha(h / 100);
        var alpha = one.color(resource.color).alpha(0);
//        var grad = ctx.createLinearGradient(x, y, x, ay);
        var width = (FiercePlanet.Orientation.cellWidth / 5) * FiercePlanet.Orientation.zoomWorld, height = FiercePlanet.Orientation.cellHeight * FiercePlanet.Orientation.zoomWorld;
        var grad = ctx.createRadialGradient(ax, ay, 0, ax, ay, width);
        grad.addColorStop(1, alpha.cssa());
        grad.addColorStop(0.5, a.cssa());
        grad.addColorStop(0, c.cssa());
//        ctx.strokeStyle = grad;
        ctx.fillStyle = grad;
//        ctx.fillRect(x - width / 2, y - (width / 4), width, height + (width / 4));

        ctx.beginPath();
        ctx.arc(ax, ay, width, 0, Math.PI * 2, true);
        ctx.closePath();

//        ctx.beginPath();
//        ctx.moveTo(x, y);
//        ctx.lineTo(ax, ay);
//        ctx.closePath();

        ctx.fill();

//        ctx.strokeStyle = "#666";
//        ctx.lineWidth = 1;
//        ctx.stroke();

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
        var newColor = '#' + rOffset + gOffset + bOffset;
        return one.color(newColor).hex();
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

        if (Lifecycle.currentWorld.allowOffscreenCycling) {
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

        var agents = altAgents || Lifecycle.currentWorld.currentAgents;
        for (var i = 0; i < agents.length; i += 1) {
            var agent = agents[i];

            // Don't process agents we want to block
            /*
             if (! Universe.settings.rivalsVisible && agent.agentType.name == AgentTypes.RIVAL_AGENT_TYPE.name)
             continue;
             if (! Universe.settings.predatorsVisible && agent.agentType.name == AgentTypes.PREDATOR_AGENT_TYPE.name)
             continue;
             */

            // Get co-ordinates
            var wx = agent.wanderX;
            var wy = agent.wanderY;
            var __ret = this.getDrawingPosition(agent, Lifecycle.waveCounter);
            var xPos = __ret.intX;
            var yPos = __ret.intY;

            var x = xPos * FiercePlanet.Orientation.cellWidth + wx;
            var y = yPos * FiercePlanet.Orientation.cellHeight + wy;

            if ((Universe.settings.isometricView || Lifecycle.currentWorld.isometricView)) {
                var newOrigin = FiercePlanet.Isometric.doIsometricOffset(xPos, yPos);
                x = newOrigin.x + wx;
                y = newOrigin.y + wy;
            }

            // INLINED SCALE
            x = (x - FiercePlanet.Orientation.halfWorldWidth) * FiercePlanet.Orientation.zoomWorld;
            y = (y - FiercePlanet.Orientation.halfWorldHeight) * FiercePlanet.Orientation.zoomWorld;

            var direction = this.getAgentDirection(agent);


            var blueH = agent.healthCategoryStats[ModuleManager.currentModule.resourceSet.categories[0].code];
            var greenH = agent.healthCategoryStats[ModuleManager.currentModule.resourceSet.categories[1].code];
            var redH = agent.healthCategoryStats[ModuleManager.currentModule.resourceSet.categories[2].code];
            var c = agent.color.toString();
            var newColor = this.diluteColour(redH, greenH, blueH, c);

            try {
                eval(agent.culture.drawFunction)(ctx, agent, x, y, FiercePlanet.Orientation.pieceWidth, FiercePlanet.Orientation.pieceHeight, newColor, Lifecycle.waveCounter, direction);
            } catch(e) {
                eval(DefaultCultures.CITIZEN_AGENT_TYPE.drawFunction)(ctx, agent, x, y, FiercePlanet.Orientation.pieceWidth, FiercePlanet.Orientation.pieceHeight, newColor, Lifecycle.waveCounter, direction);
            }

        }

        ctx.restore();
    };

    /**
     * Draw agents on the agent canvas
     */
    this.drawAgent = function(ctx, agent) {

        // Get co-ordinates
        var wx = agent.wanderX;
        var wy = agent.wanderY;
        var __ret = this.getDrawingPosition(agent, Lifecycle.waveCounter);
        var xPos = __ret.intX;
        var yPos = __ret.intY;

        var x = xPos * FiercePlanet.Orientation.cellWidth + wx + (FiercePlanet.Orientation.cellWidth / 2 - FiercePlanet.Orientation.pieceWidth / 2);
        var y = yPos * FiercePlanet.Orientation.cellHeight + wy + (FiercePlanet.Orientation.cellHeight / 4);

        if ((Universe.settings.isometricView || Lifecycle.currentWorld.isometricView)) {
            var newOrigin = FiercePlanet.Isometric.doIsometricOffset(xPos, yPos);
            x = newOrigin.x + wx + (FiercePlanet.Orientation.cellWidth / 2 - FiercePlanet.Orientation.pieceWidth / 2);
            y = newOrigin.y + wy + FiercePlanet.Orientation.cellHeight / 4;
        }

        // INLINED SCALE
        x = (x - FiercePlanet.Orientation.halfWorldWidth) * FiercePlanet.Orientation.zoomWorld;
        y = (y - FiercePlanet.Orientation.halfWorldHeight) * FiercePlanet.Orientation.zoomWorld;
//                    x = x - FiercePlanet.Orientation.halfWorldWidth;
//                    y = y - FiercePlanet.Orientation.halfWorldHeight;

        var direction = this.getAgentDirection(agent);
        /*
         var blueH = agent.healthCategoryStats[ModuleManager.currentModule.resourceSet.categories[0].code];
         var greenH = agent.healthCategoryStats[ModuleManager.currentModule.resourceSet.categories[1].code];
         var redH = agent.healthCategoryStats[ModuleManager.currentModule.resourceSet.categories[2].code];
         var c = agent.color.toString();
         var newColor = this.diluteColour(redH, greenH, blueH, c);
         */
        var newColor = agent.color || 'fff';

        try {
            eval(agent.culture.drawFunction)(ctx, agent, x, y, FiercePlanet.Orientation.pieceWidth * FiercePlanet.Orientation.zoomWorld, FiercePlanet.Orientation.pieceHeight * FiercePlanet.Orientation.zoomWorld, newColor, Lifecycle.waveCounter, direction);
        } catch(e) {
            console.log(e)
            eval(DefaultCultures.CITIZEN_AGENT_TYPE.drawFunction)(ctx, agent, x, y, FiercePlanet.Orientation.pieceWidth * FiercePlanet.Orientation.zoomWorld, FiercePlanet.Orientation.pieceHeight * FiercePlanet.Orientation.zoomWorld, newColor, Lifecycle.waveCounter, direction);
        }
    };

    /**
     * Draw agents on the agent canvas
     */
    this.drawExpiredAgent = function(agent, altCanvasName) {
        var canvasName = altCanvasName || '#resourceCanvas';
        var canvas = $(canvasName)[0];
        var ctx = canvas.getContext('2d');

        ctx.save();
        ctx.translate(FiercePlanet.Orientation.halfWorldWidth, FiercePlanet.Orientation.halfWorldHeight);
        ctx.rotate(FiercePlanet.Orientation.rotationAngle);

        agent.color = one.color('#f00');
        FiercePlanet.Drawing.drawAgent(ctx, agent);

        ctx.restore();
    };


    /**
     * Clears an individual resource
     * @param resource
     */
    this.clearResource = function(resource) {
        if ((Universe.settings.isometricView || Lifecycle.currentWorld.isometricView)) {
            FiercePlanet.Drawing.drawResources();
        }
        else {
            var canvas = $('#resourceCanvas')[0];
            var ctx = canvas.getContext('2d');

            // Rotation logic here - TODO: Refactor out
            var midTilePosX = (FiercePlanet.Orientation.worldWidth) / 2;
            var midTilePosY = (FiercePlanet.Orientation.worldHeight) / 2;

            var x = resource.x * FiercePlanet.Orientation.cellWidth;
            var y = resource.y * FiercePlanet.Orientation.cellHeight;

            ctx.save();
            ctx.translate(midTilePosX, midTilePosY);
            ctx.rotate(FiercePlanet.Orientation.rotationAngle);
            // INLINED SCALE
            x = (x - FiercePlanet.Orientation.halfWorldWidth) * FiercePlanet.Orientation.zoomWorld;
            y = (y - FiercePlanet.Orientation.halfWorldHeight) * FiercePlanet.Orientation.zoomWorld;
//                    x = x - FiercePlanet.Orientation.halfWorldWidth;
//                    y = y - FiercePlanet.Orientation.halfWorldHeight;
            ctx.clearRect(x, y, FiercePlanet.Orientation.cellWidth, FiercePlanet.Orientation.cellHeight);
            ctx.restore();
        }

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
    };

    this.clearTheseAgents = function(agents) {
        var canvasName = '#resourceCanvas';

        var world = Lifecycle.currentWorld;
        var len = FiercePlanet.Orientation.cellsAcross;

        // Inlined version
        var canvas = $(canvasName)[0];
        var ctx = canvas.getContext('2d');
        ctx.save();
        ctx.translate(FiercePlanet.Orientation.halfWorldWidth, FiercePlanet.Orientation.halfWorldHeight);
        ctx.rotate(FiercePlanet.Orientation.rotationAngle);

        this.clearAgentsInline(ctx, agents);

        ctx.restore();
    };

    this.clearThisAgent = function(agent) {
        var canvasName = '#resourceCanvas';

        var world = Lifecycle.currentWorld;
        var len = FiercePlanet.Orientation.cellsAcross;

        // Inlined version
        var canvas = $(canvasName)[0];
        var ctx = canvas.getContext('2d');
        ctx.save();
        ctx.translate(FiercePlanet.Orientation.halfWorldWidth, FiercePlanet.Orientation.halfWorldHeight);
        ctx.rotate(FiercePlanet.Orientation.rotationAngle);

        this.clearAgentInline(ctx, agent);

        ctx.restore();
    };

    /**
     * Clear all active agents
     */
    this.clearAgents = function(ctx) {
        this.clearAgentGroup(ctx, Lifecycle.currentWorld.currentAgents);
    };
    
    /**
     * Clear the agent group
     */
    this.clearAgentGroup = function(ctx, agents) {
//        var canvas = $('#agentCanvas')[0];
//        var ctx = canvas.getContext('2d');

        // Rotation logic here - TODO: Refactor out
        var midTilePosX = (FiercePlanet.Orientation.worldWidth) / 2;
        var midTilePosY = (FiercePlanet.Orientation.worldHeight) / 2;
        ctx.save();
        ctx.translate(midTilePosX, midTilePosY);
        ctx.rotate(FiercePlanet.Orientation.rotationAngle);

        if (Lifecycle.waveCounter > 0) {
            for (var i = 0; i < agents.length; i += 1) {
                var agent = agents[i];
                var wx = agent.wanderX;
                var wy = agent.wanderY;
                var __ret = this.getDrawingPosition(agent, Lifecycle.waveCounter - 1);
                var xPos = __ret.intX;
                var yPos = __ret.intY;
                var x = xPos * FiercePlanet.Orientation.cellWidth + wx + 1;
                var y = yPos * FiercePlanet.Orientation.cellHeight + wy + 1;
                if ((Universe.settings.isometricView || Lifecycle.currentWorld.isometricView)) {
                    var newOrigin = FiercePlanet.Isometric.doIsometricOffset(xPos, yPos);
                    x = newOrigin.x + wx + 1;// - FiercePlanet.Orientation.cellWidth / 2;
                    y = newOrigin.y + wy + 1;// - FiercePlanet.Orientation.cellHeight / 2;
                }

                // Rotation logic here - TODO: Refactor out
                x = x - (FiercePlanet.Orientation.worldWidth) / 2;
                y = y - (FiercePlanet.Orientation.worldHeight) / 2;

                ctx.clearRect(x, y, FiercePlanet.Orientation.cellWidth + wx + 1, FiercePlanet.Orientation.cellHeight + wy + 1);
                if (Universe.settings.agentTracing) {
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

    this.clearAgentsInline = function(ctx, agents) {
        // Get co-ordinates

        if (Lifecycle.worldCounter > 0) {
            var agents = agents || Lifecycle.currentWorld.currentAgents;
            for (var i = 0; i < agents.length; i += 1) {
                var agent = agents[i];
                FiercePlanet.Drawing.clearAgentInline(ctx, agent);
                /*
                var wx = agent.wanderX;
                var wy = agent.wanderY;
                var __ret = this.getDrawingPosition(agent, Lifecycle.waveCounter - 1);
                var xPos = __ret.intX;
                var yPos = __ret.intY;
                var x = xPos * FiercePlanet.Orientation.cellWidth + wx + 1;
                var y = yPos * FiercePlanet.Orientation.cellHeight + wy + 1;
                if ((Universe.settings.isometricView || Lifecycle.currentWorld.isometricView)) {
                    var newOrigin = FiercePlanet.Isometric.doIsometricOffset(xPos, yPos);
                    x = newOrigin.x + wx + 1;// - FiercePlanet.Orientation.cellWidth / 2;
                    y = newOrigin.y + wy + 1;// - FiercePlanet.Orientation.cellHeight / 2;
                    }

                // Rotation logic here - TODO: Refactor out
                x = x - (FiercePlanet.Orientation.worldWidth) / 2;
                y = y - (FiercePlanet.Orientation.worldHeight) / 2;

                ctx.clearRect(x, y - 17, FiercePlanet.Orientation.cellWidth + wx + 1, FiercePlanet.Orientation.cellHeight + wy + 1 + 17);
                */
            }
        }
    };

    this.clearAgentInline = function(ctx, agent) {
        // Get co-ordinates

        if (Lifecycle.worldCounter > 0) {
            var wx = agent.wanderX;
            var wy = agent.wanderY;
            var __ret = this.getDrawingPosition(agent, Lifecycle.waveCounter - 1);
            var xPos = __ret.intX;
            var yPos = __ret.intY;
            var x = xPos * FiercePlanet.Orientation.cellWidth + wx + 1;
            var y = yPos * FiercePlanet.Orientation.cellHeight + wy + 1;
            if ((Universe.settings.isometricView || Lifecycle.currentWorld.isometricView)) {
                var newOrigin = FiercePlanet.Isometric.doIsometricOffset(xPos, yPos);
                x = newOrigin.x + wx + 1;// - FiercePlanet.Orientation.cellWidth / 2;
                y = newOrigin.y + wy + 1;// - FiercePlanet.Orientation.cellHeight / 2;
            }

            // INLINED SCALE
            x = (x - FiercePlanet.Orientation.halfWorldWidth) * FiercePlanet.Orientation.zoomWorld;
            y = (y - FiercePlanet.Orientation.halfWorldHeight) * FiercePlanet.Orientation.zoomWorld;
//                    x = x - FiercePlanet.Orientation.halfWorldWidth;
//                    y = y - FiercePlanet.Orientation.halfWorldHeight;

            ctx.clearRect(x, y - 17, FiercePlanet.Orientation.cellWidth + wx + 1, FiercePlanet.Orientation.cellHeight + wy + 1 + 17);
        }
    };


    

    /**
     * Draw the scrolling layer
     */
    this.drawScrollingLayer = function(altCanvasName) {
        if (Universe.settings.scrollingImageVisible) {
            var canvasName = altCanvasName || '#scrollingCanvas';
            this.clearCanvas(canvasName);
            var canvas = $(canvasName)[0];
            var ctx = canvas.getContext('2d');
    
            // Add logic for catastrophe here
    
            if (Universe.settings.catastrophesVisible && Lifecycle.currentWorld.catastrophe != undefined) {
                var catastrophe = Lifecycle.currentWorld.catastrophe;
                if (catastrophe.notice.start <= Lifecycle.worldCounter && (catastrophe.start + catastrophe.duration) >= Lifecycle.worldCounter) {
                    FiercePlanet.Game.currentNotice = catastrophe.notice;
                }
                if (catastrophe.start <= FiercePlanet.worldCounter && (catastrophe.start + catastrophe.duration) >= Lifecycle.worldCounter) {
                    // Apply catastrophe effects
                    if (FiercePlanet.worldCounter >= (catastrophe.start + catastrophe.duration / 2)) {
                        catastrophe.strike();
                    }
    
                    // Get effect dimensions
                    var increments = catastrophe.duration / FiercePlanet.Orientation.worldWidth;
                    var leadIncrement = (Lifecycle.worldCounter - catastrophe.start) / increments * 2;
                    var trailIncrement = ((catastrophe.start + catastrophe.duration) - Lifecycle.worldCounter) / increments * 2;
                    var x = FiercePlanet.Orientation.worldWidth - leadIncrement;
                    var y = 0;
                    var w = trailIncrement;
                    var h = FiercePlanet.Orientation.worldHeight;
                    ctx.fillStyle = this.insertAlpha(catastrophe.kind.color, 0.5);
                    ctx.fillRect(x, y, w, h);
                    return;
                }
            }
        }
    };
    
    /**
     * Draw the current world
     */
    this.drawWorld = function() {
        var e = $('#world-display')[0];
        e.innerHTML = Lifecycle.currentWorld.id;
    };
    
    /**
     * Draw the current profile class
     */
    this.drawProfileClass = function() {
        var e = $('#profile-class-display')[0];
        if (e != undefined)
            e.innerHTML = FiercePlanet.Game.currentProfile.profileClass;
    };
    
    /**
     * Update the current score
     */
    this.drawScore = function() {
        var e = $('#score-display')[0];
        e.innerHTML = FiercePlanet.Utils.zeroFill(FiercePlanet.Game.currentProfile.currentScore, 5);
    };
    
    /**
     * Update the highest score
     */
    this.drawHighestScore = function() {
        var e = $('#highest-score-display')[0];
        var hs = FiercePlanet.Game.currentProfile.highestScore;
        if (hs == undefined)
            hs = 0;
        e.innerHTML = hs.toString();
    };
    
    /**
     * Update resources in store
     */
    this.drawResourcesInStore = function() {
        var e = $('#goodness-display')[0];
        e.innerHTML = FiercePlanet.Game.currentProfile.currentWorldResourcesInStore.toString();
    };
    
    /**
     * Update the number of expired agents
     */
    this.drawExpired = function() {
    //    var e = $('#expired-display')[0];
    //    e.innerHTML = FiercePlanet.expiredAgentCount.toString() + " out of " + Lifecycle.currentWorld.expiryLimit;
        var e = $('#expired-citizens')[0];
        var expiredHTML = '';
        for (var i = 0, len = Lifecycle.currentWorld.expiryLimit; i < len; i++) {
            if (i < FiercePlanet.Game.currentProfile.currentWorldExpired)
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
        var saved = FiercePlanet.Game.currentProfile.currentWorldSaved.toString();
        var totalSaveable = Lifecycle.currentWorld.getTotalSaveableAgents();
        e.innerHTML = saved + " out of " + totalSaveable;
    };
    
    /**
     * Update the current wave number
     */
    this.drawWaves = function() {
        var e = $('#waves-display')[0];
        e.innerHTML = Lifecycle.currentWaveNumber + " out of " + Lifecycle.currentWorld.waveNumber;
    };
    
    
    /**
     * Update the scoreboard
     */
    this.drawScoreboard = function() {
        this.drawWorld();
    //    FiercePlanet.drawProfileClass();
        this.drawScore();
        this.drawHighestScore();
        this.drawWaves();
        this.drawSaved();
        this.drawExpired();
        this.drawResourcesInStore();
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
        $.post('/worlds/' + Lifecycle.currentWorld.id + '/save_thumbnail',
            {thumbnail: imageData},
            function(data) {
                alert('data posted')
            }
        );
    };


    /**
     *  Process mouse moves
     */
    this.drawGuideCell = function(e) {
        var x = e.pageX - FiercePlanet.Dialogs.calculateWorldLeft();
        var y = e.pageY - FiercePlanet.Dialogs.calculateWorldTop();

        // var __ret = FiercePlanet.GeneralUI.getCurrentPosition(e);
        var __ret = FiercePlanet.GeneralUI.getCurrentPositionByCoordinates(x, y);
        var xPos = __ret.posX;
        var yPos = __ret.posY;
        this.clearGuide();

        if (xPos < 0 || xPos >= FiercePlanet.Orientation.cellsAcross || yPos < 0 || yPos >= FiercePlanet.Orientation.cellsDown)
            return;

        if (Lifecycle.currentWorld.getCell(xPos, yPos).agentsAllowed && !Universe.settings.allowResourcesOnPath)
            return;
//        if (! Lifecycle.currentWorld.getCell(xPos, yPos).resourcesAllowed)
//            return;

        var scrollingCanvas = $('#guideCanvas')[0];
        var ctx = scrollingCanvas.getContext('2d');

        ctx.save();
        ctx.translate(FiercePlanet.Orientation.halfWorldWidth, FiercePlanet.Orientation.halfWorldHeight);
        ctx.rotate(FiercePlanet.Orientation.rotationAngle);

        x = xPos * FiercePlanet.Orientation.cellWidth;
        y = yPos * FiercePlanet.Orientation.cellHeight;

        if ((Universe.settings.isometricView || Lifecycle.currentWorld.isometricView)) {
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


    /**
     *  Process mouse moves
     */
    this.clearGuide = function(e) {
        FiercePlanet.Drawing.clearCanvas('#guideCanvas');
    };


    /**
     * Pan around the current world
     *
     * @param offsetX
     * @param offsetY
     */
    this.panByDrag = function(offsetX, offsetY) {
    //    var canvases = $('canvas');
        var canvases = $('.scrollable-canvas');
        offsetX *= FiercePlanet.Orientation.zoomWorld;
        offsetY *= FiercePlanet.Orientation.zoomWorld;
        for (var i = 0; i < canvases.length; i++) {
            var canvas = canvases[i];
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.translate(offsetX, offsetY);
        }
        FiercePlanet.Orientation.offsetY += offsetY //* FiercePlanet.Orientation.zoomWorld;
        FiercePlanet.Orientation.offsetX += offsetX //* FiercePlanet.Orientation.zoomWorld;
        if (FiercePlanet.Game.googleMap) {
//            FiercePlanet.Game.googleMap.panBy(- offsetX * FiercePlanet.Orientation.zoomWorld, - offsetY * FiercePlanet.Orientation.zoomWorld);
            FiercePlanet.Game.googleMap.panBy(- offsetX, - offsetY);
        }
        this.drawCanvases();
    };
    
    
    /**
     * Pan around the current world
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
                this.panByDrag(- FiercePlanet.Orientation.offsetX / FiercePlanet.Orientation.zoomWorld, - FiercePlanet.Orientation.offsetY / FiercePlanet.Orientation.zoomWorld);
                break;
        }
    };
    
    /**
     * Zoom in or out of the current world
     *
     * @param direction
     */
    this.zoom = function(direction) {
        var canvases = $('.scrollable-canvas');
        var existingZoom = FiercePlanet.Orientation.zoomWorld, tmpZoom = existingZoom;
        var zoomChanged = false;
        // INLINED SCALE
        /*
        for (var i = 0; i < canvases.length; i++) {
            var canvas = canvases[i];
            var ctx = canvas.getContext('2d');
            ctx.translate(FiercePlanet.Orientation.halfWorldWidth, FiercePlanet.Orientation.halfWorldHeight);
            switch (direction) {
                case -1:
                    if (FiercePlanet.Orientation.zoomWorld > 0.1) {
                        ctx.scale(1 / FiercePlanet.Orientation.zoomMagnificationFactor, 1 / FiercePlanet.Orientation.zoomMagnificationFactor);
                    }
                    break;
                case 0:
                    ctx.scale(1 / FiercePlanet.Orientation.zoomWorld, 1 / FiercePlanet.Orientation.zoomWorld);
                    break;
                case 1:
                    if (FiercePlanet.Orientation.zoomWorld < 10) {
                        ctx.scale(FiercePlanet.Orientation.zoomMagnificationFactor, FiercePlanet.Orientation.zoomMagnificationFactor);
                    }
                    break;
            }
            ctx.translate(- FiercePlanet.Orientation.halfWorldWidth, - FiercePlanet.Orientation.halfWorldHeight);
        }
        */
        switch (direction) {
            case -1:
                if (FiercePlanet.Orientation.zoomWorld > 0.1) {
                    tmpZoom = FiercePlanet.Orientation.zoomWorld * (1 / FiercePlanet.Orientation.zoomMagnificationFactor);
                }
                break;
            case 0:
                tmpZoom = 1;
                break;
            case 1:
                if (FiercePlanet.Orientation.zoomWorld < 10) {
                    tmpZoom = FiercePlanet.Orientation.zoomWorld * FiercePlanet.Orientation.zoomMagnificationFactor;
                }
                break;
        }
        if (FiercePlanet.Game.googleMap) {
            var gZoom = FiercePlanet.Game.googleMap.getZoom();
            var newZoom = tmpZoom;
            var normalisedExistingZoom = Math.log(existingZoom) / Math.log(FiercePlanet.Orientation.zoomMagnificationFactor);
            var normalisedNewZoom = Math.log(newZoom) / Math.log(FiercePlanet.Orientation.zoomMagnificationFactor);
            var gZoomChange = normalisedNewZoom - normalisedExistingZoom;
            var newGZoom = ((gZoom + gZoomChange) < 1 ? gZoom : ((gZoom + gZoomChange) > 21 ? gZoom : gZoom + gZoomChange));

            // If we can't change the google map, don't change the underlying zoom level
            console.log(newGZoom, gZoom)
            if (newGZoom == gZoom)
                tmpZoom = FiercePlanet.Orientation.zoomWorld;

            FiercePlanet.Game.googleMap.setZoom(newGZoom);
    
        }
        FiercePlanet.Orientation.zoomWorld = tmpZoom;
        this.drawCanvases();
    };
    
    /**
     * Animates new world
     */
    this.animateWorld = function () {
        //#map_canvas,
        var canvases = $('#baseCanvas, #scrollingCanvas, #noticeCanvas');
        var world = $('#world-container');
        var rwl = world.position().left;
        var rwt = world.position().top;
        var ww = world.width();
        var wh = world.height();
        var rw = rwl + Math.floor(Math.random() * ww);
        var rh = rwt + Math.floor(Math.random() * wh);
        world.css({'width': 0, 'height' : 0, 'left': rw, 'top': rh});
        world.animate({'width': '100%', 'height': '68%', 'left': rwl, 'top': rwt}, 1500);
        canvases.css({'width': 0, 'height' : 0});
        canvases.animate({'width': ww, 'height': wh}, 1500);
    };

    /**
     * Contract canvas
     */
    this.contract = function () {
//        var w = FiercePlanet.Orientation.worldWidth - 200;
//        var h = FiercePlanet.Orientation.worldHeight - 150;
        var w = FiercePlanet.Drawing.Dimensions.worldWidth;
        var h = FiercePlanet.Drawing.Dimensions.worldHeight;

        if (!_.isUndefined(FiercePlanet.Drawing.Dimensions)) {

            $('#world-container, #world-container > *').width(FiercePlanet.Drawing.Dimensions.width);
            $('#world-container, #world-container > *').height(FiercePlanet.Drawing.Dimensions.height);
            $('#world-container').css('padding', FiercePlanet.Drawing.Dimensions.padding);
            $('#gameworld').css('left', FiercePlanet.Drawing.Dimensions.gameworldLeft);
            $('#gameworld').css('top', FiercePlanet.Drawing.Dimensions.gameworldTop);
            $('#controls').css('left', FiercePlanet.Drawing.Dimensions.controlsLeft);
            $('#controls').css('top', FiercePlanet.Drawing.Dimensions.controlsTop);
        }
        $('#global-info-panel').show();
        $('#notifications, .bg').show();
        Universe.settings.useInlineResourceSwatch = false;

        FiercePlanet.Orientation.adjustParameters(w,h);
        FiercePlanet.Drawing.drawGame();
//        FiercePlanet.Drawing.drawCanvases();
    };

    /**
     * Expand canvas
     */
    this.expand = function () {
//        var w = FiercePlanet.Orientation.worldWidth + 200;
//        var h = FiercePlanet.Orientation.worldHeight + 150;
        var w = $(window).width();
        var h = $(window).height();

        FiercePlanet.Drawing.Dimensions = {};
        FiercePlanet.Drawing.Dimensions.worldWidth = FiercePlanet.Orientation.worldWidth;
        FiercePlanet.Drawing.Dimensions.worldHeight = FiercePlanet.Orientation.worldHeight;
        FiercePlanet.Drawing.Dimensions.width = $('#world-container, #world-container > *').width();
        FiercePlanet.Drawing.Dimensions.height = $('#world-container, #world-container > *').height();
        FiercePlanet.Drawing.Dimensions.padding = $('#world-container').css('padding');
        FiercePlanet.Drawing.Dimensions.gameworldLeft = $('#gameworld').css('left');
        FiercePlanet.Drawing.Dimensions.gameworldTop = $('#gameworld').css('top');
        FiercePlanet.Drawing.Dimensions.controlsLeft = $('#controls').css('left');
        FiercePlanet.Drawing.Dimensions.controlsTop = $('#controls').css('top');

        $('#global-info-panel').hide();
        $('.bg').hide();
            $('#world-container').css('padding', 0);
        $('#gameworld').css('left', 0);
        $('#gameworld').css('top', 0);
        $('#controls').css('left', 0);
        $('#controls').css('top', '5%');
        $('#world-container, #world-container > *').width($(window).width());
        $('#world-container, #world-container > *').height($(window).height());

//        $('#notifications').hide();
        Universe.settings.useInlineResourceSwatch = true;

        FiercePlanet.Orientation.adjustParameters(w,h);
        FiercePlanet.Drawing.drawGame();
    };

    /**
     * Toggle 3d
     */
    this.toggle3d = function () {
        if (Universe.settings.isometricView) {
            Universe.settings.isometricView = false;
            $('#resourceCanvas').css({zIndex: 5});
            $('#agentCanvas').css({zIndex: 6});
            FiercePlanet.Orientation.mapPerspectiveAngle -= FiercePlanet.Orientation.DEFAULT_MAP_PERSPECTIVE_ANGLE;
            FiercePlanet.Orientation.mapRotationAngle -= FiercePlanet.Orientation.DEFAULT_MAP_ROTATION_ANGLE;
            $('#map_canvas').animate({
                'width': FiercePlanet.Orientation.worldWidth + 'px',
                'height': FiercePlanet.Orientation.worldHeight + 'px',
                'top': '1%',
                'left': '1%'
            }, 1000);
            $('#3d')[0].innerHTML = 'View 3D';
        }
        else {
            Universe.settings.isometricView = true;
            $('#resourceCanvas').css({zIndex: 6});
            $('#agentCanvas').css({zIndex: 5});
            var ratio = FiercePlanet.Orientation.worldHeight / FiercePlanet.Orientation.worldWidth,
                leftOffsetPercent = (1 / ratio) * 12;
             FiercePlanet.Orientation.mapPerspectiveAngle += FiercePlanet.Orientation.DEFAULT_MAP_PERSPECTIVE_ANGLE;
             FiercePlanet.Orientation.mapRotationAngle += FiercePlanet.Orientation.DEFAULT_MAP_ROTATION_ANGLE;
            $('#map_canvas').animate({
                'width': FiercePlanet.Orientation.worldHeight + 'px',
                'height': FiercePlanet.Orientation.worldHeight + 'px',
                'top': '1%',
                'left': leftOffsetPercent + '%'
            }, 1000);
//            $('#map_canvas').animate({
//                'height': Math.floor((ratio + (1 - ratio) / 2) * FiercePlanet.Orientation.worldHeight) + 'px',
//                'top': leftOffsetPercent / 2 + '1%',
////                'left': leftOffsetPercent + '%'
//            }, 1000);

            $('#3d')[0].innerHTML = 'View 2D';

        }
        FiercePlanet.Drawing.transformMap();
        FiercePlanet.Drawing.drawMap();
        FiercePlanet.Drawing.drawCanvases();
    };

    /**
     * Reset view
     */
    this.resetView = function () {
        FiercePlanet.Drawing.zoom(0);
        FiercePlanet.Drawing.panByDrag(- FiercePlanet.Orientation.offsetX / FiercePlanet.Orientation.zoomWorld, - FiercePlanet.Orientation.offsetY / FiercePlanet.Orientation.zoomWorld);
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
        FiercePlanet.Orientation.mapPerspectiveAngle = FiercePlanet.Orientation.mapPerspectiveAngle - (amount * 2.15);
        FiercePlanet.Drawing.drawCanvases();
        FiercePlanet.Drawing.transformMap();
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
        FiercePlanet.Orientation.mapRotationAngle = FiercePlanet.Orientation.mapRotationAngle + amount;
        FiercePlanet.Drawing.drawCanvases();
        FiercePlanet.Drawing.transformMap();
    };

    /**
     * Transform map
     // Experimental rotate support - for Chrome only
     */
    this.transformMap = function() {
        // Strip matrix values, and construct Sylvestor matrix
        // With help from:
        // http://stackoverflow.com/questions/8270612/get-element-moz-transformrotate-value-in-jquery
        // http://www.useragentman.com/blog/2011/01/07/css3-matrix-transform-for-the-mathematically-challenged/
        // http://www.impressivewebs.com/alternative-units-css3-rotate-transforms/
        /*
         // SAMPLE CODE FOR DETERMINING ROTATION AND SKEW. NOT YET WORKING
         var m = $('#map_canvas').css('-webkit-transform');
         var m1 = m.slice(7, m.length - 1).split(', ');
         var m2 = _.map(m1, function(e) { return parseFloat(e); });
         var a = m2[0], b = m2[1], c = m2[2], d = m2[3];
         var currentAngleRads = Math.acos(a);
         var currentAngleDirection = Math.asin(b);
         currentAngleRads = (currentAngleDirection < 0 ? -currentAngleRads : currentAngleRads);
         // Get rid of values close to zero
         var currentSkewY = b;
         var currentSkewX = c;

         var newAngleRads = currentAngleRads + amount;
         console.log(currentAngleRads)
         console.log(amount)
         newAngleRads = (Math.round(newAngleRads * 1000) == 0 ? 0 : newAngleRads);
         console.log(newAngleRads)
         */

        var mapRotate = FiercePlanet.Orientation.mapRotationAngle,
            mapPerspective = FiercePlanet.Orientation.mapPerspectiveAngle;
        $('#map_canvas').css({
            '-webkit-transform': 'rotate(' + mapRotate + 'rad) skewX(' + mapPerspective + 'rad) skewY(' + mapPerspective + 'rad)',
            '-moz-transform': 'rotate(' + mapRotate + 'rad) skewX(' + mapPerspective + 'rad) skewY(' + mapPerspective + 'rad)',
            '-o-transform': 'rotate(' + mapRotate + 'rad) skewX(' + mapPerspective + 'rad) skewY(' + mapPerspective + 'rad)',
            '-ms-transform': 'rotate(' + mapRotate + 'rad) skewX(' + mapPerspective + 'rad) skewY( ' + mapPerspective + 'rad)'
        });
    };

}).apply(FiercePlanet.Drawing);
