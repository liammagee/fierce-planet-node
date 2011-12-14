

describe("agent-related classes", function() {
  var culture;
  var agent;

  beforeEach(function() {
      culture = World.cultures[0];
      culture.desires = [Desires.ExploreSpace, Desires.Flee, Desires.ImproveHealth];
      agent = new Agent(culture, 0, 0);
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
                var rankedDesires = Desires.rankDesires(agent);
                expect(rankedDesires[0].name).toEqual('Explore');
                agent.health = 1;
                rankedDesires = Desires.rankDesires(agent);
                expect(rankedDesires[0].name).toEqual('Improve Health');
            });

        });




    });

});