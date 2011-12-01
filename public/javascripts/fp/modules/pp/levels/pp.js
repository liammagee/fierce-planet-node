/*!
 * Fierce Planet - Levels
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


/**
 * @namespace The namespace for preset levels
 */
var PredatorPreyLevels = PredatorPreyLevels || new Campaign();



(function() {

    this.init = function() {

            /* Level 22 Definition */

            this.predatorPreyLevel = new Level(1);
            (function() {
                this.isometric = false;
                this.allowResourcesOnPath = true;
                this.allowOffscreenCycling = true;
                this.initialResourceStore = 0;
                this.isPresetLevel = true;
                this.randomiseAgents = true;
                this.randomiseResources = true;
//            this.addEntryPoint(19, 0);
//                this.addExitPoint(10, 10);
                this.scaleFactor = 1;
                this.cellsAcross = 10;
                this.cellsDown = 10;
                this.initialAgentNumber = 10;
                this.generateWaveAgentsAutomatically = true;
                this.incrementAgentsEachWave = 1;
//                this.distributeAgentsNormally = true;
//                this.distributeAgentsSigma = 4;
//                this.distributeAgentsHealthNormally = false;
//                this.distributeAgentsHealthSigma = 4;
                this.noSpeedChange = true;
                this.resourcesOwnTilesExclusively = true;
                this.agentsOwnTilesExclusively = true;
                this.canCommunicateWithOtherAgents = false;
                this.allowOffscreenCycling = false;
                this.waveNumber = 1;
                this.expiryLimit = 1000;
                this.initialResourceNumber = 20;
                this.name = ("Totally experimental...");
                this.isTerminalLevel = true;
                this.introduction = (""
                        + "<p>This will never work.</p>"
                        );
                this.conclusion = ("Well done.");

                this.setup = function() {
//                    World.settings.firstPerson = true;
                    var bg = new Terrain('#ABBB2A', 0.1);
                    this.addTerrainToBackground(bg);
                    this.generatePath();
                    for (var i = 0; i < this.cellsAcross; i++) {
                        for (var j = 0; j < this.cellsDown; j++) {
                            this.terrainMap[[i, j]] = bg;
                        }
                    }
                    /*
                    FiercePlanet.Drawing.zoom(1);
                    FiercePlanet.Drawing.zoom(1);
                    FiercePlanet.Drawing.zoom(1);
                    FiercePlanet.Drawing.zoom(1);
                    FiercePlanet.Drawing.zoom(1);
                    FiercePlanet.Drawing.tilt(-0.35);
                    */
                    this.generateLevelResources();
                };

            }).apply(this.predatorPreyLevel);


        // Prepare as a module
        this.id = "Default";
        this.name = "Predator Prey";
        this.position = 1;
        this.levels = [this.predatorPreyLevel ];
    }

    this.init();

}).apply(PredatorPreyLevels);

if (typeof(exports) != "undefined") 
    exports.PredatorPreyLevels = PredatorPreyLevels;
