/*!
 * Fierce Planet
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var WorldVisionWorlds = WorldVisionWorlds || new Campaign();
var WorldVisionModule = WorldVisionModule || {};
var WorldVisionResources = WorldVisionResources || {};


/*!
 * Fierce Planet - ResourceKinds
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


/**
 * Declare the ResourceTypes namespace
 */
WorldVisionResources.id = 'WorldVisionResources';



/**
 * Do setup of this resource set
 */
WorldVisionResources.doSetup = function() {
    // Resource categories
    WorldVisionResources.ECO_CATEGORY = new ResourceCategory("Economic", "eco", "#44ABE0");
    WorldVisionResources.ENV_CATEGORY = new ResourceCategory("Environmental", "env", "#ABBB2A");
    WorldVisionResources.SOC_CATEGORY = new ResourceCategory("Social", "soc", "#DE1F2A");

    // Arrays of resource kinds
    WorldVisionResources.ECONOMIC_RESOURCE_TYPES = [];
    WorldVisionResources.ENVIRONMENTAL_RESOURCE_TYPES = [];
    WorldVisionResources.SOCIAL_RESOURCE_TYPES = [ResourceTypes.WASTE_RESOURCE_TYPE];

    // Clear types
    WorldVisionResources.ECO_CATEGORY.clearTypes();
    WorldVisionResources.ENV_CATEGORY.clearTypes();
    WorldVisionResources.SOC_CATEGORY.clearTypes();

    WorldVisionResources.SOC_CATEGORY.addType(ResourceTypes.WASTE_RESOURCE_TYPE);

    WorldVisionResources.categories = [WorldVisionResources.ECO_CATEGORY, WorldVisionResources.ENV_CATEGORY, WorldVisionResources.SOC_CATEGORY];
    WorldVisionResources.types = WorldVisionResources.ECONOMIC_RESOURCE_TYPES.concat(WorldVisionResources.ENVIRONMENTAL_RESOURCE_TYPES.concat(WorldVisionResources.SOCIAL_RESOURCE_TYPES));
};



(function () {

    this.initWorldVisionWorlds = function () {

        this.wasteInSurabaya  = new World();
        _.extend(this.wasteInSurabaya,
            {
                id: 1,
                name: "Waste in Surabaya",
                introduction: 
                    "<p>This model explores waste management in Surabaya.</p>" +
                    "<p>Using the default settings, residents of the area shown pollute available fresh water with waste.</p>" +
                    "<p>This causes pathogenic bacteria (such as E. coli) to proliferate, impacting upon the health of residents.</p>" +
                    "<p>By introducing waste disposal mechanisms, the residents can reduce the rate of infectious disease, and improve both morbidity and mortality rates.</p>",
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
                        "<p>Water consumed</p><p><input class='world-parameters' name='WaterConsumed' value='1000'/> </p>" +
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
                        {name: 'Water', color: '#f00', maxValue: 100}
                        , {name: 'Health', color: '#0f0', maxValue: 100}
                        , {name: 'Mortality', color: '#00f', maxValue: 100}
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

        // Prepare as a module
        this.id = "WorldVision";
        this.name = "WorldVision";
        this.position = 1;
        this.worlds = [
            this.wasteInSurabaya
        ];
    }

    this.initWorldVisionWorlds();
}).apply(WorldVisionWorlds);


(function() {
    this.init = function() {
        var module = new Module();
        module.id = 'WorldVision';
        module.registerSelf();
        module.registerCampaign(WorldVisionWorlds);
        module.currentCampaignID = 'WorldVision';
//        module.registerResourceSet(TBL);
        module.registerResourceSet(WorldVisionResources);
        FiercePlanet.Game.currentProfile.capabilities = ['waste'];
        Lifecycle.waveDelay = 3000;

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
            currentCampaignID: 'WorldVision',
            currentWorldPreset: true,
            interval: 500,
            worldDelay: 300
        })
        _.extend(FiercePlanet.Orientation, {
            worldWidth: 800,
            worldHeight: 600
        })

        FiercePlanet.ModuleEditor.buildEditorFromUrl('/javascripts/fp/modules/wv/wv-module.js', 'WorldVisionModule.init(); FiercePlanet.Game.loadGame();');
    };
}).apply(WorldVisionModule);

if (typeof exports !== "undefined") {
    exports.WorldVisionWorlds = WorldVisionWorlds;
    exports.WorldVisionModule = WorldVisionModule;
    exports.WorldVisionResources = WorldVisionResources;
}

