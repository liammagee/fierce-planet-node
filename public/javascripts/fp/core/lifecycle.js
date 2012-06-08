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
    this.debug = false, this.lastTime = 0;
    this.worldDelay = 1500, this.waveDelay = 200;
    // Delay variables
    this.worldDelayCounter = 0, this.waveDelayCounter = 0;
    // Counter variables
    this.waveCounter = 0, this.worldCounter = 0, this.universeCounter = 0;
    // Game play variables
    this.waveOverride = 0, this.maxWaveMoves = 0, this.maxWorldMoves = 0;
    // Game interval variables
    this.resourceRecoveryCycle = 5, this.interval = 10, this.agentTimerId = 0, this.inPlay = false;
    // World state variables
    this.currentWorld = null, this.currentCampaignID = 'Default', this.currentWorldNumber = 1, this.currentWorldPreset = true, this.existingCurrentWorld = null;
    // Wave state variables
    this.currentWave = 1, this.currentWaveNumber = 0;
    this.numAgents = 1;
	// Callbacks
//    this.preNewGameCallback, this.postNewGameCallback, this.preNewWorldCallback, this.postNewWorldCallback = null, this.preNewWaveCallback = null, this.postNewWaveCallback = null, this.preProcessCallback = null, this.postProcessCallback = null;

    /**
     * Core logic loop: processes agents.
     */
    this.processAgents = function() {
        var start = new Date();

        var recordableChangeMade = false;
        // Invoke pre process callback
		if (Lifecycle.preProcessCallback)
        	Lifecycle.preProcessCallback();

        // Delay, until we are ready for the first wave
        if (Lifecycle.worldDelayCounter < Lifecycle.worldDelay / Lifecycle.interval) {
            Lifecycle.worldDelayCounter++;
            return;
        }

        // Delay, until we are ready for a new wave
        if (Lifecycle.waveDelayCounter < Lifecycle.waveDelay / Lifecycle.interval) {
            Lifecycle.waveDelayCounter++;
            return;
        }

        // Increment counters
        Lifecycle.waveCounter++;
        Lifecycle.worldCounter++;
        Lifecycle.universeCounter++;

        // Do any world-specific computation here
         FiercePlanet.Parameters.processParameters();
        if (Lifecycle.currentWorld.tickFunction)
            Lifecycle.currentWorld.tickFunction();

        var agents = Lifecycle.currentWorld.currentAgents,
            nullifiedAgents = [], agentCount = 0;

        // Pre-movement processing - memorises current position
        for (var i = 0; i < agents.length; i++) {
            var agent = agents[i];
            if (Lifecycle.waveCounter < agent.delay)
                continue;

            var speed = agent.speed;
            var countDown = (agent.countdownToMove) % speed;

            // TODO: Constrain memory usage - expensive for large simulations
            if (countDown == 0)
                agent.reviseBeliefs(Lifecycle.currentWorld);
        }

        for (var i = 0; i < agents.length; i++) {
            var agent = agents[i];

            var speed = agent.speed;
            var countDown = (agent.countdownToMove) % speed;
            if (countDown == 0) {
                if (Lifecycle.currentWorld.isExitPoint(agent.x, agent.y)) {
                    if (Lifecycle.processSavedCallback)
                        Lifecycle.processSavedCallback();
                    Lifecycle.currentWorld.addSavedAgent(agent, Lifecycle.worldCounter);
                    agent.die(Lifecycle.currentWorld);
                }
                else if (agent.health <= 0 && !Universe.settings.godMode) {
                    Lifecycle.currentWorld.addExpiredAgent(agent, Lifecycle.worldCounter);
                    agent.die(Lifecycle.currentWorld);

                    if (ModuleManager.currentModule.id = 'Default')
                        if (typeof(FiercePlanet) !== "undefined")
                            FiercePlanet.Game.currentProfile.currentWorldExpired++;
                }
            }
        }

        // Process agents
        for (var i = 0; i < agents.length; i++) {
            agentCount++;
            var agent = agents[i];
            if (Lifecycle.waveCounter < agent.delay)
                continue;

            var speed = agent.speed;
            var countDown = (agent.countdownToMove) % speed;
//            console.log(speed, countDown)

            if (countDown == 0) {
                recordableChangeMade = true;

                // TODO: move this logic elsewhere
                if (Lifecycle.currentWorld.isExitPoint(agent.x, agent.y)) {
                    if (Lifecycle.processSavedCallback)
                        Lifecycle.processSavedCallback();
                    Lifecycle.currentWorld.addSavedAgent(agent, Lifecycle.worldCounter);
                    agent.die(Lifecycle.currentWorld);
                }

                // TODO: should be in-lined?
                if (agent.health <= 0 && !Universe.settings.godMode) {
                    Lifecycle.currentWorld.addExpiredAgent(agent, Lifecycle.worldCounter);
                    agent.die(Lifecycle.currentWorld);

                    // TODO: needs to be moved
                    if (ModuleManager.currentModule.id = 'Default')
//                    if (agent.culture == DefaultCultures.CITIZEN_AGENT_TYPE)
                        if (typeof(FiercePlanet) !== "undefined")
                            FiercePlanet.Game.currentProfile.currentWorldExpired++;
                }

                if (agent.alive) {
                    // Reset countdown
                    agent.resetCountdownToMove();

                    // Adjust speed
                    if (!Lifecycle.currentWorld.noSpeedChange && Universe.settings.agentsCanAdjustSpeed)
                        agent.adjustSpeed();

                    // Adjust wander
                    if (!Lifecycle.currentWorld.noWander && Universe.settings.agentsCanAdjustWander) {
                        // Make sure agents don't wander over boxes in 3D view
                        if (Universe.settings.showResourcesAsBoxes && Universe.settings.isometricView) {
                            agent.adjustWander(FiercePlanet.Orientation.cellWidth, 0);
                        }
                        else {
                            agent.adjustWander(FiercePlanet.Orientation.cellWidth, FiercePlanet.Orientation.pieceWidth);
                        }
                    }

                    if (agent.age > Lifecycle.maxWaveMoves)
                        Lifecycle.maxWaveMoves = agent.age;

                    // Exercises all of the agent's capabilities
                    agent.update(Lifecycle.currentWorld);
                }
            }
            agent.incrementCountdownToMove();
        }

        Lifecycle.currentWorld.recoverResources();


        // Deal with terminal conditions
        if (! Lifecycle.currentWorld.playIndefinitely) {
            if (Lifecycle.currentWorld.expiredAgents.length >= Lifecycle.currentWorld.expiryLimit && (! Universe.settings.noGameOver )) {
                return Lifecycle.gameOver();
            }
            else {
                // No agents left? End of wave
                if (Lifecycle.currentWorld.currentAgents.length == 0) {
                    // Start a new wave
                    if (Lifecycle.currentWaveNumber < Lifecycle.currentWorld.waveNumber - 1) {
                        Lifecycle.completeWave();
                        Lifecycle.newWave();
                    }
                    else if (Lifecycle.currentWorld.isPresetWorld && ! Lifecycle.currentWorld.isTerminalWorld) {
                        Lifecycle.completeWorld();
                        Lifecycle.worldDelayCounter = 0;
                    }
                    else {
                        return Lifecycle.completeGame();
                    }
                }
            }
        }


        // Invoke pre process callback
        if (Lifecycle.postProcessCallback)
            Lifecycle.postProcessCallback();

        var stop = new Date();
        if (Lifecycle.debug) {
            console.log(stop - start)
            console.log(stop - this.lastTime)
        }
        this.lastTime = stop;
    };


    /**
     * Called when a new game is commenced
     */
    this.newGame = function() {
		if (this.preNewGameCallback)
			this.preNewGameCallback();

        Lifecycle.universeCounter = 0;
        Lifecycle.newWorld();

        // Post new game
		if (this.postNewGameCallback)
			this.postNewGameCallback();
    };


    /**
     * Called when a new world is begun
     */
    this.newWorld = function() {
        // Pre new world
		if (this.preNewWorldCallback)
			this.preNewWorldCallback();

        Lifecycle.worldDelayCounter = 0;
        Lifecycle.worldCounter = 0;
    	if (Lifecycle.currentWorld != undefined) {
            Lifecycle.currentWorld.setResources([]);
            if (Lifecycle.currentWorld.teardown)
                Lifecycle.currentWorld.teardown();
        }


        Lifecycle._initialiseGame();

		if (this.doNewWorldCallback)
            this.doNewWorldCallback();
		else
        	Lifecycle.startWorld();

        // Post new world
		if (this.postNewWorldCallback)
			this.postNewWorldCallback();
    };


    /**
     * Called when a game is restarted
     */
    this.restartWorld = function() {
		if (this.preRestartWorldCallback)
			this.preRestartWorldCallback();

        // Start a new world
        Lifecycle.newWorld();

		if (this.postRestartWorldCallback)
			this.postRestartWorldCallback();
    };



    /**
     * Called when a world is started
     */
    this.startWorld = function() {
		if (this.preStartWorldCallback)
			this.preStartWorldCallback();

        FiercePlanet.Parameters.processParameters();
        if (this.currentWorld && this.currentWorld.handleParameters)
            this.currentWorld.handleParameters();

		Lifecycle.currentWaveNumber = 0;
		Lifecycle.numAgents = Lifecycle.currentWorld.initialAgentNumber;
		
        Lifecycle.newWave();

		if (this.postStartWorldCallback)
			this.postStartWorldCallback();
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

		if (this.currentWorld.waves[this.currentWaveNumber]) {
			Lifecycle.currentWorld.currentAgents = this.currentWorld.waves[this.currentWaveNumber].agents;
            Lifecycle.currentWorld.currentAgents.forEach(function(agent) {
                agent.speed = agent.culture.initialSpeed;
            });
			
		}

		this._startAgents();

		if (this.postNewWaveCallback)
			this.postNewWaveCallback();
    };


    /**
     * Called when a world is completed
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
     * Called when a world is completed
     */
    this.completeWorld = function() {
		if (this.preCompleteWorldCallback)
			this.preCompleteWorldCallback();

        if (Lifecycle.currentWorld.teardown)
            Lifecycle.currentWorld.teardown();
        if (Lifecycle.currentWorld.isPresetWorld)
            Lifecycle.currentWorldNumber++;
        Lifecycle._finaliseGame();

		if (this.postCompleteWorldCallback)
			this.postCompleteWorldCallback();
    };


    /**
     * Called when a game is completed
     */
    this.completeGame = function() {
		if (this.preCompleteGameCallback)
			this.preCompleteGameCallback();

        if (Lifecycle.currentWorld.teardown)
            Lifecycle.currentWorld.teardown();
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

        if (Lifecycle.currentWorld.teardown)
            Lifecycle.currentWorld.teardown();
        Lifecycle._finaliseGame();
		if (this.postGameOverCallback)
			this.postGameOverCallback();
    };


    /**
     * Initialises world data
     */
    this._initialiseGame = function () {
		if (this.preInitialiseGameCallback)
			this.preInitialiseGameCallback();
			
        if (typeof console != "undefined")
            console.log("Initialising Universe...");

        // Stop any existing timers
        Lifecycle._stopAgents();

        if (Lifecycle.currentWorldPreset && (Lifecycle.currentWorldNumber < 0 || Lifecycle.currentWorldNumber > 1000))
            Lifecycle.currentWorldNumber = 1;
        Lifecycle.currentCampaignID = Lifecycle.currentCampaignID || 'Default';

        if (Lifecycle.currentWorldPreset) {
            try {
                Lifecycle.currentWorld = ModuleManager.currentModule.getWorld(Lifecycle.currentCampaignID, Lifecycle.currentWorldNumber);
            }
            catch(err) {
                Lifecycle.currentWorld = ModuleManager.currentModule.getWorld(Lifecycle.currentCampaignID, 1);
            }
        }
        else if (Lifecycle.currentWorld == undefined) {
            Lifecycle.currentWorld = ModuleManager.currentModule.getWorld(Lifecycle.currentCampaignID, 1);
        }
        Lifecycle.currentWave = 1;
        Lifecycle.currentWaveNumber = 0;

        this.currentWorld.initWorld();


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
        if (! _.isUndefined(Lifecycle.currentWorld.interval) && Lifecycle.currentWorld.interval > 0)
            Lifecycle.agentTimerId = setInterval(Lifecycle.processAgents, Lifecycle.currentWorld.interval);
        else
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

if (typeof exports !== "undefined")
    exports.Lifecycle = Lifecycle;

