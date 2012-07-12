/*!
 * Fierce Planet
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var TestCampaign = TestCampaign || new Campaign();
var TestModule = TestModule || {};

(function () {
    this.init = function () {
        this.testWorld = new World();
        (function () {
            this.id = 1;
            this.isometricView = false;
            this.allowResourcesOnPath = true;
            this.allowOffscreenCycling = true;
            this.initialResourceStore = 100;
            this.isPresetWorld = true;
            this.randomiseAgents = true;
            this.randomiseResources = true;
//            this.addEntryPoint(19, 0);
//                this.addExitPoint(10, 10);
            this.scaleFactor = 1;
            this.cellsAcross = 20;
            this.cellsDown = 20;
            this.initialAgentNumber = 10;
            this.generateWaveAgentsAutomatically = true;
            this.incrementAgentsEachWave = 1;
//                this.distributeAgentsNormally = true;
//                this.distributeAgentsSigma = 4;
//                this.distributeAgentsHealthNormally = false;
//                this.distributeAgentsHealthSigma = 4;
            this.noSpeedChange = true;
            this.resourcesOwnTilesExclusively = false;
            this.agentsOwnTilesExclusively = true;
            this.allowOffscreenCycling = false;
            this.waveNumber = 1;
            this.expiryLimit = 1000;
            this.initialResourceNumber = 20;
            this.name = ("Totally experimental...");
            this.isTerminalWorld = true;
            this.introduction = "<h3>Test World</h3>";
            this.conclusion = "Well done.";
            this.setup = function () {};
        }).apply(this.testWorld);


        // Prepare as a module
        this.id = "Test Campaign";
        this.name = "Test Campaign";
        this.position = 1;
        this.worlds = [ this.testWorld ];
    }

    this.init();

}).apply(TestCampaign);

(function() {
    this.init = function() {
        var module = new Module();
        module.id = 'Test';
        module.registerSelf();
        module.registerCampaign(TestCampaign);
        module.registerResourceSet(TBL);

        var culture = DefaultCultures.MovingStickman;
        culture.healthCategories = module.resourceSet.categories;
        module.registerCulture(DefaultCultures.MovingStickman);

		Universe.settings.isometricView = false;
        Universe.settings.showGraph = true;

        var localStorage = localStorage || {};
        Lifecycle.interval = 100;
        Lifecycle.currentCampaignID = 'Test Campaign';
        Lifecycle.currentWorldNumber = localStorage.currentWorldNumber = 0;
        Lifecycle.currentWorldPreset = true;
        Lifecycle.worldDelay = 3000;
    };



}).apply(TestModule);

if (typeof exports !== "undefined")
    exports.TestModule = TestModule;

