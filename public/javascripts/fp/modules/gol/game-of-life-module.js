/*!
 * Fierce Planet
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var GameOfLifeWorlds = GameOfLifeWorlds || new Campaign();
var GameOfLifeCultures = GameOfLifeCultures || {};
var GameOfLifeModule = GameOfLifeModule || {};

/**
 * Register the default agent types
 */
(function () {

    this.init = function () {
        var switchStateCapability = {} ;
        switchStateCapability.exercise = function(agent, world) {
            var x = agent.x;
            var y = agent.y;

            var positions = world.getMooreNeighbourhood(x, y, false);
            var agentCounter = 0;
            positions.forEach(function(position) {
                var pX = position.x, pY = position.y;
                var agents = world.getAgentsAtCell(pX, pY);
                if (agents && agents.length > 0 && agents[0].isLiving)
                    agentCounter++;
            })
            agent.isDirty = false;
            if (! agent.isLiving) {
                if (agentCounter == 3) {
                    agent.isLiving = true;
                    agent.isDirty = true;
                }
            }
            else  {
                if (agentCounter < 2 || agentCounter > 3) {
                    agent.isLiving = false;
                    agent.isDirty = true;
                }
            }
        };

        this.CELLULAR_AGENT_TYPE = new Culture("Cell", "000", Universe.resourceCategories);
        this.CELLULAR_AGENT_TYPE.birthProbability = 0.0;
        this.CELLULAR_AGENT_TYPE.reproductionAge = 15;
        this.CELLULAR_AGENT_TYPE.moveCost = 0;
        this.CELLULAR_AGENT_TYPE.waveNumber = 50;
        this.CELLULAR_AGENT_TYPE.speed = 1;
        this.CELLULAR_AGENT_TYPE.characteristics = {
            isLiving: false, isDirty: true
        };
        this.CELLULAR_AGENT_TYPE.beliefs = [
//            Beliefs.BeliefsAboutPaths
        ];
        this.CELLULAR_AGENT_TYPE.desires = [
        ];
        this.CELLULAR_AGENT_TYPE.capabilities = [
            switchStateCapability
        ];
        this.CELLULAR_AGENT_TYPE.drawFunction = (function (ctx, agent, x, y, pieceWidth, pieceHeight, newColor, counter, direction) {
            if (agent.isLiving) {
                var __ret = FiercePlanet.Drawing.getDrawingPosition(agent, Lifecycle.waveCounter);
                var xPos = __ret.intX;
                var yPos = __ret.intY;
                var nx = xPos * FiercePlanet.Orientation.cellWidth;
                var ny = yPos * FiercePlanet.Orientation.cellHeight;

                var color = (agent.isLiving ? "#fff" : "#000");
                ctx.fillStyle = color;
                if ((Universe.settings.isometricView || Lifecycle.currentWorld.isometricView)) {
                    var newOrigin = FiercePlanet.Isometric.doIsometricOffset(xPos, yPos);
                    nx = newOrigin.x;
                    ny = newOrigin.y;
                    var originXp = newOrigin.x + FiercePlanet.Orientation.cellWidth / 2;
                    var originYp = newOrigin.y + FiercePlanet.Orientation.cellHeight;

                    // Rotation logic here - TODO: Refactor out
                    originXp = originXp - (FiercePlanet.Orientation.halfWorldWidth);
                    originYp = originYp - (FiercePlanet.Orientation.halfWorldHeight);

                    FiercePlanet.Isometric.draw3DTile(ctx, [originXp, originYp], FiercePlanet.Orientation.cellHeight);
                    ctx.fill();
                }
                else {
                    nx = nx - (FiercePlanet.Orientation.worldWidth) / 2;
                    ny = ny - (FiercePlanet.Orientation.worldHeight) / 2;
                    nx = Math.floor(nx);
                    ny = Math.floor(ny);

                    ctx.fillRect(nx, ny, FiercePlanet.Orientation.cellWidth, FiercePlanet.Orientation.cellHeight);
                }
            }
        });
        this.CELLULAR_AGENT_TYPE.initFunction = function (agent, world) {
            var r = Math.random();
            agent.gender = (r < 0.5 ? 'm' : 'f');
        }

        this.id = 'GOL-Agents';
        this.cultures = [GameOfLifeCultures.CELLULAR_AGENT_TYPE];
    }

}).apply(GameOfLifeCultures);



