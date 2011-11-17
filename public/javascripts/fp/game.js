/*!
 * Fierce Planet - Game
 * Core game initialisation and processing loop
 * NB: classes.js and relevant level sources must be pre-loaded
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


/**
 * @namespace Holds functionality related to FiercePlanet
 */
var FiercePlanet = FiercePlanet || {};
var $fp = $fp || FiercePlanet;

FiercePlanet.Game = FiercePlanet.Game || {};


(function() {


    this.globalRecordingCounter = 0;


    /** @constant The default width of notices */
    this.WAVE_NOTICE_WIDTH = 200;
    /** @constant The default height of notices */
    this.WAVE_NOTICE_HEIGHT = 150;

    // Start with medium difficulty - TODO: Revise
    this.levelOfDifficulty = 2;


    // Current state variables
    this.currentProfile = new Profile();
    this.currentLevelSetID = 'Default';
    this.currentLevelNumber = 1;
    this.currentWave = 1;
    this.currentLevelPreset = true;
    this.currentLevel = null;
    this.existingCurrentLevel = null;
    this.currentResourceId = null;
    this.currentResource = null;
    this.currentNotice = null;
    // Viewport variables


    // Boolean state variables
    this.inDesignMode = false;
    this.inPlay = false;


    this.isMouseDown = false;
    this.isMouseMoving = false;
    this.currentX = null;
    this.currentY = null;



    // Timer variables
    this.eventTarget = new EventTarget();
    this.recordedLevels = [];


    // Game play variables
    this.waveOverride = 0;
    this.maxWaveMoves = 0;
    this.maxLevelMoves = 0;


    this.numAgents = 1;




    // General visual and audio variables
    this.scrollingImage = new Image(); // City image
    this.scrollingImageX = 0;
    this.scrollingImageOffset = 1;

    this.audio = null;
    this.googleMap = null;






    /**
     * Called when a game is loaded
     */
    this.loadGame = function() {
        FiercePlanet.Utils.loadScripts();

        // Load relevant settings, if available
        FiercePlanet.Orientation.adjustParameters(FiercePlanet.Orientation.DEFAULT_WORLD_WIDTH, FiercePlanet.Orientation.DEFAULT_WORLD_HEIGHT);

        // Load relevant settings, if available
        FiercePlanet.ProfileUI.loadProfileSettingsFromStorage();

        // Set up the level gallery
        FiercePlanet.LevelGallery.init();

        // Initialise World settings
        FiercePlanet.Utils.initialiseWorldSettings();

        // Retrieve properties
        World.settings.load();

        // Set up dialogs
        FiercePlanet.Dialogs.setupDialogs();

        // Handle resource drag and drop and click interactions
        FiercePlanet.ResourceUI.initialiseAndLoadResources();

        // Handle resource drag and drop and click interactions
        FiercePlanet.ResourceUI.setupResourceInteraction();

        // Load profile and refresh capabilities
        FiercePlanet.ProfileUI.getProfile();

        // Add UI event listeners
        FiercePlanet.Controls.hookUpUIEventListeners();

        // Process settings
        FiercePlanet.Utils.processSettings();

        // Add custom event listeners
        FiercePlanet.Event.hookUpCustomEventListeners();

        // Bind variables
        FiercePlanet.Utils.bindVariables();

        // Add callbacks to lifecycle
        FiercePlanet.Game.setupLifecycle();

        // Draw the game
        Lifecycle.newLevel();
    };


    /**
     * Set up the lifecycle callbacks
     */
    this.setupLifecycle = function() {
        Lifecycle.preProcessCallback = function() {
            // Draw the scrolling layer
            FiercePlanet.Drawing.drawScrollingLayer();

            // Draw any notices
            if (World.settings.noticesVisible && FiercePlanet.Game.currentNotice != undefined) {
                FiercePlanet.Drawing.drawNotice(FiercePlanet.Game.currentNotice);
            }
    //        if (FiercePlanet.Game.nullifiedAgents)
//                FiercePlanet.Drawing.clearAgentGroup(FiercePlanet.Game.nullifiedAgents);
    //        FiercePlanet.Drawing.clearAgents();

        };
        Lifecycle.postProcessCallback = function() {
            // Draw scores
            FiercePlanet.Drawing.drawScore();
            FiercePlanet.Drawing.drawResourcesInStore();
            FiercePlanet.Drawing.drawSaved();
            FiercePlanet.Drawing.drawExpired();
            //


            if (FiercePlanet.Game.currentProfile.currentLevelExpired >= FiercePlanet.Game.currentLevel.expiryLimit) {
                return Lifecycle.gameOver();
            }

            // Check whether we have too many
            for (var i = 0; i < FiercePlanet.Game.currentLevel.expiredAgents.length; i++) {
                var deadAgent = FiercePlanet.Game.currentLevel.expiredAgents[i];
                if (deadAgent.diedAt > Lifecycle.levelCounter - 20)
                    FiercePlanet.Drawing.drawExpiredAgent(deadAgent);
            }

            // No agents left? End of wave
            if (FiercePlanet.Game.currentLevel.currentAgents.length == 0) {
                // Start a new wave
                if (FiercePlanet.Game.currentWave < FiercePlanet.Game.currentLevel.waveNumber) {
                    Lifecycle.completeWave();
                    Lifecycle.newWave();
                }
                else if (FiercePlanet.Game.currentLevel.isPresetLevel && ! FiercePlanet.Game.currentLevel.isTerminalLevel) {
                    Lifecycle.completeLevel();
                    Lifecycle.levelDelayCounter = 0;
                }
                else {
                    return Lifecycle.completeGame();
                }
            }
            else {
                FiercePlanet.Drawing.drawResourceAndAgents();
            }

            // Broadcast moves - TODO: Move elsewhere
            if (World.settings.sendEventsToServer) {
    //    if (World.settings.sendEventsToServer && !World.settings.spectate) {
                var simpleAgents = [];
                FiercePlanet.Game.currentLevel.currentAgents.forEach(function(agent) {
                    var simpleAgent = new SimpleAgent(AgentTypes.RIVAL_AGENT_TYPE, agent.x, agent.y, agent.color, agent.speed, agent.health, agent.wanderX, agent.wanderY, agent.lastMemory, agent.delay, agent.countdownToMove, agent.healthCategoryStats);
    //            var simpleAgent = $.extend(true, {}, agent);
    //            simpleAgent.wipeMemory();
                    simpleAgents.push(simpleAgent);
                });
                FiercePlanet.Comms.notifyServerOfEvent('agents', simpleAgents);
            }

            // Post-move processing
            if (World.settings.recording)
                FiercePlanet.Recording.recordWorld();

        };
    };

}).apply(FiercePlanet.Game);
