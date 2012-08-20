require('./helper.spec.js')

describe("a module", function() {

    beforeEach(function() {
    });

    describe("using the module manager", function() {
        beforeEach(function() {
            ModuleManager.clearAllModules();
        })

        it("should have no modules registered by default", function() {
            expect(ModuleManager.currentModule).toBeUndefined();
        })


        describe("registering a module", function() {

            var module;

            beforeEach(function() {
                module = new Module();
                module.id = 'A new module';
            })

            it("should be defined", function() {
                expect(module).toBeDefined();
                expect(module.id).toEqual('A new module');
            })

            it("should have undefined or empty campaigns, cultures and resource sets", function() {
                expect(countOwnProperties(module.campaigns)).toEqual(0);
                expect(module.cultures.length).toEqual(0);
                expect(module.resourceSet).toBeUndefined();
            })

            it("should be able to be registered", function() {
                module.registerSelf();
                expect(ModuleManager.currentModule).toEqual(module);
            })
        })
    })

    describe("initialisation", function() {
        var module;

        beforeEach(function() {
            TestModule.init();
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

        describe("cultures", function() {
            it("should have one culture", function() {
                expect(module.cultures.length).toEqual(1);
                expect(module.cultures[0]).toBeDefined();
                expect(module.cultures).toEqual(module.allCultures());
            })

            it("should be possible to add another culture", function() {
                var altCulture = new Culture();
                module.registerCulture(altCulture);
                expect(module.cultures.length).toEqual(2);
                expect(module.cultures[1]).toEqual(altCulture);
            })
        })

        describe("resource sets", function() {

            it("should have a resource set", function() {
                expect(module.resourceSet).toBeDefined();
            })

            it("should have resource categories", function() {
                expect(module.resourceSet.categories.length).toEqual(3);
            })

            it("should have resource types", function() {
                expect(module.resourceSet.types.length).toEqual(15);
            })

            it("should resolve resource types", function() {
                var resourceType = module.resolveResourceType('farm');
                expect(resourceType).toBeDefined();
                expect(resourceType.name).toEqual('Farm');
                expect(resourceType).toEqual(module.resourceSet.types[0]);

                var nonexistentType = module.resolveResourceType('nonExistentResourceType');
                expect(nonexistentType).not.toBeDefined();
            })

            it("should be possible to register a different resource set", function(){
                var altResourceSet = {
                    id: 'Alt Resource Set'
                };
                module.registerResourceSet(altResourceSet);
                expect(module.resourceSet).toBeDefined();
                expect(module.resourceSet).toEqual(altResourceSet);
            })

            it("should ignore a mock resource set without an ID", function(){
                var altResourceSet = {};
                module.registerResourceSet(altResourceSet);
                expect(module.resourceSet).not.toEqual(altResourceSet);
            })
        })
    });

});
