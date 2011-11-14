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
FiercePlanet.PredatorPreyModule = FiercePlanet.PredatorPreyModule || {};
FiercePlanet.PredatorPreyModule.Experimental = FiercePlanet.PredatorPreyModule.Experimental || {};


(function() {

    this.init = function() {

            /* Level 22 Definition */

            this.level22 = new Level(1);
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
                this.cellsAcross = 20;
                this.cellsDown = 20;
                this.initialAgentNumber = 40;
                this.waveNumber = 1;
                this.expiryLimit = 1000;
                this.initialResourceNumber = 100;
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

            }).apply(this.level22);

        this.level12 = new Level(12);
        this.level12.allowResourcesOnPath = false;
        this.level12.initialResourceStore = 50;
        this.level12.isPresetLevel = true;
        this.level12.allowOffscreenCycling = true;
        this.level12.addEntryPoint(0, 10);
        this.level12.addExitPoint(11, 1);
        this.level12.cellsAcross = 12;
        this.level12.cellsDown = 12;
        this.level12.initialAgentNumber = 1;
        this.level12.waveNumber = 10;
        this.level12.expiryLimit = 5;
        this.level12.name = ("New York, New York...");
        this.level12.introduction = (""
                + "<p>The world is in peril. But for now the citizens just want to get across Times Square...</p>"
                );
        this.level12.conclusion = ("Traffic isn't much fun. But the citizens made it through.");

        this.level12.setup = function() {
            this.setTiles(JSON.parse('[{"color":"0FFF1F","x":0,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":5,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":7,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":5,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":7,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":0,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":5,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":7,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":0,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":7,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":0,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,{"color":"0FFF1F","x":10,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":7,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":5,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":7,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":3,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":7,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":1,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":7,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":1,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":5,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":7,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":5,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":7,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":11,"terrain":{"color":"0FFF1F","alpha":1}}]'));
            this.addTerrainToPath(new Terrain('#bbb', 0.7));
        };

        // Prepare as a module
        this.id = "Default";
        this.name = "Default";
        this.position = 1;
        this.levels = [this.level22, this.level12 ];
    }

    this.init();

}).apply(FiercePlanet.PredatorPreyModule.Experimental);