(function () {

    this.init = function () {
        this.gameOfLifeWorld = new World();
        (function () {
            this.id = 1;
            this.isometricView = false;
            this.allowResourcesOnPath = true;
            this.allowOffscreenCycling = true;
            this.initialResourceStore = 10000;
            this.isPresetWorld = true;
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
            this.isTerminalWorld = true;
            this.dontClearCanvas = false;
            this.scrollingImageVisible = false;
            this.introduction =
                "<p>Size of world:</p><p><input class='world-parameters' name='SizeOfWorld' value='130'/> </p>" +
                    "<p>Enter number of live agents to start with:</p><p><input class='world-parameters' name='NumberOfLiveAgents' value='2000'/> </p>" +
                    ""
            ;
            this.conclusion = ("Well done.");
            this.currentAgentsFunction = function(agent) {
                return agent;//.isDirty;
            };

            this.setup = function () {
                if (FiercePlanet.Parameters.SizeOfWorld) {
                    this.cellsAcross = this.cellsDown = parseInt(FiercePlanet.Parameters.SizeOfWorld);
                    this.setCurrentAgents([]);
                    this.expiredAgents = [];
                }

                var bg = new Terrain('#000', 0.9);
                this.addTerrainToPath(bg);
//                this.generatePath();
//                for (var i = 0; i < this.cellsAcross; i++) {
//                    for (var j = 0; j < this.cellsDown; j++) {
//                        this.terrainMap[[i, j]] = bg;
//                    }
//                }

                if (FiercePlanet.Parameters.SizeOfWorld) {
                    this.initialiseCells();
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
                        var pathCell = this.pathway[tp];
                        var agents = this.getAgentsAtCell(pathCell[0], pathCell[1]);
                        if (agents && agents.length > 0)
                            agents[0].isLiving = true;
                    }
                }
            };


        }).apply(this.gameOfLifeWorld);


        // Prepare as a module
        this.id = "GOL";
        this.name = "GOL";
        this.position = 1;
        this.worlds = [this.gameOfLifeWorld ];
    }

    this.init();
}).apply(GameOfLifeWorlds);


(function() {
    this.init = function() {
        GameOfLifeCultures.init();

        var module = new Module();
        module.id = 'GOL';
        module.registerCampaign(GameOfLifeWorlds);
        module.registerCulture(GameOfLifeCultures.CELLULAR_AGENT_TYPE);
        module.registerResourceSet(TBL);
        module.registerSelf();

		Universe.registerCultures(module.allCultures());
		Universe.switchResourceSet(TBL);
		Universe.settings.isometricView = false;
        Universe.settings.hidePathBorder = true;
        Universe.settings.agentsCanCommunicate = false;
        Universe.settings.scrollingImageVisible = localStorage.scrollingImageVisible = false;
        Universe.settings.showGraph = true;
        Universe.settings.showEditor = true;
        Universe.settings.store();
        Lifecycle.currentCampaignID = 'GOL';
        Lifecycle.currentWorldNumber = localStorage.currentWorldNumber = 0;
        Lifecycle.currentWorldPreset = true;
        Lifecycle.interval = 10;
        Lifecycle.NEW_WORLD_DELAY = 300;

        FiercePlanet.ModuleEditor.buildEditorFromUrl('/javascripts/fp/modules/gol/game-of-life-module.js', 'GameOfLifeModule.init(); FiercePlanet.Game.loadGame();');
    };
}).apply(GameOfLifeModule);

if (typeof exports !== "undefined") {
    exports.GameOfLifeCultures = GameOfLifeCultures;
    exports.GameOfLifeWorlds = GameOfLifeWorlds;
    exports.GameOfLifeModule = GameOfLifeModule;
}

