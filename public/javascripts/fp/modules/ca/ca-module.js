/*!
 * Fierce Planet
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var CellularAutomataLevels = CellularAutomataLevels || new Campaign();
var CellularAutomataModule = CellularAutomataModule || {};


(function () {

    this.init = function () {
        this.cellularAutomataLevel  = new Level(1);
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
            this.cellsAcross = 51;
            this.cellsDown = 51;
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
            this.dontClearCanvas = true;
            this.scrollingImageVisible = false;
            this.introduction =
                "<p>Cellular Automata rule:</p><p><input class='level-parameters' name='AutomataNumber' value='110'/> </p>" +
                    "<p>Size of world:</p><p><input class='level-parameters' name='SizeOfWorld' value='101'/> </p>" +
                    ""
            ;
            this.conclusion = ("Well done.");

            this.currentAgentsFunction = function(agent) {
                if (agent.y > 0 && agent.y == Lifecycle.waveCounter - 100) {
                    return agent;
                }
            }
            this.setup = function () {
                if (FiercePlanet.Parameters.SizeOfWorld) {
                    this.cellsAcross = this.cellsDown = parseInt(FiercePlanet.Parameters.SizeOfWorld);
                    this.setCurrentAgents([]);
                    this.expiredAgents = [];
                }

                if (FiercePlanet.Parameters.AutomataNumber) {
                    this.AutomataNumber = FiercePlanet.Parameters.AutomataNumber;
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
                var tile = this.pathway[Math.ceil(this.cellsAcross / 2)];
//                var tile = this.pathway[1275];
                var agents = this.getAgentsAtContentMap(tile[0], tile[1]);
                if (agents && agents.length > 0)
                    agents[0].isLiving = true;
            };

        }).apply(this.cellularAutomataLevel);


        // Prepare as a module
        this.id = "CA";
        this.name = "Cellular Automata";
        this.position = 1;
        this.levels = [this.cellularAutomataLevel ];
    }

    this.init();
}).apply(CellularAutomataLevels);


(function() {
    this.init = function() {
        GameOfLifeCultures.init();
        var switchStateCapability = {} ;
        switchStateCapability.counter = 0;
        switchStateCapability.exercise = function(agent, level) {
            var x = agent.x;
            var y = agent.y;

            if (y > 0 && y == Lifecycle.waveCounter - 100) {
                var left = (x <= 0) ? false : level.getAgentsAtContentMap(x - 1, y - 1)[0].isLiving;
                var center = level.getAgentsAtContentMap(x, y - 1)[0].isLiving;
                var right = (x >= level.cellsAcross - 1) ? false : level.getAgentsAtContentMap(x + 1, y - 1)[0].isLiving;
                level.AutomataNumber = level.AutomataNumber || 110;
                var state = parseInt( (left & 1).toString() + (center & 1).toString() +  (right & 1).toString(), 2) + 1;
                var mask = Math.pow(2, state) / 2;
                agent.isLiving = (level.AutomataNumber & mask) > 0;
            }
        };
        GameOfLifeCultures.CELLULAR_AGENT_TYPE.capabilities = [ switchStateCapability ];

        var module = new Module();
        module.id = 'CA';

        module.registerCampaign(CellularAutomataLevels);
        module.registerCulture(GameOfLifeCultures.CELLULAR_AGENT_TYPE);
        module.registerResourceSet(TBL);
        module.register();

        World.registerCultures(module.allCultures());
        World.switchResourceSet(TBL);
        World.settings.skewTiles = false;
        World.settings.agentsCanCommunicate = false;
        World.settings.hidePathBorder = true;

        World.settings.scrollingImageVisible = localStorage.scrollingImageVisible = false;
        World.settings.showGraph = true;
        World.settings.showEditor = true;
        World.settings.store();
        Lifecycle.currentLevelSetID = 'CA';
        Lifecycle.currentLevelNumber = localStorage.currentLevelNumber = 0;
        Lifecycle.currentLevelPreset = true;
        AgentConstants.DEFAULT_SPEED = 1;
        Lifecycle.interval = 50;
        Lifecycle.NEW_LEVEL_DELAY = 300;

        FiercePlanet.ModuleEditor.buildEditorFromUrl('/javascripts/fp/modules/ca/ca-module.js', 'CellularAutomataModule.init(); FiercePlanet.Game.loadGame();');
    };

}).apply(CellularAutomataModule);


if (typeof exports !== "undefined") {
    exports.CellularAutomataLevels = CellularAutomataLevels;
    exports.CellularAutomataModule = CellularAutomataModule;
}

