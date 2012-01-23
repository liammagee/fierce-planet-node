
// Running in Node?
if (typeof(global) != "undefined") {
    global.Log = require('../public/javascripts/fp/utils/log').Log;
    global.ResourceCategory = require('../public/javascripts/fp/core/resource').ResourceCategory;
    global.ResourceType = require('../public/javascripts/fp/core/resource').ResourceType;
    global.Resource = require('../public/javascripts/fp/core/resource').Resource;
    global.World = require('../public/javascripts/fp/core/world').World;
    global.Level = require('../public/javascripts/fp/core/level').Level;
//    global.FiercePlanet = require('../public/javascripts/fp/core/maze-strategies').FiercePlanet;
//    global.FiercePlanet.Framework = require('../public/javascripts/fp/core/maze-strategies').FiercePlanet.Framework;
//    global.FiercePlanet.Framework.MazeStrategies = require('../public/javascripts/fp/core/maze-strategies').FiercePlanet.Framework.MazeStrategies;
    global.AgentType = require('../public/javascripts/fp/core/agent').AgentType;
    global.Agent = require('../public/javascripts/fp/core/agent').Agent;
    global.DEFAULT_INITIAL_SPEED = require('../public/javascripts/fp/core/culture').DEFAULT_INITIAL_SPEED;
    global.DEFAULT_INITIAL_HEALTH = require('../public/javascripts/fp/core/agent').DEFAULT_INITIAL_HEALTH;
    global.Culture = require('../public/javascripts/fp/core/agent/culture.js').Culture;
    global.Tile = require('../public/javascripts/fp/core/tile').Tile;
    global.DEFAULT_TILE_COLOR = require('../public/javascripts/fp/core/terrain').DEFAULT_TILE_COLOR;
    global.Terrain = require('../public/javascripts/fp/core/terrain').Terrain;

    var jsdom = require('jsdom').jsdom,
        myWindow = jsdom().createWindow(),
        $ = require('jquery/dist/node-jquery'),
        jq = require('jquery/dist/node-jquery').create(),
        jQuery = require('jquery/dist/node-jquery').create(myWindow);

    require('../public/javascripts/jstat-1.0.0/js/jstat-1.0.0')
    require('../public/javascripts/sylvester/sylvester')

// Add these variables to global namespace
    global.$ = $;
    global.jQuery = jQuery;
}



// Top level anonymous function for defining some general resource categories and types
(function() {

    // Create categories
    var ecoResourceCategory = new ResourceCategory("Economic", "eco", "44ABE0");
    var envResourceCategory = new ResourceCategory("Environmental", "env", "CBDB2A");
    var socResourceCategory = new ResourceCategory("Social", "soc", "DE1F2A");

    // Create types
    var ecoResourceType = new ResourceType("Farm", "farm", "", 10, 20, 100, 20);
    var envResourceType = new ResourceType("Water", "water", "", 10, 20, 100, 10);
    var socResourceType = new ResourceType("Clinic", "clinic", "", 10, 20, 100, 5);

    // Assign categories to types
    ecoResourceType.category = (ecoResourceCategory);
    envResourceType.category = (envResourceCategory);
    socResourceType.category = (socResourceCategory);

    var resourceCategories = [ecoResourceCategory, envResourceCategory, socResourceCategory];
    var resourceTypes = [ecoResourceType, envResourceType, socResourceType];

    // Create agent types
    var citizenAgentType = new AgentType("citizen", "000", resourceCategories);
    var predatorAgentType = new AgentType("predator", "000", resourceCategories);
    var agentTypes = [citizenAgentType, predatorAgentType];

    Universe.registerResourceCategories(resourceCategories);
    Universe.registerResourceTypes(resourceTypes);
    Universe.registerCultures(agentTypes);
})();


