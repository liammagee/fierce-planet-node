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


(function () {

    this.globalRecordingCounter = 0;

    // Start with medium difficulty - TODO: Revise
    this.levelOfDifficulty = 2;


    // Current state variables
    this.currentProfile = new Profile();
    this.currentResourceId = null;
    this.currentResource = null;
    this.currentNotice = null;
    // Viewport variables


    // Boolean state variables
    this.inDesignMode = false;


    this.isMouseDown = false;
    this.isMouseMoving = false;
    this.currentX = null;
    this.currentY = null;


    // Timer variables
    this.eventTarget = new EventTarget();
    this.recordedLevels = [];


    // General visual and audio variables
    this.scrollingImage = new Image(); // City image
    this.scrollingImageX = 0;
    this.scrollingImageOffset = 1;

    this.audio = null;
    this.googleMap = null;


    /**
     * Called when a game is loaded
     */
    this.loadGame = function () {
        //FiercePlanet.Utils.loadScripts();


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
    this.setupLifecycle = function () {
        Lifecycle.preProcessCallback = function () {
            // Draw the scrolling layer
            FiercePlanet.Drawing.drawScrollingLayer();

            // Draw any notices
            if (World.settings.noticesVisible && FiercePlanet.Game.currentNotice != undefined) {
                FiercePlanet.Drawing.drawNotice(FiercePlanet.Game.currentNotice);
            }

        };
        Lifecycle.processSavedCallback = function () {
            FiercePlanet.Game.currentProfile.processSavedAgent(Lifecycle.currentWaveNumber);
        }
        Lifecycle.postProcessCallback = function () {

            // Draw scores
            FiercePlanet.Drawing.drawScore();
            FiercePlanet.Drawing.drawResourcesInStore();
            FiercePlanet.Drawing.drawSaved();
            FiercePlanet.Drawing.drawExpired();

            // Check whether we have too many
            for (var i = 0; i < Lifecycle.currentLevel.expiredAgents.length; i++) {
                var deadAgent = Lifecycle.currentLevel.expiredAgents[i];
                if (deadAgent.diedAt > Lifecycle.levelCounter - 20)
                    FiercePlanet.Drawing.drawExpiredAgent(deadAgent);
            }


            if (Lifecycle.currentLevel.currentAgents.length > 0) {
                FiercePlanet.Drawing.drawResourceAndAgents();
            }

            // Broadcast moves - TODO: Move elsewhere
            if (World.settings.sendEventsToServer) {
                //    if (World.settings.sendEventsToServer && !World.settings.spectate) {
                var simpleAgents = [];
                Lifecycle.currentLevel.currentAgents.forEach(function (agent) {
                    var simpleAgent = new SimpleAgent(DefaultCultures.CITIZEN_AGENT_TYPE, agent.x, agent.y, agent.color, agent.speed, agent.health, agent.wanderX, agent.wanderY, agent.lastMemory, agent.delay, agent.countdownToMove, agent.healthCategoryStats);
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


        Lifecycle.preNewGameCallback = function () {
            if (Lifecycle.currentLevelPreset)
                Lifecycle.currentLevelNumber = 1;
            FiercePlanet.Game.currentProfile.resetScores();
        };
        Lifecycle.postNewGameCallback = function () {

        };
        Lifecycle.preNewLevelCallback = function () {
            FiercePlanet.Game.currentProfile.updateScore();
            FiercePlanet.Game.currentNotice = null;
            FiercePlanet.Game.recordedLevels = [];
            FiercePlanet.Utils.bindVariables();

            FiercePlanet.Game.inDesignMode = false;
            FiercePlanet.Game.maxLevelMoves = 0;

        };
        Lifecycle.doNewLevelCallback = function () {
            if (!World.settings.hideLevelInfo)
                FiercePlanet.GeneralUI.levelInfo();
            else
                Lifecycle.startLevel();

        };
        Lifecycle.postNewLevelCallback = function () {
            FiercePlanet.Game.currentNotice = Lifecycle.currentLevel.tip;
            //        $("#notifications").toggle(World.settings.statusBarVisible);
            FiercePlanet.GeneralUI.notify("Starting level " + Lifecycle.currentLevel.id + "...");
            if (World.settings.sendEventsToServer)
                FiercePlanet.Comms.notifyServerOfEvent("level", Lifecycle.currentLevel.id);
            /*
             if (! World.settings.hideLevelInfo)
             FiercePlanet.GeneralUI.levelInfo();
             else
             Lifecycle.startLevel();
             */

        };
        Lifecycle.preRestartLevelCallback = function () {
            // Reset the score
            FiercePlanet.Game.currentProfile.revertScore();
        };
        Lifecycle.postRestartLevelCallback = function () {

        };
        Lifecycle.preStartLevelCallback = function () {
            if (World.settings.sendEventsToServer) {
                FiercePlanet.Comms.notifyServerOfEvent("start", null);
            }

            FiercePlanet.Game._startAudio();
            FiercePlanet.Drawing.animateLevel();
            // Start a new level
            if (World.settings.firstPerson) {
                //            Lifecycle.currentLevel.generateAgents(AgentTypes.CITIZEN_AGENT_TYPE, 1);
                var agentSets = ModuleManager.currentModule.allCultures();
                for (var i = 0, l = agentSets.length; i < l; i++) {
                    var agentType = agentSets[i];
                    if (agentType.generateEachWave) {
                        Lifecycle.currentLevel.generateAgents(agentType, Lifecycle.numAgents);
                    }
                }
            }
        };
        Lifecycle.postStartLevelCallback = function () {

        };
        Lifecycle.preNewWaveCallback = function () {
            FiercePlanet.Game.currentProfile.currentLevelSavedThisWave = 0;

            // Refresh the graph every wave?
            if (World.settings.refreshGraphEveryWave)
                FiercePlanet.Graph.refreshGraph();

            FiercePlanet.GeneralUI.notify("New wave coming...");

            FiercePlanet.Drawing.drawEntryPoints();
            FiercePlanet.Drawing.drawExitPoints();
            FiercePlanet.Game.eventTarget.fire(new Event("game", this, "newWave", $fp.levelCounter, Lifecycle.currentLevel));

        };
        Lifecycle.postNewWaveCallback = function () {

        };
        Lifecycle.preCompleteWaveCallback = function () {

        };
        Lifecycle.postCompleteWaveCallback = function () {

        };
        Lifecycle.preCompleteLevelCallback = function () {
            FiercePlanet.Game.currentProfile.compileProfileStats(Lifecycle.currentLevel);
            FiercePlanet.Game._stopAudio();
            FiercePlanet.Dialogs.showCompleteLevelDialog();
        };
        Lifecycle.postCompleteLevelCallback = function () {

        };
        Lifecycle.preCompleteGameCallback = function () {
            FiercePlanet.Game.currentProfile.compileProfileStats(Lifecycle.currentLevel);
            FiercePlanet.Game._stopAudio();
            FiercePlanet.Dialogs.showCompleteGameDialog();

        };
        Lifecycle.postCompleteGameCallback = function () {

        };
        Lifecycle.preGameOverCallback = function () {
            FiercePlanet.Game.currentProfile.revertScore();
            FiercePlanet.Game._stopAudio();
            FiercePlanet.Dialogs.showGameOverDialog();

        };
        Lifecycle.postGameOverCallback = function () {

        };
        Lifecycle.preInitialiseGameCallback = function () {

        };
        Lifecycle.postInitialiseGameCallback = function () {
            if (FiercePlanet.Game.waveOverride > 0) {
                Lifecycle.currentLevel.waveNumber = (FiercePlanet.Game.waveOverride);
                FiercePlanet.Game.waveOverride = 0;
            }

            // Start the audio
            FiercePlanet.Game._stopAudio();

            //    score = 0;
            FiercePlanet.Game.currentProfile.resetCurrentStats();
            FiercePlanet.Graph.refreshGraph();


            Lifecycle.resourceRecoveryCycle = Math.pow(World.settings.rateOfResourceRecovery, FiercePlanet.Game.levelOfDifficulty - 1);

            Lifecycle.numAgents = Lifecycle.currentLevel.initialAgentNumber;
            FiercePlanet.Orientation.cellsAcross = Lifecycle.currentLevel.cellsAcross;
            FiercePlanet.Orientation.cellsDown = Lifecycle.currentLevel.cellsDown;
            FiercePlanet.Orientation.cellWidth = Math.round(FiercePlanet.Orientation.worldWidth / FiercePlanet.Orientation.cellsAcross);
            FiercePlanet.Orientation.cellHeight = Math.round(FiercePlanet.Orientation.worldHeight / FiercePlanet.Orientation.cellsDown);
            FiercePlanet.Orientation.pieceWidth = Math.round(FiercePlanet.Orientation.cellWidth * 0.5);
            FiercePlanet.Orientation.pieceHeight = Math.round(FiercePlanet.Orientation.cellHeight * 0.5);
            FiercePlanet.Game.scrollingImage.src = "/images/yellow-rain.png";

            // Draw the game
            FiercePlanet.Drawing.drawGame();

        };
        Lifecycle.preFinaliseGameCallback = function () {

        };
        Lifecycle.postFinaliseGameCallback = function () {
            FiercePlanet.ProfileUI.storeProfileData();
            FiercePlanet.Drawing.drawScoreboard();
        };
        Lifecycle.postStartAgentsCallback = function () {
            // Make sure button is on pause
            $('#playAgents').removeClass('pausing');
            $('#playAgents').addClass('playing');

        };
        Lifecycle.postStopAgentsCallback = function () {
            // Make sure button is on play
            $('#playAgents').removeClass('playing');
            $('#playAgents').addClass('pausing');
        };

    };

    /**
     * Starts the audio
     */
    this._startAudio = function () {
        // Play sound, if any are set
        if (World.settings.soundsPlayable) {
            if (FiercePlanet.Game.audio != undefined) {
                FiercePlanet.Game.audio.play();
            }
            else if (Lifecycle.currentLevel.soundSrc != undefined) {
                FiercePlanet.Game.audio = new Audio(Lifecycle.currentLevel.soundSrc);
                FiercePlanet.Game.audio.loop = true;
                FiercePlanet.Game.audio.addEventListener("ended", function () {
                    FiercePlanet.Game.audio.currentTime = 0;
                    FiercePlanet.Game.audio.play();
                }, false);
                FiercePlanet.Game.audio.play();
            }
        }
    };

    /**
     * Stops the audio
     */
    this._stopAudio = function () {
        if (World.settings.soundsPlayable) {
            if (FiercePlanet.Game.audio != undefined)
                FiercePlanet.Game.audio.pause();
        }
    };


    /**
     * Plays the current game
     */
    this.playGame = function () {
        if (Lifecycle.inPlay) {
            FiercePlanet.Game.pauseGame();
        }
        else {
            if (World.settings.sendEventsToServer) {
                FiercePlanet.Comms.notifyServerOfEvent("play", null);
            }
            FiercePlanet.Game._startAudio();
            $('#playAgents').removeClass('pausing');
            $('#playAgents').addClass('playing');
            if (Lifecycle.waveCounter == 0)
                Lifecycle.newWave();
            else
                Lifecycle._startAgents();
        }
    };


    /**
     * Pauses the current game
     */
    this.pauseGame = function () {
        if (!Lifecycle.inPlay)
            return;
        if (World.settings.sendEventsToServer) {
            FiercePlanet.Comms.notifyServerOfEvent("pause", null);
        }

        FiercePlanet.Game._stopAudio();
        Lifecycle._stopAgents();
    };


    /**
     * Slows down the rate of processing agents
     */
    this.slowDown = function () {
        if (Lifecycle.interval < 10)
            Lifecycle.interval += 1;
        else if (Lifecycle.interval < 100)
            Lifecycle.interval += 10;
        //        FiercePlanet.GeneralUI.notify("Now playing at: " + Math.round(1000 / Lifecycle.interval) + " frames per second.");
        if (FiercePlanet.Game.inPlay)
            Lifecycle._startAgents();
    };


    /**
     * Speeds up the rate of processing agents
     */
    this.speedUp = function () {
        if (Lifecycle.interval > 10)
            Lifecycle.interval -= 10;
        else if (Lifecycle.interval > 1)
            Lifecycle.interval -= 1;
        //        FiercePlanet.GeneralUI.notify("Now playing at: " + Math.round(1000 / Lifecycle.interval) + " frames per second.");
        if (FiercePlanet.Game.inPlay)
            Lifecycle._startAgents();
    };


}).apply(FiercePlanet.Game);
