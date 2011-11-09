/*!
 * Fierce Planet - Levels
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */

/* NB: Level is defined in level.js */

var FiercePlanet = FiercePlanet || {};

/**
 * @namespace The namespace for preset levels
 */
FiercePlanet.DefaultModule = FiercePlanet.DefaultModule || {};
FiercePlanet.DefaultModule.Experimental = FiercePlanet.DefaultModule.Experimental || {};


(function() {

    this.init = function() {

            /* Level 22 Definition */

            this.level22 = new Level(22);
            (function() {
                this.isometric = false;
                this.allowResourcesOnPath = true;
                this.allowOffscreenCycling = true;
                this.initialResourceStore = 0;
                this.isPresetLevel = true;
                this.randomiseAgents = true;
                this.randomiseResources = true;
            //this.addEntryPoint(19, 0);
                this.addExitPoint(10, 10);
                this.scaleFactor = 2;
                this.cellsAcross = 101;
                this.cellsDown = 101;
                this.initialAgentNumber = 1;
                this.waveNumber = 1;
                this.expiryLimit = 10;
                this.initialResourceNumber = 100;
                this.name = ("Totally experimental...");
                this.isTerminalLevel = true;
                this.introduction = (""
                        + "<p>This will never work.</p>"
                        );
                this.conclusion = ("Well done.");

                this.setup = function() {
                    World.settings.firstPerson = true;
                    var bg = new Terrain('#ABBB2A', 0.9);
                    this.addTerrainToBackground(bg);
                    this.generatePath();
                    this.terrainMap[[10, 10]] = bg;
                    FiercePlanet.Drawing.zoom(1);
                    FiercePlanet.Drawing.zoom(1);
                    FiercePlanet.Drawing.zoom(1);
                    FiercePlanet.Drawing.zoom(1);
                    FiercePlanet.Drawing.zoom(1);
                    FiercePlanet.Drawing.tilt(-0.35);
                    this.generateLevelResources();
                };

            }).apply(this.level22);


        // Prepare as a module
        this.id = "FP-Experimental";
        this.name = "Experimental";
        this.position = 3;
        this.levels = [this.level22 ];
    }

    this.init();

}).apply(FiercePlanet.DefaultModule.Experimental);