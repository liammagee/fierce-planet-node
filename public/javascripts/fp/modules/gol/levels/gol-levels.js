/*!
 * Fierce Planet - Levels
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


/**
 * @namespace The namespace for preset levels
 */
var GameOfLifeLevels = GameOfLifeLevels || new Campaign();


(function () {

    this.init = function () {

        /* Level 22 Definition */


        this.gameOfLifeLevel = new Level(1);
        (function () {
            this.isometric = false;
            this.allowResourcesOnPath = true;
            this.allowOffscreenCycling = true;
            this.initialResourceStore = 10000;
            this.isPresetLevel = true;
            this.placeAgentsOnAllCells = true;
//            this.randomiseAgents = true;
            this.randomiseResources = true;
//            this.addEntryPoint(19, 0);
//                this.addExitPoint(10, 10);
            this.scaleFactor = 1;
            this.cellsAcross = 50;
            this.cellsDown = 50;
            this.initialAgentNumber = 1;
            this.generateWaveAgentsAutomatically = true;
            this.incrementAgentsEachWave = 1;
//                this.distributeAgentsNormally = true;
//                this.distributeAgentsSigma = 4;
//                this.distributeAgentsHealthNormally = false;
//                this.distributeAgentsHealthSigma = 4;
            this.noWander = true;
            this.noSpeedChange = true;
            this.resourcesOwnTilesExclusively = false;
            this.agentsOwnTilesExclusively = true;
            this.canCommunicateWithOtherAgents = false;
            this.allowOffscreenCycling = false;
            this.waveNumber = 1;
            this.expiryLimit = 1;
            this.initialResourceNumber = 0;
            this.name = ("Testing parameters...");
            this.isTerminalLevel = true;
            this.introduction =
                "<p>Size of world:</p><p><input class='level-parameters' name='SizeOfWorld' value='50'/> </p>" +
                "<p>Enter number of live agents to start with:</p><p><input class='level-parameters' name='NumberOfLiveAgents' value='200'/> </p>" +
                ""
            ;
            this.conclusion = ("Well done.");

            this.setup = function () {
                if (FiercePlanet.Parameters.SizeOfWorld) {
                    this.cellsAcross = this.cellsDown = parseInt(FiercePlanet.Parameters.SizeOfWorld);
                    this.setCurrentAgents([]);
                    this.expiredAgents = [];
                }

                var bg = new Terrain('#000', 0.9);
                this.generatePath();
                for (var i = 0; i < this.cellsAcross; i++) {
                    for (var j = 0; j < this.cellsDown; j++) {
                        this.terrainMap[[i, j]] = bg;
                    }
                }

                if (FiercePlanet.Parameters.SizeOfWorld) {
                    this.initContentMap();
                    this.waves = undefined;
                    this.initialiseWaves(this.waveNumber);
                }

                // Get pathway length
                var pl = this.pathway.length;
                if (FiercePlanet.Parameters.NumberOfLiveAgents) {
                    var nola = parseInt(FiercePlanet.Parameters.NumberOfLiveAgents);
                    for (var i = 0; i < nola; i ++) {
                        // Generate a random tile position
                        var tp = Math.floor(Math.random() * pl);
                        var tile = this.pathway[tp];
                        var agents = this.getAgentsAtContentMap(tile[0], tile[1]);
                        if (agents && agents.length > 0)
                            agents[0].isLiving = true;
                    }
                }
            };


        }).apply(this.gameOfLifeLevel);


        // Prepare as a module
        this.id = "GOL";
        this.name = "GOL";
        this.position = 1;
        this.levels = [this.gameOfLifeLevel ];
    }

    this.init();

}).apply(GameOfLifeLevels);

if (typeof exports !== "undefined")
    exports.GameOfLifeLevels = GameOfLifeLevels;
