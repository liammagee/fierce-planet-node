/*!
 * Fierce Planet - Lifecycle
 * Lifecycle related methods
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */





/**
 * @namespace Contains lifecycle functions
 */
var Lifecycle = Lifecycle || {};


(function() {
    /** @constant The time to wait before starting the first wave */
    this.NEW_LEVEL_DELAY = 3000;
    /** @constant The time to wait between waves */
    this.NEW_WAVE_DELAY = 200;
    this.levelDelayCounter = 0;
    this.waveDelayCounter = 0;

    this.waveCounter = 0;
    this.levelCounter = 0;
    this.worldCounter = 0;

    this.resourceRecoveryCycle = 5;
    this.interval = 40;
    this.agentTimerId = 0;

    this.preProcessCallback = null;
    this.postProcessCallback = null;

    /**
     * Core logic loop: processes agents.
     */
    this.processAgents = function() {
        var recordableChangeMade = false;
//
//        // Draw the scrolling layer
//        FiercePlanet.Drawing.drawScrollingLayer();
//
//        // Draw any notices
//        // Drawing
//        if (World.settings.noticesVisible && FiercePlanet.Game.currentNotice != undefined) {
//            FiercePlanet.Drawing.drawNotice(FiercePlanet.Game.currentNotice);
//        }

        // Invoke pre process callback
        Lifecycle.preProcessCallback();

        // Delay, until we are ready for the first wave
        if (Lifecycle.levelDelayCounter < Lifecycle.NEW_LEVEL_DELAY / Lifecycle.interval) {
            Lifecycle.levelDelayCounter++;
            return;
        }

        // Delay, until we are ready for a new wave
        if (Lifecycle.waveDelayCounter < Lifecycle.NEW_WAVE_DELAY / Lifecycle.interval) {
            Lifecycle.waveDelayCounter++;
            return;
        }

        // Increment counters
        Lifecycle.waveCounter++;
        Lifecycle.levelCounter++;
        Lifecycle.worldCounter++;


        var nullifiedAgents = [];
        var citizenCount = 0;
        var agents = FiercePlanet.Game.currentLevel.currentAgents;

        // Pre-movement processing - DO NOTHING FOR NOW
        for (var i = 0; i < agents.length; i++) {
            var agent = agents[i];
            var speed = agent.speed;
            var countDown = (agent.countdownToMove) % speed;
            if (Lifecycle.waveCounter >= agent.delay && countDown % speed == 0) {
                agent.memorise(FiercePlanet.Game.currentLevel);
            }
        }

        // Move agents
        var options = {"withNoRepeat": true, "withNoCollision": false};
        for (var i = 0; i < agents.length; i++) {
            var agent = agents[i];
            citizenCount++;

            if (Lifecycle.waveCounter < agent.delay)
                continue;

            var speed = agent.speed;
            var countDownTest = (Lifecycle.waveCounter - agent.delay) % speed;
            var countDown = (agent.countdownToMove) % speed;

            if (countDown == 0) {
                recordableChangeMade = true;
                // TODO: move this logic elsewhere
//                    if (agent.agentType == AgentTypes.CITIZEN_AGENT_TYPE) {
                    if (FiercePlanet.Game.currentLevel.isExitPoint(agent.x, agent.y)) {
                        FiercePlanet.Game.currentProfile.processSavedAgent(FiercePlanet.Game.currentWave);
                        nullifiedAgents.push(i);
                    }
//                    }

                // Do for all agents
                agent.evaluateMove(FiercePlanet.Game.currentLevel, options);

                // Reset countdown
                agent.resetCountdownToMove();

                // Adjust speed
                if (!FiercePlanet.Game.currentLevel.noSpeedChange && World.settings.agentsCanAdjustSpeed)
                    agent.adjustSpeed();

                // Adjust wander
                if (!FiercePlanet.Game.currentLevel.noWander && World.settings.agentsCanAdjustWander) {
                    // Make sure agents don't wander over boxes in 3D view
                    if (World.settings.showResourcesAsBoxes && World.settings.skewTiles) {
                        agent.adjustWander(FiercePlanet.Orientation.cellWidth, 0);
                    }
                    else {
                        agent.adjustWander(FiercePlanet.Orientation.cellWidth, FiercePlanet.Orientation.pieceWidth);
                    }
                }

                if (agent.age > FiercePlanet.Game.maxWaveMoves)
                    FiercePlanet.Game.maxWaveMoves = agent.age;

                // TODO: should be in-lined?
                if (!World.settings.godMode || World.settings.showHealthReductionInGodMode)
                    agent.adjustGeneralHealth(World.settings.agentCostPerMove);
                if (agent.health <= 0 && !World.settings.godMode) {
                    nullifiedAgents.push(i);
                    FiercePlanet.Game.currentLevel.addExpiredAgent(agent, Lifecycle.levelCounter);
                    if (agent.agentType == AgentTypes.CITIZEN_AGENT_TYPE)
                        FiercePlanet.Game.currentProfile.currentLevelExpired++;
                }
                else {
                    agent.update(FiercePlanet.Game.currentLevel);
                }
            }
            agent.incrementCountdownToMove();
        }

        FiercePlanet.Game.currentLevel.recoverResources();

        // Check whether we have too many
        for (var i = nullifiedAgents.length - 1; i >= 0; i-= 1) {
            var nullIndex = nullifiedAgents[i];
            var nullifiedAgent = FiercePlanet.Game.currentLevel.currentAgents[nullIndex];
            FiercePlanet.Game.currentLevel.currentAgents.splice(nullIndex, 1);
        }

        // Invoke pre process callback
        Lifecycle.postProcessCallback();
    };


    /**
     * Called when a new game is commenced
     */
    this.newGame = function() {
        // Pre new game
        if (FiercePlanet.Game.currentLevelPreset)
            FiercePlanet.Game.currentLevelNumber = 1;
        FiercePlanet.Game.currentProfile.resetScores();

        Lifecycle.worldCounter = 0;
        Lifecycle.newLevel();

        // Post new game
    };


    /**
     * Called when a new level is begun
     */
    this.newLevel = function() {
        // Pre new level
        FiercePlanet.Game.currentProfile.updateScore();
        FiercePlanet.Game.currentNotice = null;
        FiercePlanet.Game.recordedLevels = [];
        FiercePlanet.Utils.bindVariables();



        FiercePlanet.Game.inDesignMode = false;
        Lifecycle.levelDelayCounter = 0;
        Lifecycle.levelCounter = 0;
        FiercePlanet.Game.maxLevelMoves = 0;
//    if (FiercePlanet.Game.currentLevel != undefined)
//        FiercePlanet.Game.currentLevel.setResources([]);

        Lifecycle._initialiseGame();



        // Post new level
        FiercePlanet.Game.currentNotice = FiercePlanet.Game.currentLevel.tip;
//        $("#notifications").toggle(World.settings.statusBarVisible);
        FiercePlanet.GeneralUI.notify("Starting level " + FiercePlanet.Game.currentLevel.id + "...");
        if (World.settings.sendEventsToServer)
            FiercePlanet.Comms.notifyServerOfEvent("level", FiercePlanet.Game.currentLevel.id);
        if (! World.settings.hideLevelInfo)
            FiercePlanet.GeneralUI.levelInfo();
        else
            Lifecycle.startLevel();
    };


    /**
     * Called when a game is restarted
     */
    this.restartLevel = function() {
        // Reset the score
        FiercePlanet.Game.currentProfile.revertScore();

        // Start a new level
        Lifecycle.newLevel();
    };



    /**
     * Called when a level is started
     */
    this.startLevel = function() {
        if (World.settings.sendEventsToServer) {
            FiercePlanet.Comms.notifyServerOfEvent("start", null);
        }

        FiercePlanet.Game.currentWave = 1;
        FiercePlanet.Game.numAgents = FiercePlanet.Game.currentLevel.initialAgentNumber;
        Lifecycle._startAudio();
        FiercePlanet.Drawing.animateLevel();
        // Start a new level
        if (World.settings.firstPerson) {
//            FiercePlanet.Game.currentLevel.generateAgents(AgentTypes.CITIZEN_AGENT_TYPE, 1);
            var agentSets = FiercePlanet.ModuleManager.currentModule.allAgentSets();
            for (var i in agentSets) {
                var agentType = agentSets[i];
                if (agentType.generateEachWave) {
                    FiercePlanet.Game.currentLevel.generateAgents(agentType, FiercePlanet.Game.numAgents);
                }
            }
        }
        else {
            console.log('starting level')
            Lifecycle.newWave();
        }
    };

    /**
     * Called when a new wave is ready
     */
    this.newWave = function() {
        FiercePlanet.Game.maxWaveMoves = 0;
        Lifecycle.waveCounter = 0;
        FiercePlanet.Game.waveDelayCounter = 0;
        FiercePlanet.Game.currentProfile.currentLevelSavedThisWave = 0;

        var agentSets = FiercePlanet.ModuleManager.currentModule.allAgentSets();
        for (var i in agentSets) {
            var agentType = agentSets[i];
            if (agentType.generateEachWave) {
                FiercePlanet.Game.currentLevel.generateAgents(agentType, FiercePlanet.Game.numAgents);
//                FiercePlanet.Game.currentLevel.generateAgents(AgentTypes.CITIZEN_AGENT_TYPE, FiercePlanet.Game.numAgents);
            }
        }

        // Refresh the graph every wave?
        if (World.settings.refreshGraphEveryWave)
            FiercePlanet.Graph.refreshGraph();

        FiercePlanet.GeneralUI.notify("New wave coming...");

        FiercePlanet.Drawing.drawEntryPoints();
        FiercePlanet.Drawing.drawExitPoints();
        FiercePlanet.Game.eventTarget.fire(new Event("game", this, "newWave", $fp.levelCounter, FiercePlanet.Game.currentLevel));

        Lifecycle._startAgents();
    };


    /**
     * Called when a level is completed
     */
    this.completeWave = function() {
        FiercePlanet.Game.currentWave++;
        FiercePlanet.Game.numAgents++;
        Lifecycle._finaliseGame();
    };


    /**
     * Called when a level is completed
     */
    this.completeLevel = function() {
        if (FiercePlanet.Game.currentLevel.teardown)
            FiercePlanet.Game.currentLevel.teardown();
        FiercePlanet.Game.currentProfile.compileProfileStats(FiercePlanet.Game.currentLevel);
        if (FiercePlanet.Game.currentLevel.isPresetLevel)
            FiercePlanet.Game.currentLevelNumber++;
        Lifecycle._stopAudio();
        Lifecycle._finaliseGame();
        FiercePlanet.Dialogs.showCompleteLevelDialog();
    };


    /**
     * Called when a game is completed
     */
    this.completeGame = function() {
        if (FiercePlanet.Game.currentLevel.teardown)
            FiercePlanet.Game.currentLevel.teardown();
        FiercePlanet.Game.currentProfile.compileProfileStats(FiercePlanet.Game.currentLevel);
        Lifecycle._stopAudio();
        Lifecycle._finaliseGame();
        FiercePlanet.Dialogs.showCompleteGameDialog();
    };


    /**
     * Called when the game is over
     */
    this.gameOver = function() {
        if (FiercePlanet.Game.currentLevel.teardown)
            FiercePlanet.Game.currentLevel.teardown();
        FiercePlanet.Game.currentProfile.revertScore();
        Lifecycle._stopAudio();
        Lifecycle._finaliseGame();
        FiercePlanet.Dialogs.showGameOverDialog();
    };


    /**
     * Plays the current game
     */
    this.playGame = function() {
        if (FiercePlanet.Game.inPlay) {
            Lifecycle.pauseGame();
        }
        else {
            if (World.settings.sendEventsToServer) {
                FiercePlanet.Comms.notifyServerOfEvent("play", null);
            }
            Lifecycle._startAudio();
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
    this.pauseGame = function() {
        if (!FiercePlanet.Game.inPlay)
            return;
        if (World.settings.sendEventsToServer) {
            FiercePlanet.Comms.notifyServerOfEvent("pause", null);
        }

        Lifecycle._stopAudio();
        Lifecycle._stopAgents();
    };


    /**
     * Slows down the rate of processing agents
     */
    this.slowDown = function() {
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
    this.speedUp = function() {
        if (Lifecycle.interval > 10)
            Lifecycle.interval -= 10;
        else if (Lifecycle.interval > 1)
            Lifecycle.interval -= 1;
//        FiercePlanet.GeneralUI.notify("Now playing at: " + Math.round(1000 / Lifecycle.interval) + " frames per second.");
        if (FiercePlanet.Game.inPlay)
            Lifecycle._startAgents();
    };


    /**
     * Initialises level data
     */
    this._initialiseGame = function () {
        if (typeof console != "undefined")
            console.log("Initialising world...");

        // Stop any existing timers
        Lifecycle._stopAgents();

        if (FiercePlanet.Game.currentLevelPreset && (FiercePlanet.Game.currentLevelNumber < 0 || FiercePlanet.Game.currentLevelNumber > FiercePlanet.PresetLevels.MAX_DEFAULT_LEVELS))
            FiercePlanet.Game.currentLevelNumber = 1;
        FiercePlanet.Game.currentLevelSetID = FiercePlanet.Game.currentLevelSetID || 'Default';

        if (FiercePlanet.Game.currentLevelPreset) {
            try {
                FiercePlanet.Game.currentLevel = FiercePlanet.ModuleManager.currentModule.getLevel(FiercePlanet.Game.currentLevelSetID, FiercePlanet.Game.currentLevelNumber);
                //eval("FiercePlanet.Modules.Basic.level" + FiercePlanet.Game.currentLevelNumber.toString());
            }
            catch(err) {
                FiercePlanet.Game.currentLevel = FiercePlanet.ModuleManager.currentModule.getLevel(FiercePlanet.Game.currentLevelSetID, 1);
//                FiercePlanet.Game.currentLevel = eval("FiercePlanet.Modules.Basic.level1");
            }
        }
        else if (FiercePlanet.Game.currentLevel == undefined) {
            FiercePlanet.Game.currentLevel = FiercePlanet.ModuleManager.currentModule.getLevel(FiercePlanet.Game.currentLevelSetID, 1);
//            FiercePlanet.Game.currentLevel = eval("FiercePlanet.Modules.Basic.level1");
        }

        if (FiercePlanet.Game.waveOverride > 0) {
            FiercePlanet.Game.currentLevel.waveNumber = (FiercePlanet.Game.waveOverride);
            FiercePlanet.Game.waveOverride = 0;
        }
        FiercePlanet.Game.currentWave = 1;
        FiercePlanet.Game.currentLevel.setCurrentAgents([]);
        FiercePlanet.Game.currentLevel.expiredAgents = [];
        FiercePlanet.Game.currentLevel.resetResources();
        if (FiercePlanet.Game.currentLevel.catastrophe != undefined)
            FiercePlanet.Game.currentLevel.catastrophe.struck = false;

        // Start the audio
        Lifecycle._stopAudio();

//    score = 0;
        FiercePlanet.Game.currentProfile.resetCurrentStats();
        FiercePlanet.Graph.refreshGraph();


        Lifecycle.resourceRecoveryCycle = Math.pow(World.settings.rateOfResourceRecovery, FiercePlanet.Game.levelOfDifficulty - 1);

        FiercePlanet.Game.numAgents = FiercePlanet.Game.currentLevel.initialAgentNumber;
        FiercePlanet.Orientation.cellsAcross = FiercePlanet.Game.currentLevel.cellsAcross;
        FiercePlanet.Orientation.cellsDown = FiercePlanet.Game.currentLevel.cellsDown;
        FiercePlanet.Orientation.cellWidth = Math.round(FiercePlanet.Orientation.worldWidth / FiercePlanet.Orientation.cellsAcross);
        FiercePlanet.Orientation.cellHeight = Math.round(FiercePlanet.Orientation.worldHeight / FiercePlanet.Orientation.cellsDown);
        FiercePlanet.Orientation.pieceWidth = Math.round(FiercePlanet.Orientation.cellWidth * 0.5);
        FiercePlanet.Orientation.pieceHeight = Math.round(FiercePlanet.Orientation.cellHeight * 0.5);
        FiercePlanet.Game.scrollingImage.src = "/images/yellow-rain.png";

        // Set up level
        if (FiercePlanet.Game.currentLevel.setup)
            FiercePlanet.Game.currentLevel.setup();

        // Draw the game
        FiercePlanet.Drawing.drawGame();
    };


    /**
     * Finalises game
     */
    this._finaliseGame = function() {
        Lifecycle._stopAgents();
        FiercePlanet.ProfileUI.storeProfileData();
        FiercePlanet.Drawing.drawScoreboard();
    };


    /**
     * Starts the processing of agents
     */
    this._startAgents = function () {
        FiercePlanet.Game.startTime = new Date();
        if (typeof console != "undefined")
            console.log("Starting agents at " + (FiercePlanet.Game.startTime));

        clearInterval(Lifecycle.agentTimerId);
        Lifecycle.agentTimerId = setInterval("Lifecycle.processAgents()", Lifecycle.interval);
        FiercePlanet.Game.inPlay = true;

        // Make sure button is on pause
        $('#playAgents').removeClass('pausing');
        $('#playAgents').addClass('playing');
    };

    /**
     * Stops the processing of agents
     */
    this._stopAgents = function () {
        FiercePlanet.Game.stopTime = new Date();
        if (typeof console != "undefined")
            console.log("Pausing agents after " + (FiercePlanet.Game.stopTime - FiercePlanet.Game.startTime));

        // Make sure button is on play
        $('#playAgents').removeClass('playing');
        $('#playAgents').addClass('pausing');

        clearInterval(Lifecycle.agentTimerId);
        FiercePlanet.Game.inPlay = false;
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
            else if (FiercePlanet.Game.currentLevel.soundSrc != undefined) {
                FiercePlanet.Game.audio = new Audio(FiercePlanet.Game.currentLevel.soundSrc);
                FiercePlanet.Game.audio.loop = true;
                FiercePlanet.Game.audio.addEventListener("ended", function() {
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
    this._stopAudio = function() {
        if (World.settings.soundsPlayable) {
            if (FiercePlanet.Game.audio != undefined)
                FiercePlanet.Game.audio.pause();
        }
    };

}).apply(Lifecycle);
