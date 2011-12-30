


describe("agent-related classes", function() {
  var culture, agent, level;

  beforeEach(function() {
      culture = World.cultures[0];
      culture.desires = [Desires.ExploreSpace, Desires.Flee, Desires.ImproveHealth];
      agent = new Agent(culture, 0, 0);
      Lifecycle.currentLevel = level = ModuleManager.currentModule.getLevel(Lifecycle.currentLevelSetID, 0);
      level.initLevel();
  });

    describe("an agent", function() {
        it("should have a type", function() {
          expect(agent.culture).toEqual(World.cultures[0]);
        });

        it("should have a id", function() {
          expect(agent.id).toBeDefined();
        });

        it("should have a position", function() {
          expect(agent.x).toEqual(0);
          expect(agent.y).toEqual(0);
        });

        describe("an agent's beliefs", function() {
            it("should have beliefs", function() {

            });

            it("should be able to rank desires", function() {
                var rankedDesires = Desires.rankDesires(agent, level);
                expect(rankedDesires[0].name).toEqual('Explore');
                agent.health = 1;
                rankedDesires = Desires.rankDesires(agent, level);
                expect(rankedDesires[0].name).toEqual('Improve Health');
            });
        });

        describe("an agent's desires", function() {
            it("should have desires", function() {
                expect(agent.culture.desires.length).toEqual(3);
            });

            it("should be able to rank desires", function() {
                var rankedDesires = Desires.rankDesires(agent, level);
                expect(rankedDesires[0].name).toEqual('Explore');
                agent.health = 1;
                rankedDesires = Desires.rankDesires(agent, level);
                expect(rankedDesires[0].name).toEqual('Improve Health');
            });
        });

        describe("an agent's capabilities", function() {
            beforeEach(function(){
                agent.culture.capabilities = [Capabilities.MoveWithMemoryCapability];
                agent.reviseBeliefs(level);
            });
            it("should have capabilities", function() {
                expect(agent.culture.capabilities.length).toEqual(1);
            });
            it("should be able to generate a series of arguments", function() {
                var moveCapability = agent.culture.capabilities[0],
                    capabilities = moveCapability.getCapabilities(agent, level),
                    testCapability = capabilities.capability,
                    testArguments = capabilities.arguments;
                expect(testCapability).toEqual(moveCapability);
                expect(testArguments.length).toEqual(2);
            });

            it("should be able to obtain a list of currently exercisable capabilities", function() {
                var capabilities = agent.currentCapabilities(level),
                    first = capabilities[0],
                    second = capabilities[1],
                    possibleCells = [[0, 1], [1, 0]];
                expect(first.capability.name).toEqual('MoveWithMemoryCapability');
                expect(possibleCells).toContain(first.arguments);
                expect(second.capability.name).toEqual('MoveWithMemoryCapability');
                expect(possibleCells).toContain(second.arguments);
            });
        });

        describe("an agent planning", function() {
            beforeEach(function(){
                agent.culture.capabilities = [Capabilities.MoveWithMemoryCapability];
                agent.reviseBeliefs(level);
            });
            it("should have capabilities", function() {
                agent.plan();
            });

        });




    });

});
