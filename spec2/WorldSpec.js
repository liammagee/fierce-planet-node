describe("level-related classes", function() {

    var level;

  beforeEach(function() {
      Lifecycle.currentWorld = level = ModuleManager.currentModule.getLevel(Lifecycle.currentCampaignID, 0);
      level.initLevel();
  });

    describe("initial values", function() {
        it("should have the right dimensions", function() {
            expect(level.cellsDown).toEqual(20);
            expect(level.cellsAcross).toEqual(20);
        });
    });

    describe("get surrounding cells", function() {
        it("should have the correct positions", function() {
            var surroundingPositions = level.getVonNeumannNeighbourhood(0, 0);
            expect(surroundingPositions.length).toEqual(2);
            expect(surroundingPositions[0]).toEqual({x: 1, y: 0});
            expect(surroundingPositions[1]).toEqual({x: 0, y: 1});

            surroundingPositions = level.getVonNeumannNeighbourhood(10, 10);
            expect(surroundingPositions.length).toEqual(4);
            expect(surroundingPositions[0]).toEqual({x: 11, y: 10});
            expect(surroundingPositions[1]).toEqual({x: 10, y: 11});
            expect(surroundingPositions[2]).toEqual({x: 9, y: 10});
            expect(surroundingPositions[3]).toEqual({x: 10, y: 9});

            surroundingPositions = level.getVonNeumannNeighbourhood(19, 19);
            expect(surroundingPositions.length).toEqual(2);
            expect(surroundingPositions[0]).toEqual({x: 18, y: 19});
            expect(surroundingPositions[1]).toEqual({x: 19, y: 18});
        });

        describe("get surrounding cells, when grid is toroidal", function() {
            beforeEach(function() {
                level.allowOffscreenCycling = true;
            });
            it("should have the correct positions", function() {
                var surroundingPositions = level.getVonNeumannNeighbourhood(0, 0);
                expect(surroundingPositions.length).toEqual(4);
                expect(surroundingPositions[0]).toEqual({x: 1, y: 0});
                expect(surroundingPositions[1]).toEqual({x: 0, y: 1});
                expect(surroundingPositions[2]).toEqual({x: 19, y: 0});
                expect(surroundingPositions[3]).toEqual({x: 0, y: 19});
            });
            afterEach(function() {
                level.allowOffscreenCycling = false;
            });

        });
    });

    describe("get objects in the environment", function() {

        describe("get resources in the environment", function() {
            var resource;
            beforeEach(function() {
                level.resources = [];
                level.removeAllResourcesFromContentMap();
                resource = new Resource(Universe.resourceTypes[0], 11, 10);
                level.addResource(resource)
            });

            it("should have a resource", function() {
                expect(level.resources.length).toEqual(1);
            });

            it("should have a resource in the content map", function() {
                var testResource = level.getResourcesAtContentMap(11, 10)[0];
                expect(testResource).toEqual(resource);
            });

            it("remove a resource", function() {
                level.removeResource(resource);
                var testResource = level.getResourcesAtContentMap(11, 10)[0];
                expect(testResource).toBeUndefined();
            });

            it("should have a resource in the surrounding positions", function() {
                var positions = level.getVonNeumannNeighbourhood(10, 10);
                var allResources = [];
                positions.forEach(function(position) {
                    var resources = level.getResourcesAtContentMap(position.x, position.y);
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
                level.currentAgents = [];
                level.removeAllAgentsFromContentMap();
                agent = new Agent(Universe.cultures[0], 10, 10);
                level.currentAgents.push(agent);
                level.addAgentToContentMap(agent);
            });

            it("should have a agent", function() {
                expect(level.currentAgents.length).toEqual(1);
            });

            it("should have a agent in the content map", function() {
                var testAgent = level.getAgentsAtContentMap(10, 10)[0];
                expect(testAgent).toEqual(agent);
            });

            it("remove a agent", function() {
                level.currentAgents = [];
                level.removeAgentFromContentMap(agent);
                var testAgent = level.getAgentsAtContentMap(10, 10)[0];
                expect(testAgent).toBeUndefined();
            });

            it("should have an agent in the surrounding positions", function() {
                var positions = level.getVonNeumannNeighbourhood(11, 10);
                var allAgents = [];
                positions.forEach(function(position) {
                    var agents = level.getAgentsAtContentMap(position.x, position.y);
                    agents.forEach(function(agent) {
                        allAgents.push(agent);
                    })
                });
                expect(allAgents.length).toEqual(1);
                expect(allAgents[0]).toEqual(agent);
            });
        });
    });

    describe("obtaining agents from a level", function() {
        it("should have the right number of agents", function() {
            expect(level.currentAgents.length).toEqual(50);
            expect(level.getCurrentAgents().length).toEqual(50);
        });
        describe("returning a subset of current agents from a level", function() {
            var agent;
            beforeEach(function() {
                agent = new Agent(Universe.cultures[0], 10, 10);
                level.currentAgents.push(agent);
                level.addAgentToContentMap(agent);
                level.currentAgentsFunction = function(agent) { if (agent.x == 10 && agent.y == 10) { return agent; } };
            });

            it("should have the right number of agents when a function is provided", function() {
                expect(level.currentAgents.length).toEqual(51);
                expect(level.getCurrentAgents().length).toEqual(1);
            });

            it("should have the right number of agents when no function is provided", function() {
                level.currentAgentsFunction = undefined;
                expect(level.getCurrentAgents().length).toEqual(51);
            });
        });

    });

});