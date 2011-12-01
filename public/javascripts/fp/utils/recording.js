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
    this.recordWorld = function() {
            if (Lifecycle.currentLevel != undefined) {
                if (typeof console != "undefined")
                    console.log("Recording at: " + FiercePlanet.Game.globalRecordingCounter);
                try {
                    var level = new Level(Lifecycle.currentLevel.id);
                    var agents = [];
                    for (var i = 0, len = Lifecycle.currentLevel.currentAgents.length; i < len; i++) {
                        var actualAgent = Lifecycle.currentLevel.currentAgents[i];
                        var proxyAgent = new Agent(actualAgent.culture, actualAgent.x, actualAgent.y);
                        proxyAgent.lastMemory = actualAgent.lastMemory;
                        proxyAgent.delay = actualAgent.delay;
                        proxyAgent.speed = actualAgent.speed;
                        agents.push(proxyAgent);
                    }
                    level.setCurrentAgents(agents);
                    level.setResources(Lifecycle.currentLevel.resources);
                    // Serialised option, for remote persistence
                    FiercePlanet.Game.recordedLevels[FiercePlanet.Game.globalRecordingCounter] = JSON.stringify(level);
                    // Local option
//                FiercePlanet.recordedLevels[FiercePlanet.globalRecordingCounter] = level;
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
    this.replayWorld = function() {
            Lifecycle._stopAgents();
            FiercePlanet.Game.existingCurrentLevel = Lifecycle.currentLevel;
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
            var level = FiercePlanet.Game.recordedLevels[FiercePlanet.Game.globalRecordingCounter];
            if (typeof console != "undefined")
                console.log("Replaying at: " + FiercePlanet.Game.globalRecordingCounter);
            if (level == undefined) {
                this.replayStop();
            }
            else {
                try {
                    FiercePlanet.Drawing.clearAgents();
                    // Serialised option, for remote persistence
                    Lifecycle.currentLevel = JSON.parse(level);
                    // Local option
//                Lifecycle.currentLevel = level;
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
            Lifecycle.currentLevel = FiercePlanet.existingCurrentLevel;
            FiercePlanet.Game.inPlay = false;
        };

}).apply(FiercePlanet.Recording);

