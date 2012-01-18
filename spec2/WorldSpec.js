describe("world-related classes", function() {

    var world;

  beforeEach(function() {
      Lifecycle.currentWorld = world = ModuleManager.currentModule.getWorld(Lifecycle.currentCampaignID, 0);
      world.initWorld();
  });

    describe("initial values", function() {
        it("should have the right dimensions", function() {
            expect(world.cellsDown).toEqual(20);
            expect(world.cellsAcross).toEqual(20);
        });
    });

    describe("get surrounding cells", function() {
        it("should have the correct positions", function() {
            var surroundingPositions = world.getVonNeumannNeighbourhood(0, 0);
            expect(surroundingPositions.length).toEqual(2);
            expect(surroundingPositions[0]).toEqual({x: 1, y: 0});
            expect(surroundingPositions[1]).toEqual({x: 0, y: 1});

            surroundingPositions = world.getVonNeumannNeighbourhood(10, 10);
            expect(surroundingPositions.length).toEqual(4);
            expect(surroundingPositions[0]).toEqual({x: 11, y: 10});
            expect(surroundingPositions[1]).toEqual({x: 10, y: 11});
            expect(surroundingPositions[2]).toEqual({x: 9, y: 10});
            expect(surroundingPositions[3]).toEqual({x: 10, y: 9});

            surroundingPositions = world.getVonNeumannNeighbourhood(19, 19);
            expect(surroundingPositions.length).toEqual(2);
            expect(surroundingPositions[0]).toEqual({x: 18, y: 19});
            expect(surroundingPositions[1]).toEqual({x: 19, y: 18});
        });

        describe("get surrounding cells, when grid is toroidal", function() {
            beforeEach(function() {
                world.allowOffscreenCycling = true;
            });
            it("should have the correct positions", function() {
                var surroundingPositions = world.getVonNeumannNeighbourhood(0, 0);
                expect(surroundingPositions.length).toEqual(4);
                expect(surroundingPositions[0]).toEqual({x: 1, y: 0});
                expect(surroundingPositions[1]).toEqual({x: 0, y: 1});
                expect(surroundingPositions[2]).toEqual({x: 19, y: 0});
                expect(surroundingPositions[3]).toEqual({x: 0, y: 19});
            });
            afterEach(function() {
                world.allowOffscreenCycling = false;
            });

        });
    });

    describe("get objects in the environment", function() {

        describe("get resources in the environment", function() {
            var resource;
            beforeEach(function() {
                world.resources = [];
                world.removeAllResourcesFromCells();
                resource = new Resource(Universe.resourceTypes[0], 11, 10);
                world.addResource(resource)
            });

            it("should have a resource", function() {
                expect(world.resources.length).toEqual(1);
            });

            it("should have a resource in the content map", function() {
                var testResource = world.getResourcesAtCell(11, 10)[0];
                expect(testResource).toEqual(resource);
            });

            it("remove a resource", function() {
                world.removeResource(resource);
                var testResource = world.getResourcesAtCell(11, 10)[0];
                expect(testResource).toBeUndefined();
            });

            it("should have a resource in the surrounding positions", function() {
                var positions = world.getVonNeumannNeighbourhood(10, 10);
                var allResources = [];
                positions.forEach(function(position) {
                    var resources = world.getResourcesAtCell(position.x, position.y);
                    resources.forEach(function(resource) {
                        allResources.push(resource);
                    })
                });
                expect(allResources.length).toEqual(1);
                expect(allResources[0]).toEqual(resource);
            });
        });

        describe("get agents in the environment", function() {
            var agent;
            beforeEach(function() {
                world.currentAgents = [];
                world.removeAllAgentsFromCells();
                agent = new Agent(Universe.cultures[0], 10, 10);
                world.currentAgents.push(agent);
                world.addAgentToCell(agent);
            });

            it("should have a agent", function() {
                expect(world.currentAgents.length).toEqual(1);
            });

            it("should have a agent in the content map", function() {
                var testAgent = world.getAgentsAtCell(10, 10)[0];
                expect(testAgent).toEqual(agent);
            });

            it("remove a agent", function() {
                world.currentAgents = [];
                world.removeAgentFromCell(agent);
                var testAgent = world.getAgentsAtCell(10, 10)[0];
                expect(testAgent).toBeUndefined();
            });

            it("should have an agent in the surrounding positions", function() {
                var positions = world.getVonNeumannNeighbourhood(11, 10);
                var allAgents = [];
                positions.forEach(function(position) {
                    var agents = world.getAgentsAtCell(position.x, position.y);
                    agents.forEach(function(agent) {
                        allAgents.push(agent);
                    })
                });
                expect(allAgents.length).toEqual(1);
                expect(allAgents[0]).toEqual(agent);
            });
        });
    });

    describe("obtaining agents from a world", function() {
        it("should have the right number of agents", function() {
            expect(world.currentAgents.length).toEqual(50);
            expect(world.getCurrentAgents().length).toEqual(50);
        });
        describe("returning a subset of current agents from a world", function() {
            var agent;
            beforeEach(function() {
                agent = new Agent(Universe.cultures[0], 10, 10);
                world.currentAgents.push(agent);
                world.addAgentToCell(agent);
                world.currentAgentsFunction = function(agent) { if (agent.x == 10 && agent.y == 10) { return agent; } };
            });

            it("should have the right number of agents when a function is provided", function() {
                expect(world.currentAgents.length).toEqual(51);
                expect(world.getCurrentAgents().length).toEqual(1);
            });

            it("should have the right number of agents when no function is provided", function() {
                world.currentAgentsFunction = undefined;
                expect(world.getCurrentAgents().length).toEqual(51);
            });
        });

    });

});