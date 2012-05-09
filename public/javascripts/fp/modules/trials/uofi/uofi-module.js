/*!
 * Fierce Planet
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var UofIWorlds = UofIWorlds || new Campaign();
var UofIModule = UofIModule || {};
var UofIResources = UofIResources || {};


/*!
 * Fierce Planet - ResourceKinds
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


/**
 * Declare the ResourceTypes namespace
 */
UofIResources.id = 'UofIResources';



/**
 * Do setup of this resource set
 */
UofIResources.doSetup = function() {
    // Resource categories
    UofIResources.ECO_CATEGORY = new ResourceCategory("Economic", "eco", "#44ABE0");
    UofIResources.ENV_CATEGORY = new ResourceCategory("Environmental", "env", "#ABBB2A");
    UofIResources.POL_CATEGORY = new ResourceCategory("Political", "pol", "#DE1F2A");
    UofIResources.CUL_CATEGORY = new ResourceCategory("Cultural", "cul", "#2ADBCB");

    // Arrays of resource kinds
    UofIResources.ECONOMIC_RESOURCE_TYPES = [ResourceTypes.STOCKMARKET_RESOURCE_TYPE];
    UofIResources.ENVIRONMENTAL_RESOURCE_TYPES = [ResourceTypes.WASTE_RESOURCE_TYPE];
    UofIResources.POLITICAL_RESOURCE_TYPES = [ResourceTypes.DEMOCRACY_RESOURCE_TYPE];
    UofIResources.CULTURAL_RESOURCE_TYPES = [ResourceTypes.SCHOOL_RESOURCE_TYPE];

    // Clear types
    UofIResources.ECO_CATEGORY.clearTypes();
    UofIResources.ENV_CATEGORY.clearTypes();
    UofIResources.POL_CATEGORY.clearTypes();
    UofIResources.CUL_CATEGORY.clearTypes();

    UofIResources.ECO_CATEGORY.addType(ResourceTypes.STOCKMARKET_RESOURCE_TYPE);
    UofIResources.ENV_CATEGORY.addType(ResourceTypes.WASTE_RESOURCE_TYPE);
    UofIResources.POL_CATEGORY.addType(ResourceTypes.DEMOCRACY_RESOURCE_TYPE);
    UofIResources.CUL_CATEGORY.addType(ResourceTypes.SCHOOL_RESOURCE_TYPE);

    UofIResources.categories = [UofIResources.ECO_CATEGORY, UofIResources.ENV_CATEGORY, UofIResources.POL_CATEGORY, UofIResources.CUL_CATEGORY];
    UofIResources.types =
        _.union(
            UofIResources.ECONOMIC_RESOURCE_TYPES
            , UofIResources.ENVIRONMENTAL_RESOURCE_TYPES
            , UofIResources.POLITICAL_RESOURCE_TYPES
            , UofIResources.CULTURAL_RESOURCE_TYPES
        )
};



