/*!
 * Fierce Planet
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var RMITWorlds = RMITWorlds || new Campaign();
var RMITModule = RMITModule || {};
var RMITResources = RMITResources || {};


/*!
 * Fierce Planet - ResourceKinds
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */




(function () {

    this.initRMITWorlds = function () {

		this.maze = Basic.world5;
		_.extend(this.maze, 
			{
				handleParameters: function() {
                    this.cultures = [DefaultCultures.MovingStickman];
                    this.waves = undefined;
                    this.initialiseWaves(1);
                    FiercePlanet.Drawing.drawPath();
					
				},
				interval: 10
				
			});
			
        this.fishermansBend  = new World();
        _.extend(this.fishermansBend,
            {
                id: 1,
                name: "Fishermen's Bend",
                introduction:
                    "<p>This model showcases a number of features relating to sustainable development.</p>" +
                    "<p>There are three output variables, modelling desirable features of the site: <em>Affordability</em>, <em>Sustainability</em> and <em>Mixed Use</em>.</p>" +
                        "<p>" +
                        "Using the default settings, residents populate the Fisherman's Bend area. " +
                        "Without intervention, <em>Affordability</em> and <em>Sustainability</em> variables stay at 0, while <em>Sustainability</em> declines over time.</p>" +

                        "<p>Placing resources in the area allows you to increase the values of desired features (though not necessarily all at once!).</p>" +

                        "<p>There are a number of parameters that control how this simulation works:" +
                        "<ul>" +
                        "<li><em>Transparency of overlay: </em> How much of the underlying map shows through</li>" +
                        "<li><em>Number of residents in the area</em> </li>" +
                        "<li><em>Average sustainability: </em> What is the average starting sustainability for all cells in the world?</li>" +
                        "<li><em>Standard deviation of sustainability: </em> How much variation exists in sustainability?</li>" +
                        "<li><em>Threshold of improvement for neighbours: </em> How much better do neighbouring resources need to be for a cell’s housing quality to improve?</li>" +
                        "<li><em>Importance of equal resource types: </em> How important is it to maintain a balance of different resources across the world?</li>" +
                        "<li><em>Importance of moving to better housing: </em> How important is it for residents to move to better housing?</li>" +
                        "<li><em>Residents don't follow resources: </em> Do residents try to move towards resources?</li>" +
                        "</ul>" +
                        "</p>" +
                        ""
                ,
                information: this.introduction,
                isPresetWorld: true,
                interval: 100,
                cellsAcross: 20,
                cellsDown: 20,
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
				ignoreResourceLevels: true, 
				
                //Arica
                mapOptions: ({
                    mapTypeId: google.maps.MapTypeId.HYBRID,
                    center: new google.maps.LatLng(-37.83633, 144.90533
                    ),
//                rotate: 45,
                    zoom: 17,
                    tilt: 0
                }),
                parameters:

                    "<p>Transparency of overlay</p>" +
                        "<input type='hidden' id='transparency' class='world-parameters' name='Transparency' value='7'/>" +

                        "<p>Number of Citizens</p>" +
                        "<input type='hidden' id='initialAgents' class='world-parameters' name='InitialAgents' value='100'/>" +

                        "<p>Average sustainability</p>" +
                        "<input type='hidden' id='aveSustainability' class='world-parameters' name='AveSustainability' value='50'/>" +

                        "<p>Standard deviation of sustainability</p>" +
                        "<input type='hidden' id='stdDevSustainability' class='world-parameters' name='StdDevSustainability' value='15'/>" +

                        "<p>Threshold for improvement of neighbours</p>" +
                        "<input type='hidden' id='thresholdToImproveNeighbours' class='world-parameters' name='ThresholdToImproveNeighbours' value='10'/>" +

                        "<p>Importance of equal resource types</p>" +
                        "<input type='hidden' id='importanceOfEqualResourceTypes' class='world-parameters' name='ImportanceOfEqualResourceTypes' value='1'/>" +

                        "<p>Importance of moving to better housing</p>" +
                        "<input type='hidden' id='importanceOfMovingToBetterHousing' class='world-parameters' name='ImportanceOfMovingToBetterHousing' value='1'/>" +

                        "<p>Should residents ignore resources?</p>" +
                        "<input type='checkbox' id='residentsDontFollowResources' class='world-parameters' name='ResidentsDontFollowResources' />" +

                        "",
                conclusion: "Well done.",
                setup: function() {
                    FiercePlanet.GeneralUI.refreshSwatch();
                },
                setupParameters: function() {
                    FiercePlanet.Slider.createSlider("transparency", 0, 10, 1, 7);
                    FiercePlanet.Slider.createSlider("initialAgents", 10, 300, 10, 150);
                    FiercePlanet.Slider.createSlider("aveSustainability", 0, 100, 1, 50);
                    FiercePlanet.Slider.createSlider("stdDevSustainability", 0, 40, 1, 15);
                    FiercePlanet.Slider.createSlider("thresholdToImproveNeighbours", 0, 20, 1, 10);
                    FiercePlanet.Slider.createSlider("importanceOfEqualResourceTypes", 0, 10, 1, 1);
                    FiercePlanet.Slider.createSlider("importanceOfMovingToBetterHousing", 0, 10, 1, 1);

                    FiercePlanet.Graph.setupData(
                        {label: 'Affordability', color: '#0f0', maxValue: 100}
                        , {label: 'Sustainability', color: '#f00', maxValue: 100}
                        , {label: 'Mixed Use', color: '#00f', maxValue: 100}
                    );
                },
                handleParameters: function () {
                    var world = this;
                    var initialAgents = parseInt(FiercePlanet.Parameters.InitialAgents)
                        , aveSustainability = parseInt(FiercePlanet.Parameters.AveSustainability)
                        , stdDevSustainability = parseInt(FiercePlanet.Parameters.StdDevSustainability)
                        , transparency = (parseInt(FiercePlanet.Parameters.Transparency)  / 10)
                        , thresholdToImproveNeighbours = (parseInt(FiercePlanet.Parameters.ThresholdToImproveNeighbours))
                        , importanceOfEqualResourceTypes = (parseInt(FiercePlanet.Parameters.ImportanceOfEqualResourceTypes))
                        , importanceOfMovingToBetterHousing = (parseInt(FiercePlanet.Parameters.ImportanceOfMovingToBetterHousing))

                    //Universe.settings.godMode = !residentsDieOut;
					world.allowResourcesOnPath = true;

                    /// Set up agents
                    var len = world.cells.length,
                        removedCells = [];


                    var residentCulture = _.clone(DefaultCultures.Stickman);
                    residentCulture.name = "Residents";
                    residentCulture.waveNumber = initialAgents;
                    residentCulture.initialSpeed = 5;
                    residentCulture.moveCost = 0;
                    //residentCulture.healthCategories = ModuleManager.currentModule.resourceSet.categories;

//                    residentCulture.healthCategories = ModuleManager.currentModule.resourceSet.categories;

                    // Set up housing
                    var poorCondition = one.color('#7F3300').alpha(1 - transparency);
                    world.cells.forEach(function(cell) {
                        if (cell.agentsAllowed) {
                            var sustainability = jStat.normal.sample(aveSustainability, stdDevSustainability);
                            cell.sustainability = sustainability;
                            cell.terrain = new Terrain(poorCondition.lightness(cell.sustainability / 100, true));
                        }
                    })


                    this.randomiseAgents = true;
                    this.cultures = [residentCulture];
                    this.waves = undefined;
                    this.initialiseWaves(1);
                    FiercePlanet.Drawing.drawPath()
                },



                tickFunction: function () {
                    var world = this;
                    var counter = 0;

                    var initialAgents = parseInt(FiercePlanet.Parameters.InitialAgents)
                        , aveSustainability = parseInt(FiercePlanet.Parameters.AveSustainability)
                        , stdDefSustainability = parseInt(FiercePlanet.Parameters.StdDevSustainability)
                        , transparency = (parseInt(FiercePlanet.Parameters.Transparency)  / 10)
                        , thresholdToImproveNeighbours = (parseInt(FiercePlanet.Parameters.ThresholdToImproveNeighbours))
                        , importanceOfEqualResourceTypes = (parseInt(FiercePlanet.Parameters.ImportanceOfEqualResourceTypes))
                        , importanceOfMovingToBetterHousing = (parseInt(FiercePlanet.Parameters.ImportanceOfMovingToBetterHousing))
                        , residentsDontFollowResources = ((FiercePlanet.Parameters.ResidentsDontFollowResources))

                    var len = world.currentAgents.length
                    if (initialAgents != len) {
                        if (initialAgents < len) {
                            for (var i = initialAgents; i < len; i++) {
                                world.currentAgents[i].die(world)
                            }
                        }
                        else if (initialAgents > len) {

                            for (var i = len; i < initialAgents; i++) {
                                var agent = world.currentAgents[Math.floor(len * Math.random())]
                                var child = agent.spawn();
                            }
                        }
                    }


                    //Universe.settings.godMode = !residentsDieOut;



                    var died = 0;


                    // Computes a rough estimate of the degree of distribution of resources relative to the number of resources outlayed.
                    // Kurtosis overkill for this purpose?
                    var stats = this.resourceStats();
                    var resourceCounters = stats.array
						, min = stats.min
                        , max = stats.max
                        , len = stats.len
                        , sum = stats.sum
                        , range = stats.range
                        , modLength = sum % len
                        , normalisedDiff = range - modLength
                        , relativeRange = range / sum
                        , adjustedRelativeRange = Math.pow(relativeRange, 1 / importanceOfEqualResourceTypes)



                    // Adjust quality based on neighbouring values
                    _.shuffle(world.cells).forEach(function(cell) {
                        if (cell.agentsAllowed) {
                            var x = cell.x, y = cell.y;
                            cell.newSustinability = cell.sustainability;
                            var sustainability = cell.sustainability;
                            var neighbours = world.getNeighbouringCells(x, y),
                                sustainabilities = _.chain(neighbours).map(function(neighbour) { if (neighbour.agentsAllowed) return neighbour.sustainability}).compact().sortBy(function(e) {return e}).value(),
                                midPoint = Math.floor(sustainabilities.length / 2),
                                topHalf = _.rest(sustainabilities, midPoint),
                                topHalfMean = jStat.mean(topHalf),
                                bottomHalf = _.first(sustainabilities, midPoint),
                                bottomHalfMean = jStat.mean(bottomHalf),
                                maxQuality = 0,
                                cumQuality = 0,
                                aveQuality;

                            // Top half mean
                            if ((topHalfMean - sustainability) > thresholdToImproveNeighbours ) {
                                cell.newSustainability = cell.sustainability + 1;
                            }

                            // Bottom half mean
//                            if (( sustainability - bottomHalfMean) < thresholdToImproveNeighbours) {
//                                cell.newSustainability = cell.sustainability - 1;
//                            }
                        }
                    })

                    _.shuffle(world.cells).forEach(function(cell) {
                        if (cell.agentsAllowed && cell.agents.length == 0) {
                            if (!_.isUndefined(cell.newSustainability) && cell.newSustainability <= 100 && cell.sustainability != cell.newSustainability) {
                                cell.sustainability = cell.newSustainability;
                                cell.newSustainability = cell.sustainability;
                            }
                        }
                    })
                    _.shuffle(world.cells).forEach(function(cell) {
                        var x = cell.x, y = cell.y;
                        var sustainability = cell.sustainability;
                        var adjusted = false;
                        var neighbourResources = (world.getNeighbouringResources(x, y));
                        neighbourResources.forEach(function(neighbour) {
                            if (neighbour.totalYield > neighbour.perAgentYield) {
                                var adjustedYield = neighbour.perAgentYield * ( 1 - adjustedRelativeRange);
//                                neighbour.totalYield -= neighbour.perAgentYield;
//                                neighbour.totalYield -= adjustedYield;
                                neighbour.totalYield --;
                                if (cell.sustainability + adjustedYield < 100)
                                    cell.sustainability += adjustedYield;
                                else
                                    cell.sustainability = 100;
                                adjusted = true;
                            }
                        });
                        // Adjust the sustainability for the number of agents on the cell
                        if (! adjusted) {
                            cell.sustainability -= (cell.agents.length);
                        }
                    })

                    // Adjust color based on quality
                    var poorCondition = one.color('#7F3300').alpha(1 - transparency);
                    world.cells.forEach(function(cell) {
                        if (cell.agentsAllowed) {
                            var quality = (cell.sustainability > 100 ) ? 100 : cell.sustainability;
                            cell.terrain = new Terrain(poorCondition.lightness(quality / 100, true));
                        }
                    })

                    // Move agents
                    var moveCapability = Capabilities.MoveRandomlyCapability, nullifiedAgents = [];
                    var moveToBetterHousing = new Capability();
                    (function() {
                        this.name = 'MoveToBetterHousing';
                        this.cost = 0;
                        this.exercise = function(agent, world) {
                            var currentCell = world.getCell(agent.x, agent.y),
                                currentCellQuality = currentCell.sustainability,
                                positions = world.getCellsAtDistance(agent.x, agent.y, 1, Distance.CHEBYSHEV_DISTANCE, false),
                                moveablePositions = _.chain(positions).map(function(cell) {if (cell.agentsAllowed) return cell; }).compact().shuffle().value();

                            var candidateCell = currentCell;
                            for (var i = 0; i < moveablePositions.length; i++) {
                                var testPosition = moveablePositions[i];
                                if (testPosition.sustainability - currentCellQuality > importanceOfMovingToBetterHousing) {
                                    candidateCell = testPosition;
                                    break;
                                }
                            }

                            if (!_.isUndefined(candidateCell))
                                agent.moveTo(candidateCell.x, candidateCell.y);
                        };
                    }).apply(moveToBetterHousing);
                    world.currentAgents.forEach(function(agent) {
                        if (Lifecycle.waveCounter >= agent.delay && agent.countdownToMove % agent.speed == 0) {
                            if (agent.culture.name == 'Residents') {
                                if (residentsDontFollowResources) {
                                    moveCapability.exercise(agent, world);
                                }
                                else {
                                    moveToBetterHousing.exercise(agent, world);
                                }
                            }
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


                    // Calculate affordability
					var affordability = 0
						, sustainability = 0
						, mixedUse = 0;

                    // Calculate housing density
                    var housing = 0, land = world.cells.length;
                    world.resources.forEach(function(resource) {
                        var code = resource.kind.code;
                        if (code == 'low') {
                            housing += 15;
                        }
                        else if (code == 'medium') {
                            housing += 30;
                        }
                        else if (code == 'high') {
                            housing += 50;
                        }
                        else {
                            housing -= 25;
                        }
                    });

                    var pop = world.currentAgents.length * 100;

                    affordability = housing / pop
                    affordability = (affordability > 1 ? 1 : affordability);

                    // Make affordability L-shaped rather than linear
                    affordability = Math.pow(affordability, 1 / 3)

                    // Normalise
                    affordability = affordability * 100;


                    // Calculate mixed use
                    mixedUse = (1 - stats.cappedCoeffvar) * 100

                    // Calculate sustainability
                    var sustainability = _.map(world.cells, function(cell) { return (cell.sustainability); }),
                        totalSustainability = _.reduce(sustainability, function(memo, num){ return memo + num; }, 0),
                        aveSustainability = totalSustainability / world.cells.length;

                    FiercePlanet.Graph.plotData(affordability, aveSustainability, mixedUse);
                }
            })

        // Prepare as a module
        this.id = "RMIT";
        this.name = "RMIT";
        this.position = 1;
        this.worlds = [ this.maze, this.fishermansBend  ];
    }

    this.initRMITWorlds();
}).apply(RMITWorlds);


/**
 * Declare the ResourceTypes namespace
 */
var FB = FB || {};

(function() {
	this.id = 'FB';
	
	// Resource categories
	this.ECO_CATEGORY = new ResourceCategory("Economic", "eco", "#44ABE0");
	this.ENV_CATEGORY = new ResourceCategory("Environmental", "env", "#ABBB2A");
	this.SOC_CATEGORY = new ResourceCategory("Social", "soc", "#DE1F2A");


	/**
	 * Do setup of this resource set
	 */
	this.doSetup = function() {
 

	    // Clear types
	    this.ECO_CATEGORY.clearTypes();
	    this.ENV_CATEGORY.clearTypes();
	    this.SOC_CATEGORY.clearTypes();

	// Economic resources
	    this.ECO_CATEGORY.addType(ResourceTypes.FARM_RESOURCE_TYPE);
	    this.ECO_CATEGORY.addType(ResourceTypes.SHOP_RESOURCE_TYPE);
	    this.ECO_CATEGORY.addType(ResourceTypes.BANK_RESOURCE_TYPE);
	    this.ECO_CATEGORY.addType(ResourceTypes.FACTORY_RESOURCE_TYPE);
	    this.ECO_CATEGORY.addType(ResourceTypes.STOCKMARKET_RESOURCE_TYPE);


	// Environmental resources
	    this.ENV_CATEGORY.addType(ResourceTypes.FRESH_WATER_RESOURCE_TYPE);
	    this.ENV_CATEGORY.addType(ResourceTypes.WILDLIFE_PARK_RESOURCE_TYPE);
	    this.ENV_CATEGORY.addType(ResourceTypes.CLEAN_AIR_RESOURCE_TYPE);
	    this.ENV_CATEGORY.addType(ResourceTypes.GREEN_ENERGY_RESOURCE_TYPE);
	    this.ENV_CATEGORY.addType(ResourceTypes.BIODIVERSITY_RESOURCE_TYPE);


	// Social resources
	var lowDensity = new ResourceType("Low Density Housing", "low", "/images/icons/house-2.png", 10, 20, 100, 20);
	var mediumDensity = new ResourceType("Medium Density Housing", "medium", "/images/icons/buildings.png", 10, 20, 100, 20);
	var highDensity = new ResourceType("High Density Housing", "high", "/images/icons/factories.png", 10, 20, 100, 20);
	    this.SOC_CATEGORY.addType(lowDensity);
	    this.SOC_CATEGORY.addType(mediumDensity);
	    this.SOC_CATEGORY.addType(highDensity);
//		this.SOC_CATEGORY.addType(ResourceTypes.CLINIC_RESOURCE_TYPE);
//	    this.SOC_CATEGORY.addType(ResourceTypes.SCHOOL_RESOURCE_TYPE);
//	    this.SOC_CATEGORY.addType(ResourceTypes.LEGAL_SYSTEM_RESOURCE_TYPE);
	    this.SOC_CATEGORY.addType(ResourceTypes.DEMOCRACY_RESOURCE_TYPE);
	    this.SOC_CATEGORY.addType(ResourceTypes.FESTIVAL_RESOURCE_TYPE);

	    // Arrays of resource kinds
	    this.ECONOMIC_RESOURCE_TYPES = [ResourceTypes.FARM_RESOURCE_TYPE, ResourceTypes.SHOP_RESOURCE_TYPE, ResourceTypes.BANK_RESOURCE_TYPE, ResourceTypes.FACTORY_RESOURCE_TYPE, ResourceTypes.STOCKMARKET_RESOURCE_TYPE];
	    this.ENVIRONMENTAL_RESOURCE_TYPES = [ResourceTypes.FRESH_WATER_RESOURCE_TYPE, ResourceTypes.WILDLIFE_PARK_RESOURCE_TYPE, ResourceTypes.CLEAN_AIR_RESOURCE_TYPE, ResourceTypes.GREEN_ENERGY_RESOURCE_TYPE, ResourceTypes.BIODIVERSITY_RESOURCE_TYPE];
	    this.SOCIAL_RESOURCE_TYPES = [lowDensity, mediumDensity, highDensity, ResourceTypes.DEMOCRACY_RESOURCE_TYPE, ResourceTypes.FESTIVAL_RESOURCE_TYPE];

		this.categories = [this.ECO_CATEGORY, this.ENV_CATEGORY, this.SOC_CATEGORY];
		this.types = this.ECONOMIC_RESOURCE_TYPES.concat(this.ENVIRONMENTAL_RESOURCE_TYPES.concat(this.SOCIAL_RESOURCE_TYPES));
	};
	
}).apply(FB);



(function() {
    this.init = function() {
        var module = new Module();
        module.id = 'RMIT';
        module.registerSelf();
        module.registerCampaign(RMITWorlds);
        module.currentCampaignID = 'RMIT';
        module.registerResourceSet(FB);
        //module.registerResourceSet(CoS);
        FiercePlanet.Game.currentProfile.capabilities = [
			'farm', 'shop', 'bank', 'factory', 'stockmarket'
			, 'water', 'park', 'air', 'energy', 'biodiversity'
			, 'low', 'medium', 'high', 'school', 'festival'
//			, 'legal', 'democracy', 'clinic', 'school', 'festival'
			];
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
            currentCampaignID: 'RMIT',
            currentWorldPreset: true,
            interval: 500,
            worldDelay: 300
        })
        _.extend(FiercePlanet.Orientation, {
            worldWidth: 800,
            worldHeight: 600
        })

        FiercePlanet.ModuleEditor.buildEditorFromUrl('/javascripts/fp-modules/trials/rmit/rmit-module.js', 'RMITModule.init(); FiercePlanet.Game.loadGame();');
    };
}).apply(RMITModule);



if (typeof exports !== "undefined") {
    exports.RMITWorlds = RMITWorlds;
    exports.RMITModule = RMITModule;
}

