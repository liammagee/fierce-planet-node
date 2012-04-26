/*!
 * Fierce Planet - GeneralUI
 * General UI functions
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */



var FiercePlanet = FiercePlanet || {};


/**
 * @namespace Contains keyboard-related functions
 */
FiercePlanet.Mouse = FiercePlanet.Mouse || {};

(function() {

    /**
     *  Does all the necessary binding for in-game mouse events
     */
    this.bindGameMouseEvents = function() {
        var topMostCanvas = FiercePlanet.GeneralUI.getTopMostCanvas();

        topMostCanvas.click(FiercePlanet.GeneralUI.handleNoticeEvents);
        topMostCanvas.click(FiercePlanet.ResourceUI.processResourceCanvasClick);

        topMostCanvas.mousemove(FiercePlanet.Mouse.registerMouseMove);
        if (Universe.settings.allowInlinePanning) {
            topMostCanvas.mousedown(FiercePlanet.Mouse.registerMouseDown);
            topMostCanvas.mouseup(FiercePlanet.Mouse.registerMouseUp);
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
        topMostCanvas.unbind('mousedown', FiercePlanet.Mouse.registerMouseDown);
        topMostCanvas.unbind('mousemove', FiercePlanet.Mouse.registerMouseMove);
        topMostCanvas.unbind('mouseup', FiercePlanet.Mouse.registerMouseUp);
//        topMostCanvas.unmousewheel();
        topMostCanvas.unbind("contextmenu");
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
    };

    /**
     *  Register mouse move event
     */
    this.registerMouseMove = function(e) {
        if (FiercePlanet.Game.isMouseDown && Universe.settings.allowInlinePanning) {
            FiercePlanet.Game.isMouseMoving = true;
            FiercePlanet.Mouse.doMove(e);
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
            /*
            else if (e.layerX || e.layerX == 0) { // Firefox
                ex = e.layerX;
                ey = e.layerY;
            }
            */
            var offsetX = ex - FiercePlanet.Game.currentX;
            var offsetY = ey - FiercePlanet.Game.currentY;

            if ((!Universe.settings.reverseMouseClickEffects && e.which != 1) || (Universe.settings.reverseMouseClickEffects && e.which == 1)) {
                var midX = FiercePlanet.Orientation.halfWorldWidth;
                var midY = FiercePlanet.Orientation.halfWorldHeight;
                var	cx = FiercePlanet.Game.currentX - midX;
                var	cy = FiercePlanet.Game.currentY - midY;
                var	nx = ex - midX;
                var	ny = ey - midY;
                var ct = Math.atan2(cy, cx);
                var nt = Math.atan2(ny, nx);
                var dt = (nt - ct) * ((Math.abs(nx) / midX) + (Math.abs(ny) / midY));

                FiercePlanet.Orientation.rotationAngle = FiercePlanet.Orientation.rotationAngle + dt;
                FiercePlanet.Orientation.perspectiveAngle = FiercePlanet.Orientation.perspectiveAngle + (offsetY / (FiercePlanet.Orientation.halfWorldHeight));
                FiercePlanet.Orientation.mapRotationAngle = FiercePlanet.Orientation.mapRotationAngle + dt;
                FiercePlanet.Orientation.mapPerspectiveAngle = FiercePlanet.Orientation.mapPerspectiveAngle - (offsetY / (FiercePlanet.Orientation.halfWorldHeight * 2));
                console.log(FiercePlanet.Orientation.perspectiveAngle, FiercePlanet.Orientation.mapPerspectiveAngle)

                FiercePlanet.Drawing.transformMap();
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
            FiercePlanet.Mouse.doMove(e);
            FiercePlanet.Game.isMouseDown = false;
        }
        return false;
    };

}).apply(FiercePlanet.Mouse);
