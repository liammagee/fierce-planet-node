/*!
 * Fierce Planet
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var CitiesCultures = CitiesCultures || {};
var CitiesWorlds = CitiesWorlds || new Campaign();
var CitiesModule = CitiesModule || {};




(function() {
    this.init = function() {
        var switchStateCapability = {} ;
        switchStateCapability.counter = 0;
        switchStateCapability.exercise = function(agent, world) {
            var x = agent.x, y = agent.y;
            agent.potential = Math.pow(agent.potential * FiercePlanet.Parameters.RateOfGrowth, FiercePlanet.Parameters.ScaleFactor);
            if (agent.potential > 1)
                agent.potential = 1;
        };
        this.CELLULAR_AGENT_TYPE = new Culture("Cell", "000", Universe.resourceCategories);
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
        this.CELLULAR_AGENT_TYPE.initFunction = function (agent, world) {
            if (FiercePlanet.Parameters.DistributeNormally) {
                var pot = jStat.normal.sample(0.5, 0.15);
                pot = (pot < 0 ? 0 : (pot > 1 ? 1 : pot));
                agent.potential = pot;
            }
            // Otherwise, assume uniform distribution
            else {
                agent.potential = Math.random();
            }
        }
    };

}).apply(CitiesCultures);


(function () {

    this.init = function () {
        this.citiesWorld1  = new World();
        (function () {
            this.id = 1;
            this.name = "Arthur's Model (pp. 36-40)";
            this.isPresetWorld = true;
            this.cellsAcross = 21, this.cellsDown = 21;
            this.placeAgentsOnAllCells = true, this.generateWaveAgentsAutomatically = true;
            this.waveNumber = 1, this.dontClearCanvas = true, this.scrollingImageVisible = false, this.initialResourceStore = 0;
            this.introduction =
                "<p>Scale Factor</p><p><input class='world-parameters' name='ScaleFactor' value='2'/> </p>" +
                    "<p>Rate of growth:</p><p><input class='world-parameters' name='RateOfGrowth' value='1.05'/> </p>" +
                    "<p>Distribute potential normally:</p><p><input type='checkbox' class='world-parameters' name='DistributeNormally' checked='checked'/> </p>" +
                    ""
            ;
            this.conclusion = "Well done.";
            this.setup = function () {
                CitiesCultures.init();
                this.generatePath();
                CitiesCultures.CELLULAR_AGENT_TYPE.capabilities[0].exercise = function(agent, world) {
                    var normalisedPotential = (agent.potential / FiercePlanet.Parameters.Range);// * FiercePlanet.Parameters.TotalAgents / 2;
                    agent.potential = FiercePlanet.Parameters.RateOfGrowth * Math.pow(normalisedPotential, FiercePlanet.Parameters.ScaleFactor);// * FiercePlanet.Parameters.TotalPotential;
                    if (agent.potential > 1)
                        agent.potential = 1;
                };
                this.initialiseWaves(1);
            };
            this.tickFunction = function () {
                var potentials = _.map(this.currentAgents, function(agent) { return agent.potential; }),
                    min = _.min(potentials),
                    max = _.max(potentials),
                    range = max - min;
                FiercePlanet.Parameters.Range =  range;
            };
        }).apply(this.citiesWorld1);

        this.citiesWorld2  = new World();
        (function () {
            this.id = 2;
            this.name = "Arthur's Model with Neighbourhood (pp. 41-42)";
            this.isPresetWorld = true;
            this.cellsAcross = 21, this.cellsDown = 21;
            this.placeAgentsOnAllCells = true, this.generateWaveAgentsAutomatically = true;
            this.waveNumber = 1, this.dontClearCanvas = true, this.scrollingImageVisible = false, this.initialResourceStore = 0;
            this.introduction =
                "<p>Scale Factor</p><p><input class='world-parameters' name='ScaleFactor' value='2'/> </p>" +
                    "<p>Rate of growth:</p><p><input class='world-parameters' name='RateOfGrowth' value='1.05'/> </p>" +
                    "<p>Distribute potential normally:</p><p><input type='checkbox' class='world-parameters' name='DistributeNormally' checked='checked'/> </p>" +
                    ""
            ;
            this.conclusion = "Well done.";
            this.setup = function () {
                CitiesCultures.init();
                this.generatePath();
                CitiesCultures.CELLULAR_AGENT_TYPE.capabilities[0].exercise = function(agent, world) {
                    var x = agent.x, y = agent.y;
                    var positions = world.getMooreNeighbourhood(x, y, true);
                    var totalPotential = 0, counter = 0;
                    positions.forEach(function(position) {
                        var agents = world.getAgentsAtCell(position.x, position.y);
                        if (agents && agents.length > 0) {
                            counter++;
                            var agent = agents[0];
                            totalPotential += agent.potential;
                        }
                    });
                    totalPotential = totalPotential / counter;

                    var normalisedPotential = (totalPotential / FiercePlanet.Parameters.Range);
                    agent.potential = FiercePlanet.Parameters.RateOfGrowth * Math.pow(normalisedPotential, FiercePlanet.Parameters.ScaleFactor);// * FiercePlanet.Parameters.TotalPotential;
                    if (agent.potential > 1)
                        agent.potential = 1;
                };
                this.initialiseWaves(1);
            };
            this.tickFunction = function () {
                var potentials = _.map(this.currentAgents, function(agent) { return agent.potential; }),
                    min = _.min(potentials),
                    max = _.max(potentials),
                    range = max - min;
                FiercePlanet.Parameters.Max =  max;
                FiercePlanet.Parameters.Range =  range;
            };
        }).apply(this.citiesWorld2);

        this.citiesWorld3  = new World();
        (function () {
            this.id = 3;
            this.name = "Vicsek-Szalay Model (pp. 43-44)";
            this.isPresetWorld = true;
            this.interval = 10;
            this.cellsAcross = 130, this.cellsDown = 130;
            this.placeAgentsOnAllCells = true, this.generateWaveAgentsAutomatically = true;
            this.waveNumber = 1, this.dontClearCanvas = true, this.scrollingImageVisible = false, this.initialResourceStore = 0;
            this.introduction =
                "<p>Threshold</p><p><input class='world-parameters' name='Threshold' value='4.5'/> </p>" +
                    "<p>Add noise:</p><p><input type='checkbox' class='world-parameters' name='AddNoise' checked='checked'/> </p>" +
                    "<p>Draw development:</p><p><input type='checkbox' class='world-parameters' name='DrawDevelopment' checked='checked'/> </p>" +
                    ""
            ;
            this.conclusion = "Well done.";
            this.setup = function () {
                CitiesCultures.init();
                this.generatePath();
                _.extend(CitiesCultures.CELLULAR_AGENT_TYPE,
                    {
                        initFunction: function (agent, world) {
                            agent.potential = Math.random() < 0.5 ? -1 : 1;
                            agent.development = 0;
                        },
                        drawFunction: (function (ctx, agent, x, y, pieceWidth, pieceHeight, newColor, counter, direction) {
                            var __ret = FiercePlanet.Drawing.getDrawingPosition(agent, Lifecycle.waveCounter);
                            var xPos = __ret.intX;
                            var yPos = __ret.intY;
                            var nx = xPos * FiercePlanet.Orientation.cellWidth;
                            var ny = yPos * FiercePlanet.Orientation.cellHeight;
                            nx = nx - (FiercePlanet.Orientation.worldWidth) / 2;
                            ny = ny - (FiercePlanet.Orientation.worldHeight) / 2;

                            if (FiercePlanet.Parameters.Threshold)
                                ctx.fillStyle = agent.development == 1 ? '#fff' : '#000';
                            else
                                ctx.fillStyle = agent.development == 1 ? '#fff' : '#000';
                            ctx.fillRect(nx, ny, FiercePlanet.Orientation.cellWidth, FiercePlanet.Orientation.cellHeight);
                        }),
                        characteristics: {
                            potential: 0, development: 0
                        }
                    });
                CitiesCultures.CELLULAR_AGENT_TYPE.capabilities[0].exercise = function(agent, world) {
                    var x = agent.x, y = agent.y;
                    var positions = world.getVonNeumannNeighbourhood(x, y, true);
                    var totalPotential = 0, counter = 0;
                    positions.forEach(function(position) {
                        var agents = world.getAgentsAtCell(position.x, position.y);
                        if (agents && agents.length > 0) {
                            counter++;
                            var agent = agents[0];
                            totalPotential += agent.potential;
                        }
                    });
                    totalPotential = totalPotential / counter;
                    if (FiercePlanet.Parameters.AddNoise) {
                        totalPotential += (Math.random() < 0.5 ? -1 : 1);
                    }

                    agent.newPotential = totalPotential;
                };
                this.cultures = [CitiesCultures.CELLULAR_AGENT_TYPE];
                this.initialiseWaves(1);
            };
            this.tickFunction = function () {
                this.currentAgents.forEach(function(agent) {
                    if (agent.newPotential)
                        agent.potential = agent.newPotential;
                    agent.development =  (agent.potential <= FiercePlanet.Parameters.Threshold && agent.development == 0 ? 0 : 1 );
                })
                var potentials = _.map(this.currentAgents, function(agent) { return agent.potential; }),
                    min = _.min(potentials),
                    max = _.max(potentials),
                    range = max - min;
                var devs = _.map(this.currentAgents, function(agent) { return agent.development; }),
                    totalDev = _.reduce(devs, function(memo, num){ return memo + num; }, 0);
                FiercePlanet.Parameters.Max =  max;
                FiercePlanet.Parameters.Range =  range;
                console.log(max, range, totalDev, Lifecycle.waveCounter)
            };
        }).apply(this.citiesWorld3);


        // Prepare as a module
        this.id = "Cities";
        this.name = "Cities Module - Batty";
        this.position = 1;
        this.worlds = [this.citiesWorld1, this.citiesWorld2, this.citiesWorld3 ];
    }

    this.init();
}).apply(CitiesWorlds);



(function() {
    this.init = function() {

        var module = new Module();
        module.id = 'Cities';

        module.registerCampaign(CitiesWorlds);
        CitiesCultures.init();
        module.registerCulture(CitiesCultures.CELLULAR_AGENT_TYPE );
        module.registerResourceSet(TBL);
        module.register();

        Universe.registerCultures(module.allCultures());
        Universe.switchResourceSet(TBL);
        Universe.settings.skewTiles = false;
        Universe.settings.agentsCanCommunicate = false;
        Universe.settings.hidePathBorder = true;

        Universe.settings.scrollingImageVisible = localStorage.scrollingImageVisible = false;
        Universe.settings.showGraph = true;
        Universe.settings.showEditor = true;
        Universe.settings.store();
        Lifecycle.currentCampaignID = 'Cities';
        //Lifecycle.currentWorldNumber = localStorage.currentWorldNumber = 0;
        Lifecycle.currentWorldPreset = true;
        AgentConstants.DEFAULT_SPEED = 1;
        Lifecycle.interval = 500;
        Lifecycle.NEW_WORLD_DELAY = 300;

        FiercePlanet.ModuleEditor.buildEditorFromUrl('/javascripts/fp/modules/cities/cities-module.js', 'CitiesModule.init(); FiercePlanet.Game.loadGame();');
    };

}).apply(CitiesModule);


if (typeof exports !== "undefined") {
    exports.CitiesCultures = CitiesCultures;
    exports.CitiesWorlds = CitiesWorlds;
    exports.CitiesModule = CitiesModule;
}