(function () {

    this.initWorlds = function () {

        this.wasteInSurabaya  = new World();
        _.extend(this.wasteInSurabaya,
            {
                id: 1,
                name: "Waste in Surabaya",
                introduction: 
                    "<p>This model explores waste management in Surabaya.</p>" +
                    "<p>Using the default settings, residents of the area shown pollute available fresh water with waste.</p>" +
                    "<p>This causes pathogenic bacteria (such as E. coli) to proliferate, impacting upon the health of residents.</p>" +
                    "<p>By introducing waste disposal mechanisms, the residents can reduce the rate of infectious disease, and improve both morbidity and mortality rates.</p>" +
                    "<p>There are a number of parameters that control how this simulation works:" +
                        "<ul>" +
                        "<li><em>Initial agents: </em> Number of agents to 'seed' the simulation</li>" +
                        "<li><em>Rate of personal waste emission: </em> How much waste each person contributes (in grams/day)</li>" +
                        "<li><em>No. of waste disposal units: </em> Number of waste disposal 'units' (latrines, collection sites, etc.) to include in the area. </li>" +
                        "<li><em>Proximity to waste disposal unit: </em> How close an agent needs to be to a unit to make use of it (the assumption here is that units will not be used if they are too far away). </li>" +
                        "<li><em>Natural rate of water improvement: </em> How quickly the water supply improves in quality per turn, with no human activity. Water quality is ranged from 0-100.</li>" +
                        "<li><em>Health cost of infection: </em> How much health is lost to infection per turn. Health is ranged from 0-100.</li>" +
                        "<li><em>Water quality: </em> Inital water quality.</li>" +
                        "<li><em>Reproduction probability: </em> The likelihood a female will reproduce in the model.</li>" +
                        "</ul>" +
                        "</p>" +
                        ""
                ,

                isPresetWorld: true,
                interval: 100,
                cellsAcross: 40,
                cellsDown: 40,
                dontClearCanvas: true,
                scrollingImageVisible: false,
                initialResourceStore: 1000,
                playIndefinitely: true,
                noWander: false,
                noSpeedChange: true,
                allowResourcesOnPath: true,
                mapOptions: ({
                    mapTypeId: google.maps.MapTypeId.HYBRID,
                    center: new google.maps.LatLng(-7.3075, 112.7952),
                    zoom: 20,
                    tilt: 0
                }),
                parameters:
                    "<p>Initial agents</p>" +
                        "0 <div id='initialAgentsSlider' /> 200" +
                        "<input type='hidden' id='initialAgents' class='world-parameters' name='InitialAgents' value='100'/>" +
                        "<p>Rate of personal waste emission</p><p><input class='world-parameters' name='RateOfWasteEmission' value='250'/> </p>" +
                        "<p>No. of waste disposal units</p><p><input class='world-parameters' name='NumWasteDisposalUnits' value='10'/> </p>" +
                        "<p>Proximity to waste disposal unit</p><p><input class='world-parameters' name='ProximityToDisposalUnit' value='1'/> </p>" +
                        "<p>Natural rate of water improvement</p><p><input class='world-parameters' name='NaturalRateOfImprovement' value='1'/> </p>" +
                        "<p>Health cost of infection</p><p><input class='world-parameters' name='HealthCostOfInfection' value='1'/> </p>" +
//                        "<p>Water consumed</p><p><input class='world-parameters' name='WaterConsumed' value='1000'/> </p>" +
                        "<p>Quality of water</p><p><input class='world-parameters' name='WaterQuality' value='100'/> </p>" +
                        "<p>Reproduction probability</p><p><input class='world-parameters' name='ReproductionProbability' value='0.5'/> </p>" +

                        "",
                conclusion: "Well done.",
                setup: function() {
                },
                setupParameters: function() {
                    $( "#initialAgentsSlider" ).slider({
                        value: 100, min: 0, max: 200, step: 1,
                        slide: function( event, ui ) { $("#initialAgents").val( ui.value ); }
                    });
                    FiercePlanet.Graph.openDialog();
                    $("#world-graph").show();
                    FiercePlanet.Graph.setupData(
                        {label: 'Water', color: '#f00', maxValue: 100}
                        , {label: 'Health', color: '#0f0', maxValue: 100}
                        , {label: 'Mortality', color: '#00f', maxValue: 100}
                    );
                },
                handleParameters: function () {
                    var world = this;
                    var initialAgents = parseInt(FiercePlanet.Parameters.InitialAgents)
                        , rateOfWasteEmission = parseInt(FiercePlanet.Parameters.RateOfWasteEmission)
                        , numWasteDisposalUnits = parseInt(FiercePlanet.Parameters.NumWasteDisposalUnits)
                        , proximityToDisposalUnit = parseInt(FiercePlanet.Parameters.ProximityToDisposalUnit)
                        , waterConsumed = parseInt(FiercePlanet.Parameters.WaterConsumed)
                        , waterQuality = parseInt(FiercePlanet.Parameters.WaterQuality)
                        , naturalRateOfImprovement = parseInt(FiercePlanet.Parameters.NaturalRateOfImprovement)
                        , infectionProbability = parseFloat(FiercePlanet.Parameters.InfectionProbability)
                        , healthCostOfInfection = parseInt(FiercePlanet.Parameters.HealthCostOfInfection)
                        , reproductionProbability = parseFloat(FiercePlanet.Parameters.ReproductionProbability)

                    /// Set up agents
                    var culture = _.clone(DefaultCultures.Stickman);
                    culture.waveNumber = initialAgents;
                    culture.initialSpeed = 5;
                    culture.moveCost = 0;
                    culture.healthCategories = ModuleManager.currentModule.resourceSet.categories;
                    world.cells.forEach(function(cell) {
                        if (cell.y > 23 && cell.y < 33) {
                            cell.terrain = new Terrain(one.color('#00a').alpha(.6));
                            cell.waterQuality = waterQuality;
                            cell.resourcesAllowed = false;
                            cell.agentsAllowed = false;
                        }
                        else
                            cell.resourcesAllowed = true;
                    })
                    culture.initFunction = function(agent, world) {
                        agent.infected = false;
                        agent.generalHealth = 100;
                        agent.color = '#f00';
                        agent.age = Math.floor(Math.random() * 100);
                        agent.gender = (Math.random() < .5 ? 'm' : 'f');
                        agent.childCount = 0;
                    };

                    for (var i = 0; i < numWasteDisposalUnits; i++) {
                        world.addResourceRandomly(ResourceTypes.WASTE_RESOURCE_TYPE);
                    }
                    this.currentWaterQuality = waterQuality;
                    this.children = 0;

                    culture.drawExpired = function(){};
//                    culture.updateFunction = function(agent, world) {};
                    this.randomiseAgents = true;
                    this.cultures = [culture];
                    this.waves = undefined;
                    this.initialiseWaves(1);
                    FiercePlanet.Drawing.drawPath();
                },
                tickFunction: function () {
                    var world = this;
                    var counter = 0;

                    var initialAgents = parseInt(FiercePlanet.Parameters.InitialAgents)
                        , rateOfWasteEmission = parseInt(FiercePlanet.Parameters.RateOfWasteEmission)
                        , numWasteDisposalUnits = parseInt(FiercePlanet.Parameters.NumWasteDisposalUnits)
                        , proximityToDisposalUnit = parseInt(FiercePlanet.Parameters.ProximityToDisposalUnit)
                        , waterQuality = parseInt(FiercePlanet.Parameters.WaterQuality)
                        , naturalRateOfImprovement = parseInt(FiercePlanet.Parameters.NaturalRateOfImprovement)
                        , infectionProbability = parseFloat(FiercePlanet.Parameters.InfectionProbability)
                        , healthCostOfInfection = parseInt(FiercePlanet.Parameters.HealthCostOfInfection)
                        , reproductionProbability = parseInt(FiercePlanet.Parameters.ReproductionProbability)

                    var moveCapability = Capabilities.MoveRandomlyCapability, nullifiedAgents = [];
                    var died = 0;

                        // Adjust water quality
                    var totalWaste = world.currentAgents.length * rateOfWasteEmission / 10000;
                    var totalWasteDisposed = 0;
                    world.currentAgents.forEach(function(agent) {
                        var resources = world.getResourcesAtDistance(agent.x, agent.y, proximityToDisposalUnit, 0, true);
                        if (resources.length > 0)
                            totalWasteDisposed += rateOfWasteEmission / 10000;
                    });
                    var currentWaterQuality = world.currentWaterQuality;
                    currentWaterQuality -= (totalWaste - totalWasteDisposed);
                    currentWaterQuality += naturalRateOfImprovement;
                    currentWaterQuality = (currentWaterQuality > 100 ? 100 : (currentWaterQuality < 0 ? 0 : currentWaterQuality));
                    this.currentWaterQuality = currentWaterQuality;

                    // Change the water quality
                    world.cells.forEach(function(cell) {
                        if (cell.y > 23 && cell.y < 33) {
                            cell.terrain.color = cell.terrain.color.blue(currentWaterQuality / 100);
                        }
                    })

                    // Move agents
                    world.currentAgents.forEach(function(agent) {
                        if (Lifecycle.waveCounter >= agent.delay && agent.countdownToMove % agent.speed == 0)
                            moveCapability.exercise(agent, world);
                    });
                    // Adjust health
                    world.currentAgents.forEach(function(agent) {
                        var r = Math.random() * 100;
                        if (r > world.currentWaterQuality)    {
                            agent.infected = true;
                        }
                    });
                    world.currentAgents.forEach(function(agent) {
                        if (agent.infected) {
                            // Infection-driven health decline
                            agent.adjustGeneralHealth(-healthCostOfInfection - 1);
                        }
                        else {
                            // Naturally aging
                            agent.adjustGeneralHealth(-1);
                        }
                        agent.color = one.color(agent.color).red(agent.health / 100).hex();
                    });
                    // Die
                    world.currentAgents.forEach(function(agent) {
                        if (agent.health < 0)
                            agent.die(world);
                    });

                    // Reproduce
                    if (world.currentAgents.length < 400) {
                        world.currentAgents.forEach(function(agent) {
                            if (agent.gender == 'f' && agent.age >= 15 && agent.age <= 45) {
                                var r = Math.random();
                                // Diminishing likelihood of children
                                if (r < Math.pow(reproductionProbability,  agent.childCount)) {
                                    var child = agent.spawn();
                                    child.infected = false;
                                    child.generalHealth = 100;
                                    child.color = '#f00';
                                    child.gender = (Math.random() < .5 ? 'm' : 'f');
                                    child.childCount = 0;
                                    world.children ++;
                                }
                            }
                        });
                    }
                    FiercePlanet.Drawing.clearCanvas('#baseCanvas');
                    FiercePlanet.Drawing.clearCanvas('#resourceCanvas');
                    FiercePlanet.Drawing.drawPath();

                    var health = _.map(this.currentAgents, function(agent) { return agent.health ; }),
                        totalHealth = _.reduce(health, function(memo, num){ return memo + num; }, 0);
                    var infected = _.map(this.currentAgents, function(agent) { return (agent.infected ? 1 : 0); }),
                        totalInfected = _.reduce(infected, function(memo, num){ return memo + num; }, 0);
                    var ageAtDeath = _.map(this.expiredAgents, function(agent) { return agent.diedAt - agent.bornAt; }),
                        totalAgeAtDeath = _.reduce(health, function(memo, num){ return memo + num; }, 0);
                    console.log(totalInfected, world.currentAgents.length, world.children, Lifecycle.waveCounter)
                    FiercePlanet.Graph.plotData(world.currentWaterQuality, totalHealth / initialAgents, totalInfected * 100 / initialAgents);
//                    if (world.currentAgents.length <= 0)
//                        Lifecycle._stopAgents();
                }
            })

        this.pegirianVillage  = new World();
        _.extend(this.pegirianVillage,
            {
                id: 2,
                name: "Pegirian Village",
                introduction:
                    "<p>This model examines impacts of waste collection on households in the Pegirian Village.</p>" +
                    "<p>If not enough waste is collected, the total amount of waste and pollution increases.</p>" +
                    "<p>In addition, having enough resources in the environment, in a very abstract sense, improves the efficiency of waste collection.</p>" +
                "<p>There are a number of parameters that control how this simulation works:" +
                    "<ul>" +
                    "<li><em>No. of households: </em> Number of households to 'seed' the simulation</li>" +
                    "<li><em>Ave. persons per household: </em> Average number of people per household</li>" +
                    "<li><em>No. of waste collectors: </em> How many waste collectors work in the area. </li>" +
                    "<li><em>Waste removed per collector: </em> Maximum daily waste removed by each collector. </li>" +
                    "<li><em>Daily waste emissions: </em> How much waste is produced per person per day.</li>" +
                    "<li><em>% Composted: </em> What percentage of waste is composted.</li>" +
                    "<li><em>% Recycled: </em> What percentage of waste is recycled.</li>" +
                    "<li><em>Number of resources: </em> How many resources (economic, ecological, political, cultural) to 'seed' in the area.</li>" +
                    "</ul>" +
                    "</p>" +
                    ""
                ,
                isPresetWorld: true,
                interval: 100,
                cellsAcross: 60,
                cellsDown: 60,
                dontClearCanvas: true,
                scrollingImageVisible: false,
                initialResourceStore: 1000,
                playIndefinitely: true,
                noWander: false,
                noSpeedChange: true,
                allowResourcesOnPath: true,
                mapOptions: ({
                    mapTypeId: google.maps.MapTypeId.HYBRID,
                    center: new google.maps.LatLng(
                        -7.228373, 112.755032),
                    zoom: 18,
                    tilt: 0
                }),
                parameters:
                        "<p>Number of households</p>" +
                            "0 <div id='numberOfHouseholdsSlider' /> 3000" +
                            "<input type='hidden' id='numberOfHouseholds' class='world-parameters' name='NumberOfHouseholds' value='1500'/>" +
                        "<p>Ave. Persons/households</p><p><input class='world-parameters' name='AvePersonPerHousehold' value='4'/> </p>" +
                        "<p>No. of waste collectors</p>" +
                            "0 <div id='numberOfWasteCollectorsSlider' /> 200" +
                            "<input type='hidden' id='numberOfWasteCollectors' class='world-parameters' name='NumberOfWasteCollectors' value='40'/>" +

                        "<p>Waste removed per collector (ltrs)</p><p><input class='world-parameters' name='WasteRemovedPerCollector' value='200'/> </p>" +
//                        "<p>Waste collector cost</p><p><input class='world-parameters' name='WasteCollectionCost' value='3000'/> </p>" +
                        "<p>Daily waste emission (lts/cap/day)</p><p><input class='world-parameters' name='DailyWasteEmission' value='2.95'/> </p>" +

                        "<p>% Composted</p><p><input class='world-parameters' name='PercentageComposted' value='10'/> </p>" +
                        "<p>% Recycled</p><p><input class='world-parameters' name='PercentageRecyled' value='10'/> </p>" +

                        "<p>Number of resources</p><p><input class='world-parameters' name='NumberOfResources' value='40'/> </p>" +

                        "",
                conclusion: "Well done.",
                setup: function() {
                },
                setupParameters: function() {
                    $( "#numberOfHouseholdsSlider" ).slider({
                        value: 1500, min: 0, max: 3000, step: 1,
                        slide: function( event, ui ) { $("#numberOfHouseholds").val( ui.value ); }
                    });
                    $( "#numberOfWasteCollectorsSlider" ).slider({
                        value: 40, min: 0, max: 200, step: 1,
                        slide: function( event, ui ) { $("#numberOfWasteCollectors").val( ui.value ); }
                    });
                    FiercePlanet.Graph.openDialog();
                    $("#world-graph").show();
                    FiercePlanet.Graph.setupData(
                        {name: 'Sustainability Index', color: '#f00', maxValue: 1}
                        , {name: 'Pollution level', color: '#0f0', maxValue: 100}
                    );
                },
                handleParameters: function () {
                    var world = this;
                    var numberOfHouseholds = parseInt(FiercePlanet.Parameters.NumberOfHouseholds)
                        , aveRersonPerHouseholdwaterQuality = parseInt(FiercePlanet.Parameters.AvePersonPerHousehold)
                        , numberOfWasteCollectors = parseInt(FiercePlanet.Parameters.NumberOfWasteCollectors)
                        , wasteRemovedPerCollector = parseFloat(FiercePlanet.Parameters.WasteRemovedPerCollector)
                        , wasteCollectionCost = parseInt(FiercePlanet.Parameters.WasteCollectionCost)
                        , dailyWasteEmission = parseFloat(FiercePlanet.Parameters.DailyWasteEmission)
                        , percentageComposted = parseFloat(FiercePlanet.Parameters.PercentageComposted)
                        , percentageRecycled = parseFloat(FiercePlanet.Parameters.PercentageRecyled)
                        , numberOfResources = parseFloat(FiercePlanet.Parameters.NumberOfResources)

                    /// Set up agents
                    var culture = _.clone(DefaultCultures.Stickman);
                    culture.waveNumber = numberOfWasteCollectors;
                    culture.initialSpeed = 5;
                    culture.moveCost = 0;
//                    culture.healthCategories = ModuleManager.currentModule.resourceSet.categories;
                    world.cells.forEach(function(cell) {
                        cell.resourcesAllowed = true;
                    })
                    culture.initFunction = function(agent, world) {
                        agent.infected = false;
                        agent.generalHealth = 100;
                        agent.color = '#f00';
                        agent.age = Math.floor(Math.random() * 100);
                        agent.gender = (Math.random() < .5 ? 'm' : 'f');
                        agent.childCount = 0;
                    };

                    world.totalResidents = 0;
                    for (var i = 0; i < numberOfHouseholds; i++) {
                        var rx = Math.floor(Math.random() * world.cellsAcross), ry = Math.floor(Math.random() * world.cellsDown);
                        var cell = world.getCell(rx, ry);
                        if (cell.isHousehold) {
                            i--;
                            continue;
                        }
                        else {
                            cell.isHousehold = true;
                            var rooftopRed = Math.floor(Math.random() * 100) + 100;
                            cell.terrain = new Terrain(one.color('rgba( ' + rooftopRed + ', 76, 86, 0.5)'));
                            cell.householdSize = jStat.normal.sample(aveRersonPerHouseholdwaterQuality, 0.15);
                            world.totalResidents += cell.householdSize;
                        }
                    }
                    for (var i = 0; i < numberOfResources; i++) {
                        world.addResourceRandomly(ResourceTypes.STOCKMARKET_RESOURCE_TYPE);
                        world.addResourceRandomly(ResourceTypes.WASTE_RESOURCE_TYPE);
                        world.addResourceRandomly(ResourceTypes.DEMOCRACY_RESOURCE_TYPE);
                        world.addResourceRandomly(ResourceTypes.SCHOOL_RESOURCE_TYPE);
                    }

                    culture.drawExpired = function(){};
                    this.randomiseAgents = true;
                    this.cultures = [culture];
                    this.waves = undefined;
                    this.initialiseWaves(1);
                    FiercePlanet.Drawing.drawPath();
                },
                tickFunction: function () {
                    var world = this;
                    var counter = 0;

                    var numberOfHouseholds = parseInt(FiercePlanet.Parameters.NumberOfHouseholds)
                        , aveRersonPerHouseholdwaterQuality = parseInt(FiercePlanet.Parameters.AvePersonPerHousehold)
                        , dailyWasteEmission = parseFloat(FiercePlanet.Parameters.DailyWasteEmission)
                        , numberOfWasteCollectors = parseInt(FiercePlanet.Parameters.NumberOfWasteCollectors)
                        , wasteRemovedPerCollector = parseFloat(FiercePlanet.Parameters.WasteRemovedPerCollector)
                        , wasteCollectionCost = parseInt(FiercePlanet.Parameters.WasteCollectionCost)
                        , percentageComposted = parseFloat(FiercePlanet.Parameters.PercentageComposted)
                        , percentageRecycled = parseFloat(FiercePlanet.Parameters.PercentageRecyled)
                        , numberOfResources = parseFloat(FiercePlanet.Parameters.NumberOfResources)

                    var moveCapability = Capabilities.MoveRandomlyCapability, nullifiedAgents = [];

                    // Count overall resources
                    var sustainabilityIndex = 0;
                    var pol = 0, cul = 0, eco = 0, elo = 0;
                    world.cells.forEach(function(cell) {
                            if (cell.resources.length > 0) {
                            var resource = cell.resources[0];
                            if (resource.category.code == 'cul') {
                                cul++;
                            }
                            else if (resource.category.code == 'pol') {
                                pol++;
                            }
                            else if (resource.category.code == 'eco') {
                                eco++;
                            }
                            else if (resource.category.code == 'elo') {
                                elo++;
                            }
                        }
                    })
                    // Normalise index around a value of 50
                    sustainabilityIndex = (pol * 25 + cul * 25 + eco * 25 + elo * 25) / world.totalResidents;

                    // Generate waste
                    world.cells.forEach(function(cell) {
                        if (cell.isHousehold) {
                            var numPersons = cell.householdSize;
                            var householdWaste = numPersons * dailyWasteEmission;
                            cell.wasteToBeCollected = householdWaste * (1 - (percentageComposted / 100) - (percentageRecycled / 100) );
                        }
                    })

                    // Move agents
                    world.currentAgents.forEach(function(agent) {
                        if (Lifecycle.waveCounter >= agent.delay && agent.countdownToMove % agent.speed == 0)
                            moveCapability.exercise(agent, world);
                        var cellsAtDistince = world.getCellsAtDistance(agent.x, agent.y, 3, Distance.MINKOWSKI_DISTANCE, true);
                        var wasteCollected = 0;
                        var wasteCollectible = wasteRemovedPerCollector * sustainabilityIndex;
                        _.shuffle(cellsAtDistince).forEach(function(cell) {
                            if (cell.isHousehold) {
                                if (wasteCollected + cell.wasteToBeCollected < wasteCollectible) {
                                    wasteCollected += cell.wasteToBeCollected;
                                    cell.wasteToBeCollected = 0;
                                }
                            }
})
                    });
                    var totalWasteRemaining = 0;
                    world.cells.forEach(function(cell) {
                        if (cell.isHousehold) {
                            totalWasteRemaining += cell.wasteToBeCollected;
                            var l = cell.terrain.color.green();
                            var adjustment = - cell.wasteToBeCollected / 100;
                            if (cell.wasteToBeCollected > 100)
                                adjustment = -0.1;
                            else if (cell.wasteToBeCollected == 0)
                                adjustment = 0.1;
                            if (l + adjustment < 0)
                                l = 0;
                            else if (l + adjustment > 1)
                                l = 1;
                            else
                                l += adjustment;
                            cell.terrain.color = cell.terrain.color.green(l);
                        }
                    })

                    FiercePlanet.Drawing.clearCanvas('#baseCanvas');
                    FiercePlanet.Drawing.clearCanvas('#resourceCanvas');
                    FiercePlanet.Drawing.drawPath();

//                    console.log(sustainabilityIndex, world.totalResidents, totalWasteRemaining)
                    FiercePlanet.Graph.plotData(sustainabilityIndex * 100, totalWasteRemaining / 200);
                }
            })

        // Prepare as a module
        this.id = "UofI";
        this.name = "UofI";
        this.position = 1;
        this.worlds = [
            this.wasteInSurabaya, this.pegirianVillage
        ];
    }

    this.initWorlds();
}).apply(UofIWorlds);


