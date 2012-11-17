/*!
 * Fierce Planet - Recording
 * Handles recording-related functions
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var FiercePlanet = FiercePlanet || {};

/**
 * @namespace Contains drawing functions
 */
FiercePlanet.Recording = FiercePlanet.Recording || {};

(function() {
    /**
     * Record the current state of the game
     */
    this.recordUniverse = function() {
            if (Lifecycle.currentWorld != undefined) {
                try {
                    var world = new World(Lifecycle.currentWorld.id);
                    var agents = [];
                    for (var i = 0, len = Lifecycle.currentWorld.currentAgents.length; i < len; i++) {
                        var actualAgent = Lifecycle.currentWorld.currentAgents[i];
                        var proxyAgent = new Agent(actualAgent.culture, actualAgent.x, actualAgent.y);
                        proxyAgent.lastMemory = actualAgent.lastMemory;
                        proxyAgent.delay = actualAgent.delay;
                        proxyAgent.speed = actualAgent.speed;
                        agents.push(proxyAgent);
                    }
                    world.setCurrentAgents(agents);
                    world.setResources(Lifecycle.currentWorld.resources);
                    // Serialised option, for remote persistence
                    FiercePlanet.Game.recordedWorlds[FiercePlanet.Game.globalRecordingCounter] = JSON.stringify(world);
                    // Local option
//                FiercePlanet.recordedWorlds[FiercePlanet.globalRecordingCounter] = world;
                    FiercePlanet.Game.globalRecordingCounter++;
                }
                catch (err) {
//                console.log(err);
                }
            }
        };

    /**
     * Replay the game
     */
    this.replayUniverse = function() {
            Lifecycle._stopAgents();
            FiercePlanet.Game.existingCurrentWorld = Lifecycle.currentWorld;
            clearInterval(Lifecycle.agentTimerId);
            FiercePlanet.Game.globalRecordingCounter = 0;
            Lifecycle.waveCounter = 0;
            FiercePlanet.Drawing.drawGame();
            FiercePlanet.Game.inPlay = true;

            setTimeout("FiercePlanet.Recording.replayStart()", 100);
        };


    /**
     * Begin the replay of the game, by adding a new interval
     */
    this.replayStart = function() {
            Lifecycle.agentTimerId = setInterval("FiercePlanet.Recording.replayStep()", Lifecycle.interval * 2);
    };

    /**
     * Replay a single step in a recorded game
     */
    this.replayStep = function () {
            var world = FiercePlanet.Game.recordedWorlds[FiercePlanet.Game.globalRecordingCounter];
            if (world == undefined) {
                this.replayStop();
            }
            else {
                try {
                    FiercePlanet.Drawing.clearAgents();
                    // Serialised option, for remote persistence
                    Lifecycle.currentWorld = JSON.parse(world);
                    // Local option
//                Lifecycle.currentWorld = world;
                    FiercePlanet.Game.globalRecordingCounter++;
                    Lifecycle.waveCounter++;
                    FiercePlanet.Drawing.clearCanvas('#resourceCanvas');
                    FiercePlanet.Drawing.clearCanvas('#scrollingCanvas');
                    FiercePlanet.Drawing.clearCanvas('#noticeCanvas');
                    FiercePlanet.Drawing.clearCanvas('#agentCanvas');

                    FiercePlanet.Drawing.drawEntryPoints();
                    FiercePlanet.Drawing.drawExitPoints();
                    FiercePlanet.Drawing.drawScrollingLayer();
        //            FiercePlanet.drawScoreboard();
                    FiercePlanet.Drawing.drawResourceAndAgents();
//                    FiercePlanet.Drawing.drawResources();
//                    FiercePlanet.Drawing.drawAgents();
                }
                catch(err) {
//                console.log(err);
                }
            }
        };


    /**
     * Stop the replay of a recorded game
     */
    this.replayStop = function () {
            Lifecycle.agentTimerId = clearInterval(Lifecycle.agentTimerId);
            FiercePlanet.Game.globalRecordingCounter = 0;
            Lifecycle.currentWorld = FiercePlanet.existingCurrentWorld;
            FiercePlanet.Game.inPlay = false;
        };

}).apply(FiercePlanet.Recording);

