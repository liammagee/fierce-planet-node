/*!
 * Fierce Planet - Worlds
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


/**
 * @namespace The namespace for preset worlds
 */
var PredatorPreyWorlds = PredatorPreyWorlds || new Campaign();


(function () {

    this.init = function () {

        /* World 22 Definition */


        this.gameOfLifeWorld = new World();
        (function () {
            this.id = 1;
            this.isometricView = false;
            this.allowResourcesOnPath = true;
            this.allowOffscreenCycling = true;
            this.initialResourceStore = 10000;
            this.isPresetWorld = true;
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
            this.isTerminalWorld = true;
            this.introduction = "<p>This will never work.</p>";
            this.introduction =
                "<h3>Resource Characteristics</h3>" +
                "<p>Starting number of resources:</p><p><input class='world-parameters' name='InitialResourceNumber' value='50'/> </p>" +
                "<h3>Prey Characteristics</h3>" +
                "<p>Starting number of agents:</p><p><input class='world-parameters' name='PreyWaveNumber' value='50'/> </p>" +
                "<p>Move cost:</p><p><input class='world-parameters' name='PreyMoveCost' value='-2'/> </p>" +
                "<p>Birth probability:</p><p><input class='world-parameters' name='PreyBirthProbability' value='0.8'/> </p>" +
                "<p>Reproduction age:</p><p><input class='world-parameters' name='PreyReproductionAge' value='15'/> </p>" +
                "<h3>Predator Characteristics</h3>" +
                "<p>Starting number of agents:</p><p><input class='world-parameters' name='PredatorWaveNumber' value='20'/> </p>" +
                "<p>Move cost:</p><p><input class='world-parameters' name='PredatorMoveCost' value='-5'/> </p>" +
                "<p>Birth probability:</p><p><input class='world-parameters' name='PredatorBirthProbability' value='-5'/> </p>" +
                "<p>Reproduction age:</p><p><input class='world-parameters' name='PredatorReproductionAge' value='25'/> </p>" +
                    "<h3>Predation Characteristics</h3>" +
                "<p>Likelihood of successful predation:</p><p><input class='world-parameters' name='PredatorPreyProbability' value='0.2'/> </p>" +
                "<p>Gain to predator:</p><p><input class='world-parameters' name='PredatorGain' value='20'/> </p>" +
                "<p>Cost to prey:</p><p><input class='world-parameters' name='PreyCost' value='-10'/> </p>" +
                ""
            ;
            this.conclusion = ("Well done.");

            this.setup = function () {
//                    Universe.settings.firstPerson = true;
                var bg = new Terrain('#ABBB2A', 0.01);
                this.addTerrainToPath(bg);
//                    this.addTerrainToBackground(bg);
//                this.generatePath();
//                for (var i = 0; i < this.cellsAcross; i++) {
//                    for (var j = 0; j < this.cellsDown; j++) {
//                        this.terrainMap[[i, j]] = bg;
//                    }
//                }
                if (typeof FiercePlanet !== "undefined" && !_.isUndefined(FiercePlanet.Parameters)) {
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
                this.generateWorldResources();


            };

            /* Google Map links */
            if (typeof google !== "undefined" && typeof google.maps !== "undefined") {
                this.mapOptions = ({mapTypeId:google.maps.MapTypeId.ROADMAP, center:new google.maps.LatLng(-37.81439, 144.96099), zoom:16, tilt:0, rotate:20}); // Budapest: 47.5153, 19.0782
            }

        }).apply(this.gameOfLifeWorld);


        // Prepare as a module
        this.id = "Predator-Prey";
        this.name = "Predator Prey";
        this.position = 1;
        this.worlds = [this.gameOfLifeWorld ];
    }

    this.init();

}).apply(PredatorPreyWorlds);

if (typeof exports !== "undefined")
    exports.PredatorPreyWorlds = PredatorPreyWorlds;
