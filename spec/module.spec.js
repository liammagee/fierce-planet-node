require('./helper.spec.js')

describe("a module", function() {

    beforeEach(function() {
        TestModule.init();
    });


    describe("initialisation", function() {
        var module;

        beforeEach(function() {
            module = ModuleManager.currentModule;
        })

        it("should be defined", function() {
            expect(module).toBeDefined();
        });

        it("should have an ID", function() {
            expect(module.id).toEqual('Test');
        });


        describe("campaigns", function() {

            it("should have a campaign", function() {
                expect(module.campaigns).toBeDefined();
                expect(module.campaigns['Test Campaign']).toBeDefined();
            });

            it("should retrieve a campaign with an ID", function() {
                expect(module.getCampaign('Test Campaign')).toBeDefined();
            });

            it("should generated an undefined result when a campaign does not exist", function() {
                expect(module.getCampaign('A non-existent Campaign')).toBeUndefined();
            });

            it("should have a world", function() {
                expect(module.getWorld('Test Campaign', 0)).toBeDefined();
            });

            it("should not retrieve an invalid world", function() {
                expect(module.getWorld('Test Campaign', 100000)).toBeUndefined();
                expect(module.getWorld('A non-existent Campaign', 100000)).toBeUndefined();
                module.campaigns = {};
                expect(module.getWorld('Test Campaign', 0)).toBeUndefined();
            });

            describe("a particular campaign", function() {
                var campaign;

                beforeEach(function() {
                    campaign = module.getCampaign('Test Campaign')
                })

                it("should have a name", function() {
                    expect(campaign.name).toEqual('Test Campaign')
                })

                it("should have a position", function() {
                    expect(campaign.position).toEqual(1)
                })

                it("should have a world", function() {
                    expect(campaign.worlds).toBeDefined()
                    expect(campaign.worlds.length).toEqual(1)
                })
            })
        })
    });

});
