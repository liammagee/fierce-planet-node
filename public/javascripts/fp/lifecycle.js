/*!
 * Fierce Planet - Lifecycle
 * Lifecycle related methods
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */



var FiercePlanet = FiercePlanet || {};



/**
 * @namespace Contains lifecycle functions
 */
FiercePlanet.Lifecycle = FiercePlanet.Lifecycle || {};


(function() {

    /**
     * Core logic loop: processes agents.
     */
    this.processAgents = function() {

        var recordableChangeMade = false;

        // Draw the scrolling layer
        FiercePlanet.Drawing.drawScrollingLayer();

        // Draw any notices
        if (World.settings.noticesVisible && FiercePlanet.Game.currentNotice != undefined) {
            FiercePlanet.Drawing.drawNotice(FiercePlanet.Game.currentNotice);
        }

        // Delay, until we are ready for the first wave
        if (FiercePlanet.Game.levelDelayCounter < FiercePlanet.Game.NEW_LEVEL_DELAY / FiercePlanet.Game.interval) {
            FiercePlanet.Game.levelDelayCounter++;
            return;
        }

        // Delay, until we are ready for a new wave
        if (FiercePlanet.Game.waveDelayCounter < FiercePlanet.Game.NEW_WAVE_DELAY / FiercePlanet.Game.interval) {
            FiercePlanet.Game.waveDelayCounter++;
            return;
        }

        // Increment counters
        FiercePlanet.Game.waveCounter++;
        FiercePlanet.Game.levelCounter++;
        FiercePlanet.Game.gameCounter++;


        if (FiercePlanet.Game.nullifiedAgents)
            FiercePlanet.Drawing.clearAgentGroup(FiercePlanet.Game.nullifiedAgents);
        FiercePlanet.Game.nullifiedAgents = [];
        FiercePlanet.Drawing.clearAgents();
        var nullifiedAgents = [];
        var citizenCount = 0;
        var agents = FiercePlanet.Game.currentLevel.currentAgents;

        // Pre-movement processing - DO NOTHING FOR NOW
        for (var i = 0; i < agents.length; i++) {
            var agent = agents[i];
            var speed = agent.speed;
            var countDown = (agent.countdownToMove) % speed;
            if (FiercePlanet.Game.waveCounter >= agent.delay && countDown % speed == 0) {
                agent.memorise(FiercePlanet.Game.currentLevel);
            }
        }

        // Move agents
        var options = {"withNoRepeat": true, "withNoCollision": false};
        for (var i = 0; i < agents.length; i++) {
            var agent = agents[i];

            // Don't process agents we want to block
            if (! World.settings.rivalsVisible && agent.agentType == AgentTypes.RIVAL_AGENT_TYPE)
                continue;
            if (! World.settings.predatorsVisible && agent.agentType == AgentTypes.PREDATOR_AGENT_TYPE)
                continue;

            var speed = agent.speed;
            if (agent.agentType == AgentTypes.CITIZEN_AGENT_TYPE)
                citizenCount++;
            if (FiercePlanet.Game.waveCounter >= agent.delay) {
                var countDownTest = (FiercePlanet.Game.waveCounter - agent.delay) % speed;
                var countDown = (agent.countdownToMove) % speed;

                if (countDown == 0) {
                    recordableChangeMade = true;
                    // TODO: move this logic elsewhere
                    if (agent.agentType == AgentTypes.CITIZEN_AGENT_TYPE) {
                        if (FiercePlanet.Game.currentLevel.isExitPoint(agent.x, agent.y)) {
                            FiercePlanet.Game.currentProfile.processSavedAgent(FiercePlanet.Game.currentWave);
                            nullifiedAgents.push(i);

                            FiercePlanet.Drawing.drawScore();
                            FiercePlanet.Drawing.drawResourcesInStore();
                            FiercePlanet.Drawing.drawSaved();
                        }
                    }

                    // Do for all agents
                    agent.evaluateMove(FiercePlanet.Game.currentLevel, options);

                    if (agent.agentType == AgentTypes.CITIZEN_AGENT_TYPE) {
                        agent.resetCountdownToMove();
                        if (!FiercePlanet.Game.currentLevel.noSpeedChange && World.settings.agentsCanAdjustSpeed)
                            agent.adjustSpeed();
                        if (!FiercePlanet.Game.currentLevel.noWander && World.settings.agentsCanAdjustWander) {
                            // Make sure agents don't wander over boxes in 3D view
                            if (World.settings.showResourcesAsBoxes && World.settings.skewTiles) {
                                agent.adjustWander(FiercePlanet.Orientation.cellWidth, 0);
                                agent.wanderX = Math.abs(agent.wanderX);
                                agent.wanderY = Math.abs(agent.wanderY);
                            }
                            else {
                                agent.adjustWander(FiercePlanet.Orientation.cellWidth, FiercePlanet.Orientation.pieceWidth);
                            }
                        }

                    }

                    if (agent.age > FiercePlanet.Game.maxWaveMoves)
                        FiercePlanet.Game.maxWaveMoves = agent.age;

                    // TODO: should be in-lined?
                    if (agent.agentType == AgentTypes.CITIZEN_AGENT_TYPE || agent.agentType == AgentTypes.RIVAL_AGENT_TYPE) {
                        if (!World.settings.godMode || World.settings.showHealthReductionInGodMode)
                            agent.adjustGeneralHealth(World.settings.agentCostPerMove);
                        if (agent.health <= 0 && !World.settings.godMode) {
                            nullifiedAgents.push(i);
                            FiercePlanet.Game.nullifiedAgents.push(agent);
                            FiercePlanet.Drawing.drawExpiredAgent(agent);
                            if (agent.agentType == AgentTypes.CITIZEN_AGENT_TYPE)
                                FiercePlanet.Game.currentProfile.currentLevelExpired++;
                           FiercePlanet.Drawing.drawExpired();
                        }
                        else {
                            // Hook for detecting 'active' resources
//                        FiercePlanet.processNeighbouringResources(agent);
                            FiercePlanet.Game.currentLevel.processNeighbouringResources(agent);
                            // TODO: Implement resource to agent interaction
//                            FiercePlanet.Game.currentLevel.processNeighbouringResources(agent, FiercePlanet.Drawing.drawResourceAgentInteraction);

                            // Hook for detecting other agents
//                        FiercePlanet.processNeighbouringAgents(agent);
                            FiercePlanet.Game.currentLevel.processNeighbouringAgents(agent);
                        }
                    }
                }
                if (agent.agentType == AgentTypes.CITIZEN_AGENT_TYPE) {
                    agent.incrementCountdownToMove();
                }
            }


        }
        if (World.settings.sendEventsToServer) {
//    if (World.settings.sendEventsToServer && !World.settings.spectate) {
            var simpleAgents = [];
            agents.forEach(function(agent) {
                var simpleAgent = new SimpleAgent(AgentTypes.RIVAL_AGENT_TYPE, agent.x, agent.y, agent.color, agent.speed, agent.health, agent.wanderX, agent.wanderY, agent.lastMemory, agent.delay, agent.countdownToMove, agent.healthCategoryStats);
//            var simpleAgent = $.extend(true, {}, agent);
//            simpleAgent.wipeMemory();
                simpleAgents.push(simpleAgent);
            });
            FiercePlanet.Comms.notifyServerOfEvent('agents', simpleAgents);
        }



        if (FiercePlanet.Game.currentProfile.currentLevelExpired >= FiercePlanet.Game.currentLevel.expiryLimit) {
            return FiercePlanet.Lifecycle.gameOver();
        }

        // Check whether we have too many
        for (var i = nullifiedAgents.length - 1; i >= 0; i-= 1) {
            FiercePlanet.Game.currentLevel.currentAgents.splice(nullifiedAgents[i], 1);
        }

        // No agents left? End of wave
        if (citizenCount == 0) {
            // Start a new wave
            if (FiercePlanet.Game.currentWave < FiercePlanet.Game.currentLevel.waveNumber) {
                FiercePlanet.Lifecycle.completeWave();
                FiercePlanet.Lifecycle.newWave();
            }
            else if (FiercePlanet.Game.currentLevel.isPresetLevel && ! FiercePlanet.Game.currentLevel.isTerminalLevel) {
                FiercePlanet.Lifecycle.completeLevel();
                FiercePlanet.Game.levelDelayCounter = 0;
            }
            else {
                return FiercePlanet.Lifecycle.completeGame();
            }
        }
        else {
            if (FiercePlanet.Game.waveCounter % FiercePlanet.Game.resourceRecoveryCycle == 0) {
                // Since resources can overwrite eachother in 2.5d, force redraw of all resources here
                if ((World.settings.skewTiles || FiercePlanet.Game.currentLevel.isometric) && World.settings.showResourcesAsBoxes) {
                    FiercePlanet.Game.currentLevel.recoverResources();
                    FiercePlanet.Drawing.drawResources();
                }
                else {
                    FiercePlanet.Game.currentLevel.recoverResources().forEach(function(resource) {
                        FiercePlanet.Drawing.drawResource(resource);
                    });
                }

            }
            FiercePlanet.Drawing.drawAgents();
        }

        // Post-move processing
        if (World.settings.recording)
            FiercePlanet.Recording.recordWorld();

    };


    /**
     * Called when a new game is commenced
     */
    this.newGame = function() {
        if (FiercePlanet.Game.currentLevelPreset)
            FiercePlanet.Game.currentLevelNumber = 1;
        FiercePlanet.Game.currentProfile.resetScores();
        FiercePlanet.Game.gameCounter = 0;
        FiercePlanet.Lifecycle.newLevel();
    };


    /**
     * Called when a new level is begun
     */
    this.newLevel = function() {
        FiercePlanet.Game.inDesignMode = false;
        FiercePlanet.Game.levelDelayCounter = 0;
        FiercePlanet.Game.levelCounter = 0;
        FiercePlanet.Game.maxLevelMoves = 0;
        FiercePlanet.Game.currentProfile.updateScore();
//    if (FiercePlanet.Game.currentLevel != undefined)
//        FiercePlanet.Game.currentLevel.setResources([]);
        FiercePlanet.Game.currentNotice = null;
        FiercePlanet.Game.recordedLevels = [];
        FiercePlanet.Utils.bindVariables();

        FiercePlanet.Lifecycle._initialiseGame();

        FiercePlanet.Game.currentNotice = FiercePlanet.Game.currentLevel.tip;
//        $("#notifications").toggle(World.settings.statusBarVisible);
        FiercePlanet.GeneralUI.notify("Starting level " + FiercePlanet.Game.currentLevel.id + "...");
        if (World.settings.sendEventsToServer)
            FiercePlanet.Comms.notifyServerOfEvent("level", FiercePlanet.Game.currentLevel.id);
        if (! World.settings.hideLevelInfo)
            FiercePlanet.GeneralUI.levelInfo();
        else
            FiercePlanet.Lifecycle.startLevel();
    };


    /**
     * Called when a game is restarted
     */
    this.restartLevel = function() {
        // Reset the score
        FiercePlanet.Game.currentProfile.revertScore();

        // Start a new level
        FiercePlanet.Lifecycle.newLevel();
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
        FiercePlanet.Lifecycle._startAudio();
        FiercePlanet.Drawing.animateLevel();
        // Start a new level
        if (World.settings.firstPerson) {
            FiercePlanet.Game.currentLevel.generateAgents(AgentTypes.CITIZEN_AGENT_TYPE, 1);
        }
        else {
            FiercePlanet.Lifecycle.newWave();
        }
    };

    /**
     * Called when a new wave is ready
     */
    this.newWave = function() {
        FiercePlanet.Game.maxWaveMoves = 0;
        FiercePlanet.Game.waveCounter = 0;
        FiercePlanet.Game.waveDelayCounter = 0;
        FiercePlanet.Game.currentProfile.currentLevelSavedThisWave = 0;

        FiercePlanet.Game.currentLevel.generateAgents(AgentTypes.CITIZEN_AGENT_TYPE, FiercePlanet.Game.numAgents);

        // Refresh the graph every wave?
        if (World.settings.refreshGraphEveryWave)
            FiercePlanet.Drawing.refreshGraph();

        FiercePlanet.GeneralUI.notify("New wave coming...");

        FiercePlanet.Drawing.drawEntryPoints();
        FiercePlanet.Drawing.drawExitPoints();
        FiercePlanet.Game.eventTarget.fire(new Event("game", this, "newWave", $fp.levelCounter, FiercePlanet.Game.currentLevel));

        FiercePlanet.Lifecycle._startAgents();
    };


    /**
     * Called when a level is completed
     */
    this.completeWave = function() {
        FiercePlanet.Game.currentWave++;
        FiercePlanet.Game.numAgents++;
        FiercePlanet.Lifecycle._finaliseGame();
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
        FiercePlanet.Lifecycle._stopAudio();
        FiercePlanet.Lifecycle._finaliseGame();
        FiercePlanet.Dialogs.showCompleteLevelDialog();
    };


    /**
     * Called when a game is completed
     */
    this.completeGame = function() {
        if (FiercePlanet.Game.currentLevel.teardown)
            FiercePlanet.Game.currentLevel.teardown();
        FiercePlanet.Game.currentProfile.compileProfileStats(FiercePlanet.Game.currentLevel);
        FiercePlanet.Lifecycle._stopAudio();
        FiercePlanet.Lifecycle._finaliseGame();
        FiercePlanet.Dialogs.showCompleteGameDialog();
    };


    /**
     * Called when the game is over
     */
    this.gameOver = function() {
        if (FiercePlanet.Game.currentLevel.teardown)
            FiercePlanet.Game.currentLevel.teardown();
        FiercePlanet.Game.currentProfile.revertScore();
        FiercePlanet.Lifecycle._stopAudio();
        FiercePlanet.Lifecycle._finaliseGame();
        FiercePlanet.Dialogs.showGameOverDialog();
    };


    /**
     * Plays the current game
     */
    this.playGame = function() {
        if (FiercePlanet.Game.inPlay) {
            FiercePlanet.Lifecycle.pauseGame();
        }
        else {
            if (World.settings.sendEventsToServer) {
                FiercePlanet.Comms.notifyServerOfEvent("play", null);
            }
            FiercePlanet.Lifecycle._startAudio();
            $('#playAgents').removeClass('pausing');
            $('#playAgents').addClass('playing');
            if (FiercePlanet.Game.waveCounter == 0)
                FiercePlanet.Lifecycle.newWave();
            else
                FiercePlanet.Lifecycle._startAgents();
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

        FiercePlanet.Lifecycle._stopAudio();
        FiercePlanet.Lifecycle._stopAgents();
    };


    /**
     * Slows down the rate of processing agents
     */
    this.slowDown = function() {
        if (FiercePlanet.Game.interval < 10)
            FiercePlanet.Game.interval += 1;
        else if (FiercePlanet.Game.interval < 100)
            FiercePlanet.Game.interval += 10;
        FiercePlanet.GeneralUI.notify("Now playing at: " + Math.round(1000 / FiercePlanet.Game.interval) + " frames per second.");
        if (FiercePlanet.inPlay)
            FiercePlanet.Game.Lifecycle._startAgents();
    };


    /**
     * Speeds up the rate of processing agents
     */
    this.speedUp = function() {
        if (FiercePlanet.Game.interval > 10)
            FiercePlanet.Game.interval -= 10;
        else if (FiercePlanet.Game.interval > 1)
            FiercePlanet.Game.interval -= 1;
        FiercePlanet.GeneralUI.notify("Now playing at: " + Math.round(1000 / FiercePlanet.Game.interval) + " frames per second.");
        if (FiercePlanet.Game.inPlay)
            FiercePlanet.Lifecycle._startAgents();
    };


    /**
     * Initialises level data
     */
    this._initialiseGame = function () {
        if (typeof console != "undefined")
            console.log("Initialising world...");

        // Stop any existing timers
        FiercePlanet.Lifecycle._stopAgents();

        if (FiercePlanet.Game.currentLevelPreset && (FiercePlanet.Game.currentLevelNumber < 0 || FiercePlanet.Game.currentLevelNumber > FiercePlanet.PresetLevels.MAX_DEFAULT_LEVELS))
            FiercePlanet.Game.currentLevelNumber = 1;
        FiercePlanet.Game.currentLevelSetID = FiercePlanet.Game.currentLevelSetID || 'FP-Basic';

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
        FiercePlanet.Game.currentLevel.resetResources();
        if (FiercePlanet.Game.currentLevel.catastrophe != undefined)
            FiercePlanet.Game.currentLevel.catastrophe.struck = false;

        // Start the audio
        FiercePlanet.Lifecycle._stopAudio();

//    score = 0;
        FiercePlanet.Game.currentProfile.resetCurrentStats();
        FiercePlanet.Drawing.refreshGraph();


        FiercePlanet.Game.resourceRecoveryCycle = Math.pow(World.settings.rateOfResourceRecovery, FiercePlanet.Game.levelOfDifficulty - 1);

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
        FiercePlanet.Lifecycle._stopAgents();
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

        clearInterval(FiercePlanet.Game.agentTimerId);
        FiercePlanet.Game.agentTimerId = setInterval("FiercePlanet.Lifecycle.processAgents()", FiercePlanet.Game.interval);
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

        clearInterval(FiercePlanet.Game.agentTimerId);
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

}).apply(FiercePlanet.Lifecycle);
