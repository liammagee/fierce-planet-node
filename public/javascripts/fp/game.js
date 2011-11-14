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

    /** @constant The time to wait before starting the first wave */
    this.NEW_LEVEL_DELAY = 3000;
    /** @constant The time to wait between waves */
    this.NEW_WAVE_DELAY = 200;

    this.resourceRecoveryCycle = 5;
    this.interval = 40;

    /** @constant The default width of notices */
    this.WAVE_NOTICE_WIDTH = 200;
    /** @constant The default height of notices */
    this.WAVE_NOTICE_HEIGHT = 150;

    // Start with medium difficulty - TODO: Revise
    this.levelOfDifficulty = 2;

    this.agentTimerId = 0;

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

    this.levelDelayCounter = 0;
    this.waveDelayCounter = 0;
    this.waveCounter = 0;
    this.levelCounter = 0;
    this.gameCounter = 0;
    this.globalRecordingCounter = 0;



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

        // Draw the game
        FiercePlanet.Lifecycle.newLevel();

    };


}).apply(FiercePlanet.Game);