(function() {
    this.init = function() {
        var module = new Module();
        module.id = 'UofI';
        module.registerSelf();
        module.registerCampaign(UofIWorlds);
        module.currentCampaignID = 'UofI';
//        module.registerResourceSet(TBL);
        module.registerResourceSet(UofIResources);
        FiercePlanet.Game.currentProfile.capabilities = ['stockmarket', 'democracy', 'school', 'waste'];
        Lifecycle.waveDelay = 3000;

        _.extend(Universe.settings, {
            isometricView: false,
            hidePathBorder: true,
            scrollingImageVisible: false,
            showGraph: false,
            showEditor: true,
            animateWorldAtStart: false
        })
        localStorage.scrollingImageVisible = false;
        Universe.settings.store();

        _.extend(Lifecycle, {
            currentCampaignID: 'UofI',
            currentWorldPreset: true,
            interval: 500,
            worldDelay: 300
        })
        _.extend(FiercePlanet.Orientation, {
            worldWidth: 800,
            worldHeight: 600
        })

        FiercePlanet.ModuleEditor.buildEditorFromUrl('/javascripts/fp/modules/trials/uofi/uofi-module.js', 'UofIModule.init(); FiercePlanet.Game.loadGame();');
    };
}).apply(UofIModule);

if (typeof exports !== "undefined") {
    exports.UofIWorlds = UofIWorlds;
    exports.UofIModule = UofIModule;
    exports.UofIResources = UofIResources;
}

