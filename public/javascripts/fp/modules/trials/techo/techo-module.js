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
    this.STOCKMARKET_RESOURCE_TYPE = new ResourceType("Stockmarket", "stockmarket", "/images/icons/stockmarket.png", 10, 20, 100, 10);
    this.SCHOOL_RESOURCE_TYPE = new ResourceType("School", "school", "/images/icons/abc.png", 10, 20, 100, 10);
    this.DEMOCRACY_RESOURCE_TYPE = new ResourceType("Democracy", "democracy", "/images/icons/microphone.png", 10, 20, 100, 10);
    this.WASTE_RESOURCE_TYPE = new ResourceType("Waste", "waste", "/images/icons/liquid-waste.png", 10, 20, 100, 10);

    // Resource categories
    TechoResources.ECO_CATEGORY = new ResourceCategory("Economic", "eco", "#44ABE0");
    TechoResources.ENV_CATEGORY = new ResourceCategory("Environmental", "env", "#ABBB2A");
    TechoResources.POL_CATEGORY = new ResourceCategory("Political", "pol", "#DE1F2A");
    TechoResources.CUL_CATEGORY = new ResourceCategory("Cultural", "cul", "#2ADBCB");

    // Arrays of resource kinds
    TechoResources.ECONOMIC_RESOURCE_TYPES = [this.STOCKMARKET_RESOURCE_TYPE];
    TechoResources.ENVIRONMENTAL_RESOURCE_TYPES = [this.WASTE_RESOURCE_TYPE];
    TechoResources.POLITICAL_RESOURCE_TYPES = [this.DEMOCRACY_RESOURCE_TYPE];
    TechoResources.CULTURAL_RESOURCE_TYPES = [this.SCHOOL_RESOURCE_TYPE];

    // Clear types
    TechoResources.ECO_CATEGORY.clearTypes();
    TechoResources.ENV_CATEGORY.clearTypes();
    TechoResources.POL_CATEGORY.clearTypes();
    TechoResources.CUL_CATEGORY.clearTypes();

    TechoResources.ECO_CATEGORY.addType(this.STOCKMARKET_RESOURCE_TYPE);
    TechoResources.ENV_CATEGORY.addType(this.WASTE_RESOURCE_TYPE);
    TechoResources.POL_CATEGORY.addType(this.DEMOCRACY_RESOURCE_TYPE);
    TechoResources.CUL_CATEGORY.addType(this.SCHOOL_RESOURCE_TYPE);

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
                    "<p>This demonstration model showcases a number of features relating to housing development.</p>" +
                    "<p>Using the default settings, housing quality varies across the area." +
                    "Poor housing quality impacts on residential wellbeing and quality of life." +
                        "By placing resources on the map, housing quality can be improved, which in turn improves the wellbeing of residents.</p>" +
                    "<p>The aim of the simulation is to place resources in a way that creates a sustainable level of housing quality for residents.</p>" +

                    "<p>There are a number of parameters that control how this simulation works:" +
                        "<ul>" +
                        "<li><em>Transparency of overlay: </em> How much of the underlying map shows through</li>" +
                        "<li><em>Number of residents in the area</em> </li>" +
                        "<li><em>Number of workers in the area</em> </li>" +
                        "<li><em>Number of development blocks: </em> Increasing this parameter allows more cells to be developed</li>" +
                        "<li><em>Average housing quality: </em> What is the average starting housing quality for all cells in the world?</li>" +
                        "<li><em>Standard deviation of housing quality: </em> How much variation exists in housing quality?</li>" +
                        "<li><em>Threshold of improvement for neighbours: </em> How much better do neighbouring resources need to be for a cell’s housing quality to improve?</li>" +
                        "<li><em>Importance of equal resource types: </em> How important is it to maintain a balance of different resources across the world?</li>" +
                        "<li><em>Importance of moving to better housing: </em> How important is it for residents to move to better housing?</li>" +
                        "<li><em>Residents die out: </em> When residents’ health gets to zero, do they die out?</li>" +
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
                incrementAgentsEachWave: false,
                initialAgentNumber: 0,
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

                    "<p>Transparency of overlay</p>" +
                        "<input type='hidden' id='transparency' class='world-parameters' name='Transparency' value='5'/>" +

                        "<p>Number of Citizens</p>" +
                        "<input type='hidden' id='initialAgents' class='world-parameters' name='InitialAgents' value='100'/>" +

                        "<p>Number of Workers</p>" +
                        "<input type='hidden' id='initialWorkers' class='world-parameters' name='InitialWorkers' value='0'/>" +

                        "<p>Development blocks</p>" +
                        "<input type='hidden' id='developmentBlocks' class='world-parameters' name='DevelopmentBlocks' value='100'/>" +

                        "<p>Average housing quality (<em>more is better</em> - see <a href='http://en.wikipedia.org/wiki/Housing_quality_and_health_outcomes_in_the_United_States' target='_blank'>Wikipedia</a> for more)</p>" +
                        "<input type='hidden' id='aveHousingQuality' class='world-parameters' name='AveHousingQuality' value='50'/>" +

                        "<p>Standard deviation of housing quality (more means <em>less</em> equality)</p>" +
                        "<input type='hidden' id='stdDevHousingQuality' class='world-parameters' name='StdDevHousingQuality' value='15'/>" +

                        "<p>Threshold for improvement of neighbours</p>" +
                        "<input type='hidden' id='thresholdToImproveNeighbours' class='world-parameters' name='ThresholdToImproveNeighbours' value='10'/>" +

                        "<p>Importance of equal resource types</p>" +
                        "<input type='hidden' id='importanceOfEqualResourceTypes' class='world-parameters' name='ImportanceOfEqualResourceTypes' value='1'/>" +

                        "<p>Importance of moving to better housing</p>" +
                        "<input type='hidden' id='importanceOfMovingToBetterHousing' class='world-parameters' name='ImportanceOfMovingToBetterHousing' value='1'/>" +

                        "<p>Should residents die out when health reaches zero?</p>" +
                        "<input type='checkbox' id='residentsDieOut' class='world-parameters' name='ResidentsDieOut' />" +
                    "",
                conclusion: "Well done.",
                setup: function() {
                },
                setupParameters: function() {
                    FiercePlanet.Slider.createSlider("initialAgents", 0, 200, 5, 100);
                    FiercePlanet.Slider.createSlider("initialWorkers", 0, 100, 5, 0);
                    FiercePlanet.Slider.createSlider("developmentBlocks", 0, 400, 10, 100);
                    FiercePlanet.Slider.createSlider("aveHousingQuality", 0, 100, 1, 50);
                    FiercePlanet.Slider.createSlider("stdDevHousingQuality", 0, 40, 1, 15);
                    FiercePlanet.Slider.createSlider("transparency", 0, 10, 1, 5);
                    FiercePlanet.Slider.createSlider("thresholdToImproveNeighbours", 0, 20, 1, 10);
                    FiercePlanet.Slider.createSlider("importanceOfEqualResourceTypes", 0, 10, 1, 1);
                    FiercePlanet.Slider.createSlider("importanceOfMovingToBetterHousing", 0, 10, 1, 1);

                    FiercePlanet.Graph.setupData(
                        {label: 'Social Wellbeing', color: '#0f0', maxValue: 100}
                        , {label: 'Housing Quality', color: '#f00', maxValue: 100}
                    );
                },
                handleParameters: function () {
                    var world = this;
                    var initialAgents = parseInt(FiercePlanet.Parameters.InitialAgents)
                        , initialWorkers = parseInt(FiercePlanet.Parameters.InitialWorkers)
                        , aveHousingQuality = parseInt(FiercePlanet.Parameters.AveHousingQuality)
                        , stdDevHousingQuality = parseInt(FiercePlanet.Parameters.StdDevHousingQuality)
                        , transparency = (parseInt(FiercePlanet.Parameters.Transparency)  / 10)
                        , developmentBlocks = (parseInt(FiercePlanet.Parameters.DevelopmentBlocks))
                        , thresholdToImproveNeighbours = (parseInt(FiercePlanet.Parameters.ThresholdToImproveNeighbours))
                        , importanceOfEqualResourceTypes = (parseInt(FiercePlanet.Parameters.ImportanceOfEqualResourceTypes))
                        , importanceOfMovingToBetterHousing = (parseInt(FiercePlanet.Parameters.ImportanceOfMovingToBetterHousing))
                        , residentsDieOut = ((FiercePlanet.Parameters.ResidentsDieOut))

                    Universe.settings.godMode = !residentsDieOut;

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

                    var residentCulture = _.clone(DefaultCultures.Stickman);
                    residentCulture.name = "Residents";
                    residentCulture.waveNumber = initialAgents;
                    residentCulture.initialSpeed = 5;
                    residentCulture.moveCost = 0;
                    residentCulture.healthCategories = ModuleManager.currentModule.resourceSet.categories;
                    /*
                    _.extend(residentCulture, {
                        capabilities: [
                            Capabilities.ConsumeResourcesCapability
                        ]
                    });
                    */

                    var workerCulture = _.clone(DefaultCultures.Stickman);
                    workerCulture.name = "Workers";
                    workerCulture.waveNumber = initialWorkers;
                    workerCulture.initialSpeed = 5;
                    workerCulture.moveCost = 0;
                    workerCulture.color = one.color('#0f0');
                    _.extend(workerCulture, {
                        beliefs: [
                            Beliefs.BeliefsAboutPaths
                            , Beliefs.BeliefsAboutResources
                        ]
                        , desires: [
                            Desires.ExploreSpace
                            , Desires.ImproveHealth
                        ]
                        , capabilities: [
                            Capabilities.ConsumeResourcesCapability
                        ]
                    });

//                    residentCulture.healthCategories = ModuleManager.currentModule.resourceSet.categories;

                    // Set up housing
                    var poorCondition = one.color('#7F3300').alpha(1 - transparency);
                    world.cells.forEach(function(cell) {
                        if (cell.agentsAllowed) {
                            var quality = jStat.normal.sample(aveHousingQuality, stdDevHousingQuality);
                            cell.quality = quality;
                            cell.terrain = new Terrain(poorCondition.lightness(cell.quality / 100, true));
                        }
                    })


                    this.randomiseAgents = true;
                    this.cultures = [residentCulture, workerCulture];
                    this.waves = undefined;
                    this.initialiseWaves(1);
                    FiercePlanet.Drawing.drawPath();
                },



                tickFunction: function () {
                    var world = this;
                    var counter = 0;

                    var initialAgents = parseInt(FiercePlanet.Parameters.InitialAgents)
                        , initialWorkers = parseInt(FiercePlanet.Parameters.Workers)
                        , aveHousingQuality = parseInt(FiercePlanet.Parameters.AveHousingQuality)
                        , stdDevHousingQuality = parseInt(FiercePlanet.Parameters.StdDevHousingQuality)
                        , transparency = (parseInt(FiercePlanet.Parameters.Transparency)  / 10)
                        , developmentBlocks = (parseInt(FiercePlanet.Parameters.DevelopmentBlocks))
                        , thresholdToImproveNeighbours = (parseInt(FiercePlanet.Parameters.ThresholdToImproveNeighbours))
                        , importanceOfEqualResourceTypes = (parseInt(FiercePlanet.Parameters.ImportanceOfEqualResourceTypes))
                        , importanceOfMovingToBetterHousing = (parseInt(FiercePlanet.Parameters.ImportanceOfMovingToBetterHousing))
                        , residentsDieOut = ((FiercePlanet.Parameters.ResidentsDieOut))

                    Universe.settings.godMode = !residentsDieOut;

                    var moveCapability = Capabilities.MoveRandomlyCapability, nullifiedAgents = [];
                    var moveToBetterHousing = new Capability();
                    (function() {
                        this.name = 'MoveToBetterHousing';
                        this.cost = 0;
                        this.exercise = function(agent, world) {
                            var currentCell = world.getCell(agent.x, agent.y),
                                currentCellQuality = currentCell.quality,
                                positions = world.getCellsAtDistance(agent.x, agent.y, 1, Distance.CHEBYSHEV_DISTANCE, false),
                                moveablePositions = _.chain(positions).map(function(cell) {if (cell.agentsAllowed) return cell; }).compact().shuffle().value();

                            var candidateCell = currentCell;
                            for (var i = 0; i < moveablePositions.length; i++) {
                                var testPosition = moveablePositions[i];
                                if (testPosition.quality - currentCellQuality > importanceOfMovingToBetterHousing) {
                                    candidateCell = testPosition;
                                    break;
                                }
                            }

                            if (!_.isUndefined(candidateCell))
                                agent.moveTo(candidateCell.x, candidateCell.y);
                        };
                    }).apply(moveToBetterHousing);

                    var died = 0;

                    var resourceBalance = 0, resourceCounters = [];
                    ModuleManager.currentModule.resourceSet.categories.forEach(function(category) {
                        resourceCounters.push(0);
                    });
                    world.resources.forEach(function(resource) {
                        for (var i = 0; i < ModuleManager.currentModule.resourceSet.categories.length; i++) {
                            var category = ModuleManager.currentModule.resourceSet.categories[i];
                            if (resource.category == (category))
                                resourceCounters[i] = resourceCounters[i] + 1;
                        }
                    });

                    /*
                    var n = 0,
                        mean = 0,
                        M2 = 0,
                        M3 = 0,
                        M4 = 0;
                    var l = resourceCounters.length
                        , mean = jStat.mean(resourceCounters)
                        , stdev = jStat.stdev(resourceCounters)
                        , secondMoment = jStat.sum(_.map(resourceCounters, function(val) { return Math.pow(val - mean, 2)}))
                        , fourthMoment = jStat.sum(_.map(resourceCounters, function(val) { return Math.pow(val - mean, 4)}))
                        , m2 = (secondMoment / n)
                        , m4 = (fourthMoment / n)
                        , kurtosis = (m4 / Math.pow(m2, 2)) - 3;
                    // http://en.wikipedia.org/wiki/Algorithms_for_calculating_variance#On-line_algorithm
                    for (var i = 0; i < resourceCounters.length; i ++) {
                        var x = resourceCounters[i];
                        var n1 = n;
                        n = n + 1
                        var delta = x - mean;
                        var delta_n = delta / n;
                        var delta_n2 = delta_n * delta_n;
                        var term1 = delta * delta_n * n1;
                        mean = mean + delta_n;
                        M4 = M4 + term1 * delta_n2 * (n * n - 3*n + 3) + (6 * delta_n2 * M2) - (4 * delta_n * M3)
                        console.log(term1, mean, M4, n, delta, delta_n, delta_n2, (n * n - 3*n + 3), M2, M3)
                        M3 = M3 + (term1 * delta_n * (n - 2)) - (3 * delta_n * M2)
                        M2 = M2 + term1
                    }
                    var kurtosis = ((n*M4) / (M2*M2)) - 3;
                    console.log(resourceCounters, kurtosis, n, M4, M3, M2, mean)
                    */
                    // Computes a rough estimate of the degree of distribution of resources relative to the number of resources outlayed.
                    // Kurtosis overkill for this purpose?
                    var min = _.min(resourceCounters)
                        , max = _.max(resourceCounters)
                        , len = resourceCounters.length
                        , sum = jStat.sum(resourceCounters)
                        , modLength = sum % len
                        , diff = (max - min)
                        , normalisedDiff = diff - modLength
                        , relativeRange = diff / sum
                        , adjustedRelativeRange = Math.pow(relativeRange, 1 / importanceOfEqualResourceTypes)
                        , normalisedSpread = normalisedDiff / sum;

                    _.shuffle(world.cells).forEach(function(cell) {
                        var x = cell.x, y = cell.y;
                        var quality = cell.quality;
                        var neighbourResources = (world.getNeighbouringResources(x, y));
                        neighbourResources.forEach(function(neighbour) {
                            if (neighbour.totalYield > neighbour.perAgentYield) {
                                var adjustedYield = neighbour.perAgentYield * ( 1 - adjustedRelativeRange);
//                                neighbour.totalYield -= neighbour.perAgentYield;
//                                neighbour.totalYield -= adjustedYield;
                                neighbour.totalYield --;
                                if (cell.quality + adjustedYield < 100)
                                    cell.quality += adjustedYield;
                                else
                                    cell.quality = 100;
                            }
                        });
                    })

                    // Adjust quality depending on agent type
                    world.currentAgents.forEach(function(agent) {
                        var cell = world.getCell(agent.x, agent.y);
                        if (agent.culture.name == "Residents") {
                            if (cell.quality > 0) {
                                cell.quality--;
                            }
                            if (agent.health > 0) {
                                var adjustChance = Math.random();
                                if (adjustChance * 100 > cell.quality)
                                    agent.adjustGeneralHealth(-1);
                                // Allow some opportunity to recuperate
                                else if (adjustChance < Math.pow(cell.quality / 100, 2))
                                    agent.adjustGeneralHealth(1);
                            }
                        }
                        else if (agent.culture.name == "Workers") {
                            if (cell.quality < 100)
                                cell.quality ++;
                        }
                    })

                    // Adjust quality based on neighbouring values
                    world.cells.forEach(function(cell) {
                        if (cell.agentsAllowed) {
                            var x = cell.x, y = cell.y;
                            cell.newQuality = cell.quality;
                            var quality = cell.quality;
                            var neighbours = world.getNeighbouringCells(x, y),
                                qualities = _.chain(neighbours).map(function(neighbour) { if (neighbour.agentsAllowed) return neighbour.quality}).compact().sortBy(function(e) {return e}).value(),
                                midPoint = Math.floor(qualities.length / 2),
                                topHalf = _.rest(qualities, midPoint),
                                topHalfMean = jStat.mean(topHalf),
                                maxQuality = 0,
                                cumQuality = 0,
                                aveQuality;


//                            neighbours.forEach(function(neighbour) {
//                                if (neighbour.agentsAllowed) {
//                                    cumQuality += neighbour.quality;
//                                    neighbourTotal++;
//                                    if (maxQuality < neighbour.quality)
//                                        maxQuality = neighbour.quality;
//                                }
//                            });
//                            aveQuality = cumQuality / neighbourTotal;
                            // Max
//                            if ((maxQuality - quality) > thresholdToImproveNeighbours) {
//                                cell.newQuality = cell.quality + 1;
//                            }
                            // Top half mean
                            if ((topHalfMean - quality) > thresholdToImproveNeighbours) {
                                cell.newQuality = cell.quality + 1;
                            }
                            // Average
//                            if ((aveQuality - quality) > thresholdToImproveNeighbours) {
//                                cell.newQuality = cell.quality + 1;
//                            }
                            // Percentage average over threshold?
//                            if ((aveQuality - quality) > thresholdToImproveNeighbours) {
//                                cell.newQuality = cell.quality + 1;
//                            }
                        }
                    })
                    world.cells.forEach(function(cell) {
                        if (cell.agentsAllowed) {
                            if (!_.isUndefined(cell.newQuality) && cell.newQuality <= 100 && cell.quality != cell.newQuality) {
                                cell.quality = cell.newQuality;
                                cell.newQuality = cell.quality;
                            }
                        }
                    })

                    // Adjust color based on quality
                    var poorCondition = one.color('#7F3300').alpha(1 - transparency);
                    world.cells.forEach(function(cell) {
                        if (cell.agentsAllowed) {
                            var quality = (cell.quality > 100 ) ? 100 : cell.quality;
                            cell.terrain = new Terrain(poorCondition.lightness(quality / 100, true));
                        }
                    })

                    // Move agents
                    world.currentAgents.forEach(function(agent) {
                        if (Lifecycle.waveCounter >= agent.delay && agent.countdownToMove % agent.speed == 0) {
                            if (agent.culture.name == 'Residents')
                                moveToBetterHousing.exercise(agent, world);
                            else if (agent.culture.name == 'Workers')
                                agent.update(world);
                        }
                    });

                    // Die
//                    if (residentsDieOut) {
//                        world.currentAgents.forEach(function(agent) {
//                            if (agent.health < 0)
//                                agent.die(world);
//                        });
//                    }

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
                    world.recoverResources();
                    FiercePlanet.Drawing.clearCanvas('#baseCanvas');
                    FiercePlanet.Drawing.clearCanvas('#resourceCanvas');
                    FiercePlanet.Drawing.drawPath();

                    var totalHealth =
                            _.chain(world.currentAgents)
                            .map(function(agent) { if (agent.culture.name == "Residents") return agent; })
                            .compact()
                            .map(function(agent) { return agent.health ; })
                            .reduce(function(memo, num){ return memo + num; }, 0)
                            .value()
                        , aveHealth = totalHealth / initialAgents;
                    var housingQuality = _.map(world.pathway, function(pathCell) { return (world.getCell(pathCell[0], pathCell[1]).quality); }),
                        totalHousingQuality = _.reduce(housingQuality, function(memo, num){ return memo + num; }, 0),
                        aveHousingQuality = totalHousingQuality / world.pathway.length;
//                    var ageAtDeath = _.map(this.expiredAgents, function(agent) { return agent.diedAt - agent.bornAt; }),
//                        totalAgeAtDeath = _.reduce(health, function(memo, num){ return memo + num; }, 0);
                    console.log(aveHealth, aveHousingQuality)
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

