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

    this.initCitiesWorlds = function () {
        this.citiesWorld1  = new World();
        _.extend(this.citiesWorld1,
            {
                id: 1,
                name: "Arthur's Model (pp. 36-40)",
                isPresetWorld: true,
                interval: 1000,
                cellsAcross: 21,
                cellsDown: 21,
                placeAgentsOnAllCells: true,
                generateWaveAgentsAutomatically: true,
                waveNumber: 1,
                dontClearCanvas: true,
                scrollingImageVisible: false,
                initialResourceStore: 0,
                playIndefinitely: true,
                introduction:
                    "<p>Scale Factor</p><p><input class='world-parameters' name='ScaleFactor' value='2'/> </p>" +
                    "<p>Rate of growth:</p><p><input class='world-parameters' name='RateOfGrowth' value='1.05'/> </p>" +
                    "<p>Distribute potential normally:</p><p><input type='checkbox' class='world-parameters' name='DistributeNormally' checked='checked'/> </p>" +
                    "",
                conclusion: "Well done.",
                setup: function () {
                    this.generatePath();
                    this.cells.forEach(function(cell) {
                        if (FiercePlanet.Parameters.DistributeNormally) {
                            var pot = jStat.normal.sample(0.5, 0.15);
                            pot = (pot < 0 ? 0 : (pot > 1 ? 1 : pot));
                            cell.potential = pot;
                        }
                        // Otherwise, assume uniform distribution
                        else {
                            cell.potential = Math.random();
                        }
                        cell.development = 0;
                        cell.terrain = new Terrain("#000", 1.0);
                        cell.agentsAllowed = true;
                    });
                },
                tickFunction: function () {
                    var world = this;

                    var potentials = _.map(this.cells, function(cell) { return cell.potential; }),
                        min = _.min(potentials),
                        max = _.max(potentials),
                        range = max - min;
                    FiercePlanet.Parameters.Range =  range;
                    FiercePlanet.Drawing.drawPath();
                    console.log(min, max, range, Lifecycle.waveCounter)

                    // Adjust potential for all cells
                    this.cells.forEach(function(cell) {
                        var normalisedPotential = (cell.potential - min) / range;// * FiercePlanet.Parameters.TotalAgents / 2;
                        cell.potential = FiercePlanet.Parameters.RateOfGrowth * Math.pow(normalisedPotential, FiercePlanet.Parameters.ScaleFactor);// * FiercePlanet.Parameters.TotalPotential;
                        if (cell.potential > 1)
                            cell.potential = 1;
                        var grey = Math.floor(cell.potential * 255);
//                        var color = 'rgb(' + grey + ', ' + grey + ', ' + grey + ')';
                        var color = '#' + grey.toString(16) + grey.toString(16) + grey.toString(16);
                        cell.terrain = new Terrain(color, 1.0);
                    });
                }
            })

        this.citiesWorld2  = new World();
        _.extend(this.citiesWorld2,
            {
                id: 2,
                name: "Arthur's Model with Neighbourhood (pp. 41-42)",
                isPresetWorld: true,
                interval: 1000,
                cellsAcross: 21,
                cellsDown: 21,
                dontClearCanvas: true,
                scrollingImageVisible: false,
                initialResourceStore: 0,
                playIndefinitely: true,
                introduction:
                    "<p>Scale Factor</p><p><input class='world-parameters' name='ScaleFactor' value='2'/> </p>" +
                        "<p>Rate of growth:</p><p><input class='world-parameters' name='RateOfGrowth' value='1.05'/> </p>" +
                        "<p>Distribute potential normally:</p><p><input type='checkbox' class='world-parameters' name='DistributeNormally' checked='checked'/> </p>" +
                    "",
                conclusion: "Well done.",
                setup: function () {
                    this.cells.forEach(function(cell) {
                        if (FiercePlanet.Parameters.DistributeNormally) {
                            var pot = jStat.normal.sample(0.5, 0.15);
                            pot = (pot < 0 ? 0 : (pot > 1 ? 1 : pot));
                            cell.potential = pot;
                        }
                        // Otherwise, assume uniform distribution
                        else {
                            cell.potential = Math.random();
                        }
                        cell.development = 0;
                        cell.terrain = new Terrain("#000", 1.0);
                        cell.agentsAllowed = true;
                    });
                },
                tickFunction: function () {
                    var potentials = _.map(this.cells, function(cell) { return cell.potential; }),
                        min = _.min(potentials),
                        max = _.max(potentials),
                        range = max - min;

                    var world = this;
                    // Adjust potential for all cells
                    this.cells.forEach(function(cell) {
                        var x = cell.x, y = cell.y;
                        var positions = world.getMooreNeighbourhood(x, y, true);
                        var totalPotential = 0, counter = 0;
                        positions.forEach(function(position) {
                            var cell = world.getCell(position.x, position.y);
                            totalPotential += cell.potential;
                            counter++;
                        });
                        totalPotential = totalPotential / counter;

                        var normalisedPotential = (totalPotential - min) / range;
                        cell.newPotential = FiercePlanet.Parameters.RateOfGrowth * Math.pow(normalisedPotential, FiercePlanet.Parameters.ScaleFactor);// * FiercePlanet.Parameters.TotalPotential;
                        if (cell.newPotential > 1)
                            cell.newPotential = 1;
                    });

                    // Adjust potential for all cells
                    this.cells.forEach(function(cell) {
                        if (cell.newPotential)
                            cell.potential = cell.newPotential;
                        var grey = Math.floor(cell.potential * 255);
//                        var color = 'rgb(' + grey + ', ' + grey + ', ' + grey + ')';
                        var color = '#' + grey.toString(16) + grey.toString(16) + grey.toString(16);
                        cell.terrain = new Terrain(color, 1.0);
                    });


                    FiercePlanet.Drawing.drawPath();
                    console.log(min, max, range, Lifecycle.waveCounter)


                }
            })

        this.citiesWorld3  = new World();
        _.extend(this.citiesWorld3,
            {
                id: 3,
                name: "Vicsek-Szalay Model (pp. 43-47)",
                isPresetWorld: true,
                interval: 10,
                cellsAcross: 130,
                cellsDown: 130,
                dontClearCanvas: true,
                scrollingImageVisible: false,
                initialResourceStore: 0,
                playIndefinitely: true,
                introduction: "<p>Threshold</p><p><input class='world-parameters' name='Threshold' value='6'/> </p>" +
                    "<p>Add noise:</p><p><input type='checkbox' class='world-parameters' name='AddNoise' checked='checked'/> </p>" +
                    "<p>Draw development:</p><p><input type='checkbox' class='world-parameters' name='DrawDevelopment' checked='checked'/> </p>" +
                    "",
                conclusion: "Well done.",
                setup: function () {
                    this.generatePath();
                    this.cells.forEach(function(cell) {
                        cell.potential = Math.random() < 0.5 ? -1 : 1;
                        cell.development = 0;
                        cell.terrain = new Terrain("#000", 1.0);
                        cell.agentsAllowed = true;
                    });
                },
                tickFunction: function () {
                    var world = this;
                    // Adjust potential for all cells
                    this.cells.forEach(function(cell) {
                        var x = cell.x, y = cell.y;
                        var positions = world.getVonNeumannNeighbourhood(x, y, true);
                        var totalPotential = 0, counter = 0;
                        positions.forEach(function(position) {
                            var cell = world.getCell(position.x, position.y);
                            counter++;
                            totalPotential += cell.potential;
                        });
                        totalPotential = totalPotential / counter;
                        if (FiercePlanet.Parameters.AddNoise) {
                            totalPotential += (Math.random() < 0.5 ? -1 : 1);
                        }
                        cell.newPotential = totalPotential;
                    });

                    // Adjust potential for all cells
                    this.cells.forEach(function(cell) {
                        if (cell.newPotential)
                            cell.potential = cell.newPotential;
                        cell.development =  (cell.potential <= FiercePlanet.Parameters.Threshold && cell.development == 0 ? 0 : 1 );
                        if (cell.development == 1)
                            cell.terrain = new Terrain("#fff", 1.0);
                    });
                    var potentials = _.map(this.cells, function(cell) { return cell.potential; }),
                        min = _.min(potentials),
                        max = _.max(potentials),
                        range = max - min;
//                        ,total = _.reduce(potentials, function(memo, num){ return memo + num; }, 0);
                    var devs = _.map(this.cells, function(cell) { return cell.development; }),
                        totalDev = _.reduce(devs, function(memo, num){ return memo + num; }, 0);
                    FiercePlanet.Parameters.Max =  max;
                    FiercePlanet.Parameters.Range =  range;
                    FiercePlanet.Drawing.drawPath();
                    console.log(max, range, totalDev, Lifecycle.waveCounter)



                }
            })

        this.citiesWorld4  = new World();
        _.extend(this.citiesWorld4,
            {
                id: 4,
                name: "Local Diffusion and Contact: Global Pattern from Local Action (pp. 48-51)",
                isPresetWorld: true,
                interval: 10,
                cellsAcross: 130,
                cellsDown: 130,
                dontClearCanvas: true,
                scrollingImageVisible: false,
                initialResourceStore: 0,
                playIndefinitely: true,
                introduction:
                    "<p>Threshold</p><p><input class='world-parameters' name='Threshold' value='4.5'/> </p>" +
                    "<p>Add noise:</p><p><input type='checkbox' class='world-parameters' name='AddNoise' checked='checked'/> </p>" +
                    "<p>Draw development:</p><p><input type='checkbox' class='world-parameters' name='DrawDevelopment' checked='checked'/> </p>" +
                    "<p>Number of Agents:</p><p><input class='world-parameters' name='NumberOfAgents' value='6000'/> </p>" +
                    "",
                conclusion: "Well done.",
                setup: function () {
                    DefaultCultures.init();
                    this.generatePath();
                    this.cells.forEach(function(cell) {
                        cell.potential = Math.random() < 0.5 ? -1 : 1;
                        cell.development = 0;
                        cell.terrain = new Terrain("#000", 1.0);
                        cell.agentsAllowed = true;
                    });

                    /// Set up agents
                    var culture = _.clone(DefaultCultures.CITIZEN_AGENT_TYPE);
                    culture.waveNumber = parseInt(FiercePlanet.Parameters.NumberOfAgents);
                    culture.updateFunction = function(agent, world) {
                        var newX = Math.floor(Math.random() * world.cellsAcross),
                            newY = Math.floor(Math.random() * world.cellsDown);
                        if (world.getCell(newX, newY).agents.length == 0)
                            agent.moveTo(newX, newY);
                    };
                    this.cultures = [culture];
                    this.randomiseAgents = true;
                    this.initialiseWaves(1);
                },
                tickFunction: function () {
                    var world = this;
                    // Adjust potential for all cells
                    this.cells.forEach(function(cell) {
                        var x = cell.x, y = cell.y;
                        var positions = world.getVonNeumannNeighbourhood(x, y, true);
                        var totalPotential = 0, counter = 0;
                        positions.forEach(function(position) {
                            var cell = world.getCell(position.x, position.y);
                            counter++;
                            totalPotential += cell.potential;
                        });
                        totalPotential = totalPotential / counter;
                        if (FiercePlanet.Parameters.AddNoise) {
                            totalPotential += (Math.random() < 0.5 ? -1 : 1);
                        }
                        cell.newPotential = totalPotential;
                    });

                    // Adjust potential for all cells
                    this.cells.forEach(function(cell) {
                        if (cell.newPotential)
                            cell.potential = cell.newPotential;
                        cell.development =  (cell.potential <= FiercePlanet.Parameters.Threshold && cell.development == 0 ? 0 : 1 );
                        if (cell.development == 1)
                            cell.terrain = new Terrain("#fff", 1.0);
                    });
                    var potentials = _.map(this.cells, function(cell) { return cell.potential; }),
                        min = _.min(potentials),
                        max = _.max(potentials),
                        range = max - min;
//                        ,total = _.reduce(potentials, function(memo, num){ return memo + num; }, 0);
                    var devs = _.map(this.cells, function(cell) { return cell.development; }),
                        totalDev = _.reduce(devs, function(memo, num){ return memo + num; }, 0);
                    FiercePlanet.Parameters.Max =  max;
                    FiercePlanet.Parameters.Range =  range;
                    FiercePlanet.Drawing.drawPath();
                    //console.log(max, range, totalDev, Lifecycle.waveCounter)
                }
            })

        this.citiesWorld5  = new World();
        _.extend(this.citiesWorld5,
            {
                id: 5,
                name: "Schelling's Model: Segregation as Self-Organisation (pp. 51-57)",
                isPresetWorld: true,
                interval: 10,
                cellsAcross: 130,
                cellsDown: 130,
                dontClearCanvas: true,
                scrollingImageVisible: false,
                initialResourceStore: 0,
                playIndefinitely: true,
                introduction:
                    "<p>Threshold</p><p><input class='world-parameters' name='Threshold' value='4.5'/> </p>" +
                        "<p>Add noise:</p><p><input type='checkbox' class='world-parameters' name='AddNoise' checked='checked'/> </p>" +
                        "<p>Draw development:</p><p><input type='checkbox' class='world-parameters' name='DrawDevelopment' checked='checked'/> </p>" +
                        "<p>Number of Agents:</p><p><input class='world-parameters' name='NumberOfAgents' value='6000'/> </p>" +
                        "",
                conclusion: "Well done.",
                setup: function () {
                    this.generatePath();
                    this.cells.forEach(function(cell) {
                        cell.potential = Math.random() < 0.5 ? -1 : 1;
                        cell.development = 0;
                        cell.terrain = new Terrain("#000", 1.0);
                        cell.agentsAllowed = true;
                    });
                },
                tickFunction: function () {
                    var world = this;
                    // Adjust potential for all cells
                    this.cells.forEach(function(cell) {
                        var x = cell.x, y = cell.y;
                        var positions = world.getVonNeumannNeighbourhood(x, y, true);
                        var totalPotential = 0, counter = 0;
                        positions.forEach(function(position) {
                            var cell = world.getCell(position.x, position.y);
                            counter++;
                            totalPotential += cell.potential;
                        });
                        totalPotential = totalPotential / counter;
                        if (FiercePlanet.Parameters.AddNoise) {
                            totalPotential += (Math.random() < 0.5 ? -1 : 1);
                        }
                        cell.newPotential = totalPotential;
                    });

                    // Adjust potential for all cells
                    this.cells.forEach(function(cell) {
                        if (cell.newPotential)
                            cell.potential = cell.newPotential;
                        cell.development =  (cell.potential <= FiercePlanet.Parameters.Threshold && cell.development == 0 ? 0 : 1 );
                        if (cell.development == 1)
                            cell.terrain = new Terrain("#fff", 1.0);
                    });
                    var potentials = _.map(this.cells, function(cell) { return cell.potential; }),
                        min = _.min(potentials),
                        max = _.max(potentials),
                        range = max - min;
//                        ,total = _.reduce(potentials, function(memo, num){ return memo + num; }, 0);
                    var devs = _.map(this.cells, function(cell) { return cell.development; }),
                        totalDev = _.reduce(devs, function(memo, num){ return memo + num; }, 0);
                    FiercePlanet.Parameters.Max =  max;
                    FiercePlanet.Parameters.Range =  range;
                    FiercePlanet.Drawing.drawPath();
                    console.log(max, range, totalDev, Lifecycle.waveCounter)



                }
            })

        this.citiesWorld6  = new World();
        _.extend(this.citiesWorld6,
            {
                id: 5,
                name: "Krugman's Model: Trade and Scale (pp. 57-63)",
                isPresetWorld: true,
                interval: 10,
                cellsAcross: 130,
                cellsDown: 130,
                dontClearCanvas: true,
                scrollingImageVisible: false,
                initialResourceStore: 0,
                playIndefinitely: true,
                introduction:
                    "<p>Threshold</p><p><input class='world-parameters' name='Threshold' value='4.5'/> </p>" +
                    "<p>Add noise:</p><p><input type='checkbox' class='world-parameters' name='AddNoise' checked='checked'/> </p>" +
                    "<p>Draw development:</p><p><input type='checkbox' class='world-parameters' name='DrawDevelopment' checked='checked'/> </p>" +
                    "<p>Number of Agents:</p><p><input class='world-parameters' name='NumberOfAgents' value='6000'/> </p>" +
                    "",
                conclusion: "Well done.",
                setup: function () {
                    this.generatePath();
                    this.cells.forEach(function(cell) {
                        cell.potential = Math.random() < 0.5 ? -1 : 1;
                        cell.development = 0;
                        cell.terrain = new Terrain("#000", 1.0);
                        cell.agentsAllowed = true;
                    });
                },
                tickFunction: function () {
                    var world = this;
                    // Adjust potential for all cells
                    this.cells.forEach(function(cell) {
                        var x = cell.x, y = cell.y;
                        var positions = world.getVonNeumannNeighbourhood(x, y, true);
                        var totalPotential = 0, counter = 0;
                        positions.forEach(function(position) {
                            var cell = world.getCell(position.x, position.y);
                            counter++;
                            totalPotential += cell.potential;
                        });
                        totalPotential = totalPotential / counter;
                        if (FiercePlanet.Parameters.AddNoise) {
                            totalPotential += (Math.random() < 0.5 ? -1 : 1);
                        }
                        cell.newPotential = totalPotential;
                    });

                    // Adjust potential for all cells
                    this.cells.forEach(function(cell) {
                        if (cell.newPotential)
                            cell.potential = cell.newPotential;
                        cell.development =  (cell.potential <= FiercePlanet.Parameters.Threshold && cell.development == 0 ? 0 : 1 );
                        if (cell.development == 1)
                            cell.terrain = new Terrain("#fff", 1.0);
                    });
                    var potentials = _.map(this.cells, function(cell) { return cell.potential; }),
                        min = _.min(potentials),
                        max = _.max(potentials),
                        range = max - min;
//                        ,total = _.reduce(potentials, function(memo, num){ return memo + num; }, 0);
                    var devs = _.map(this.cells, function(cell) { return cell.development; }),
                        totalDev = _.reduce(devs, function(memo, num){ return memo + num; }, 0);
                    FiercePlanet.Parameters.Max =  max;
                    FiercePlanet.Parameters.Range =  range;
                    FiercePlanet.Drawing.drawPath();
                    console.log(max, range, totalDev, Lifecycle.waveCounter)

                }
            })

        // Prepare as a module
        this.id = "Cities";
        this.name = "Cities Module - Batty";
        this.position = 1;
        this.worlds = [this.citiesWorld1, this.citiesWorld2, this.citiesWorld3, this.citiesWorld4, this.citiesWorld5, this.citiesWorld6 ];
    }

    this.initCitiesWorlds();
}).apply(CitiesWorlds);


(function() {
    this.init = function() {

        var module = new Module();
        module.id = 'Cities';

        module.registerCampaign(CitiesWorlds);
        CitiesCultures.init();
        module.registerCulture(CitiesCultures.CELLULAR_AGENT_TYPE );
        module.register();

        _.extend(Universe.settings, {
            skewTiles: false,
            agentsCanCommunicate: false,
            hidePathBorder: true,
            scrollingImageVisible: false,
            showGraph: false,
            showEditor: false
        })
        localStorage.scrollingImageVisible = false;
        Universe.settings.store();

        _.extend(Lifecycle, {
            currentCampaignID: 'Cities',
            currentWorldPreset: true,
            interval: 500,
            NEW_WORLD_DELAY: 300

        })

        AgentConstants.DEFAULT_SPEED = 1;

        FiercePlanet.ModuleEditor.buildEditorFromUrl('/javascripts/fp/modules/cities/cities-module.js', 'CitiesModule.init(); FiercePlanet.Game.loadGame();');
    };
}).apply(CitiesModule);

if (typeof exports !== "undefined") {
    exports.CitiesCultures = CitiesCultures;
    exports.CitiesWorlds = CitiesWorlds;
    exports.CitiesModule = CitiesModule;
}

