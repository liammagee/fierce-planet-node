/*!
 * Fierce Planet
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var CitiesCultures = CitiesCultures || {};
var CitiesLevels = CitiesLevels || new Campaign();
var CitiesModule = CitiesModule || {};



(function() {
    this.init = function() {
        var switchStateCapability = {} ;
        switchStateCapability.counter = 0;
        switchStateCapability.exercise = function(agent, level) {
            var x = agent.x, y = agent.y;
            agent.potential = Math.pow(agent.potential * FiercePlanet.Parameters.RateOfGrowth, FiercePlanet.Parameters.ScaleFactor);
            if (agent.potential > 1)
                agent.potential = 1;
        };
        this.CELLULAR_AGENT_TYPE = new Culture("Cell", "000", World.resourceCategories);
        _.extend(this.CELLULAR_AGENT_TYPE,
            {
                speed: 1,
                characteristics: {potential: 0},
                capabilities: [switchStateCapability]
            });
        this.CELLULAR_AGENT_TYPE.drawFunction = (function (ctx, agent, x, y, pieceWidth, pieceHeight, newColor, counter, direction) {
            var __ret = FiercePlanet.Drawing.getDrawingPosition(agent, Lifecycle.waveCounter);
            var xPos = __ret.intX;
            var yPos = __ret.intY;
            var nx = xPos * FiercePlanet.Orientation.cellWidth;
            var ny = yPos * FiercePlanet.Orientation.cellHeight;
            nx = nx - (FiercePlanet.Orientation.worldWidth) / 2;
            ny = ny - (FiercePlanet.Orientation.worldHeight) / 2;

            var grey = Math.floor(agent.potential * 255);
            ctx.fillStyle = 'rgb(' + grey + ', ' + grey + ', ' + grey + ')';
            ctx.fillRect(nx, ny, FiercePlanet.Orientation.cellWidth, FiercePlanet.Orientation.cellHeight);
        });
        this.CELLULAR_AGENT_TYPE.initFunction = function (agent, level) {
            agent.potential = Math.random();
        }
    };

}).apply(CitiesCultures);


(function () {

    this.init = function () {
        this.citiesLevel1  = new Level();
        (function () {
            this.id = 1;
            this.name = "Arthur's Model (pp. 36-40)";
            this.isPresetLevel = true;
            this.cellsAcross = 21, this.cellsDown = 21;
            this.placeAgentsOnAllCells = true, this.generateWaveAgentsAutomatically = true;
            this.waveNumber = 1, this.dontClearCanvas = true, this.scrollingImageVisible = false, this.initialResourceStore = 0;
            this.introduction =
                "<p>Scale Factor</p><p><input class='level-parameters' name='ScaleFactor' value='2'/> </p>" +
                    "<p>Rate of growth:</p><p><input class='level-parameters' name='RateOfGrowth' value='1.05'/> </p>" +
                    ""
            ;
            this.conclusion = "Well done.";
            this.setup = function () {
                this.generatePath();
                CitiesCultures.CELLULAR_AGENT_TYPE.capabilities[0].exercise = function(agent, level) {
                    var normalisedPotential = (agent.potential / FiercePlanet.Parameters.TotalPotential);// * FiercePlanet.Parameters.TotalAgents / 2;
                    agent.potential = FiercePlanet.Parameters.RateOfGrowth * Math.pow(normalisedPotential, FiercePlanet.Parameters.ScaleFactor);// * FiercePlanet.Parameters.TotalPotential;
                    if (agent.potential > 1)
                        agent.potential = 1;
                };
                this.initialiseWaves(1);
            };
            this.tickFunction = function () {
                FiercePlanet.Parameters.TotalPotential =
                    _.chain(this.currentAgents)
                    .map(function(agent) { return agent.potential; })
                    .reduce(function(memo, num) { return memo + num}, 0)
                    .value();
                FiercePlanet.Parameters.TotalAgents = this.currentAgents.length;
                console.log(FiercePlanet.Parameters.TotalPotential);
            };
        }).apply(this.citiesLevel1);

        this.citiesLevel2  = new Level();
        (function () {
            this.id = 2;
            this.name = "Arthur's Model with Neighbourhood (pp. 41-42)";
            this.isPresetLevel = true;
            this.cellsAcross = 21, this.cellsDown = 21;
            this.placeAgentsOnAllCells = true, this.generateWaveAgentsAutomatically = true;
            this.waveNumber = 1, this.dontClearCanvas = true, this.scrollingImageVisible = false, this.initialResourceStore = 0;
            this.introduction =
                "<p>Scale Factor</p><p><input class='level-parameters' name='ScaleFactor' value='2'/> </p>" +
                    "<p>Rate of growth:</p><p><input class='level-parameters' name='RateOfGrowth' value='1.05'/> </p>" +
                    ""
            ;
            this.conclusion = "Well done.";
            this.setup = function () {
                this.generatePath();
                CitiesCultures.CELLULAR_AGENT_TYPE.capabilities[0].exercise = function(agent, level) {
                    var x = agent.x, y = agent.y;
                    var positions = level.getMooreNeighbourhood(x, y, true);
                    var totalPotential = 0, counter = 0;
                    positions.forEach(function(position) {
                        var agents = level.getAgentsAtContentMap(position.x, position.y);
                        if (agents && agents.length > 0) {
                            counter++;
                            var agent = agents[0];
                            totalPotential += agent.potential;
                        }
                    });
                    totalPotential = totalPotential / counter;

                    agent.potential = Math.pow(totalPotential * FiercePlanet.Parameters.RateOfGrowth, FiercePlanet.Parameters.ScaleFactor);
                    if (agent.potential > 1)
                        agent.potential = 1;
                };
                this.initialiseWaves(1);
            };
        }).apply(this.citiesLevel2);


        // Prepare as a module
        this.id = "Cities";
        this.name = "Cities - Batty";
        this.position = 1;
        this.levels = [this.citiesLevel1, this.citiesLevel2 ];
    }

    this.init();
}).apply(CitiesLevels);



(function() {
    this.init = function() {

        var module = new Module();
        module.id = 'Cities';

        module.registerCampaign(CitiesLevels);
        CitiesCultures.init();
        module.registerCulture(CitiesCultures.CELLULAR_AGENT_TYPE );
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
        Lifecycle.currentLevelSetID = 'Cities';
        Lifecycle.currentLevelNumber = localStorage.currentLevelNumber = 0;
        Lifecycle.currentLevelPreset = true;
        AgentConstants.DEFAULT_SPEED = 1;
        Lifecycle.interval = 500;
        Lifecycle.NEW_LEVEL_DELAY = 300;

        FiercePlanet.ModuleEditor.buildEditorFromUrl('/javascripts/fp/modules/cities/cities-module.js', 'CitiesModule.init(); FiercePlanet.Game.loadGame();');
    };

}).apply(CitiesModule);


if (typeof exports !== "undefined") {
    exports.CitiesCultures = CitiesCultures;
    exports.CitiesLevels = CitiesLevels;
    exports.CitiesModule = CitiesModule;
}

