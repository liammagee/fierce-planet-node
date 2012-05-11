/*!
 * Fierce Planet
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */

var Game2Worlds = Game2Worlds || new Campaign();

var Game2Module = Game2Module || {};


(function () {

    this.initGame2Worlds = function () {
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
            zombieCulture.healthCategories = ModuleManager.currentModule.resourceSet.categories;
            var trollCulture = _.clone(DefaultCultures.MovingStickman);
            trollCulture.initialSpeed = 50;
            trollCulture.healthCategories = ModuleManager.currentModule.resourceSet.categories;

            var wave1 = new Wave();
            wave1.agents = this.generateAgents(zombieCulture, 4);
            wave1.agents = wave1.agents.concat(this.generateAgents(trollCulture, 4));
            wave1.agents = _.shuffle(wave1.agents);

            this.waves = [wave1];

            // Add predators and rivals
//            this.worldAgents = ([new Agent(AgentTypes.PREDATOR_AGENT_TYPE, 0, 9)]);
//            this.waveAgents = ([new Agent(AgentTypes.RIVAL_AGENT_TYPE, 10, 1)]);
        };


        // Prepare as a module
        this.id = "Game2Worlds";
        this.name = "Game2Worlds";
        this.position = 1;
        this.worlds = [
            this.world1
        ];
    }

    this.initGame2Worlds();
}).apply(Game2Worlds);


(function() {

    this.init = function() {
        var module = new Module();
        module.id = 'Game2';
        module.registerSelf();
        module.registerResourceSet(TBL);

        module.registerCampaign(Game2Worlds);
        Lifecycle.currentCampaignID = 'Game2Worlds';
        module.currentCampaignID = 'Game2Worlds';

        Universe.settings.animateWorldAtStart = true;

    };
}).apply(Game2Module);


if (typeof exports !== "undefined")
    exports.Game2Module = Game2Module;


