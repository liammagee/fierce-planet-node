/*!
 * Fierce Planet
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var NetLogoWorlds = NetLogoWorlds || new Campaign();
var NetLogoModule = NetLogoModule || {};


(function () {

    this.initWVWorlds = function () {
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
                    console.log(totalAlt, totalSelf, Lifecycle.waveCounter)
                    FiercePlanet.Drawing.clearCanvas('#resourceCanvas');
//                    FiercePlanet.Drawing.drawPath();

                }
            })


        this.cooperation  = new World();
        _.extend(this.cooperation,
            {
                id: 2,
                name: "Cooperation",
                isPresetWorld: true,
                interval: 100,
                cellsAcross: 21,
                cellsDown: 21,
                dontClearCanvas: true,
                scrollingImageVisible: false,
                initialResourceStore: 0,
                playIndefinitely: true,
                noWander: false,
                noSpeedChange: true,
                mapOptions: ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(-33.434969, -70.655254), zoom: 18, tilt: 45}), // Santiago: -33.434969,-70.655254
                parameters:
                    "<p>Initial cows</p>" +
                        "<div id='initialCowsSlider' />" +
                        "<input type='hidden' id='initialCows' class='world-parameters' name='InitialCows' value='20'/>" +

                        "<p>Stride length</p><p><input class='world-parameters' name='StrideLength' value='0.08'/> </p>" +
                        "<p>Cooperative probability</p><p><input class='world-parameters' name='CooperativeProbability' value='0.50'/> </p>" +
                        "<p>Metabolism</p><p><input class='world-parameters' name='Metabolism' value='6'/> </p>" +
                        "<p>Reproduction cost</p><p><input class='world-parameters' name='ReproductionCost' value='54'/> </p>" +
                        "<p>Reproduction threshold</p><p><input class='world-parameters' name='ReproductionThreshold' value='102'/> </p>" +

                        "<p>Grass energy</p><p><input class='world-parameters' name='GrassEnergy' value='51'/> </p>" +
                        "<p>High growth chance</p><p><input class='world-parameters' name='HighGrowthChance' value='77'/> </p>" +
                        "<p>Low growth chance</p><p><input class='world-parameters' name='LowGrowthChance' value='30'/> </p>" +
                        "<p>Max grass height</p><p><input class='world-parameters' name='MaxGrassHeight' value='10'/> </p>" +
                        "<p>Low high threshold</p><p><input class='world-parameters' name='LowHighThreshold' value='5'/> </p>" +
                        "<p>Move probability</p><p><input class='world-parameters' name='MoveProbability' value='0.01'/> </p>" +

                        "",
                conclusion: "Well done.",
                setup: function() {
                },
                setupParameters: function() {
                    $( "#initialCowsSlider" ).slider({
                        value: 20,
                        min: 0,
                        max: 100,
                        step: 1,
                        slide: function( event, ui ) {
                            $( "#initialCows" ).val( ui.value );
                        }
                    });
                },
                handleParameters: function () {
                    var world = this;
                    var initialCows = parseInt(FiercePlanet.Parameters.InitialCows)
                        , strideLength = parseFloat(FiercePlanet.Parameters.StrideLength)
                        , cooperativeProbability = parseFloat(FiercePlanet.Parameters.CooperativeProbability)
                        , metabolism = parseInt(FiercePlanet.Parameters.Metabolism)
                        , reproductionCost = parseInt(FiercePlanet.Parameters.ReproductionCost)
                        , reproductionThreshold = parseInt(FiercePlanet.Parameters.ReproductionThreshold)
                        , grassEnergy = parseInt(FiercePlanet.Parameters.GrassEnergy)
                        , highGrowthChance = parseInt(FiercePlanet.Parameters.HighGrowthChance)
                        , lowGrowthChance = parseInt(FiercePlanet.Parameters.LowGrowthChance)
                        , maxGrassHeight = parseInt(FiercePlanet.Parameters.MaxGrassHeight)
                        , lowHighThreshold = parseInt(FiercePlanet.Parameters.LowHighThreshold)
                    /// Set up agents
                    var culture = _.clone(DefaultCultures.Stickman);
                    culture.waveNumber = initialCows;
                    culture.initialSpeed = 1;
                    world.cells.forEach(function(cell) {
                        cell.terrain = new Terrain('#090', 0.5);
                        cell.grass = maxGrassHeight;
                    })
                    culture.initFunction = function(agent, world) {
                        agent.energy = metabolism * 4;
                        var r = Math.random();
                        if (r < cooperativeProbability) {
                            agent.breed = 'cooperative';
                            agent.color = 'f00';
                        }
                        else {
                            agent.breed = 'greedy';
                            agent.color = '00f';
                        }
                    };
                    /*
                    */
                    culture.updateFunction = function(agent, world) {};
                    this.randomiseAgents = true;
                    this.cultures = [culture];
                    this.waves = undefined;
                    this.initialiseWaves(1);
                    FiercePlanet.Drawing.drawPath();
                },
                tickFunction: function () {
                    var world = this;
                    var counter = 0;

                    var initialCows = parseInt(FiercePlanet.Parameters.InitialCows)
                        , strideLength = parseFloat(FiercePlanet.Parameters.StrideLength)
                        , cooperativeProbability = parseFloat(FiercePlanet.Parameters.CooperativeProbability)
                        , metabolism = parseInt(FiercePlanet.Parameters.Metabolism)
                        , reproductionCost = parseInt(FiercePlanet.Parameters.ReproductionCost)
                        , reproductionThreshold = parseInt(FiercePlanet.Parameters.ReproductionThreshold)
                        , grassEnergy = parseInt(FiercePlanet.Parameters.GrassEnergy)
                        , highGrowthChance = parseInt(FiercePlanet.Parameters.HighGrowthChance)
                        , lowGrowthChance = parseInt(FiercePlanet.Parameters.LowGrowthChance)
                        , maxGrassHeight = parseInt(FiercePlanet.Parameters.MaxGrassHeight)
                        , lowHighThreshold = parseInt(FiercePlanet.Parameters.LowHighThreshold)
                        , moveProbability = parseFloat(FiercePlanet.Parameters.MoveProbability)

                    var moveCapability = Capabilities.MoveRandomlyCapability, nullifiedAgents = [];
                    var died = 0;
                    // Move
                    world.currentAgents.forEach(function(agent) {
                        var r = Math.random();
                        if (r < moveProbability)
                            moveCapability.exercise(agent, world);
                        agent.energy -= metabolism;
                        if (agent.energy < 0) {
                            agent.die(world);
                            died++;
                        }
                    });
                    // Eat
                    world.currentAgents.forEach(function(agent) {
                        var cell = world.getCell(agent.x, agent.y);
                        if (agent.breed == 'cooperative' && cell.grass > lowHighThreshold) {
                            cell.grass -= 1;
                            agent.energy += grassEnergy;
                        }
                        else if (agent.breed == 'greedy' && cell.grass > 0) {
                            cell.grass -= 1;
                            agent.energy += grassEnergy;
                        }
                    });
                    // Reproduce
                    world.currentAgents.forEach(function(agent) {
                        if (agent.energy > reproductionThreshold) {
                            agent.energy -= reproductionCost;
                            var childAgent = agent.spawn();

                            var childAgent = new Agent(agent.culture, agent.x, agent.y);
                            childAgent.delay = parseInt(Math.random() * childAgent.culture.initialSpeed * 5);
                            childAgent.bornAt = (Lifecycle.worldCounter);
                            childAgent.parents = [agent];
                            childAgent.breed = agent.breed;
                            childAgent.color = agent.color;
                            Lifecycle.currentWorld.currentAgents.push(childAgent);
                            Lifecycle.currentWorld.addAgentToCell(childAgent);
                        }
                    });
                    // Regenerate grass
                    world.cells.forEach(function(cell) {
                        var r = Math.random() * 100;
                        if (cell.grass >= lowHighThreshold) {
                            if (highGrowthChance >= r)
                                cell.grass += 1;
                        }
                        else if (lowGrowthChance >= r)
                            cell.grass += 1;
                        if (cell.grass > maxGrassHeight)
                            cell.grass = maxGrassHeight
                        cell.terrain = new Terrain('#0' + (cell.grass >= 10 ? 'a' : cell.grass) + '0', 0.5);
                    })
                    FiercePlanet.Drawing.clearCanvas('#baseCanvas');
                    FiercePlanet.Drawing.clearCanvas('#resourceCanvas');
                    FiercePlanet.Drawing.drawPath();

                    var coops = _.map(this.currentAgents, function(agent) { return (agent.breed == 'cooperative' ? 1 : 0); }),
                        totalCoops = _.reduce(coops, function(memo, num){ return memo + num; }, 0);
                    var greedy = _.map(this.currentAgents, function(agent) { return (agent.breed == 'greedy' ? 1 : 0); }),
                        totalGreedy = _.reduce(greedy, function(memo, num){ return memo + num; }, 0);
                    console.log(totalCoops, totalGreedy, died, Lifecycle.waveCounter)
                }
            })

        this.segregation  = new World();
        _.extend(this.segregation,
            {
                id: 3,
                name: "Segregation",
                isPresetWorld: true,
                interval: 100,
                cellsAcross: 50,
                cellsDown: 50,
                dontClearCanvas: true,
                scrollingImageVisible: false,
                initialResourceStore: 0,
                playIndefinitely: true,
                noWander: true,
                noSpeedChange: true,
                mapOptions: ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(-33.434969, -70.655254), zoom: 18, tilt: 45}), // Santiago: -33.434969,-70.655254
                parameters:
                    "<p>Number of agents</p>" +
                        "<div>" +
                            "0 <input type='range' min='0' max='3000' class='world-parameters' id='NumAgents' name='NumAgents' value='2000'/> 3000" +
                        "</div>" +
                        "<p>% similar wanted</p><p><input class='world-parameters' name='PercentageSimilarWanted' value='0.30'/> </p>" +

                        "",
                conclusion: "Well done.",
                setup: function() {
                },
                handleParameters: function () {
                    var world = this;
                    var numAgents = parseInt(FiercePlanet.Parameters.NumAgents)
                        , percentageSimilarWanted = parseFloat(FiercePlanet.Parameters.PercentageSimilarWanted)

                    /// Set up agents
                    var culture = _.clone(DefaultCultures.Stickman);
                    culture.waveNumber = numAgents;
                    culture.initialSpeed = 1;
                    world.cells.forEach(function(cell) {
                        cell.terrain = new Terrain('#090', 0.5);
                    })
                    culture.initFunction = function(agent, world) {
                        agent.isHappy = false;
                        agent.similarNearby = 0;
                        agent.otherNearby = 0;
                        agent.totalNearby = 0;
                        agent.color = 'f00';
                    };
                    /*
                     */
                    culture.updateFunction = function(agent, world) {};
                    this.randomiseAgents = true;
                    this.cultures = [culture];
                    this.waves = undefined;
                    world.initialiseWaves(1);
                    for (var i = 0; i < world.currentAgents.length; i++) {
                        var agent = world.currentAgents[i];
                        if (i % 2 == 0)
                            agent.color = 'f00';
                        else
                            agent.color = '0f0';
                    }

                    FiercePlanet.Drawing.drawPath();
                },
                tickFunction: function () {
                    var world = this;
                    var counter = 0;

                    var numAgents = parseInt(FiercePlanet.Parameters.NumAgents)
                        , percentageSimilarWanted = parseFloat(FiercePlanet.Parameters.PercentageSimilarWanted)
                    var capability = Capabilities.MoveRandomlyToFreeCellCapability, nullifiedAgents = [];

                    var allHappy = true;
                    for (var i = 0; i < world.currentAgents.length; i++) {
                        var agent = world.currentAgents[i];
                        if (! agent.isHappy) {
                            allHappy = false;
                            break;
                        }
                    }

                    if (allHappy) {
                        Lifecycle._stopAgents();
                    }

                    // Move unhappy agents
                    world.currentAgents.forEach(function(agent) {
                        if (! agent.isHappy)
                            capability.exercise(agent, world);
                    });

                    // Update agent variables
                    var totalSelfColor = 0, totalTotalColors = 0;
                    world.currentAgents.forEach(function(agent) {
                        var x = agent.x, y = agent.y;
                        var surroundingAgents = world.getAgentsAtDistance(x, y, 1, Distance.CHEBYSHEV_DISTANCE, false);
                        var selfColor = 0, otherColor = 0, totalColor = 0;
                        surroundingAgents.forEach(function(otherAgent) {
                            if (agent.color == otherAgent.color)
                                selfColor++
                            else
                                otherColor++;
                        });
                        totalColor = selfColor + otherColor;
                        agent.isHappy = (selfColor >= (percentageSimilarWanted * totalColor / 100));
                        totalSelfColor += selfColor;
                        totalTotalColors += totalColor;
                    });


                    // Update global variables
                    FiercePlanet.Drawing.clearCanvas('#baseCanvas');
                    FiercePlanet.Drawing.clearCanvas('#resourceCanvas');
                    FiercePlanet.Drawing.drawPath();

                    var percentSimilar = totalSelfColor / totalTotalColors;
                    var unhappy = _.map(this.currentAgents, function(agent) { return (! agent.isHappy ? 1 : 0); }),
                        totalUnhappy = _.reduce(unhappy, function(memo, num){ return memo + num; }, 0);

                    console.log(percentSimilar, totalUnhappy, Lifecycle.waveCounter)
                }
            })

        this.rumorMill  = new World();
        _.extend(this.rumorMill,
            {
                id: 4,
                name: "Rumor Mill",
                isPresetWorld: true,
                interval: 100,
                cellsAcross: 50,
                cellsDown: 50,
                dontClearCanvas: true,
                scrollingImageVisible: false,
                initialResourceStore: 0,
                playIndefinitely: true,
                noWander: false,
                noSpeedChange: true,
                mapOptions: ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(-33.434969, -70.655254), zoom: 18, tilt: 45}), // Santiago: -33.434969,-70.655254
                parameters:
                    "<p>Number of agents</p><p><input class='world-parameters' name='NumAgents' value='2000'/> </p>" +
                        "<p>% similar wanted</p><p><input class='world-parameters' name='PercentageSimilarWanted' value='0.30'/> </p>" +

                        "",
                conclusion: "Well done.",
                setup: function() {
                },
                handleParameters: function () {
                    var world = this;
                    var numAgents = parseInt(FiercePlanet.Parameters.NumAgents)
                        , percentageSimilarWanted = parseFloat(FiercePlanet.Parameters.PercentageSimilarWanted)

                    /// Set up agents
                    var culture = _.clone(DefaultCultures.Stickman);
                    culture.waveNumber = numAgents;
                    culture.initialSpeed = 1;
                    world.cells.forEach(function(cell) {
                        cell.terrain = new Terrain('#090', 0.5);
                        cell.grass = maxGrassHeight;
                    })
                    culture.initFunction = function(agent, world) {
                        agent.isHappy = true;
                        agent.similarNearby = 0;
                        agent.otherNearby = 0;
                        agent.totalNearby = 0;
                        agent.color = 'f00';
                    };
                    /*
                     */
                    culture.updateFunction = function(agent, world) {};
                    this.randomiseAgents = true;
                    this.cultures = [culture];
                    this.waves = undefined;
                    this.initialiseWaves(1);
                    FiercePlanet.Drawing.drawPath();
                },
                tickFunction: function () {
                    var world = this;
                    var counter = 0;

                    var numAgents = parseInt(FiercePlanet.Parameters.NumAgents)
                        , percentageSimilarWanted = parseFloat(FiercePlanet.Parameters.PercentageSimilarWanted)

                    var capability = Capabilities.MoveRandomlyCapability, nullifiedAgents = [];
                    var died = 0;
                    // Move
                    world.currentAgents.forEach(function(agent) {
                        var r = Math.random();
                        if (r < moveProbability) {
                            capability.exercise(agent, world);
                        }
                        agent.energy -= metabolism;
                        if (agent.energy < 0) {
                            agent.die(world);
                            died++;
                        }
                    });
                    // Eat
                    world.currentAgents.forEach(function(agent) {
                        var cell = world.getCell(agent.x, agent.y);
                        if (agent.breed == 'cooperative' && cell.grass > lowHighThreshold) {
                            cell.grass -= 1;
                            agent.energy += grassEnergy;
                        }
                        else if (agent.breed == 'greedy' && cell.grass > 0) {
                            cell.grass -= 1;
                            agent.energy += grassEnergy;
                        }
                    });
                    // Reproduce
                    world.currentAgents.forEach(function(agent) {
                        if (agent.energy > reproductionThreshold) {
                            agent.energy -= reproductionCost;
                            var childAgent = new Agent(agent.culture, agent.x, agent.y);
                            childAgent.delay = parseInt(Math.random() * childAgent.culture.initialSpeed * 5);
                            childAgent.bornAt = (Lifecycle.worldCounter);
                            childAgent.parents = [agent];
                            childAgent.breed = agent.breed;
                            childAgent.color = agent.color;
                            Lifecycle.currentWorld.currentAgents.push(childAgent);
                            Lifecycle.currentWorld.addAgentToCell(childAgent);
                        }
                    });
                    // Regenerate grass
                    world.cells.forEach(function(cell) {
                        var r = Math.random() * 100;
                        if (cell.grass >= lowHighThreshold) {
                            if (highGrowthChance >= r)
                                cell.grass += 1;
                        }
                        else if (lowGrowthChance >= r)
                            cell.grass += 1;
                        if (cell.grass > maxGrassHeight)
                            cell.grass = maxGrassHeight
                        cell.terrain = new Terrain('#0' + (cell.grass >= 10 ? 'a' : cell.grass) + '0', 0.5);
                    })
                    FiercePlanet.Drawing.clearCanvas('#baseCanvas');
                    FiercePlanet.Drawing.clearCanvas('#resourceCanvas');
                    FiercePlanet.Drawing.drawPath();

                    var coops = _.map(this.currentAgents, function(agent) { return (agent.breed == 'cooperative' ? 1 : 0); }),
                        totalCoops = _.reduce(coops, function(memo, num){ return memo + num; }, 0);
                    var greedy = _.map(this.currentAgents, function(agent) { return (agent.breed == 'greedy' ? 1 : 0); }),
                        totalGreedy = _.reduce(greedy, function(memo, num){ return memo + num; }, 0);
                    console.log(totalCoops, totalGreedy, died, Lifecycle.waveCounter)
                }
            })

        this.rebellion  = new World();
        _.extend(this.rebellion,
            {
                id: 5,
                name: "Rebellion",
                isPresetWorld: true,
                interval: 100,
                cellsAcross: 50,
                cellsDown: 50,
                dontClearCanvas: true,
                scrollingImageVisible: false,
                initialResourceStore: 0,
                playIndefinitely: true,
                noWander: false,
                noSpeedChange: true,
                mapOptions: ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(-33.434969, -70.655254), zoom: 18, tilt: 45}), // Santiago: -33.434969,-70.655254
                parameters:
                    "<p>Number of agents</p><p><input class='world-parameters' name='NumAgents' value='2000'/> </p>" +
                        "<p>% similar wanted</p><p><input class='world-parameters' name='PercentageSimilarWanted' value='0.30'/> </p>" +

                        "",
                conclusion: "Well done.",
                setup: function() {
                },
                handleParameters: function () {
                    var world = this;
                    var numAgents = parseInt(FiercePlanet.Parameters.NumAgents)
                        , percentageSimilarWanted = parseFloat(FiercePlanet.Parameters.PercentageSimilarWanted)

                    /// Set up agents
                    var culture = _.clone(DefaultCultures.Stickman);
                    culture.waveNumber = numAgents;
                    culture.initialSpeed = 1;
                    world.cells.forEach(function(cell) {
                        cell.terrain = new Terrain('#090', 0.5);
                        cell.grass = maxGrassHeight;
                    })
                    culture.initFunction = function(agent, world) {
                        agent.isHappy = true;
                        agent.similarNearby = 0;
                        agent.otherNearby = 0;
                        agent.totalNearby = 0;
                        agent.color = 'f00';
                    };
                    /*
                     */
                    culture.updateFunction = function(agent, world) {};
                    this.randomiseAgents = true;
                    this.cultures = [culture];
                    this.waves = undefined;
                    this.initialiseWaves(1);
                    FiercePlanet.Drawing.drawPath();
                },
                tickFunction: function () {
                    var world = this;
                    var counter = 0;

                    var numAgents = parseInt(FiercePlanet.Parameters.NumAgents)
                        , percentageSimilarWanted = parseFloat(FiercePlanet.Parameters.PercentageSimilarWanted)

                    var capability = Capabilities.MoveRandomlyCapability, nullifiedAgents = [];
                    var died = 0;
                    // Move
                    world.currentAgents.forEach(function(agent) {
                        var r = Math.random();
                        if (r < moveProbability) {
                            capability.exercise(agent, world);
                        }
                        agent.energy -= metabolism;
                        if (agent.energy < 0) {
                            agent.die(world);
                            died++;
                        }
                    });
                    // Eat
                    world.currentAgents.forEach(function(agent) {
                        var cell = world.getCell(agent.x, agent.y);
                        if (agent.breed == 'cooperative' && cell.grass > lowHighThreshold) {
                            cell.grass -= 1;
                            agent.energy += grassEnergy;
                        }
                        else if (agent.breed == 'greedy' && cell.grass > 0) {
                            cell.grass -= 1;
                            agent.energy += grassEnergy;
                        }
                    });
                    // Reproduce
                    world.currentAgents.forEach(function(agent) {
                        if (agent.energy > reproductionThreshold) {
                            agent.energy -= reproductionCost;
                            var childAgent = new Agent(agent.culture, agent.x, agent.y);
                            childAgent.delay = parseInt(Math.random() * childAgent.culture.initialSpeed * 5);
                            childAgent.bornAt = (Lifecycle.worldCounter);
                            childAgent.parents = [agent];
                            childAgent.breed = agent.breed;
                            childAgent.color = agent.color;
                            Lifecycle.currentWorld.currentAgents.push(childAgent);
                            Lifecycle.currentWorld.addAgentToCell(childAgent);
                        }
                    });
                    // Regenerate grass
                    world.cells.forEach(function(cell) {
                        var r = Math.random() * 100;
                        if (cell.grass >= lowHighThreshold) {
                            if (highGrowthChance >= r)
                                cell.grass += 1;
                        }
                        else if (lowGrowthChance >= r)
                            cell.grass += 1;
                        if (cell.grass > maxGrassHeight)
                            cell.grass = maxGrassHeight
                        cell.terrain = new Terrain('#0' + (cell.grass >= 10 ? 'a' : cell.grass) + '0', 0.5);
                    })
                    FiercePlanet.Drawing.clearCanvas('#baseCanvas');
                    FiercePlanet.Drawing.clearCanvas('#resourceCanvas');
                    FiercePlanet.Drawing.drawPath();

                    var coops = _.map(this.currentAgents, function(agent) { return (agent.breed == 'cooperative' ? 1 : 0); }),
                        totalCoops = _.reduce(coops, function(memo, num){ return memo + num; }, 0);
                    var greedy = _.map(this.currentAgents, function(agent) { return (agent.breed == 'greedy' ? 1 : 0); }),
                        totalGreedy = _.reduce(greedy, function(memo, num){ return memo + num; }, 0);
                    console.log(totalCoops, totalGreedy, died, Lifecycle.waveCounter)
                }
            })

        this.ethnocentrism  = new World();
        _.extend(this.ethnocentrism,
            {
                id: 6,
                name: "Ethnocentrism",
                isPresetWorld: true,
                interval: 100,
                cellsAcross: 50,
                cellsDown: 50,
                dontClearCanvas: true,
                scrollingImageVisible: false,
                initialResourceStore: 0,
                playIndefinitely: true,
                noWander: false,
                noSpeedChange: true,
                mapOptions: ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(-33.434969, -70.655254), zoom: 18, tilt: 45}), // Santiago: -33.434969,-70.655254
                parameters:
                    "<p>Number of agents</p><p><input class='world-parameters' name='NumAgents' value='2000'/> </p>" +
                        "<p>% similar wanted</p><p><input class='world-parameters' name='PercentageSimilarWanted' value='0.30'/> </p>" +

                        "",
                conclusion: "Well done.",
                setup: function() {
                },
                handleParameters: function () {
                    var world = this;
                    var numAgents = parseInt(FiercePlanet.Parameters.NumAgents)
                        , percentageSimilarWanted = parseFloat(FiercePlanet.Parameters.PercentageSimilarWanted)

                    /// Set up agents
                    var culture = _.clone(DefaultCultures.Stickman);
                    culture.waveNumber = numAgents;
                    culture.initialSpeed = 1;
                    world.cells.forEach(function(cell) {
                        cell.terrain = new Terrain('#090', 0.5);
                        cell.grass = maxGrassHeight;
                    })
                    culture.initFunction = function(agent, world) {
                        agent.isHappy = true;
                        agent.similarNearby = 0;
                        agent.otherNearby = 0;
                        agent.totalNearby = 0;
                        agent.color = 'f00';
                    };
                    /*
                     */
                    culture.updateFunction = function(agent, world) {};
                    this.randomiseAgents = true;
                    this.cultures = [culture];
                    this.waves = undefined;
                    this.initialiseWaves(1);
                    FiercePlanet.Drawing.drawPath();
                },
                tickFunction: function () {
                    var world = this;
                    var counter = 0;

                    var numAgents = parseInt(FiercePlanet.Parameters.NumAgents)
                        , percentageSimilarWanted = parseFloat(FiercePlanet.Parameters.PercentageSimilarWanted)

                    var capability = Capabilities.MoveRandomlyCapability, nullifiedAgents = [];
                    var died = 0;
                    // Move
                    world.currentAgents.forEach(function(agent) {
                        var r = Math.random();
                        if (r < moveProbability) {
                            capability.exercise(agent, world);
                        }
                        agent.energy -= metabolism;
                        if (agent.energy < 0) {
                            agent.die(world);
                            died++;
                        }
                    });
                    // Eat
                    world.currentAgents.forEach(function(agent) {
                        var cell = world.getCell(agent.x, agent.y);
                        if (agent.breed == 'cooperative' && cell.grass > lowHighThreshold) {
                            cell.grass -= 1;
                            agent.energy += grassEnergy;
                        }
                        else if (agent.breed == 'greedy' && cell.grass > 0) {
                            cell.grass -= 1;
                            agent.energy += grassEnergy;
                        }
                    });
                    // Reproduce
                    world.currentAgents.forEach(function(agent) {
                        if (agent.energy > reproductionThreshold) {
                            agent.energy -= reproductionCost;
                            var childAgent = new Agent(agent.culture, agent.x, agent.y);
                            childAgent.delay = parseInt(Math.random() * childAgent.culture.initialSpeed * 5);
                            childAgent.bornAt = (Lifecycle.worldCounter);
                            childAgent.parents = [agent];
                            childAgent.breed = agent.breed;
                            childAgent.color = agent.color;
                            Lifecycle.currentWorld.currentAgents.push(childAgent);
                            Lifecycle.currentWorld.addAgentToCell(childAgent);
                        }
                    });
                    // Regenerate grass
                    world.cells.forEach(function(cell) {
                        var r = Math.random() * 100;
                        if (cell.grass >= lowHighThreshold) {
                            if (highGrowthChance >= r)
                                cell.grass += 1;
                        }
                        else if (lowGrowthChance >= r)
                            cell.grass += 1;
                        if (cell.grass > maxGrassHeight)
                            cell.grass = maxGrassHeight
                        cell.terrain = new Terrain('#0' + (cell.grass >= 10 ? 'a' : cell.grass) + '0', 0.5);
                    })
                    FiercePlanet.Drawing.clearCanvas('#baseCanvas');
                    FiercePlanet.Drawing.clearCanvas('#resourceCanvas');
                    FiercePlanet.Drawing.drawPath();

                    var coops = _.map(this.currentAgents, function(agent) { return (agent.breed == 'cooperative' ? 1 : 0); }),
                        totalCoops = _.reduce(coops, function(memo, num){ return memo + num; }, 0);
                    var greedy = _.map(this.currentAgents, function(agent) { return (agent.breed == 'greedy' ? 1 : 0); }),
                        totalGreedy = _.reduce(greedy, function(memo, num){ return memo + num; }, 0);
                    console.log(totalCoops, totalGreedy, died, Lifecycle.waveCounter)
                }
            })

        this.voting  = new World();
        _.extend(this.voting,
            {
                id: 7,
                name: "Voting",
                isPresetWorld: true,
                interval: 100,
                cellsAcross: 50,
                cellsDown: 50,
                dontClearCanvas: true,
                scrollingImageVisible: false,
                initialResourceStore: 0,
                playIndefinitely: true,
                noWander: false,
                noSpeedChange: true,
                mapOptions: ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(-33.434969, -70.655254), zoom: 18, tilt: 45}), // Santiago: -33.434969,-70.655254
                parameters:
                    "<p>Number of agents</p><p><input class='world-parameters' name='NumAgents' value='2000'/> </p>" +
                        "<p>% similar wanted</p><p><input class='world-parameters' name='PercentageSimilarWanted' value='0.30'/> </p>" +

                        "",
                conclusion: "Well done.",
                setup: function() {
                },
                handleParameters: function () {
                    var world = this;
                    var numAgents = parseInt(FiercePlanet.Parameters.NumAgents)
                        , percentageSimilarWanted = parseFloat(FiercePlanet.Parameters.PercentageSimilarWanted)

                    /// Set up agents
                    var culture = _.clone(DefaultCultures.Stickman);
                    culture.waveNumber = numAgents;
                    culture.initialSpeed = 1;
                    world.cells.forEach(function(cell) {
                        cell.terrain = new Terrain('#090', 0.5);
                        cell.grass = maxGrassHeight;
                    })
                    culture.initFunction = function(agent, world) {
                        agent.isHappy = true;
                        agent.similarNearby = 0;
                        agent.otherNearby = 0;
                        agent.totalNearby = 0;
                        agent.color = 'f00';
                    };
                    /*
                     */
                    culture.updateFunction = function(agent, world) {};
                    this.randomiseAgents = true;
                    this.cultures = [culture];
                    this.waves = undefined;
                    this.initialiseWaves(1);
                    FiercePlanet.Drawing.drawPath();
                },
                tickFunction: function () {
                    var world = this;
                    var counter = 0;

                    var numAgents = parseInt(FiercePlanet.Parameters.NumAgents)
                        , percentageSimilarWanted = parseFloat(FiercePlanet.Parameters.PercentageSimilarWanted)

                    var capability = Capabilities.MoveRandomlyCapability, nullifiedAgents = [];
                    var died = 0;
                    // Move
                    world.currentAgents.forEach(function(agent) {
                        var r = Math.random();
                        if (r < moveProbability) {
                            capability.exercise(agent, world);
                        }
                        agent.energy -= metabolism;
                        if (agent.energy < 0) {
                            agent.die(world);
                            died++;
                        }
                    });
                    // Eat
                    world.currentAgents.forEach(function(agent) {
                        var cell = world.getCell(agent.x, agent.y);
                        if (agent.breed == 'cooperative' && cell.grass > lowHighThreshold) {
                            cell.grass -= 1;
                            agent.energy += grassEnergy;
                        }
                        else if (agent.breed == 'greedy' && cell.grass > 0) {
                            cell.grass -= 1;
                            agent.energy += grassEnergy;
                        }
                    });
                    // Reproduce
                    world.currentAgents.forEach(function(agent) {
                        if (agent.energy > reproductionThreshold) {
                            agent.energy -= reproductionCost;
                            var childAgent = new Agent(agent.culture, agent.x, agent.y);
                            childAgent.delay = parseInt(Math.random() * childAgent.culture.initialSpeed * 5);
                            childAgent.bornAt = (Lifecycle.worldCounter);
                            childAgent.parents = [agent];
                            childAgent.breed = agent.breed;
                            childAgent.color = agent.color;
                            Lifecycle.currentWorld.currentAgents.push(childAgent);
                            Lifecycle.currentWorld.addAgentToCell(childAgent);
                        }
                    });
                    // Regenerate grass
                    world.cells.forEach(function(cell) {
                        var r = Math.random() * 100;
                        if (cell.grass >= lowHighThreshold) {
                            if (highGrowthChance >= r)
                                cell.grass += 1;
                        }
                        else if (lowGrowthChance >= r)
                            cell.grass += 1;
                        if (cell.grass > maxGrassHeight)
                            cell.grass = maxGrassHeight
                        cell.terrain = new Terrain('#0' + (cell.grass >= 10 ? 'a' : cell.grass) + '0', 0.5);
                    })
                    FiercePlanet.Drawing.clearCanvas('#baseCanvas');
                    FiercePlanet.Drawing.clearCanvas('#resourceCanvas');
                    FiercePlanet.Drawing.drawPath();

                    var coops = _.map(this.currentAgents, function(agent) { return (agent.breed == 'cooperative' ? 1 : 0); }),
                        totalCoops = _.reduce(coops, function(memo, num){ return memo + num; }, 0);
                    var greedy = _.map(this.currentAgents, function(agent) { return (agent.breed == 'greedy' ? 1 : 0); }),
                        totalGreedy = _.reduce(greedy, function(memo, num){ return memo + num; }, 0);
                    console.log(totalCoops, totalGreedy, died, Lifecycle.waveCounter)
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
            this.segregation,
            this.rumorMill,
            this.rebellion,
            this.ethnocentrism,
            this.voting,
            this.diffusionLimitedAggregationWorld
        ];
    }

    this.initWVWorlds();
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

