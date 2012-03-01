/*!
 * Fierce Planet
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var WorldVisionWorlds = WorldVisionWorlds || new Campaign();
var WorldVisionModule = WorldVisionModule || {};


(function () {

    this.initWorldVisionWorlds = function () {

        this.wasteInSurabaya  = new World();
        _.extend(this.wasteInSurabaya,
            {
                id: 1,
                name: "Waste in Surabaya",
                isPresetWorld: true,
                interval: 100,
                cellsAcross: 21,
                cellsDown: 21,
                dontClearCanvas: true,
                scrollingImageVisible: false,
                initialResourceStore: 1000,
                playIndefinitely: true,
                noWander: false,
                noSpeedChange: true,
                allowResourcesOnPath: true,
                mapOptions: ({
                    mapTypeId: google.maps.MapTypeId.HYBRID,
                    center: new google.maps.LatLng(-7.307, 112.7955),
                    zoom: 20,
                    tilt: 0
                }),
                parameters:
                    "<p>Initial agents</p>" +
                        "<div id='initialAgentsSlider' />" +
                        "<input type='hidden' id='initialAgents' class='world-parameters' name='InitialAgents' value='1'/>" +
                        "<p>Rate of personal waste emission</p><p><input class='world-parameters' name='RateOfWasteEmission' value='1'/> </p>" +
                        "<p>No. of waste disposal units</p><p><input class='world-parameters' name='NumWasteDisposalUnits' value='1'/> </p>" +

                        "<p>Health cost</p><p><input class='world-parameters' name='HealthCost' value='1'/> </p>" +

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
                    $( "#initialAgentsSlider" ).slider({
                        value: 20,
                        min: 0,
                        max: 100,
                        step: 1,
                        slide: function( event, ui ) {
                            $( "#initialAgents" ).val( ui.value );
                        }
                    });
                    FiercePlanet.Graph.openDialog();
                    $("#world-graph").show();
                    FiercePlanet.Graph.setupData(
                        {name: 'Agents', color: '#f00', maxValue: 100}
                        , {name: 'Health', color: '#0f0', maxValue: 100}
                        , {name: 'Mortality', color: '#00f', maxValue: 100}
                    );
                },
                handleParameters: function () {
                    var world = this;
                    var initialAgents = parseInt(FiercePlanet.Parameters.InitialAgents)
                        , healthCost = parseInt(FiercePlanet.Parameters.HealthCost)
                        , moveProbability = parseFloat(FiercePlanet.Parameters.MoveProbability)
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
                    _.extend(culture, {
//                        beliefs: [
//                            Beliefs.BeliefsAboutPaths
//                            , Beliefs.BeliefsAboutResources
//                            , Beliefs.BeliefsBasedOnOtherAgentsBeliefs
//                        ]
//                        , desires: [
//                            Desires.ExploreSpace
//                            , Desires.Flee
////        , Desires.ImproveHealth
//                        ]
//                        ,
                        capabilities: [
                            Capabilities.ConsumeResourcesCapability
                            , Capabilities.MoveRandomlyCapability
                        ]
                    });
                    culture.waveNumber = initialAgents;
                    culture.initialSpeed = 1;
                    culture.moveCost = -healthCost;
                    culture.healthCategories = ModuleManager.currentModule.resourceSet.categories;
                    world.cells.forEach(function(cell) {
                        cell.terrain = new Terrain('#090', 0.4);
                        cell.grass = maxGrassHeight;
                        cell.allowResourcesOnPath = true;
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
                        , healthCost = parseInt(FiercePlanet.Parameters.HealthCost)
                        , moveProbability = parseFloat(FiercePlanet.Parameters.MoveProbability)
                        , cooperativeProbability = parseFloat(FiercePlanet.Parameters.CooperativeProbability)
                        , metabolism = parseInt(FiercePlanet.Parameters.Metabolism)
                        , reproductionCost = parseInt(FiercePlanet.Parameters.ReproductionCost)
                        , reproductionThreshold = parseInt(FiercePlanet.Parameters.ReproductionThreshold)
                        , grassEnergy = parseInt(FiercePlanet.Parameters.GrassEnergy)
                        , highGrowthChance = parseInt(FiercePlanet.Parameters.HighGrowthChance)
                        , lowGrowthChance = parseInt(FiercePlanet.Parameters.LowGrowthChance)
                        , maxGrassHeight = parseInt(FiercePlanet.Parameters.MaxGrassHeight)
                        , lowHighThreshold = parseInt(FiercePlanet.Parameters.LowHighThreshold)

                    var moveCapability = Capabilities.MoveRandomlyCapability, nullifiedAgents = [];
                    var died = 0;
                    // Move
//                    world.currentAgents.forEach(function(agent) {
//                        var r = Math.random();
//                        if (r < moveProbability)
//                            moveCapability.exercise(agent, world);
//                        agent.energy -= metabolism;
//                        if (agent.energy < 0) {
//                            agent.die(world);
//                            died++;
//                        }
//                    });
                    // Adjust health
//                    world.currentAgents.forEach(function(agent) {
//                        agent.health -= healthCost;
//                    });
                    // Die
//                    world.currentAgents.forEach(function(agent) {
//                        if (agent.health < 0)
//                            agent.die(world);
//                    });
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
                            agent.spawn();
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
                        cell.terrain = new Terrain('#0' + (cell.grass >= 10 ? 'a' : cell.grass) + '0', 0.2);
                    })
                    FiercePlanet.Drawing.clearCanvas('#baseCanvas');
                    FiercePlanet.Drawing.clearCanvas('#resourceCanvas');
                    FiercePlanet.Drawing.drawPath();


                    var coops = _.map(this.currentAgents, function(agent) { return (agent.breed == 'cooperative' ? 1 : 0); }),
                        totalCoops = _.reduce(coops, function(memo, num){ return memo + num; }, 0);
                    var greedy = _.map(this.currentAgents, function(agent) { return (agent.breed == 'greedy' ? 1 : 0); }),
                        totalGreedy = _.reduce(greedy, function(memo, num){ return memo + num; }, 0);
                    var health = _.map(this.currentAgents, function(agent) { return agent.health ; }),
                        totalHealth = _.reduce(health, function(memo, num){ return memo + num; }, 0);
                    var ageAtDeath = _.map(this.expiredAgents, function(agent) { return agent.diedAt - agent.bornAt; }),
                        totalAgeAtDeath = _.reduce(health, function(memo, num){ return memo + num; }, 0);
//                    FiercePlanet.Graph.plotData(world.currentAgents.length);
                    FiercePlanet.Graph.plotData(world.currentAgents.length, totalHealth / world.currentAgents.length, totalAgeAtDeath / world.expiredAgents.length);
                    console.log(world.currentAgents.length, totalHealth / world.currentAgents.length, totalAgeAtDeath / world.expiredAgents.length, Lifecycle.waveCounter)
                    if (world.currentAgents.length <= 0)
                        Lifecycle._stopAgents();
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
        module.registerResourceSet(TBL);

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
}

