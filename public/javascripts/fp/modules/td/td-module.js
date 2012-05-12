/*!
 * Fierce Planet
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */

var TowerDefenceWorlds = TowerDefenceWorlds || new Campaign();

var TowerDefenceModule = TowerDefenceModule || {};


(function () {

    this.initTowerDefenceWorlds = function () {
        /* World 1 Definition */
        this.world1 = new World();
        this.world1.id = 1;
        this.world1.thumbnail = '/images/worlds/world-thumbnail-1.png';
        this.world1.isPresetWorld = true;
        this.world1.cellsAcross = 11;
        this.world1.cellsDown = 11;
        this.world1.initialAgentNumber = 1;
        this.world1.waveNumber = 1;
        this.world1.expiryLimit = 20;
        this.world1.name = ("World 1: Welcome to Fierce Planet!");
        this.world1.introduction = (
            "<p>The citizens of Fierce Planet are in danger of extinction. Their cities have been destroyed &mdash; there is a shortage of food and water, law and order has broken down, and disease is rampant.</p>" +
                "<p>Help your citizens rebuild their world before they are wiped out!</p>"
            );
        this.world1.conclusion = (
            "<p>Congratulations, you have helped the citizens of Fierce Planet start rebuilding their Universe... there is still a long way to go!</p>"
            );
        //"<p>The citizens of Fierce Planet are under threat. They are migrating in ever increasing numbers, seeking a promised land of peace and prosperity.</p>" +
        //"<p>Help them by placing resources beside their path - before they expire!</p> "
        // this.world1.tip = new Notice("Drag or click the resources on the right (->), then add them to the map.", FiercePlanet.Orientation.worldWidth - FiercePlanet.Game.WAVE_NOTICE_WIDTH, FiercePlanet.Orientation.halfWorldHeight);
        this.world1.tip = new Notice("Drag or click the resources on the right (->), then add them to the map.");
        this.world1.soundSrc = ("http://db.tt/iFLVJKi");

        this.world1.setup = function() {

            this.addEntryPoint(0, 9);
            this.addExitPoint(10, 1);
            this.forbidAgentsOnAllCells();
            this.allowAgentsOnCellRange(99, 10);
            this.allowAgentsOnCellRange(97, 1);
            this.allowAgentsOnCellRange(78, 9);
            this.allowAgentsOnCellRange(67, 1);
            this.allowAgentsOnCellRange(56, 9);
            this.allowAgentsOnCellRange(53, 1);
            this.allowAgentsOnCellRange(34, 9);
            this.allowAgentsOnCellRange(23, 1);
            this.allowAgentsOnCellRange(12, 10);
            this.addTerrainToPath(new Terrain(one.color('#aaa').alpha(0.8)));

            // Add multiple cultures here
            var zombieCulture = _.clone(DefaultCultures.MovingStickman);
            zombieCulture.name = 'Zombie Stickman';
            zombieCulture.healthCategories = ModuleManager.currentModule.resourceSet.categories;
            zombieCulture.initialSpeed = zombieCulture.initialSpeed * 2;
            zombieCulture.drawFunction = function(ctx, agent, x, y, pieceWidth, pieceHeight, newColor, counter, direction) {
                var zombieImage = new Image();
                zombieImage.onload = function() {
                    console.log(x, y, pieceWidth, pieceHeight)
                    //ctx.drawImage(zombieImage, 0, 0, pieceWidth, pieceHeight);
                    x = x + (FiercePlanet.Orientation.worldWidth) / 2;
                    y = y + (FiercePlanet.Orientation.worldHeight) / 2;
                    //ctx.clearRect(zombieImage, x, y, pieceWidth, pieceHeight);
                    ctx.drawImage(zombieImage, 112, 106, 15, 20, x, y, pieceWidth, pieceHeight);
                };
                zombieImage.src = '/javascripts/fp/modules/td/OGA_16x18_zombie_charas_complete.png'
//                x = x - (FiercePlanet.Orientation.worldWidth) / 2;
//                y = y - (FiercePlanet.Orientation.worldHeight) / 2;

            };
            var trollCulture = _.clone(DefaultCultures.MovingStickman);
            trollCulture.healthCategories = ModuleManager.currentModule.resourceSet.categories;

            var wave1 = new Wave();
            wave1.agents = this.generateAgents(zombieCulture, 36);
            wave1.agents = wave1.agents.concat(this.generateAgents(trollCulture, 24));
            wave1.agents = _.shuffle(wave1.agents);

            this.waves = [wave1];

            // Add predators and rivals
//            this.worldAgents = ([new Agent(AgentTypes.PREDATOR_AGENT_TYPE, 0, 9)]);
//            this.waveAgents = ([new Agent(AgentTypes.RIVAL_AGENT_TYPE, 10, 1)]);
        };


        // Prepare as a module
        this.id = "TowerDefenceWorlds";
        this.name = "TowerDefenceWorlds";
        this.position = 1;
        this.worlds = [
            this.world1
        ];
    }

    this.initTowerDefenceWorlds();
}).apply(TowerDefenceWorlds);


(function() {

    this.init = function() {
        var module = new Module();
        module.id = 'TowerDefence';
        module.registerSelf();
        module.registerResourceSet(TBL);

        module.registerCampaign(TowerDefenceWorlds);
        Lifecycle.currentCampaignID = 'TowerDefenceWorlds';
        module.currentCampaignID = 'TowerDefenceWorlds';

        Universe.settings.animateWorldAtStart = true;

    };
}).apply(TowerDefenceModule);


if (typeof exports !== "undefined")
    exports.TowerDefenceModule = TowerDefenceModule;


