require('./helper.spec.js')

describe("a resource", function() {

    var resource;

    beforeEach(function() {
        TestModule.init();
        resource = new Resource(ResourceTypes.FARM_RESOURCE_TYPE, 0, 0);
    });


    describe("a resource", function() {
        it("should have a category", function() {
            expect(resource.category).toEqual(ModuleManager.currentModule.resourceSet.categories[0]);
        });

        it("should have a type", function() {
            expect(resource.kind).toEqual(ModuleManager.currentModule.resourceSet.types[0]);
        });

        it("should have a per agent yield of 20", function() {
            expect(resource.perAgentYield).toEqual(20);
        });

        it("should have a total yield of 100", function() {
            expect(resource.totalYield).toEqual(100);
        });

        describe("providing a yield", function() {
            var agent;

            beforeEach(function() {
                agent = new Agent(ModuleManager.currentModule.cultures[0], 0, 0);
            });

            it("should not yield anything to an agent in full health", function() {
                resource.provideYield(agent, 10, false);
                expect(resource.totalYield).toEqual(100);
                expect(agent.health).toEqual(100);
                expect(agent.getHealthForResource(resource)).toEqual(100);
            });

            it("should yield health for this resource category", function() {
                agent.adjustGeneralHealth(-90);
                resource.provideYield(agent, 1, false);
                expect(resource.totalYield).toEqual(80);
                expect(agent.health + 0.5 | 0).toEqual(30);
                expect(agent.getHealthForResource(resource)).toEqual(70);
            });

            it("should yield less health for this resource category with a smaller resource effect", function() {
                agent.adjustGeneralHealth(-90);
                resource.provideYield(agent, 0.5, false);
                expect(resource.totalYield).toEqual(80);
                expect(agent.health + 0.5 | 0).toEqual(20);
                expect(agent.getHealthForResource(resource)).toEqual(40);
            });
        });
    });

    /*
require('./helper.spec.js')

describe("a resource", function() {

    var resource;

    beforeEach(function() {
        TestModule.init();
        resource = new Resource(ResourceTypes.FARM_RESOURCE_TYPE, 0, 0);
    });


    describe("a resource", function() {
        it("should have a category", function() {
            expect(resource.category).toEqual(ModuleManager.currentModule.resourceSet.categories[0]);
        });

        it("should have a type", function() {
            expect(resource.kind).toEqual(ModuleManager.currentModule.resourceSet.types[0]);
        });

        it("should have a per agent yield of 20", function() {
            expect(resource.perAgentYield).toEqual(20);
        });

        it("should have a total yield of 100", function() {
            expect(resource.totalYield).toEqual(100);
        });

        describe("providing a yield", function() {
            var agent;

            beforeEach(function() {
                agent = new Agent(ModuleManager.currentModule.cultures[0], 0, 0);
            });

            it("should not yield anything to an agent in full health", function() {
                resource.provideYield(agent, 10, false);
                expect(resource.totalYield).toEqual(100);
                expect(agent.health).toEqual(100);
                expect(agent.getHealthForResource(resource)).toEqual(100);
            });

            it("should yield health for this resource category", function() {
                agent.adjustGeneralHealth(-90);
                resource.provideYield(agent, 1, false);
                expect(resource.totalYield).toEqual(80);
                expect(agent.health + 0.5 | 0).toEqual(30);
                expect(agent.getHealthForResource(resource)).toEqual(70);
            });

            it("should yield less health for this resource category with a smaller resource effect", function() {
                agent.adjustGeneralHealth(-90);
                resource.provideYield(agent, 0.5, false);
                expect(resource.totalYield).toEqual(80);
                expect(agent.health + 0.5 | 0).toEqual(20);
                expect(agent.getHealthForResource(resource)).toEqual(40);
            });
        });

    });
*/
})