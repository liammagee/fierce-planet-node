
require('./helper.spec.js')

describe("the 'universe' - stores system-wide properties    ", function() {

    describe("storing and retrieving setting properties", function() {

        beforeEach(function() {
            if (typeof(localStorage) == "undefined")
                localStorage = {};
        });

        it("should have default settings", function() {
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


        // Requires installation of XCode
        xdescribe("saving and loading setting properties", function() {
            var settingsAsJSON;
            var proxyLocalStorage;

            beforeEach(function() {
                // If in a non-browser environment, construct a proxy
                proxyLocalStorage = localStorage || {};
                settingsAsJSON = Universe.settings.toJSON();
            });

            it("should settings string to exist", function() {
                expect(settingsAsJSON).toBeDefined();
            });

            it("should be possible to save settings as JSON", function() {
                // Restore settings
                Universe.settings.parseJSON(settingsAsJSON);
            });

            xit("should be possible to save and load settings from local storage, explicitly", function() {
                localStorage.settings = Universe.settings.toJSON();
                expect(localStorage.settings).toBeDefined();

                // Restore settings
                Universe.settings.parseJSON(localStorage.settings);
            });

            xit("should be possible to save and load settings from local storage, implicitly", function() {
                Universe.settings.store();

                // Restore settings
                Universe.settings.load();
            });

            xit("should throw an error when invalid JSON is passed in", function() {
                expect(Universe.settings.parseJSON(null)).toBeUndefined();
                expect(Universe.settings.parseJSON("")).toBeUndefined();
                expect(Universe.settings.parseJSON([])).toBeUndefined();
                expect(Universe.settings.parseJSON({})).toBeUndefined();
                expect(Universe.settings.parseJSON(undefined)).toBeUndefined();
            });
        });

    });


})