/*!
 * Fierce Planet
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var TechoWorlds = TechoWorlds || new Campaign();
var TechoModule = TechoModule || {};
var TechoResources = TechoResources || {};


/*!
 * Fierce Planet - ResourceKinds
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


/**
 * Declare the ResourceTypes namespace
 */
TechoResources.id = 'TechoResources';



/**
 * Do setup of this resource set
 */
TechoResources.doSetup = function() {
    // Resource categories
    TechoResources.ECO_CATEGORY = new ResourceCategory("Economic", "eco", "#44ABE0");
    TechoResources.ENV_CATEGORY = new ResourceCategory("Environmental", "env", "#ABBB2A");
    TechoResources.POL_CATEGORY = new ResourceCategory("Political", "pol", "#DE1F2A");
    TechoResources.CUL_CATEGORY = new ResourceCategory("Cultural", "cul", "#2ADBCB");

    // Arrays of resource kinds
    TechoResources.ECONOMIC_RESOURCE_TYPES = [ResourceTypes.STOCKMARKET_RESOURCE_TYPE];
    TechoResources.ENVIRONMENTAL_RESOURCE_TYPES = [ResourceTypes.WASTE_RESOURCE_TYPE];
    TechoResources.POLITICAL_RESOURCE_TYPES = [ResourceTypes.DEMOCRACY_RESOURCE_TYPE];
    TechoResources.CULTURAL_RESOURCE_TYPES = [ResourceTypes.SCHOOL_RESOURCE_TYPE];

    // Clear types
    TechoResources.ECO_CATEGORY.clearTypes();
    TechoResources.ENV_CATEGORY.clearTypes();
    TechoResources.POL_CATEGORY.clearTypes();
    TechoResources.CUL_CATEGORY.clearTypes();

    TechoResources.ECO_CATEGORY.addType(ResourceTypes.STOCKMARKET_RESOURCE_TYPE);
    TechoResources.ENV_CATEGORY.addType(ResourceTypes.WASTE_RESOURCE_TYPE);
    TechoResources.POL_CATEGORY.addType(ResourceTypes.DEMOCRACY_RESOURCE_TYPE);
    TechoResources.CUL_CATEGORY.addType(ResourceTypes.SCHOOL_RESOURCE_TYPE);

    TechoResources.categories = [TechoResources.ECO_CATEGORY, TechoResources.ENV_CATEGORY, TechoResources.POL_CATEGORY, TechoResources.CUL_CATEGORY];
    TechoResources.types =
        _.union(
            TechoResources.ECONOMIC_RESOURCE_TYPES
            , TechoResources.ENVIRONMENTAL_RESOURCE_TYPES
            , TechoResources.POLITICAL_RESOURCE_TYPES
            , TechoResources.CULTURAL_RESOURCE_TYPES
        )
};



