/*!
 * Fierce Planet
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var NetLogoWorlds = NetLogoWorlds || new Campaign();
var NetLogoModule = NetLogoModule || {};


(function () {

    this.initNetLogoWorlds = function () {
        this.altruism  = new World();
        _.extend(this.altruism,
            {
                id: 1,
                name: "Altruism",
                isPresetWorld: true,
                interval: 50,
                cellsAcross: 41,
                cellsDown: 41,
                dontClearCanvas: true,
                scrollingImageVisible: false,
                allowOffscreenCycling: true,
                initialResourceStore: 0,
                playIndefinitely: true,
                persistSetupScreen: true,
                noWander: true,
                noSpeedChange: true,
//                "<p>Threshold</p><p><input class='world-parameters' name='Threshold' value='6'/> </p>" +
//                    "<p>Number of Agents:</p><p><input class='world-parameters' name='NumberOfAgents' value='100'/> </p>" +
                parameters:
                        "<p>Altruistic probability</p><p><input class='world-parameters' name='AltruisticProbability' value='0.26'/> </p>" +
                        "<p>Selfish probability</p><p><input class='world-parameters' name='SelfishProbability' value='0.26'/> </p>" +
                        "<p>Cost of altruism</p><p><input class='world-parameters' name='CostOfAltruism' value='0.13'/> </p>" +
                        "<p>Benefit from altruism</p><p><input class='world-parameters' name='BenefitFromAltruism' value='0.48'/> </p>" +
                        "<p>Disease</p><p><input class='world-parameters' name='Disease' value='0.0'/> </p>" +
                        "<p>Harshness</p><p><input class='world-parameters' name='Harshness' value='0.0'/> </p>" +
                        "",
                conclusion: "Well done.",
                setup: function() {
                    this.cells.forEach(function(cell) {
                        cell.potential = Math.random() < 0.5 ? -1 : 1;
                        cell.development = 0;
                        cell.terrain = new Terrain("#fff", 1.0);
                        cell.agentsAllowed = true;
                    });
                },
                handleParameters: function () {
                    var altruisticProbability = parseFloat(FiercePlanet.Parameters.AltruisticProbability)
                        , selfishProbability = parseFloat(FiercePlanet.Parameters.SelfishProbability)
                    /// Set up agents
                    var culture = _.clone(DefaultCultures.Square);
                    culture.waveNumber = parseInt(FiercePlanet.Parameters.NumberOfAgents);
                    culture.initialSpeed = 1;
                    culture.initFunction = function(agent, world) {
                        var r = Math.random();
                        agent.altruisticBenefit = 0;
                        agent.altruisticCost = 0;
                        agent.fitness = 0;
                        agent.selfWeight = 0;
                        agent.altWeight = 0;
                        agent.harshness = 0;
                        if (r < altruisticProbability) {
                            agent.color = 'faa';
                            agent.state = 'altruistic';
                            agent.benefitOut = 1;
                        }
                        else if (r < (altruisticProbability + selfishProbability)) {
                            agent.color = '0f0';
                            agent.state = 'selfish';
                            agent.benefitOut = 0;
                        }
                        else {
                            agent.color = '000';
                            agent.state = 'neither';
                            agent.benefitOut = 0;
                          }
//                        console.log(r, altruisticProbability, selfishProbability, agent.state)

                    };
                    culture.updateFunction = function(agent, world) {
                    };
                    this.cultures = [culture];
//                    this.randomiseAgents = true;
                    this.placeAgentsOnAllCells = true;
                    this.waves = undefined;
                    this.initialiseWaves(1);
                },
                tickFunction: function () {
                    var world = this;
                    var counter = 0;
                    var benefitFromAltruism = parseFloat(FiercePlanet.Parameters.BenefitFromAltruism)
                        , costOfAltruism = parseFloat(FiercePlanet.Parameters.CostOfAltruism)
                        , disease = parseFloat(FiercePlanet.Parameters.Disease)
                        , harshness = parseFloat(FiercePlanet.Parameters.Harshness)
                    world.currentAgents.forEach(function(agent) {
                        if (agent.state == 'altruistic' || agent.state == 'selfish') {
                            counter ++;
                        }
                    });
                    if (counter == 0) {
                        Lifecycle._stopAgents();
                    }

                    // Set altruism benefit
                    world.currentAgents.forEach(function(agent) {
                        var positions = world.getVonNeumannNeighbourhood(agent.x, agent.y, false);
                        var benefits = agent.benefitOut, counter = 1;
                        positions.forEach(function(position) {
                            var agents = world.getAgentsAtCell(position.x, position.y);
                            if (!_.isUndefined(agents) && agents.length > 0) {
                                var testAgent = agents[0];
                                benefits += testAgent.benefitOut;
                                counter++;
                            }
                        })
                        agent.altruisticBenefit = benefitFromAltruism * (benefits / counter);
                    });

                    // Perform fitness check
                    world.currentAgents.forEach(function(agent) {
                        if (agent.state == 'altruistic') {
                            agent.fitness = (1 - costOfAltruism) + agent.altruisticBenefit;
                        }
                        else if (agent.state == 'selfish') {
                            agent.fitness = 1 + agent.altruisticBenefit;
                        }
                        else if (agent.state == 'neither') {
                            agent.fitness = harshness;
                        }
                    });

                    // Record neighbour fitness
                    // Find lottery weights
                    world.currentAgents.forEach(function(agent) {
                        var altFitness = 0, selfFitness = 0, harshFitness = 0;
                        if (agent.state == 'altruistic') {
                            altFitness = agent.fitness;
                        }
                        else if (agent.state == 'selfish') {
                            selfFitness = agent.fitness;
                        }
                        else if (agent.state == 'neither') {
                            harshFitness = agent.fitness;
                        }
                        var positions = world.getVonNeumannNeighbourhood(agent.x, agent.y, false);
                        var benefits = 0;
                        positions.forEach(function(position) {
                            var agents = world.getAgentsAtCell(position.x, position.y);
                            if (!_.isUndefined(agents) && agents.length > 0) {
                                var testAgent = agents[0];
                                if (testAgent.state == 'altruistic') {
                                    altFitness += testAgent.fitness;
                                }
                                else if (testAgent.state == 'selfish') {
                                    selfFitness += testAgent.fitness;
                                }
                                else if (testAgent.state == 'neither') {
                                    harshFitness += testAgent.fitness;
                                }
                            }
                        })
                        agent.altFitness  = altFitness;
                        agent.selfFitness  = selfFitness;
                        agent.harshFitness  = harshFitness;
                    });
                    // Find lottery weights
                    world.currentAgents.forEach(function(agent) {
                        var fitnessSum = agent.altFitness + agent.selfFitness + agent.harshFitness + disease;
                        if (fitnessSum > 0) {
                            agent.altWeight = agent.altFitness / fitnessSum;
                            agent.selfWeight = agent.selfFitness / fitnessSum;
                            agent.harshWeight = (agent.harshFitness + disease) / fitnessSum;
                        }
                        else {
                            agent.altWeight = 0;
                            agent.selfWeight = 0;
                            agent.harshWeight = 0;
                        }
                    });

//                    console.log(world.getAgentsAtCell(10, 10)[0].altruisticBenefit)
//                    console.log(world.getAgentsAtCell(10, 10)[0].altFitness)
//                    console.log(world.getAgentsAtCell(10, 10)[0].altWeight)
                    // Next generation
                    world.currentAgents.forEach(function(agent) {
                        var breedChance = Math.random();
                        if (breedChance < agent.altWeight) {
                            agent.state = 'altruistic';
                            agent.color = 'faa';
                            agent.benefitOut = 1;
                        }
                        else if (breedChance < (agent.altWeight + agent.selfWeight)) {
                            agent.state = 'selfish';
                            agent.color = '0f0';
                            agent.benefitOut = 0;
                        }
                        else {
                            agent.state = 'neither';
                            agent.color = '000';
                            agent.altruisticBenefit = 0;
                            agent.benefitOut = 0;
                            agent.altFitness = 0;
                            agent.selfFitness = 0;
                            agent.harshFitness = 0;
                            agent.altWeight = 0;
                            agent.selfWeight = 0;
                            agent.harshWeight = 0;
                        }
                    });

                    var alts = _.map(this.currentAgents, function(agent) { return (agent.state == 'altruistic' ? 1 : 0); }),
                        totalAlt = _.reduce(alts, function(memo, num){ return memo + num; }, 0);
                    var selfs = _.map(this.currentAgents, function(agent) { return (agent.state == 'selfish' ? 1 : 0); }),
                        totalSelf = _.reduce(selfs, function(memo, num){ return memo + num; }, 0);
                    FiercePlanet.Drawing.clearCanvas('#resourceCanvas');
//                    FiercePlanet.Drawing.drawPath();
                    console.log(totalAlt, totalSelf, Lifecycle.waveCounter)

                }
            })

        this.cooperation  = new World();
        _.extend(this.cooperation,
            {
                id: 2,
                name: "Cooperation",
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
                parameters:
                    "<p>Threshold</p><p><input class='world-parameters' name='Threshold' value='6'/> </p>" +
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

                    /// Set up agents
                    var culture = _.clone(DefaultCultures.CITIZEN_AGENT_TYPE);
                    culture.healthCategories = [];
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
                    var cell = this.getCell(65, 65);
                    cell.developed = true;
                    cell.terrain = new Terrain('#f00', 1.0);
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
                    this.cells.forEach(function(cell) {
                        var x = cell.x, y = cell.y;
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
//                        if (x > 50 && x < 53 && y > 50 && y < 53)
//                            console.log(agentCounter)
                        if (agentCounter > parseInt(FiercePlanet.Parameters.Threshold)) {
                            //  || world.currentAgents.length - undevelopedCounter < 5
                            if ((developedAgentCounter > 0 && developedAgentCounter < 3)) {
                                cell.needsToBeDeveloped = true;
                                undevelopedCounter--;
                            }
                        }
                    })
                    this.cells.forEach(function(cell) {
                        if (cell.needsToBeDeveloped) {
                            cell.terrain = new Terrain('#f00', 1.0);
                            cell.developed = true;
                        }
                    })
                    var devs = _.map(this.cells, function(cell) { return (cell.developed ? 1 : 0); }),
                        totalDev = _.reduce(devs, function(memo, num){ return memo + num; }, 0);
                    FiercePlanet.Drawing.clearCanvas('#resourceCanvas');
                    FiercePlanet.Drawing.drawPath();
                    console.log(totalDev, Lifecycle.waveCounter)
                }
            })


        this.diffusionLimitedAggregationWorld  = new World();
        _.extend(this.diffusionLimitedAggregationWorld,
            {
                id: 10,
                name: "DLA",
                isPresetWorld: true,
                interval: 20,
                cellsAcross: 101,
                cellsDown: 101,
                dontClearCanvas: true,
                scrollingImageVisible: false,
                initialResourceStore: 0,
                playIndefinitely: true,
                noWander: true,
                noSpeedChange: true,
                parameters:
                    "<p>Proportion of empty space</p><p><input class='world-parameters' name='EmptySpace' value='0.8'/> </p>" +
                        "",
                conclusion: "Well done.",
                handleParameters: function () {
                    this.generatePath();
                    this.cells.forEach(function(cell) {
                        cell.terrain = new Terrain("#000", 1.0);
                        cell.agentsAllowed = true;
                    });

                    /// Set up agents
                    var culture = _.clone(DefaultCultures.Circular);
                    culture.healthCategories = [];
                    culture.waveNumber = parseInt(FiercePlanet.Parameters.NumberOfAgents);
                    culture.initialSpeed = 1;
                    culture.beliefs = [];
                    culture.desires = [];
                    culture.capabilities = [];
                    culture.initFunction = function(agent, world) {
                        agent.color = 'ff0';
                        agent.stopped = false;
                    };
                    culture.updateFunction = function(agent, world) {
                    };
                    this.cultures = [culture];
                    this.placeAgentsOnAllCells = true;
                    var numAgents = this.cellsAcross * this.cellsDown;
                    var emptySpace = parseFloat(FiercePlanet.Parameters.EmptySpace);
                    numAgents = (1 - emptySpace) * numAgents;

                    this.waves = undefined;
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
                            removedCells.push(index)
                        }
                    }
                    removedCells.sort(function(a, b) { return (a < b ? 1 : (a > b ? -1 : 0))})
                    var world = this;
                    removedCells.forEach(function(index) {
                        world.waves[0].agents.splice(index, 1);
                    })
                    this.initialiseCells();
                    this.cells.forEach(function(cell) {
                        cell.terrain = new Terrain("#000", 1.0);
                        cell.agentsAllowed = true;
                    });
                    var cell = this.getCell(50, 50);
                    cell.developed = true;
                    cell.terrain = new Terrain("#f00", 1.0);


                },
                tickFunction: function () {
                    var world = this;
                    // Adjust potential for all cells
                    var threshold = parseFloat(FiercePlanet.Parameters.Threshold),
                        newSpaces = [],
                        agentsToMove = [],
                        candidateAgents = [];
                    this.currentAgents.forEach(function(agent) {
                        var x = agent.x, y = agent.y;
                        var positions = world.getMooreNeighbourhood(x, y, false);
                        var newPosition = false, len  = positions.length, counter = 0;
                        var cell = world.getCell(x, y);
                        for (var i = 0; i < len; i++) {
                            if (!agent.stopped) {
                                var position = positions[i];
                                var testCell = world.getCell(position.x, position.y);
                                if (testCell.developed) {
                                    candidateAgents.push(agent);
                                    break;
                                }
                            }
                        }

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
                    });
                    if (candidateAgents.length > 0) {
                        var agentIndex = Math.floor(Math.random() * candidateAgents.length);
                        var stoppedAgent = candidateAgents[agentIndex];
                        stoppedAgent.stopped = true;
                        stoppedAgent.color = 'f00'
                        var x = stoppedAgent.x, y = stoppedAgent.y;
                        var cell = world.getCell(x, y);
                        cell.terrain = new Terrain('#f00', 1.0);
                        cell.developed = true;
                    }

                    agentsToMove.forEach(function(agent) {
                        if (!agent.stopped) {
                            var newPosition = agent.newPosition;
                            agent.moveTo(newPosition.x, newPosition.y);
                        }
                    });

                    var potentials = _.map(this.currentAgents, function(agent) { return agent.stopped; })
                        ,totalStopped = _.reduce(potentials, function(memo, num){ return memo + num; }, 0);
                    FiercePlanet.Drawing.clearCanvas('#resourceCanvas');
                    FiercePlanet.Drawing.drawPath();
                    console.log(totalStopped, Lifecycle.waveCounter)

                }
            })

        // Prepare as a module
        this.id = "NetLogo";
        this.name = "NetLogo";
        this.position = 1;
        this.worlds = [
            this.altruism,
            this.cooperation,
            this.diffusionLimitedAggregationWorld
        ];
    }

    this.initNetLogoWorlds();
}).apply(NetLogoWorlds);


(function() {
    this.init = function() {
        var module = new Module();
        module.id = 'NetLogo';
        module.registerSelf();
        module.registerCampaign(NetLogoWorlds);
        module.currentCampaignID = 'NetLogo';

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
            currentCampaignID: 'NetLogo',
            currentWorldPreset: true,
            interval: 500,
            worldDelay: 300
        })
        _.extend(FiercePlanet.Orientation, {
            worldWidth: 600,
            worldHeight: 600
        })

        FiercePlanet.ModuleEditor.buildEditorFromUrl('/javascripts/fp/modules/netlogo/netlogo-module.js', 'NetLogoModule.init(); FiercePlanet.Game.loadGame();');
    };
}).apply(NetLogoModule);

if (typeof exports !== "undefined") {
    exports.NetLogoWorlds = NetLogoWorlds;
    exports.NetLogoModule = NetLogoModule;
}

