


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

        describe("an agent", function() {
            it("should have desires", function() {
                var rankedDesires = Desires.rankDesires(agent, level);
                expect(rankedDesires[0].name).toEqual('Explore');
                agent.health = 1;
                rankedDesires = Desires.rankDesires(agent, level);
                expect(rankedDesires[0].name).toEqual('Improve Health');
            });
        });
        describe("an agent's capabilities", function() {
            beforeEach(function(){
                agent.culture.capabilities = [Capabilities.MoveWithMemoryCapability]
            });
            it("should have capabilities", function() {
                expect(agent.culture.capabilities.length).toEqual(1);
            });
            it("should have a move capability", function() {
                var candidates = agent.culture.capabilities[0].evaluate(agent, level);
            });
        });




    });

});
