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
            this.randomiseAgents = true;
            this.randomiseResources = true;
//            this.addEntryPoint(19, 0);
//                this.addExitPoint(10, 10);
            this.scaleFactor = 1;
            this.cellsAcross = 20;
            this.cellsDown = 20;
            this.initialAgentNumber = 10;
            this.generateWaveAgentsAutomatically = true;
            this.incrementAgentsEachWave = 1;
//                this.distributeAgentsNormally = true;
//                this.distributeAgentsSigma = 4;
//                this.distributeAgentsHealthNormally = false;
//                this.distributeAgentsHealthSigma = 4;
            this.noSpeedChange = true;
            this.resourcesOwnTilesExclusively = false;
            this.agentsOwnTilesExclusively = true;
            this.canCommunicateWithOtherAgents = false;
            this.allowOffscreenCycling = false;
            this.waveNumber = 1;
            this.expiryLimit = 1000;
            this.initialResourceNumber = 20;
            this.name = ("Totally experimental...");
            this.isTerminalLevel = true;
            this.introduction = "<p>This will never work.</p>";
            this.introduction =
                "<h3>Resource Characteristics</h3>" +
                "<p>Starting number of resources:</p><p><input class='level-parameters' name='InitialResourceNumber' value='50'/> </p>" +
                "<h3>Prey Characteristics</h3>" +
                "<p>Starting number of agents:</p><p><input class='level-parameters' name='PreyWaveNumber' value='50'/> </p>" +
                "<p>Move cost:</p><p><input class='level-parameters' name='PreyMoveCost' value='-2'/> </p>" +
                "<p>Birth probability:</p><p><input class='level-parameters' name='PreyBirthProbability' value='0.8'/> </p>" +
                "<p>Reproduction age:</p><p><input class='level-parameters' name='PreyReproductionAge' value='15'/> </p>" +
                "<h3>Predator Characteristics</h3>" +
                "<p>Starting number of agents:</p><p><input class='level-parameters' name='PredatorWaveNumber' value='20'/> </p>" +
                "<p>Move cost:</p><p><input class='level-parameters' name='PredatorMoveCost' value='-5'/> </p>" +
                "<p>Birth probability:</p><p><input class='level-parameters' name='PredatorBirthProbability' value='-5'/> </p>" +
                "<p>Reproduction age:</p><p><input class='level-parameters' name='PredatorReproductionAge' value='25'/> </p>" +
                    "<h3>Predation Characteristics</h3>" +
                "<p>Likelihood of successful predation:</p><p><input class='level-parameters' name='PredatorPreyProbability' value='0.2'/> </p>" +
                "<p>Gain to predator:</p><p><input class='level-parameters' name='PredatorGain' value='20'/> </p>" +
                "<p>Cost to prey:</p><p><input class='level-parameters' name='PreyCost' value='-10'/> </p>" +
                ""
            ;
            this.conclusion = ("Well done.");

            this.setup = function () {
//                    World.settings.firstPerson = true;
                var bg = new Terrain('#ABBB2A', 0.01);
//                    this.addTerrainToBackground(bg);
                this.generatePath();
                for (var i = 0; i < this.cellsAcross; i++) {
                    for (var j = 0; j < this.cellsDown; j++) {
                        this.terrainMap[[i, j]] = bg;
                    }
                }
                if (!_.isUndefined(FiercePlanet) && !_.isUndefined(FiercePlanet.Parameters)) {
                    PredatorPreyCultures.PREY_AGENT_TYPE.waveNumber = parseInt(FiercePlanet.Parameters.PreyWaveNumber);
                    PredatorPreyCultures.PREY_AGENT_TYPE.moveCost = parseInt(FiercePlanet.Parameters.PreyMoveCost);
                    PredatorPreyCultures.PREY_AGENT_TYPE.birthProbability = parseInt(FiercePlanet.Parameters.PreyBirthProbability);
                    PredatorPreyCultures.PREY_AGENT_TYPE.reproductionAge = parseInt(FiercePlanet.Parameters.PreyReproductionAge);

                    PredatorPreyCultures.PREDATOR_AGENT_TYPE.waveNumber = parseInt(FiercePlanet.Parameters.PredatorWaveNumber);
                    PredatorPreyCultures.PREDATOR_AGENT_TYPE.moveCost = parseInt(FiercePlanet.Parameters.PredatorMoveCost);
                    PredatorPreyCultures.PREDATOR_AGENT_TYPE.birthProbability = parseInt(FiercePlanet.Parameters.PredatorBirthProbability);
                    PredatorPreyCultures.PREDATOR_AGENT_TYPE.reproductionAge = parseInt(FiercePlanet.Parameters.PredatorReproductionAge);

                    PredatorPreyCultures.PREDATOR_AGENT_TYPE.preyProbability = parseInt(FiercePlanet.Parameters.PredatorPreyProbability);
                    PredatorPreyCultures.PREDATOR_AGENT_TYPE.predatorGain = parseInt(FiercePlanet.Parameters.PredatorGain);
                    PredatorPreyCultures.PREDATOR_AGENT_TYPE.preyCost = parseInt(FiercePlanet.Parameters.PreyCost);

                    this.initialResourceNumber = parseInt(FiercePlanet.Parameters.InitialResourceNumber);
                }

                // Re-initialise the waves
                this.waves = [];
                this.initialiseWaves(this.waveNumber);
                this.generateLevelResources();


            };

            /* Google Map links */
            if (!_.isUndefined(google) && !_.isUndefined(google.maps)) {
                this.mapOptions = ({mapTypeId:google.maps.MapTypeId.ROADMAP, center:new google.maps.LatLng(-37.81439, 144.96099), zoom:16, tilt:0, rotate:20}); // Budapest: 47.5153, 19.0782
            }

        }).apply(this.gameOfLifeLevel);


        // Prepare as a module
        this.id = "Predator-Prey";
        this.name = "Predator Prey";
        this.position = 1;
        this.levels = [this.gameOfLifeLevel ];
    }

    this.init();

}).apply(PredatorPreyLevels);

if (typeof exports !== "undefined")
    exports.PredatorPreyLevels = PredatorPreyLevels;
