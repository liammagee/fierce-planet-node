/*!
 * Fierce Planet
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var CitiesWorlds = CitiesWorlds || new Campaign();
var CitiesModule = CitiesModule || {};


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
                interval: 50,
                cellsAcross: 130,
                cellsDown: 130,
                dontClearCanvas: true,
                scrollingImageVisible: false,
                initialResourceStore: 0,
                playIndefinitely: true,
                noWander: true,
                noSpeedChange: true,
                introduction:
                    "<p>Threshold</p><p><input class='world-parameters' name='Threshold' value='6'/> </p>" +
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
                    culture.initialSpeed = 1;
                    culture.beliefs = [];
                    culture.desires = [];
                    culture.capabilities = [];
                    culture.initFunction = function(agent, world) {
                        agent.color = '666';
                        agent.isDeveloped = false;
                    };
                    culture.updateFunction = function(agent, world) {
                    };
                    this.cultures = [culture];
                    this.randomiseAgents = true;
                    this.initialiseWaves(1);
                },
                tickFunction: function () {
                    var world = this;
                    var undevelopedAgents = _.compact(_.map(this.currentAgents, function(agent) {if (! agent.isDeveloped) return agent;} ));
                    undevelopedAgents.forEach(function(agent) {
//                        var positions = world.getVonNeumannNeighbourhood(agent.x, agent.y, false);
                        var positions = world.getMooreNeighbourhood(agent.x, agent.y, false);
                        var position = positions[Math.floor(Math.random() * positions.length)],
                            newX = position.x,
                            newY = position.y;
//                        var position = world.cells[Math.floor(Math.random() * world.cells.length)],
//                            newX = position.x, newY = position.y;
                        var agents = world.getAgentsAtCell(position.x, position.y);
                        if (agents.length == 0) {
                            agent.moveTo(newX, newY);
                        }
                    })

                    var undevelopedCounter = undevelopedAgents.length;
                    undevelopedAgents.forEach(function(agent) {
                        var x = agent.x, y = agent.y,
                            cell = world.getCell(x, y);
                        var surroundingPositions = world.getMooreNeighbourhood(x, y, true),
                            agentCounter = 0, developedAgentCounter = 0;
                        surroundingPositions.forEach(function(position) {
                            var testCell = world.getCell(position.x, position.y);
                            var agents = world.getAgentsAtCell(position.x, position.y);
                            if (agents && agents.length > 0) {
                                agentCounter++;
                                if (testCell.developed)
                                    developedAgentCounter++;
                            }
                        });
                        if (agentCounter > parseInt(FiercePlanet.Parameters.Threshold)) {
                            if ((developedAgentCounter > 0 && developedAgentCounter < 3) || world.currentAgents.length - undevelopedCounter < 5) {
                                cell.needsToBeDeveloped = true;
                                undevelopedCounter--;
                            }
                        }
                    })
                    undevelopedAgents.forEach(function(agent) {
                        var x = agent.x, y = agent.y;
                        var cell = world.getCell(x, y);
                        if (cell.needsToBeDeveloped) {
                            cell.terrain = new Terrain('#fff', 1.0);
                            cell.developed = true;
                        }
                    })
                    var devs = _.map(this.currentAgents, function(agent) { return (agent.color == 'fff' ? 1 : 0); }),
                        totalDev = _.reduce(devs, function(memo, num){ return memo + num; }, 0);
                    FiercePlanet.Drawing.clearCanvas('#resourceCanvas');
                    console.log(totalDev, Lifecycle.waveCounter)
                }
            })

        this.citiesWorld5  = new World();
        _.extend(this.citiesWorld5,
            {
                id: 5,
                name: "Schelling's Model: Segregation as Self-Organisation (pp. 51-57)",
                isPresetWorld: true,
                interval: 100,
                cellsAcross: 100,
                cellsDown: 100,
                dontClearCanvas: true,
                scrollingImageVisible: false,
                initialResourceStore: 0,
                playIndefinitely: true,
                noWander: true,
                noSpeedChange: true,
                introduction:
                    "<p>Proportion of empty space</p><p><input class='world-parameters' name='EmptySpace' value='0.3'/> </p>" +
                    "<p>Move instead of change:</p><p><input type='checkbox' class='world-parameters' name='Move' checked='checked'/> </p>" +
                    "<p>Move threshold</p><p><input class='world-parameters' name='Threshold' value='0.5'/> </p>" +
                        "",
                conclusion: "Well done.",
                setup: function () {
                    DefaultCultures.init();
                    this.generatePath();
                    this.cells.forEach(function(cell) {
                        cell.terrain = new Terrain("#666", 1.0);
                        cell.agentsAllowed = true;
                    });

                    /// Set up agents
                    var culture = _.clone(DefaultCultures.CITIZEN_AGENT_TYPE);
                    culture.waveNumber = parseInt(FiercePlanet.Parameters.NumberOfAgents);
                    culture.initialSpeed = 1;
                    culture.beliefs = [];
                    culture.desires = [];
                    culture.capabilities = [];
                    culture.initFunction = function(agent, world) {
						var pref = Math.random();
						if (pref < 0.5) {
							agent.preference = 'beer';
	                        agent.color = 'ff0';
						}
						else {
							agent.preference = 'wine';
	                        agent.color = 'f0f';
						}
                    };
                    culture.updateFunction = function(agent, world) {
                    };
                    this.cultures = [culture];
                    this.placeAgentsOnAllCells = true;
					var numAgents = this.cellsAcross * this.cellsDown;
					var emptySpace = parseFloat(FiercePlanet.Parameters.EmptySpace);
					numAgents = (1 - emptySpace) * numAgents;
					
                    this.initialiseWaves(1);
					var len = Math.floor(this.cellsAcross * this.cellsDown * emptySpace),
						removedCells = [];
					for (var i = 0; i < len; i++) {
						var x = Math.floor(Math.random() * this.cellsAcross),
						 	y = Math.floor(Math.random() * this.cellsDown),
							index = x * this.cellsAcross + y;
						if (removedCells.indexOf(index) > -1) {
							i--;
							continue;
						}
						else {
							this.waves[0].agents.splice(index, 1);
						}
					}
					this.initialiseCells();
                    this.cells.forEach(function(cell) {
                        cell.terrain = new Terrain("#666", 1.0);
                        cell.agentsAllowed = true;
                    });
					

                },
                tickFunction: function () {
                    var world = this;
                    // Adjust potential for all cells
					var move = FiercePlanet.Parameters.Move;
					if (move) {
						var threshold = parseFloat(FiercePlanet.Parameters.Threshold),
							newSpaces = [],
							agentsToMove = [];
	                    this.currentAgents.forEach(function(agent) {
	                        var x = agent.x, y = agent.y;
	                        var positions = world.getMooreNeighbourhood(x, y, false);
	                        var beer = 0, wine = 0;
	                        positions.forEach(function(position) {
	                            var agents = world.getAgentsAtCell(position.x, position.y);
	                            if (agents && agents.length > 0) {
									var a = agents[0];
	                                if (a.preference == 'beer')
	                                    beer++;
		                            else if (a.preference == 'wine')
		                                wine++;
	                            }
	                        });
							if ((wine / (wine + beer)) < threshold && agent.preference == 'wine') {
								var newPosition = false, len  = positions.length, counter = 0;
								while (!newPosition && counter < len) {
									var position = positions[Math.floor(Math.random() * len)];
									var index = position.x * this.cellsDown + position.y;
		                            var agents = world.getAgentsAtCell(position.x, position.y);
									if ((_.isUndefined(agents) || agents.length == 0) && newSpaces.indexOf(index) == -1) {
										newSpaces.push(index);
										agent.newPosition = position;
										agentsToMove.push(agent)
										newPosition = true;
									}
									counter++;
								}
							}
							else if ((beer / (wine + beer)) < threshold && agent.preference == 'beer') {
								var newPosition = false, len  = positions.length, counter = 0;
								while (!newPosition && counter < len) {
									var position = positions[Math.floor(Math.random() * len)];
									var index = position.x * this.cellsDown + position.y;
		                            var agents = world.getAgentsAtCell(position.x, position.y);
									if ((_.isUndefined(agents) || agents.length == 0) && newSpaces.indexOf(index) == -1) {
										newSpaces.push(index);
										agent.newPosition = position;
										agentsToMove.push(agent)
										newPosition = true;
									}
									counter++;
								}
							}
						});
	                    agentsToMove.forEach(function(agent) {
							var newPosition = agent.newPosition;
							agent.moveTo(newPosition.x, newPosition.y);
						});
					}
					else {
	                    this.currentAgents.forEach(function(agent) {
	                        var x = agent.x, y = agent.y;
	                        var positions = world.getMooreNeighbourhood(x, y, false);
	                        var beer = 0, wine = 0;
	                        positions.forEach(function(position) {
	                            var agents = world.getAgentsAtCell(position.x, position.y);
	                            if (agents && agents.length > 0) {
									var a = agents[0];
	                                if (a.preference == 'beer')
	                                    beer++;
		                            else if (a.preference == 'wine')
		                                wine++;
	                            }
	                        });
							if (beer > 4) {
		                        agent.newPreference = 'beer';
							}
							else if (wine > 4) {
		                        agent.newPreference = 'wine';
							}
							else {
		                        agent.newPreference = agent.preference;
							}
	                    });
	                    this.currentAgents.forEach(function(agent) {
	                        var x = agent.x, y = agent.y;
	                        if (agent.newPreference) {
								if (agent.newPreference == 'beer') {
	                                agent.preference = 'beer';
	                                agent.color = 'ff0';
	                            }
								else if (agent.newPreference == 'wine') {
	                                agent.preference = 'wine';
	                                agent.color = 'f0f';
	                            }
							}
	                    });
					}

                    var potentials = _.map(this.currentAgents, function(agent) { return agent.preference == 'beer'; })
                        ,totalBeer = _.reduce(potentials, function(memo, num){ return memo + num; }, 0);
                    FiercePlanet.Drawing.clearCanvas('#resourceCanvas');
                    console.log(totalBeer, Lifecycle.waveCounter)

                }
            })


        this.citiesWorld6  = new World();
        _.extend(this.citiesWorld6,
            {
                id: 6,
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

        this.citiesWorld7  = new World();
        _.extend(this.citiesWorld7,
            {
                id: 7,
                name: "Neighbourhoods (pp. 77-96)",
                isPresetWorld: true,
                interval: 100,
                cellsAcross: 101,
                cellsDown: 101,
                dontClearCanvas: true,
                scrollingImageVisible: false,
                initialResourceStore: 0,
                playIndefinitely: true,
                introduction:
                    "<p>Neighbourhood type</p>" +
                    "<p><select class='world-parameters' name='NeighbourhoodType'>" +
                        "<option value='0'>Moore</option>" +
                        "<option value='1'>von Neumann</option>" +
                        "<option value='2'>Combined Moore/von Neumann</option>" +
                        "<option value='3'>Displace von Neumann </option>" +
                        "<option value='4'>'H'</option>" +
                        "<option value='5'>Sierpinkski's gasket</option>" +
                        "<option value='6'>Superblock</option>" +
                    "</select></p>" +
                    "<p>Minimum neighbours</p>" +
                        "<p><select class='world-parameters' name='MinNeighbours'>" +
                        "<option value='0'>0</option>" +
                        "<option value='1' selected='true'>1</option>" +
                        "<option value='2'>2</option>" +
                        "<option value='3'>3</option>" +
                        "<option value='4'>4</option>" +
                        "<option value='5'>5</option>" +
                        "<option value='6'>6</option>" +
                        "<option value='7'>7</option>" +
                        "<option value='8'>8</option>" +
                        "<option value='9'>9</option>" +
                        "</select></p>" +
                    "<p>Maximum neighbours</p>" +
                        "<p><select class='world-parameters' name='MaxNeighbours'>" +
                        "<option value='0'>0</option>" +
                        "<option value='1' selected='true'>1</option>" +
                        "<option value='2'>2</option>" +
                        "<option value='3'>3</option>" +
                        "<option value='4'>4</option>" +
                        "<option value='5'>5</option>" +
                        "<option value='6'>6</option>" +
                        "<option value='7'>7</option>" +
                        "<option value='8'>8</option>" +
                        "<option value='9'>9</option>" +
                        "</select></p>" +
                    "<p>Probability</p><p><input class='world-parameters' name='Probability' value='1.0'/> </p>" +
                    "<p>Use Cumulative Probability</p><p><input type='checkbox' class='world-parameters' name='CumulativeProbability'/> </p>" +
                    "<p>Age to revert: </p><p><input type='text' class='world-parameters' name='AgeToRevert' value='0'/> </p>" +
                    "<p>With shading:</p><p><input type='checkbox' class='world-parameters' name='WithShading' checked='checked'/> </p>" +
                    "",
                conclusion: "Well done.",
                setup: function () {
                    this.generatePath();
                    this.cells.forEach(function(cell) {
                        cell.developed = 0;
                        cell.terrain = new Terrain("#000", 1.0);
                        cell.agentsAllowed = true;
                        cell.attemptsToDevelop = 0;
                    });
                    var cell = this.getCell(50, 50);
                    cell.developed = true;
                    cell.terrain = new Terrain("#fff", 1.0);
                },
                tickFunction: function () {
                    this.generateAutomata();

                    var devs = _.map(this.cells, function(cell) { return cell.developed; }),
                        totalDev = _.reduce(devs, function(memo, num){ return memo + num; }, 0);
                    FiercePlanet.Drawing.drawPath();
                    console.log(totalDev, Lifecycle.waveCounter)
                },
                generateAutomata: function () {
                    var world = this,
                        neighbourhoodType = parseInt(FiercePlanet.Parameters.NeighbourhoodType),
                        minNeighbours = parseInt(FiercePlanet.Parameters.MinNeighbours),
                        maxNeighbours = parseInt(FiercePlanet.Parameters.MaxNeighbours),
                        probability = parseFloat(FiercePlanet.Parameters.Probability),
                        cumulativeProbability = FiercePlanet.Parameters.CumulativeProbability,
                        ageToRevert = parseInt(FiercePlanet.Parameters.AgeToRevert),
                        withShading = FiercePlanet.Parameters.WithShading;
                    // Adjust potential for all cells
                    this.cells.forEach(function(cell) {
                        var x = cell.x, y = cell.y, positions;
                        switch(neighbourhoodType) {
                            case 0:
                                positions = world.getMooreNeighbourhood(x, y, true);
                                break;
                            case 1:
                                positions = world.getVonNeumannNeighbourhood(x, y, true);
                                break;
                            case 2:
                                positions = world.getMvNNeighbourhood(x, y, true);
                                break;
                            // Displaced von Neumann
                            case 3:
                                positions = world.getMaskedNeighbourhood(x, y, true, [0, 2, 4, 6]);
                                break;
                            // 'H'
                            case 4:
                                positions = world.getMaskedNeighbourhood(x, y, true, [2, 6]);
                                break;
                            // Sierpinkski's gasket
                            case 5:
                                positions = world.getMaskedNeighbourhood(x, y, true, [0, 2, 3, 4, 6]);
                                break;
                            // Superblock
                            case 6:
                                positions = world.getMaskedNeighbourhood(x, y, true, [2, 3]);
                                break;
                        }
                        var totalPotential = 0, counter = 0;
                        positions.forEach(function(position) {
                            var testCell = world.getCell(position.x, position.y);
                            if (testCell.developed)
                                counter++;
                        });
                        if (counter >= minNeighbours && counter <= maxNeighbours && !cell.developed) {
                            var r = Math.random();
                            // Apply att
                            if (cumulativeProbability)
                                r = Math.pow(r, cell.attemptsToDevelop + 1);
                            if (r < probability)
                                cell.needsDevelopment = true;
                            else if (cumulativeProbability)
                                cell.attemptsToDevelop++;
                        }
                    });
                    this.cells.forEach(function(cell) {
                        if (cell.needsDevelopment) {
                            cell.terrain = new Terrain("#fff", 1.0);
                            cell.developed = true;
                            cell.needsDevelopment = false;
                            cell.age = 0;
                        }
                        else if (ageToRevert > 0 && cell.developed && cell.age > 0 && cell.age % ageToRevert == 0) {
                            cell.terrain = new Terrain("#000", 1.0);
                            cell.developed = false;
                            cell.age = 0;
                        }
                        else if (cell.developed) {
                            cell.age++;
                        }
                    });

                }
            })

        // Prepare as a module
        this.id = "Cities";
        this.name = "Cities Module - Batty";
        this.position = 1;
        this.worlds = [this.citiesWorld1, this.citiesWorld2, this.citiesWorld3, this.citiesWorld4, this.citiesWorld5, this.citiesWorld6, this.citiesWorld7 ];
    }

    this.initCitiesWorlds();
}).apply(CitiesWorlds);


(function() {
    this.init = function() {
        var module = new Module();
        module.id = 'Cities';
        module.registerSelf();
        module.registerCampaign(CitiesWorlds);
        module.currentCampaignID = 'Cities';

        _.extend(Universe.settings, {
            isometricView: false,
            hidePathBorder: true,
            scrollingImageVisible: false,
            showGraph: false,
            showEditor: false,
            animateWorldAtStart: false
        })
        localStorage.scrollingImageVisible = false;
        Universe.settings.store();

        _.extend(Lifecycle, {
            currentCampaignID: 'Cities',
            currentWorldPreset: true,
            interval: 500,
            worldDelay: 300
        })
        _.extend(FiercePlanet.Orientation, {
            worldWidth: 600,
            worldHeight: 600
        })

        FiercePlanet.ModuleEditor.buildEditorFromUrl('/javascripts/fp/modules/cities/cities-module.js', 'CitiesModule.init(); FiercePlanet.Game.loadGame();');
    };
}).apply(CitiesModule);

if (typeof exports !== "undefined") {
    exports.CitiesWorlds = CitiesWorlds;
    exports.CitiesModule = CitiesModule;
}

