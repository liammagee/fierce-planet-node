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
            if (FiercePlanet.Game.currentLevel != undefined) {
                if (typeof console != "undefined")
                    console.log("Recording at: " + FiercePlanet.Game.globalRecordingCounter);
                try {
                    var level = new Level(FiercePlanet.Game.currentLevel.id);
                    var agents = [];
                    for (var i = 0, len = FiercePlanet.Game.currentLevel.currentAgents.length; i < len; i++) {
                        var actualAgent = FiercePlanet.Game.currentLevel.currentAgents[i];
                        var proxyAgent = new Agent(actualAgent.agentType, actualAgent.x, actualAgent.y);
                        proxyAgent.lastMemory = actualAgent.lastMemory;
                        proxyAgent.delay = actualAgent.delay;
                        proxyAgent.speed = actualAgent.speed;
                        agents.push(proxyAgent);
                    }
                    level.setCurrentAgents(agents);
                    level.setResources(FiercePlanet.Game.currentLevel.resources);
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
            FiercePlanet.Lifecycle._stopAgents();
            FiercePlanet.Game.existingCurrentLevel = FiercePlanet.Game.currentLevel;
            clearInterval(FiercePlanet.Game.agentTimerId);
            FiercePlanet.Game.globalRecordingCounter = 0;
            FiercePlanet.Game.waveCounter = 0;
            FiercePlanet.Drawing.drawGame();
            FiercePlanet.Game.inPlay = true;

            setTimeout("FiercePlanet.Recording.replayStart()", 100);
        };


    /**
     * Begin the replay of the game, by adding a new interval
     */
    this.replayStart = function() {
            FiercePlanet.Game.agentTimerId = setInterval("FiercePlanet.Recording.replayStep()", FiercePlanet.Game.interval * 2);
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
                    FiercePlanet.Game.currentLevel = JSON.parse(level);
                    // Local option
//                FiercePlanet.Game.currentLevel = level;
                    FiercePlanet.Game.globalRecordingCounter++;
                    FiercePlanet.Game.waveCounter++;
                    FiercePlanet.Drawing.clearCanvas('#resourceCanvas');
                    FiercePlanet.Drawing.clearCanvas('#scrollingCanvas');
                    FiercePlanet.Drawing.clearCanvas('#noticeCanvas');
                    FiercePlanet.Drawing.clearCanvas('#agentCanvas');

                    FiercePlanet.Drawing.drawEntryPoints();
                    FiercePlanet.Drawing.drawExitPoints();
                    FiercePlanet.Drawing.drawResources();
                    FiercePlanet.Drawing.drawScrollingLayer();
        //            FiercePlanet.drawScoreboard();
                    FiercePlanet.Drawing.drawAgents();
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
            FiercePlanet.Game.agentTimerId = clearInterval(FiercePlanet.Game.agentTimerId);
            FiercePlanet.Game.globalRecordingCounter = 0;
            FiercePlanet.Game.currentLevel = FiercePlanet.existingCurrentLevel;
            FiercePlanet.Game.inPlay = false;
        };

}).apply(FiercePlanet.Recording);