describe("world-related classes", function() {

    beforeEach(function() {
        if (typeof(localStorage) == "undefined")
            localStorage = {};
    });

    describe("world", function() {
        it("should have 3 resource categories", function() {
            expect(Universe.resourceCategories.length).toEqual(3);
        });

        it("should have 3 resource types", function() {
            expect(Universe.resourceTypes.length).toEqual(3);
        });

        it("should have 2 agent types", function() {
            expect(Universe.cultures.length).toEqual(2);
        });

        it("should resolve a type given its code", function() {
            expect(Universe.resolveResourceType("farm")).toEqual(Universe.resourceTypes[0]);
            expect(Universe.resolveResourceType("water")).toEqual(Universe.resourceTypes[1]);
            expect(Universe.resolveResourceType("clinic")).toEqual(Universe.resourceTypes[2]);
            expect(Universe.resolveResourceType("legal")).toBeUndefined();
        });

        describe("adding a different namespace", function() {
            beforeEach(function() {
                Universe.resourceTypeNamespace = {};
                Universe.resourceTypeNamespace.name = "Triple bottom line";
            });

            it("should have a namespace", function() {
                expect(Universe.resourceTypeNamespace).toBeDefined();
            });
        });


        describe("storing and retrieving setting properties", function() {

            beforeEach(function() {
            });

            it("should have default settings", function() {
                expect(Universe.settings.agentsCanCommunicate).toBeTruthy();
                expect(Universe.settings.agentsHaveRandomInitialHealth).toBeFalsy();
                expect(Universe.settings.agentsCanAdjustSpeed).toBeTruthy();
                expect(Universe.settings.agentsCanAdjustWander).toBeTruthy();
                expect(Universe.settings.agentCostPerMove).toEqual(Universe.settings.DEFAULT_AGENT_COST_PER_MOVE);

                expect(Universe.settings.resourcesUpgradeable).toBeFalsy();
                expect(Universe.settings.resourcesInTension).toBeFalsy();
                expect(Universe.settings.resourcesInTensionGlobally).toBeFalsy();
                expect(Universe.settings.resourceBonus).toBeFalsy();
                expect(Universe.settings.applyGeneralHealth).toBeFalsy();
                expect(Universe.settings.ignoreResourceBalance).toBeFalsy();
                expect(Universe.settings.rateOfResourceRecovery).toEqual(Universe.settings.DEFAULT_RESOURCE_RECOVERY_RATE);
            });

            it("should be possible to set property settings", function() {
                Universe.settings.agentsCanCommunicate = false;
                expect(Universe.settings.agentsCanCommunicate).toBeFalsy();
                Universe.settings.agentsHaveRandomInitialHealth = true;
                expect(Universe.settings.agentsHaveRandomInitialHealth).toBeTruthy();
                Universe.settings.resourcesUpgradeable = true;
                expect(Universe.settings.resourcesUpgradeable).toBeTruthy();
                Universe.settings.resourcesInTension = true;
                expect(Universe.settings.resourcesInTension).toBeTruthy();
                Universe.settings.resourcesInTensionGlobally = true;
                expect(Universe.settings.resourcesInTensionGlobally).toBeTruthy();
                Universe.settings.resourceBonus = true;
                expect(Universe.settings.resourceBonus).toBeTruthy();
                Universe.settings.applyGeneralHealth = true;
                expect(Universe.settings.applyGeneralHealth).toBeTruthy();
                Universe.settings.ignoreResourceBalance = true;
                expect(Universe.settings.ignoreResourceBalance).toBeTruthy();

                Universe.settings.agentCostPerMove = -4;
                expect(Universe.settings.agentCostPerMove).toNotEqual(Universe.settings.DEFAULT_AGENT_COST_PER_MOVE);
                Universe.settings.rateOfResourceRecovery = 3;
                expect(Universe.settings.rateOfResourceRecovery).toNotEqual(Universe.settings.DEFAULT_RESOURCE_RECOVERY_RATE);
            });

            it("should be possible to store arbitrary properties", function() {
                expect(Universe.settings.someArbitraryProperty).toBeUndefined();
                Universe.settings.someArbitraryProperty = true;
                expect(Universe.settings.someArbitraryProperty).toBeTruthy();
                Universe.settings.someArbitraryProperty = false;
                expect(Universe.settings.someArbitraryProperty).toBeFalsy();
            });

            describe("reset property values", function() {
                beforeEach(function() {
                    Universe.settings.agentsCanCommunicate = false;
                });

                it("should have a new value", function() {
                    expect(Universe.settings.agentsCanCommunicate).toBeFalsy();
                });

                it("should have a new value", function() {
                    initUniverse.apply(World);
                    expect(Universe.settings.agentsCanCommunicate).toBeTruthy();
                });
            });


            describe("saving and loading setting properties", function() {
                var settingsAsJSON;
                var proxyLocalStorage;

                beforeEach(function() {
                    // If in a non-browser environment, construct a proxy
                    proxyLocalStorage = localStorage || {};
                    Universe.settings.agentsCanCommunicate = true;
                    settingsAsJSON = Universe.settings.toJSON();
                });

                it("should settings string to exist", function() {
                    expect(settingsAsJSON).toBeDefined();
                });

                it("should be possible to save settings as JSON", function() {
                    Universe.settings.agentsCanCommunicate = false;
                    expect(Universe.settings.agentsCanCommunicate).toBeFalsy();

                    // Restore settings
                    Universe.settings.parseJSON(settingsAsJSON);
                    expect(Universe.settings.agentsCanCommunicate).toBeTruthy();
                });

                it("should be possible to save and load settings from local storage, explicitly", function() {
                    localStorage.settings = Universe.settings.toJSON();
                    expect(localStorage.settings).toBeDefined();

                    Universe.settings.agentsCanCommunicate = false;
                    expect(Universe.settings.agentsCanCommunicate).toBeFalsy();

                    // Restore settings
                    Universe.settings.parseJSON(localStorage.settings);
                    expect(Universe.settings.agentsCanCommunicate).toBeTruthy();
                });

                it("should be possible to save and load settings from local storage, implicitly", function() {
                    Universe.settings.store();

                    Universe.settings.agentsCanCommunicate = false;
                    expect(Universe.settings.agentsCanCommunicate).toBeFalsy();

                    // Restore settings
                    Universe.settings.load();
                    expect(Universe.settings.agentsCanCommunicate).toBeTruthy();
                });

                it("should throw an error when invalid JSON is passed in", function() {
                    Universe.settings.agentsCanCommunicate = false;

                    expect(Universe.settings.parseJSON(null)).toBeUndefined();
                    expect(Universe.settings.parseJSON("")).toBeUndefined();
                    expect(Universe.settings.parseJSON([])).toBeUndefined();
                    expect(Universe.settings.parseJSON({})).toBeUndefined();
                    expect(Universe.settings.parseJSON(undefined)).toBeUndefined();

                    // Settings properties should be undisturbed
                    expect(Universe.settings.agentsCanCommunicate).toBeFalsy();
                });
            });

        });
    });


});

