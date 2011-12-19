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
    // Delay variables
    this.levelDelayCounter = 0, this.waveDelayCounter = 0;
    // Counter variables
    this.waveCounter = 0, this.levelCounter = 0, this.worldCounter = 0;
    // Game play variables
    this.waveOverride = 0, this.maxWaveMoves = 0, this.maxLevelMoves = 0;
    // Game interval variables
    this.resourceRecoveryCycle = 5, this.interval = 40, this.agentTimerId = 0, this.inPlay = false;
    // Level state variables
    this.currentLevel = null, this.currentLevelSetID = 'Default', this.currentLevelNumber = 1, this.currentLevelPreset = true, this.existingCurrentLevel = null;
    // Wave state variables
    this.currentWave = 1, this.currentWaveNumber = 0;
    this.numAgents = 1;
	// Callbacks
    this.preNewGameCallback, this.postNewGameCallback, this.preNewLevelCallback, this.postNewLevelCallback = null, this.preNewWaveCallback = null, this.postNewWaveCallback = null, this.preProcessCallback = null, this.postProcessCallback = null;

    /**
     * Core logic loop: processes agents.
     */
    this.processAgents = function() {
      var recordableChangeMade = false;

        // Invoke pre process callback
		if (Lifecycle.preProcessCallback)
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

        var agents = Lifecycle.currentLevel.currentAgents, nullifiedAgents = [], agentCount = 0;

        // Pre-movement processing - memorises current position
        for (var i = 0; i < agents.length; i++) {
            var agent = agents[i];
            if (Lifecycle.waveCounter < agent.delay)
                continue;

            var speed = agent.speed;
            var countDown = (agent.countdownToMove) % speed;

            // TODO: Constrain memory usage - expensive for large simulations
            if (countDown == 0)
                agent.reviseBeliefs(Lifecycle.currentLevel);
        }


        // Process agents
        var options = {"withNoRepeat": true, "withNoCollision": false};
        for (var i = 0; i < agents.length; i++) {
            agentCount++;
            var agent = agents[i];
            if (Lifecycle.waveCounter < agent.delay)
                continue;

            var speed = agent.speed;
            var countDown = (agent.countdownToMove) % speed;

            if (countDown == 0) {
                recordableChangeMade = true;

                // TODO: move this logic elsewhere
                if (Lifecycle.currentLevel.isExitPoint(agent.x, agent.y)) {
                    if (Lifecycle.processSavedCallback)
                        Lifecycle.processSavedCallback();
                    Lifecycle.currentLevel.addSavedAgent(agent, Lifecycle.levelCounter)
                    nullifiedAgents.push(i);
                }

                // Do for all agents
//                agent.evaluateMove(Lifecycle.currentLevel, options);

                // Reset countdown
                agent.resetCountdownToMove();


                // Adjust speed
                if (!Lifecycle.currentLevel.noSpeedChange && World.settings.agentsCanAdjustSpeed)
                    agent.adjustSpeed();

                // Adjust wander
                if (!Lifecycle.currentLevel.noWander && World.settings.agentsCanAdjustWander) {
                    // Make sure agents don't wander over boxes in 3D view
                    if (World.settings.showResourcesAsBoxes && World.settings.skewTiles) {
                        agent.adjustWander(FiercePlanet.Orientation.cellWidth, 0);
                    }
                    else {
                        agent.adjustWander(FiercePlanet.Orientation.cellWidth, FiercePlanet.Orientation.pieceWidth);
                    }
                }

                if (agent.age > Lifecycle.maxWaveMoves)
                    Lifecycle.maxWaveMoves = agent.age;

                // Exercises all of the agent's capabilities
                agent.update(Lifecycle.currentLevel);

                // TODO: should be in-lined?
                if (agent.health <= 0 && !World.settings.godMode) {
                    nullifiedAgents.push(i);
                    Lifecycle.currentLevel.addExpiredAgent(agent, Lifecycle.levelCounter);
                    // TODO: needs to be moved
                    if (agent.culture == DefaultCultures.CITIZEN_AGENT_TYPE)
						if (typeof(FiercePlanet) !== "undefined")
                        	FiercePlanet.Game.currentProfile.currentLevelExpired++;
                }
            }
            agent.incrementCountdownToMove();
        }

        Lifecycle.currentLevel.recoverResources();

        // Check whether we have too many
        for (var i = nullifiedAgents.length - 1; i >= 0; i-= 1) {
            var nullIndex = nullifiedAgents[i];
            var nullifiedAgent = Lifecycle.currentLevel.currentAgents[nullIndex];
            Lifecycle.currentLevel.currentAgents.splice(nullIndex, 1);
            // Remove the agent from the map
            Lifecycle.currentLevel.removeAgentFromContentMap(agent);
        }

        if (Lifecycle.currentLevel.expiredAgents.length >= Lifecycle.currentLevel.expiryLimit && ! World.settings.noGameOver) {
            return Lifecycle.gameOver();
        }
		else {
            // No agents left? End of wave
            if (Lifecycle.currentLevel.currentAgents.length == 0) {
                // Start a new wave
                if (Lifecycle.currentWaveNumber < Lifecycle.currentLevel.waveNumber - 1) {
                    Lifecycle.completeWave();
                    Lifecycle.newWave();
                }
                else if (Lifecycle.currentLevel.isPresetLevel && ! Lifecycle.currentLevel.isTerminalLevel) {
                    Lifecycle.completeLevel();
                    Lifecycle.levelDelayCounter = 0;
                }
                else {
                    return Lifecycle.completeGame();
                }
            }
		}


        // Invoke pre process callback
		if (Lifecycle.postProcessCallback)
        	Lifecycle.postProcessCallback();
    };


    /**
     * Called when a new game is commenced
     */
    this.newGame = function() {
		if (this.preNewGameCallback)
			this.preNewGameCallback();

        Lifecycle.worldCounter = 0;
        Lifecycle.newLevel();

        // Post new game
		if (this.postNewGameCallback)
			this.postNewGameCallback();
    };


    /**
     * Called when a new level is begun
     */
    this.newLevel = function() {
        // Pre new level
		if (this.preNewLevelCallback)
			this.preNewLevelCallback();

        Lifecycle.levelDelayCounter = 0;
        Lifecycle.levelCounter = 0;
    	if (Lifecycle.currentLevel != undefined)
        	Lifecycle.currentLevel.setResources([]);

        Lifecycle._initialiseGame();

		if (this.doNewLevelCallback)
			this.doNewLevelCallback();
		else
        	Lifecycle.startLevel();

        // Post new level
		if (this.postNewLevelCallback)
			this.postNewLevelCallback();
    };


    /**
     * Called when a game is restarted
     */
    this.restartLevel = function() {
		if (this.preRestartLevelCallback)
			this.preRestartLevelCallback();

        // Start a new level
        Lifecycle.newLevel();

		if (this.postRestartLevelCallback)
			this.postRestartLevelCallback();
    };



    /**
     * Called when a level is started
     */
    this.startLevel = function() {
		if (this.preStartLevelCallback)
			this.preStartLevelCallback();

		Lifecycle.currentWaveNumber = 0;
		Lifecycle.numAgents = Lifecycle.currentLevel.initialAgentNumber;
		
        Lifecycle.newWave();

		if (this.postStartLevelCallback)
			this.postStartLevelCallback();
    };

    /**
     * Called when a new wave is ready
     */
    this.newWave = function() {
		if (this.preNewWaveCallback)
			this.preNewWaveCallback();
		Lifecycle.maxWaveMoves = 0;
		Lifecycle.waveCounter = 0;
		Lifecycle.waveDelayCounter = 0;

		if (this.currentLevel.waves[this.currentWaveNumber])
			Lifecycle.currentLevel.currentAgents = this.currentLevel.waves[this.currentWaveNumber].agents;

		this._startAgents();

		if (this.postNewWaveCallback)
			this.postNewWaveCallback();
    };


    /**
     * Called when a level is completed
     */
    this.completeWave = function() {
		if (this.preCompleteWaveCallback)
			this.preCompleteWaveCallback();

        Lifecycle.currentWaveNumber++;
        Lifecycle.numAgents++;
        Lifecycle._finaliseGame();

		if (this.postCompleteWaveCallback)
			this.postCompleteWaveCallback();
		
    };


    /**
     * Called when a level is completed
     */
    this.completeLevel = function() {
		if (this.preCompleteLevelCallback)
			this.preCompleteLevelCallback();

        if (Lifecycle.currentLevel.teardown)
            Lifecycle.currentLevel.teardown();
        if (Lifecycle.currentLevel.isPresetLevel)
            Lifecycle.currentLevelNumber++;
        Lifecycle._finaliseGame();

		if (this.postCompleteLevelCallback)
			this.postCompleteLevelCallback();
    };


    /**
     * Called when a game is completed
     */
    this.completeGame = function() {
		if (this.preCompleteGameCallback)
			this.preCompleteGameCallback();

        if (Lifecycle.currentLevel.teardown)
            Lifecycle.currentLevel.teardown();
        Lifecycle._finaliseGame();

		if (this.postCompleteGameCallback)
			this.postCompleteGameCallback();
    };


    /**
     * Called when the game is over
     */
    this.gameOver = function() {
		if (this.preGameOverCallback)
			this.preGameOverCallback();

        if (Lifecycle.currentLevel.teardown)
            Lifecycle.currentLevel.teardown();
        Lifecycle._finaliseGame();
		if (this.postGameOverCallback)
			this.postGameOverCallback();
    };


    /**
     * Initialises level data
     */
    this._initialiseGame = function () {
		if (this.preInitialiseGameCallback)
			this.preInitialiseGameCallback();
			
        if (typeof console != "undefined")
            console.log("Initialising world...");


        // Stop any existing timers
        Lifecycle._stopAgents();

        if (Lifecycle.currentLevelPreset && (Lifecycle.currentLevelNumber < 0 || Lifecycle.currentLevelNumber > 1000))
            Lifecycle.currentLevelNumber = 1;
        Lifecycle.currentLevelSetID = Lifecycle.currentLevelSetID || 'Default';

        if (Lifecycle.currentLevelPreset) {
            try {
                Lifecycle.currentLevel = ModuleManager.currentModule.getLevel(Lifecycle.currentLevelSetID, Lifecycle.currentLevelNumber);
                //eval("FiercePlanet.Modules.Basic.level" + Lifecycle.currentLevelNumber.toString());
            }
            catch(err) {
                Lifecycle.currentLevel = ModuleManager.currentModule.getLevel(Lifecycle.currentLevelSetID, 1);
//                Lifecycle.currentLevel = eval("FiercePlanet.Modules.Basic.level1");
            }
        }
        else if (Lifecycle.currentLevel == undefined) {
            Lifecycle.currentLevel = ModuleManager.currentModule.getLevel(Lifecycle.currentLevelSetID, 1);
//            Lifecycle.currentLevel = eval("FiercePlanet.Modules.Basic.level1");
        }

        Lifecycle.currentWave = 1;
        Lifecycle.currentWaveNumber = 0;
        Lifecycle.currentLevel.initLevel();

		if (this.postInitialiseGameCallback)
			this.postInitialiseGameCallback();
    };


    /**
     * Finalises game
     */
    this._finaliseGame = function() {
		if (this.preFinaliseGameCallback)
			this.preFinaliseGameCallback();
		
        Lifecycle._stopAgents();

		if (this.postFinaliseGameCallback)
			this.postFinaliseGameCallback();
    };


    /**
     * Starts the processing of agents
     */
    this._startAgents = function () {
		if (this.preStartAgentsCallback)
			this.preStartAgentsCallback();

        Lifecycle.startTime = new Date();
        if (typeof console != "undefined")
            console.log("Starting agents at " + (Lifecycle.startTime));

        clearInterval(Lifecycle.agentTimerId);
        Lifecycle.agentTimerId = setInterval(Lifecycle.processAgents, Lifecycle.interval);
        Lifecycle.inPlay = true;

		if (this.postStartAgentsCallback)
			this.postStartAgentsCallback();
    };

    /**
     * Stops the processing of agents
     */
    this._stopAgents = function () {
		if (this.preStopAgentsCallback)
			this.preStopAgentsCallback();

        Lifecycle.stopTime = new Date();
        if (typeof console != "undefined")
            console.log("Pausing agents after " + (Lifecycle.stopTime - Lifecycle.startTime));

        clearInterval(Lifecycle.agentTimerId);
        Lifecycle.inPlay = false;

		if (this.postStopAgentsCallback)
			this.postStopAgentsCallback();
    };


}).apply(Lifecycle);

if (typeof(exports) != "undefined")
    exports.Lifecycle = Lifecycle;

