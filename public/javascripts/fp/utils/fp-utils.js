/*!
 * Fierce Planet - Utils
 * Various utility methods
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


// Modify the namespace

/**
 * Always send the authenticity_token with ajax
 */
$(document).ajaxSend(function(event, request, settings) {
    if ( settings.type == 'post' ) {
        settings.data = (settings.data ? settings.data + "&" : "")
            + "authenticity_token=" + encodeURIComponent( AUTH_TOKEN );
    }
});


/**
 * Handle zoom, as best as possible
 */
$(function(){
    $().zoom(function(direction){
        switch(direction) {
            case 1:
                FiercePlanet.Orientation.externalZoomWorld *= 1.2;
                break;
            case -1:
                FiercePlanet.Orientation.externalZoomWorld /= 1.2;
                break;
            case 0:
                FiercePlanet.Orientation.externalZoomWorld = 1;
                break;
            }
    });
});




var FiercePlanet = FiercePlanet || {};

/**
 * @namespace Contains utility functions
 */
FiercePlanet.Utils = FiercePlanet.Utils || {};

(function() {

    /**
     * Simple method for coercing a value to a floored integer
     * @param value
     */
    this.checkInteger = function(value) {
        return Math.floor(value);
    };

    /**
     * Binds shortcut variables for use in the console
     */
    this.bindVariables = function() {
        // Set up shortcut variable names for debugging convenience
        $fp.w = $fp.w || Universe;
        $fp.s = $fp.s || Universe.settings;
        $fp.p = FiercePlanet.Game.currentProfile;
        $fp.l = Lifecycle.currentWorld;
        $fp.r = FiercePlanet.Game.currentResource;
        $fp.rid = FiercePlanet.Game.currentResourceId;
        $fp.x = FiercePlanet.Game.currentX;
        $fp.y = FiercePlanet.Game.currentY;
    };

    /**
     * Initialises Universe settings
     */
    this.initialiseUniverseSettings = function() {
        Universe.settings.noticesVisible = Universe.settings.noticesVisible || true;
        Universe.settings.statusBarVisible = Universe.settings.statusBarVisible || true;
        Universe.settings.scrollingImageVisible = Universe.settings.scrollingImageVisible || true;
        Universe.settings.catastrophesVisible = Universe.settings.catastrophesVisible || true;
        Universe.settings.disableKeyboardShortcuts = Universe.settings.disableKeyboardShortcuts || true;
        Universe.settings.allowInlinePanning = Universe.settings.allowInlinePanning || false;

        Universe.settings.soundsPlayable = Universe.settings.soundsPlayable || false;
        Universe.settings.useInlineResourceSwatch = Universe.settings.useInlineResourceSwatch || false;
        Universe.settings.agentTracing = Universe.settings.agentTracing || false;
        Universe.settings.agentGoToNearestExit = Universe.settings.agentGoToNearestExit || false;

        Universe.settings.hidePath = Universe.settings.hidePath || false;
        Universe.settings.hidePathBorder = Universe.settings.hidePathBorder || false;
        Universe.settings.hideWorldInfo = Universe.settings.hideWorldInfo || false;
        Universe.settings.showGraph = Universe.settings.showGraph || false;
        Universe.settings.showModuleEditor = Universe.settings.showModuleEditor || false;
        Universe.settings.refreshGraphEveryWave = Universe.settings.refreshGraphEveryWave || false;
        Universe.settings.showChat = Universe.settings.showChat || false;
        Universe.settings.makeElementsMovable = Universe.settings.makeElementsMovable || false;
        Universe.settings.reverseMouseClickEffects = Universe.settings.reverseMouseClickEffects || false;

        Universe.settings.rivalsVisible = Universe.settings.rivalsVisible || false;
        Universe.settings.predatorsVisible = Universe.settings.predatorsVisible || false;
        Universe.settings.tilesMutable = Universe.settings.tilesMutable || false;
        Universe.settings.tilesRemovable = Universe.settings.tilesRemovable || false;
        Universe.settings.backgroundIconsVisible = Universe.settings.backgroundIconsVisible || false;
        Universe.settings.recording = Universe.settings.recording || false;
        Universe.settings.godMode = Universe.settings.godMode || false;

        Universe.settings.isometricView = Universe.settings.isometricView || false;
        Universe.settings.showResourcesAsBoxes = Universe.settings.showResourcesAsBoxes || true;

        Universe.settings.sendEventsToServer = Universe.settings.sendEventsToServer || false;
        Universe.settings.spectate = Universe.settings.spectate || false;
        Universe.settings.firstPerson = Universe.settings.firstPerson || false;
    }

    /**
     * Sourced from: http://stackoverflow.com/questions/1267283/how-can-i-create-a-zerofilled-value-using-javascript/1267338#1267338.
     *
     * @param number
     * @param width
     */
    this.zeroFill = function ( number, width ){
      width -= number.toString().length;
      if ( width > 0 ) {
        return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
      }
      return number;
    };



    /**
     * Gets all properties from local storage, and sets them on the settings dialog.
     */
    this.getAndRetrieveProperties = function() {

        // Get the settings from the World object
        for (var key in Universe.settings) {
            // Make sure we're only capturing numbers, strings, booleans (not objects, functions or undefineds)
            if (Universe.settings.hasOwnProperty(key) && $.inArray(typeof Universe.settings[key], ["number", "string", "boolean"]) > -1) {
                var option = $('#' + key);
                if (option && option.length > 0) {
                    // Using a checkbox?
                    if (option[0].type == "checkbox") {
                        option[0].checked = Universe.settings[key];
                    }
                    // Using a slider?
                    else if (option.attr("class") && option.attr("class").indexOf("slider-component") > -1) {
                        option.slider("value", Universe.settings[key]);
                        $('#' + key + "Display")[0].innerHTML = Universe.settings[key];
                    }
                }
            }
        }
    };


    /**
     * Sets all properties on settings dialog, and stores property values in local storage.
     */
    this.setAndStoreProperties = function() {

        // Set the settings on the World object
        console.log(Universe.settings)

        // Add checkbox values
        var inputs = $('#settings-dialog input[type="checkbox"]');
        for (var key in inputs) {
            var inputID = inputs[key].id;
            Universe.settings[inputID] = inputs[key].checked;
        }

        // Add slider values
        inputs = $('#settings-dialog .slider-component');
        for (key in inputs) {
            inputID = inputs[key].id;
            Universe.settings[inputID] = $("#" + inputID).slider("value");
        }



        // Store all settings
        Universe.settings.store();

        FiercePlanet.Utils.processSettings();

        Lifecycle.restartWorld();
    };


    /**
     * Processes settings
     */
    this.processSettings = function() {
        // Handle setting specific settings

        // Open extended area if we are showing the graph
        if (Universe.settings.showGraph) {
            FiercePlanet.Graph.openDialog();
            FiercePlanet.Graph.drawGraph();
        }
        else {
            FiercePlanet.Graph.clearGraph();
        }

        if (Universe.settings.showModuleEditor) {
            FiercePlanet.ModuleEditor.openDialog();
        }


        if (Universe.settings.disableKeyboardShortcuts)
            $(document).unbind('keydown');
        else {
            $(document).unbind('keydown');
            $(document).keydown(FiercePlanet.Keyboard.handleKeyboardShortcuts);
        }

        // Update based on allowInlinePanning property
        FiercePlanet.Mouse.unbindGameMouseEvents();
        FiercePlanet.Mouse.bindGameMouseEvents();

        // Makes elements movable
        FiercePlanet.GeneralUI.makeElementsMovable();

        // Load optional scripts dynamically
        FiercePlanet.Utils.loadScripts();


        if (Universe.settings.resourcesUpgradeable)
            $('#upgrade-option').css('display', 'block');
        else
            $('#upgrade-option').css('display', 'none');

        if (Universe.settings.makeSquare) {
//        $('#world-container').height($('#world-container').width());
//            $('#world-container').height(480);
            $('#map_canvas').height(480);
            $('canvas').height(480);
            $('canvas').width(480);
            $('#notifications').css('top', '597px');
            $('#world-editor').css('top', '580px');
//        FiercePlanet.Orientation.worldHeight = 480;
        }
        else {
//            $('#world-container').height(500);
//            $('#map_canvas').height(500);
//            $('canvas').height(500);
//            $('canvas').width(600);
//            $('#notifications').css('top', '517px');
//            $('#world-editor').css('top', '500px');
//            FiercePlanet.Orientation.worldHeight = 400;
        }
    };

    /**
     * Makes a world from a JSON object
     */
    this.makeFromJSONObject = function(obj, prototype) {
        var obj = {};
        for (var key in prototype) {
            if (typeof(prototype[key]) == "function") {
                obj[key] = prototype[key];
            }
        }
        return obj;
    };


    /**
     * Loads optional scripts dynamically
     */
    this.loadScripts = function() {
        // TODO: Add settings checks to test for which scripts need to be loaded
        var scripts = ['/javascripts/fp/utils/test.js'];
        try {
//            $.getScript(scripts[0], function() {
//                console.log(FiercePlanet.Test.initialised);
//            });
        }
        catch (e) {}
    };

}).apply(FiercePlanet.Utils);



