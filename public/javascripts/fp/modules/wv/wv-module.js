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
                initialResourceStore: 0,
                playIndefinitely: true,
                noWander: false,
                noSpeedChange: true,
                mapOptions: ({
                    mapTypeId: google.maps.MapTypeId.HYBRID,
                    center: new google.maps.LatLng(-7.307, 112.7955),
                    zoom: 20,
                    tilt: 0
                }),
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
                        cell.terrain = new Terrain('#090', 0.2);
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
                        cell.terrain = new Terrain('#0' + (cell.grass >= 10 ? 'a' : cell.grass) + '0', 0.2);
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