(function () {

    this.initTechoWorlds = function () {

        this.housingInArica  = new World();
        _.extend(this.housingInArica,
            {
                id: 1,
                name: "Housing in Arica",
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
                allowResourcesOnPath: false,
                drawAllCells: true,
                //Arica
                mapOptions: ({
                mapTypeId: google.maps.MapTypeId.HYBRID,
                center: new google.maps.LatLng(-18.458277, -70.281976
                ),
//                rotate: 45,
                zoom: 19,
                tilt: 0
                }),
                parameters:
                    "<p>Initial citizens</p>" +
                        "<input type='hidden' id='initialAgents' class='world-parameters' name='InitialAgents' value='100'/>" +

                        "<p>Development blocks</p>" +
                        "<input type='hidden' id='developmentBlocks' class='world-parameters' name='DevelopmentBlocks' value='100'/>" +

                        "<p>Average housing quality (<em>more is better</em> - see <a href='http://en.wikipedia.org/wiki/Housing_quality_and_health_outcomes_in_the_United_States'>Wikipedia</a> for more)</p>" +
                        "<input type='hidden' id='aveHousingQuality' class='world-parameters' name='AveHousingQuality' value='50'/>" +

                        "<p>Standard deviation of housing quality (more means <em>less</em> equality)</p>" +
                        "<input type='hidden' id='stdDevHousingQuality' class='world-parameters' name='StdDevHousingQuality' value='15'/>" +

                        "<p>Threshold for improvement of neighbours</p>" +
                        "<input type='hidden' id='thresholdToImproveNeighbours' class='world-parameters' name='ThresholdToImproveNeighbours' value='10'/>" +

                        "<p>Transparency of overlay</p>" +
                        "<input type='hidden' id='transparency' class='world-parameters' name='Transparency' value='5'/>" +
                        /*

                        "<p>No. of waste disposal units</p>" +
                        "<input type='hidden' id='numWasteDisposalUnits' class='world-parameters' name='NumWasteDisposalUnits' value='10'/>" +

                        "<p>Proximity to waste disposal unit</p>" +
                        "<input type='hidden' id='proximityToDisposalUnit' class='world-parameters' name='ProximityToDisposalUnit' value='1'/>" +

                        "<p>Natural rate of water improvement</p>" +
                        "<input type='hidden' id='naturalRateOfImprovement' class='world-parameters' name='NaturalRateOfImprovement' value='1'/>" +

                        "<p>Health cost of infection</p>" +
                        "<input type='hidden' id='healthCostOfInfection' class='world-parameters' name='HealthCostOfInfection' value='1'/>" +
//                        "<p>Water consumed</p><p><input class='world-parameters' name='WaterConsumed' value='1000'/> </p>" +

                    "<p>Quality of water</p>" +
                    "<input type='hidden' id='waterQuality' class='world-parameters' name='WaterQuality' value='100'/>" +

                    "<p>Reproduction probability</p>" +
                    "<input type='hidden' id='reproductionProbability' class='world-parameters' name='ReproductionProbability' value='0.5'/>" +
*/
                    "",
                conclusion: "Well done.",
                setup: function() {
                },
                setupParameters: function() {
                    FiercePlanet.Slider.createSlider("initialAgents", 0, 200, 5, 100);
                    FiercePlanet.Slider.createSlider("developmentBlocks", 0, 400, 10, 100);
                    FiercePlanet.Slider.createSlider("aveHousingQuality", 0, 100, 1, 50);
                    FiercePlanet.Slider.createSlider("stdDevHousingQuality", 0, 40, 1, 15);
                    FiercePlanet.Slider.createSlider("transparency", 0, 10, 1, 5);
                    FiercePlanet.Slider.createSlider("thresholdToImproveNeighbours", 0, 20, 1, 10);
//                    FiercePlanet.Slider.createSlider("proximityToDisposalUnit", 0, 10, 1, 1);
//                    FiercePlanet.Slider.createSlider("naturalRateOfImprovement", 0, 10, 1, 1);
//                    FiercePlanet.Slider.createSlider("healthCostOfInfection", 0, 5, 1, 1);
//                    FiercePlanet.Slider.createSlider("waterQuality", 0, 200, 10, 100);
//                    FiercePlanet.Slider.createSlider("reproductionProbability", 0, 1, 0.05, 0.5);

//                    FiercePlanet.Graph.openDialog();
//                    $("#world-graph").show();
                    FiercePlanet.Graph.setupData(
                        {label: 'Health', color: '#0f0', maxValue: 100}
                        , {label: 'Housing Quality', color: '#f00', maxValue: 100}
                    );
                },
                handleParameters: function () {
                    var world = this;
                    var initialAgents = parseInt(FiercePlanet.Parameters.InitialAgents)
                        , aveHousingQuality = parseInt(FiercePlanet.Parameters.AveHousingQuality)
                        , stdDevHousingQuality = parseInt(FiercePlanet.Parameters.StdDevHousingQuality)
                        , transparency = (parseInt(FiercePlanet.Parameters.Transparency)  / 10)
                        , developmentBlocks = (parseInt(FiercePlanet.Parameters.DevelopmentBlocks))
                        , thresholdToImproveNeighbours = (parseInt(FiercePlanet.Parameters.ThresholdToImproveNeighbours))
//                        , waterConsumed = parseInt(FiercePlanet.Parameters.WaterConsumed)
//                        , waterQuality = parseInt(FiercePlanet.Parameters.WaterQuality)
//                        , naturalRateOfImprovement = parseInt(FiercePlanet.Parameters.NaturalRateOfImprovement)
//                        , infectionProbability = parseFloat(FiercePlanet.Parameters.InfectionProbability)
//                        , healthCostOfInfection = parseInt(FiercePlanet.Parameters.HealthCostOfInfection)
//                        , reproductionProbability = parseFloat(FiercePlanet.Parameters.ReproductionProbability)

                    /// Set up agents
                    var len = world.cells.length,
                        removedCells = [];
                    for (var i = 0; i < developmentBlocks; i++) {
                        var cellNo = Math.floor(Math.random() * len);
                        var cell = world.cells[cellNo];
                        if (!cell.agentsAllowed) {
                            i--;
                            continue;
                        }
                        else {
                            cell.agentsAllowed = false;
                            cell.terrain = new Terrain(one.color('#000').alpha(1));
                        }
                    }
                    world.generatePath();

                    var culture = _.clone(DefaultCultures.Stickman);
                    culture.waveNumber = initialAgents;
                    culture.initialSpeed = 5;
                    culture.moveCost = 0;
                    culture.healthCategories = ModuleManager.currentModule.resourceSet.categories;
                    var poorCondition = one.color('#7F3300').alpha(1 - transparency);
                    world.cells.forEach(function(cell) {
                        if (cell.agentsAllowed) {
                            var quality = jStat.normal.sample(aveHousingQuality, stdDevHousingQuality);
                            cell.quality = quality;
                            cell.terrain = new Terrain(poorCondition.lightness(cell.quality / 100, true));
                        }
                    })
                    /*
                    culture.initFunction = function(agent, world) {
                        agent.infected = false;
                        agent.generalHealth = 100;
                        agent.color = '#f00';
                        agent.age = Math.floor(Math.random() * 100);
                        agent.gender = (Math.random() < .5 ? 'm' : 'f');
                        agent.childCount = 0;
                    };

                    this.currentWaterQuality = waterQuality;
                    this.children = 0;
                    */

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
                        , aveHousingQuality = parseInt(FiercePlanet.Parameters.AveHousingQuality)
                        , stdDevHousingQuality = parseInt(FiercePlanet.Parameters.StdDevHousingQuality)
                        , transparency = (parseInt(FiercePlanet.Parameters.Transparency)  / 10)
                        , thresholdToImproveNeighbours = (parseInt(FiercePlanet.Parameters.ThresholdToImproveNeighbours))
//                        , rateOfWasteEmission = parseInt(FiercePlanet.Parameters.RateOfWasteEmission)
//                        , numWasteDisposalUnits = parseInt(FiercePlanet.Parameters.NumWasteDisposalUnits)
//                        , proximityToDisposalUnit = parseInt(FiercePlanet.Parameters.ProximityToDisposalUnit)
//                        , waterQuality = parseInt(FiercePlanet.Parameters.WaterQuality)
//                        , naturalRateOfImprovement = parseInt(FiercePlanet.Parameters.NaturalRateOfImprovement)
//                        , infectionProbability = parseFloat(FiercePlanet.Parameters.InfectionProbability)
//                        , healthCostOfInfection = parseInt(FiercePlanet.Parameters.HealthCostOfInfection)
//                        , reproductionProbability = parseInt(FiercePlanet.Parameters.ReproductionProbability)
                    var moveCapability = Capabilities.MoveRandomlyCapability, nullifiedAgents = [];
                    var died = 0;

                    world.cells.forEach(function(cell) {
                        var x = cell.x, y = cell.y;
                        var quality = cell.quality;
                        var neighbours = world.getNeighbouringResources(x, y);
                        neighbours.forEach(function(neighbour) {
                            if (neighbour.totalYield > neighbour.perAgentYield) {
                                neighbour.totalYield -= neighbour.perAgentYield;
                                cell.quality += neighbour.perAgentYield;
                            }
                        });
                    })

                    world.cells.forEach(function(cell) {
                        if (cell.agentsAllowed) {
                            var x = cell.x, y = cell.y;
                            var quality = cell.quality;
                            var neighbours = world.getNeighbouringCells(x, y),
                                neighbourTotal = 0,
                                cumQuality = 0,
                                aveQuality;
                            neighbours.forEach(function(neighbour) {
                                if (neighbour.agentsAllowed) {
                                    cumQuality += neighbour.quality;
                                    neighbourTotal++;
                                }
                            });
                            aveQuality = cumQuality / neighbourTotal;
                            if ((aveQuality - quality) > thresholdToImproveNeighbours) {
                                cell.newQuality = cell.quality + 1;
                            }
                        }
                    })
                    world.cells.forEach(function(cell) {
                        if (cell.agentsAllowed) {
                            if (!_.isUndefined(cell.newQuality)) {
                                cell.quality = cell.newQuality;
                            }
                        }
                    })
                    var poorCondition = one.color('#7F3300').alpha(1 - transparency);
                    world.cells.forEach(function(cell) {
                        if (cell.agentsAllowed) {
                            var quality = (cell.quality > 100 ) ? 100 : cell.quality;
                            cell.terrain = new Terrain(poorCondition.lightness(quality / 100, true));
                        }
                    })
                    // Move agents
                    world.currentAgents.forEach(function(agent) {
                        if (Lifecycle.waveCounter >= agent.delay && agent.countdownToMove % agent.speed == 0)
                            moveCapability.exercise(agent, world);
                    });
                    // Adjust health
                    /*
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
                        agent.color = one.color(agent.color).red(agent.health / 100);
                    });
                    */
                    // Die
                    world.currentAgents.forEach(function(agent) {
                        if (agent.health < 0)
                            agent.die(world);
                    });

                    // Reproduce
                    /*
                    if (world.currentAgents.length < 400) {
                        world.currentAgents.forEach(function(agent) {
                            if (agent.gender == 'f' && agent.age >= 15 && agent.age <= 45) {
                                var r = Math.random();
                                // Diminishing likelihood of children
                                if (r < Math.pow(reproductionProbability,  agent.childCount + 1)) {
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
                    */
                    FiercePlanet.Drawing.clearCanvas('#baseCanvas');
                    FiercePlanet.Drawing.clearCanvas('#resourceCanvas');
                    FiercePlanet.Drawing.drawPath();

                    var health = _.map(this.currentAgents, function(agent) { return agent.health ; }),
                        totalHealth = _.reduce(health, function(memo, num){ return memo + num; }, 0),
                        aveHealth = totalHealth / initialAgents;
                    var housingQuality = _.map(this.pathway, function(pathCell) { return (world.getCell(pathCell[0], pathCell[1]).quality); }),
                        totalHousingQuality = _.reduce(housingQuality, function(memo, num){ return memo + num; }, 0),
                        aveHousingQuality = totalHousingQuality / this.pathway.length;
//                    var ageAtDeath = _.map(this.expiredAgents, function(agent) { return agent.diedAt - agent.bornAt; }),
//                        totalAgeAtDeath = _.reduce(health, function(memo, num){ return memo + num; }, 0);
                    console.log(aveHealth, aveHousingQuality    )
                    FiercePlanet.Graph.plotData(aveHealth, aveHousingQuality);
                }
            })


        // Prepare as a module
        this.id = "Techo";
        this.name = "Techo";
        this.position = 1;
        this.worlds = [
            this.housingInArica
        ];
    }

    this.initTechoWorlds();
}).apply(TechoWorlds);


(function() {
    this.init = function() {
        var module = new Module();
        module.id = 'Techo';
        module.registerSelf();
        module.registerCampaign(TechoWorlds);
        module.currentCampaignID = 'Techo';
        module.registerResourceSet(TechoResources);
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
            currentCampaignID: 'Techo',
            currentWorldPreset: true,
            interval: 500,
            worldDelay: 300
        })
        _.extend(FiercePlanet.Orientation, {
            worldWidth: 800,
            worldHeight: 600
        })

        FiercePlanet.ModuleEditor.buildEditorFromUrl('/javascripts/fp/modules/trials/techo/techo-module.js', 'TechoModule.init(); FiercePlanet.Game.loadGame();');
    };
}).apply(TechoModule);

if (typeof exports !== "undefined") {
    exports.TechoWorlds = TechoWorlds;
    exports.TechoModule = TechoModule;
    exports.TechoResources = TechoResources;
}

