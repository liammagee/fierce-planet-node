/*!
 * Fierce Planet - Game
 * Core game initialisation and processing loop
 * NB: classes.js and relevant world sources must be pre-loaded
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

    this.SAVE_SCORE = 10;
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
    this.recordedWorlds = [];


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
        $(window).resize(function() {
            FiercePlanet.Orientation.adjustParameters($('#world-container').width(), $('#world-container').height());
            FiercePlanet.Drawing.drawCanvases();
        });

        // Set world width and height
        FiercePlanet.Orientation.initialiseParameters($('#world-container').width(), $('#world-container').height());

        // Load relevant settings, if available
        FiercePlanet.ProfileUI.loadProfileSettingsFromStorage();

        // Set up the world gallery
        FiercePlanet.WorldGallery.init();

        // Initialise World settings
        FiercePlanet.Utils.initialiseUniverseSettings();

        // Retrieve properties
        Universe.settings.load();

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

        // Push graph set up elsewhere
        $("#model-tabs").tabs();
        $("#world-graph").width(FiercePlanet.Orientation.worldWidth * 0.9);
        $("#world-graph").height(FiercePlanet.Orientation.worldHeight * 0.25);
        FiercePlanet.Graph.drawGraph();

        // Draw the game
        Lifecycle.newWorld();
    };


    /**
     * Set up the lifecycle callbacks
     */
    this.setupLifecycle = function () {
        Lifecycle.preProcessCallback = function () {
            // Draw the scrolling layer
            FiercePlanet.Drawing.drawScrollingLayer();

            // Draw any notices
            if (Universe.settings.noticesVisible && FiercePlanet.Game.currentNotice != undefined) {
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
            FiercePlanet.Drawing.clearCanvas('#agentCanvas');
            for (var i = 0; i < Lifecycle.currentWorld.expiredAgents.length; i++) {
                var deadAgent = Lifecycle.currentWorld.expiredAgents[i];
                if (deadAgent.diedAt > Lifecycle.worldCounter - 20)
                    FiercePlanet.Drawing.drawExpiredAgent(deadAgent);
            }


//            if (Lifecycle.currentWorld.getCurrentAgents().length > 0) {
                FiercePlanet.Drawing.drawResourceAndAgents();
//            }

            // Broadcast moves - TODO: Move elsewhere
            if (Universe.settings.sendEventsToServer) {
                //    if (Universe.settings.sendEventsToServer && !Universe.settings.spectate) {
                var simpleAgents = [];
                Lifecycle.currentWorld.currentAgents.forEach(function (agent) {
                    var simpleAgent = new SimpleAgent(DefaultCultures.CITIZEN_AGENT_TYPE, agent.x, agent.y, agent.color, agent.speed, agent.health, agent.wanderX, agent.wanderY, agent.lastMemory, agent.delay, agent.countdownToMove, agent.healthCategoryStats);
                    //            var simpleAgent = $.extend(true, {}, agent);
                    //            simpleAgent.wipeMemory();
                    simpleAgents.push(simpleAgent);
                });
                FiercePlanet.Comms.notifyServerOfEvent('agents', simpleAgents);
            }

            // Post-move processing
            if (Universe.settings.recording)
                FiercePlanet.Recording.recordUniverse();

        };


        Lifecycle.preNewGameCallback = function () {
            if (Lifecycle.currentWorldPreset)
                Lifecycle.currentWorldNumber = 1;
            FiercePlanet.Game.currentProfile.resetScores();
        };
        Lifecycle.postNewGameCallback = function () {

        };
        Lifecycle.preNewWorldCallback = function () {
            FiercePlanet.Game.currentProfile.updateScore();
            FiercePlanet.Game.currentNotice = null;
            FiercePlanet.Game.recordedWorlds = [];
            FiercePlanet.Utils.bindVariables();

            FiercePlanet.Game.inDesignMode = false;
            FiercePlanet.Game.maxWorldMoves = 0;

        };
        Lifecycle.doNewWorldCallback = function () {
            if (!Universe.settings.hideWorldInfo)
                FiercePlanet.GeneralUI.worldInfo();
            else
                Lifecycle.startWorld();

        };
        Lifecycle.postNewWorldCallback = function () {
            FiercePlanet.Game.currentNotice = Lifecycle.currentWorld.tip;
            //        $("#notifications").toggle(Universe.settings.statusBarVisible);
            FiercePlanet.GeneralUI.notify("Starting world " + Lifecycle.currentWorld.id + "...");
            if (Universe.settings.sendEventsToServer)
                FiercePlanet.Comms.notifyServerOfEvent("world", Lifecycle.currentWorld.id);
            /*
             if (! Universe.settings.hideWorldInfo)
             FiercePlanet.GeneralUI.worldInfo();
             else
             Lifecycle.startWorld();
             */
        };
        Lifecycle.preRestartWorldCallback = function () {
            // Reset the score
            FiercePlanet.Game.currentProfile.revertScore();
        };
        Lifecycle.postRestartWorldCallback = function () {

        };
        Lifecycle.preStartWorldCallback = function () {
            if (Universe.settings.sendEventsToServer)
                FiercePlanet.Comms.notifyServerOfEvent("start", null);

            if (Universe.settings.playAudio)
                FiercePlanet.Game._startAudio();
            if (Universe.settings.animateWorldAtStart)
                FiercePlanet.Drawing.animateWorld();

            // Start a new world
            if (Universe.settings.firstPerson) {
                //            Lifecycle.currentWorld.generateAgents(AgentTypes.CITIZEN_AGENT_TYPE, 1);
                var agentSets = ModuleManager.currentModule.allCultures();
                for (var i = 0, l = agentSets.length; i < l; i++) {
                    var agentType = agentSets[i];
                    if (agentType.generateEachWave) {
                        Lifecycle.currentWorld.generateAgents(agentType, Lifecycle.numAgents);
                    }
                }
            }

            if (FiercePlanet.Effects)
                FiercePlanet.Effects.setupView();
        };
        Lifecycle.postStartWorldCallback = function () {
//            FiercePlanet.Drawing.drawGame();
        };
        Lifecycle.preNewWaveCallback = function () {
            FiercePlanet.Game.currentProfile.currentWorldSavedThisWave = 0;

            // Refresh the graph every wave?
            if (Universe.settings.refreshGraphEveryWave)
                FiercePlanet.Graph.refreshGraph();

            FiercePlanet.GeneralUI.notify("New wave coming...");

            FiercePlanet.Drawing.drawEntryPoints();
            FiercePlanet.Drawing.drawExitPoints();
            FiercePlanet.Game.eventTarget.fire(new Event("game", this, "newWave", $fp.worldCounter, Lifecycle.currentWorld));

        };
        Lifecycle.postNewWaveCallback = function () {

        };
        Lifecycle.preCompleteWaveCallback = function () {

        };
        Lifecycle.postCompleteWaveCallback = function () {

        };
        Lifecycle.preCompleteWorldCallback = function () {
            FiercePlanet.Game.currentProfile.compileProfileStats(Lifecycle.currentWorld);
            FiercePlanet.Game._stopAudio();
            FiercePlanet.Dialogs.showCompleteWorldDialog();
        };
        Lifecycle.postCompleteWorldCallback = function () {

        };
        Lifecycle.preCompleteGameCallback = function () {
            FiercePlanet.Game.currentProfile.compileProfileStats(Lifecycle.currentWorld);
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
                Lifecycle.currentWorld.waveNumber = FiercePlanet.Game.waveOverride;
                FiercePlanet.Game.waveOverride = 0;
            }

            // Stop the audio
            FiercePlanet.Game._stopAudio();

            FiercePlanet.Game.currentProfile.resetCurrentStats();
            FiercePlanet.Graph.refreshGraph();

            Lifecycle.resourceRecoveryCycle = Math.pow(Universe.settings.rateOfResourceRecovery, FiercePlanet.Game.levelOfDifficulty - 1);
            Lifecycle.numAgents = Lifecycle.currentWorld.initialAgentNumber;
            FiercePlanet.Orientation.cellsAcross = Lifecycle.currentWorld.cellsAcross;
            FiercePlanet.Orientation.cellsDown = Lifecycle.currentWorld.cellsDown;
            FiercePlanet.Orientation.cellWidth = Math.round(FiercePlanet.Orientation.worldWidth / FiercePlanet.Orientation.cellsAcross);
            FiercePlanet.Orientation.cellHeight = Math.round(FiercePlanet.Orientation.worldHeight / FiercePlanet.Orientation.cellsDown);
            FiercePlanet.Orientation.pieceWidth = Math.round(FiercePlanet.Orientation.cellWidth * 0.5);
            FiercePlanet.Orientation.pieceHeight = Math.round(FiercePlanet.Orientation.cellHeight * 0.5);

            // Draw the game
//            Lifecycle.currentWorld.initialiseCells();
//            Lifecycle.currentWorld.generatePath();
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
        if (Universe.settings.soundsPlayable) {
            if (FiercePlanet.Game.audio != undefined) {
                FiercePlanet.Game.audio.play();
            }
            else if (Lifecycle.currentWorld.soundSrc != undefined) {
                FiercePlanet.Game.audio = new Audio(Lifecycle.currentWorld.soundSrc);
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
        if (Universe.settings.soundsPlayable) {
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
            if (Universe.settings.sendEventsToServer) {
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
        if (Universe.settings.sendEventsToServer) {
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
//        if (FiercePlanet.Game.inPlay)
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
//        if (FiercePlanet.Game.inPlay)
            Lifecycle._startAgents();
    };


}).apply(FiercePlanet.Game);
