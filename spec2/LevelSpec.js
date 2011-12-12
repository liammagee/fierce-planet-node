describe("level-related classes", function() {

    var level;

  beforeEach(function() {
      Lifecycle.currentLevel = level = ModuleManager.currentModule.getLevel(Lifecycle.currentLevelSetID, 0);
      level.initLevel();
  });

    describe("initial values", function() {
        it("should have the right dimensions", function() {
            var surroundingPositions = level.getSurroundingPositions(0, 0);
            expect(level.cellsDown).toEqual(20);
            expect(level.cellsAcross).toEqual(20);
        });
    });

    describe("get surrounding cells", function() {

        it("should have the correct positions", function() {
            var surroundingPositions = level.getSurroundingPositions(0, 0);
            expect(surroundingPositions.length).toEqual(2);
            expect(surroundingPositions[0]).toEqual([1, 0]);
            expect(surroundingPositions[1]).toEqual([0, 1]);

            surroundingPositions = level.getSurroundingPositions(10, 10);
            expect(surroundingPositions.length).toEqual(4);
            expect(surroundingPositions[0]).toEqual([11, 10]);
            expect(surroundingPositions[1]).toEqual([10, 11]);
            expect(surroundingPositions[2]).toEqual([9, 10]);
            expect(surroundingPositions[3]).toEqual([10, 9]);

            surroundingPositions = level.getSurroundingPositions(19, 19);
            expect(surroundingPositions.length).toEqual(2);
            expect(surroundingPositions[0]).toEqual([18, 19]);
            expect(surroundingPositions[1]).toEqual([19, 18]);
        });

    });

    describe("get objects in the environment", function() {

        describe("get resources in the environment", function() {
            var resource;
            beforeEach(function() {
                level.resources = [];
                level.removeAllResourcesFromContentMap();
                resource = new Resource(World.resourceTypes[0], 11, 10);
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
                var positions = level.getSurroundingPositions(10, 10);
                var allResources = [];
                positions.forEach(function(position) {
                    var resources = level.getResourcesAtContentMap(position[0], position[1]);
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
                agent = new Agent(World.cultures[0], 10, 10);
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
                var positions = level.getSurroundingPositions(11, 10);
                var allAgents = [];
                positions.forEach(function(position) {
                    var agents = level.getAgentsAtContentMap(position[0], position[1]);
                    agents.forEach(function(agent) {
                        allAgents.push(agent);
                    })
                });
                expect(allAgents.length).toEqual(1);
                expect(allAgents[0]).toEqual(agent);
            });
        });
    });

});