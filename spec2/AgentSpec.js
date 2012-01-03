


describe("agent-related classes", function() {
  var culture, agent, level;

  beforeEach(function() {
      culture = World.cultures[0];
      culture.beliefs = [
          Beliefs.BeliefsAboutResources
          , Beliefs.BeliefsBasedOnOtherAgentsBeliefs
        , Beliefs.BeliefsAboutPaths
      ];
      culture.desires = [Desires.ExploreSpace, Desires.Flee, Desires.ImproveHealth];
      agent = new Agent(culture, 0, 0);
      Lifecycle.currentLevel = level = ModuleManager.currentModule.getLevel(Lifecycle.currentLevelSetID, 0);
      level.initLevel();
  });

    describe("an agent", function() {
        beforeEach(function(){
            agent.reviseBeliefs(level);
        });

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
                expect(agent.culture.beliefs.length).toEqual(3);
            });


            it("should have beliefs about unvisited cells", function() {
                var possibleCells = [[0, 1], [1, 0]];
                for (var i in agent.memoriesOfPathsUntried) {
                    if (agent.memoriesOfPathsUntried.hasOwnProperty(i)) {
                        var belief = agent.memoriesOfPathsUntried[i];
                        expect(possibleCells).toContain([belief.x, belief.y]);
                    }
                }
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

            it("should be possible for one of the desires ('Explore') to find satisfying objects", function() {
                var rankedDesires = Desires.rankDesires(agent, level),
                    desireToExplore = rankedDesires[0],
                    satisfyingObjects = desireToExplore.findSatisfyingObjects(agent),
                    possibleCells = [[0, 1], [1, 0]];
                satisfyingObjects.forEach(function(obj) {
                    expect(possibleCells).toContain(obj);

                });
            });
        });

        describe("an agent's capabilities", function() {
            beforeEach(function(){
                agent.culture.capabilities = [Capabilities.MoveWithMemoryCapability];
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
            });

            it("should be able to develop a list of desireable objects", function() {
                var rankedDesires = Desires.rankDesires(agent, level),
                    desireToExplore = rankedDesires[0],
                    satisfyingObjects = desireToExplore.findSatisfyingObjects(agent),
                    possibleCells = [[0, 1], [1, 0]];
                var ret = Plans.getAllPlans(agent, level, satisfyingObjects);
                expect(possibleCells).toContain(ret[0].point);
                expect(possibleCells).toContain(ret[1].point);
            });

            describe("plan evaluation after some sequence of moves", function() {
                beforeEach(function() {
                    agent.moveTo(0, 1);
                    agent.reviseBeliefs(level);
                    agent.moveTo(0, 2);
                    agent.reviseBeliefs(level);
                    agent.moveTo(0, 3);
                    agent.reviseBeliefs(level);
                });

                it("should be possible for one of the desires ('Explore') to find satisfying objects", function() {
                    var rankedDesires = Desires.rankDesires(agent, level),
                        desireToExplore = rankedDesires[0],
                        satisfyingObjects = desireToExplore.findSatisfyingObjects(agent),
                        possibleCells = [[1, 0], [ 1, 1], [1, 2], [1, 3], [0, 4]];
                    satisfyingObjects.forEach(function(obj) {
                        expect(possibleCells).toContain(obj);

                    });
                });

                it("should be possible to generate a series of plans", function() {
                    var rankedDesires = Desires.rankDesires(agent, level),
                        desireToExplore = rankedDesires[0],
                        satisfyingObjects = desireToExplore.findSatisfyingObjects(agent),
                        possibleCells = [[1, 0], [ 1, 1], [1, 2], [1, 3], [0, 4]];
                    var ret = Plans.getAllPlans(agent, level, satisfyingObjects);
                    expect(possibleCells.length).toEqual(ret.length);
                    expect(possibleCells).toContain(ret[0].point);
                    expect(possibleCells).toContain(ret[1].point);
                    expect(possibleCells).toContain(ret[2].point);
                    expect(possibleCells).toContain(ret[3].point);
                    expect(possibleCells).toContain(ret[4].point);
                });

                it("should be possible to evaluate the best plans", function() {
                    var rankedDesires = Desires.rankDesires(agent, level),
                        desireToExplore = rankedDesires[0],
                        satisfyingObjects = desireToExplore.findSatisfyingObjects(agent),
                        possibleCells = [ [1, 3], [0, 4]];
                    var ret = Plans.getBestPlans(agent, level, satisfyingObjects);
                    expect(possibleCells.length).toEqual(ret.length);
                    expect(possibleCells).toContain(ret[0].point);
                    expect(possibleCells).toContain(ret[1].point);
                });

            });
        });

        describe("plan evaluation after some sequence of moves, with a cell removed", function() {
            beforeEach(function() {
                if (level.getTile(1, 2) == undefined)
                    level.addDefaultTile(1, 2);
                agent.moveTo(0, 1);
                agent.reviseBeliefs(level);
                agent.moveTo(0, 2);
                agent.reviseBeliefs(level);
                agent.moveTo(0, 3);
                agent.reviseBeliefs(level);
            });

            it("should be possible for one of the desires ('Explore') to find satisfying objects", function() {
                var rankedDesires = Desires.rankDesires(agent, level),
                    desireToExplore = rankedDesires[0],
                    satisfyingObjects = desireToExplore.findSatisfyingObjects(agent),
                    possibleCells = [[1, 0], [ 1, 1], [1, 3], [0, 4]];
                satisfyingObjects.forEach(function(obj) {
                    expect(possibleCells).toContain(obj);

                });
            });

            it("should be possible to generate a series of plans", function() {
                var rankedDesires = Desires.rankDesires(agent, level),
                    desireToExplore = rankedDesires[0],
                    satisfyingObjects = desireToExplore.findSatisfyingObjects(agent),
                    possibleCells = [[1, 0], [ 1, 1], [1, 3], [0, 4]];
                var ret = Plans.getAllPlans(agent, level, satisfyingObjects);
                expect(possibleCells.length).toEqual(ret.length);
                expect(possibleCells).toContain(ret[0].point);
                expect(possibleCells).toContain(ret[1].point);
                expect(possibleCells).toContain(ret[2].point);
                expect(possibleCells).toContain(ret[3].point);
            });

            it("should be possible to evaluate the best plans", function() {
                var rankedDesires = Desires.rankDesires(agent, level),
                    desireToExplore = rankedDesires[0],
                    satisfyingObjects = desireToExplore.findSatisfyingObjects(agent),
                    possibleCells = [ [1, 3], [0, 4]];
                var ret = Plans.getBestPlans(agent, level, satisfyingObjects);
                expect(possibleCells.length).toEqual(ret.length);
                expect(possibleCells).toContain(ret[0].point);
                expect(possibleCells).toContain(ret[1].point);
            });

            it("should be possible to select one of the plans, and execute", function() {
                var possibleCells = [ [1, 3], [0, 4]];
                agent.developPlan(level);
                var plan = agent.currentPlan, step = agent.currentPlanStep;
                expect([agent.x, agent.y]).toEqual([0, 3]);
                expect(possibleCells).toContain(plan.trail[1]);
                expect(step).toEqual(1);
            });

            it("should contain the correct last memories", function() {
                var possibleCells = [ [1, 3], [0, 4]];
                expect([0, 3]).toEqual([agent.lastMemory.x, agent.lastMemory.y]);
                agent.executePlan(level);
                expect(possibleCells).toContain([agent.x, agent.y]);
                expect([0, 3]).toEqual([agent.lastMemory.x, agent.lastMemory.y]);
                agent.reviseBeliefs(level);
                expect(possibleCells).toContain([agent.lastMemory.x, agent.lastMemory.y]);
            });

        });

        describe("plan evaluation with another agent", function() {
            var otherAgent;
            beforeEach(function() {
                if (level.getTile(1, 2) == undefined)
                    level.addDefaultTile(1, 2);
                agent.moveTo(0, 1);
                agent.reviseBeliefs(level);
                agent.moveTo(0, 2);

                otherAgent = new Agent(culture, 0, 4);
                otherAgent.reviseBeliefs(level);
                otherAgent.moveTo(0, 3);
                otherAgent.reviseBeliefs(level);
                otherAgent.moveTo(0, 2);
                otherAgent.reviseBeliefs(level);
                agent.reviseBeliefs(level);
            });

            it("should have the other agents beliefs", function() {
                expect(agent.memoriesOfPlacesVisitedByOtherAgents).toBeDefined();
                expect(agent.memoriesOfPlacesVisitedByOtherAgents[otherAgent.id]).toBeDefined();
                expect(agent.memoriesOfPathsUntriedByOtherAgents).toBeDefined();
                expect(agent.memoriesOfPathsUntriedByOtherAgents[otherAgent.id]).toBeDefined();
                var otherAgentsPlacesVisited = agent.memoriesOfPlacesVisitedByOtherAgents[otherAgent.id],
                    otherAgentsPathsUntried = agent.memoriesOfPathsUntriedByOtherAgents[otherAgent.id],
                    cellsVisited = [[ 0, 4], [ 0, 3], [0, 2]],
                    cellsUnvisited = [[ 1, 3], [ 1, 4], [0, 5]];
                otherAgentsPlacesVisited.forEach(function(obj) {
                    expect(cellsVisited).toContain(obj);
                });
                otherAgentsPathsUntried.forEach(function(obj) {
                    expect(cellsUnvisited).toContain(obj);
                });
            });

            it("should be possible for one of the desires ('Explore') to find satisfying objects", function() {
                var rankedDesires = Desires.rankDesires(agent, level),
                    desireToExplore = rankedDesires[0],
                    satisfyingObjects = desireToExplore.findSatisfyingObjects(agent),
                    possibleCells = [[1, 0], [ 1, 1], [ 1, 3], [ 1, 4], [0, 5]];
                satisfyingObjects.forEach(function(obj) {
                    expect(possibleCells).toContain(obj);
                });
            });

            it("should be possible to generate a series of plans", function() {
                var rankedDesires = Desires.rankDesires(agent, level),
                    desireToExplore = rankedDesires[0],
                    satisfyingObjects = desireToExplore.findSatisfyingObjects(agent),
                    possibleCells = [[1, 0], [ 1, 1], [ 1, 3], [ 1, 4], [0, 5]];
                var ret = Plans.getAllPlans(agent, level, satisfyingObjects);
                expect(possibleCells.length).toEqual(ret.length);
                expect(possibleCells).toContain(ret[0].point);
                expect(possibleCells).toContain(ret[1].point);
                expect(possibleCells).toContain(ret[2].point);
                expect(possibleCells).toContain(ret[3].point);
                expect(possibleCells).toContain(ret[4].point);
            });

            it("should be possible to evaluate the best plans", function() {
                var rankedDesires = Desires.rankDesires(agent, level),
                    desireToExplore = rankedDesires[0],
                    satisfyingObjects = desireToExplore.findSatisfyingObjects(agent),
                    possibleCells = [ [1, 1], [1, 3]];
                var ret = Plans.getBestPlans(agent, level, satisfyingObjects);
                expect(possibleCells.length).toEqual(ret.length);
                expect(possibleCells).toContain(ret[0].point);
                expect(possibleCells).toContain(ret[1].point);
            });

            it("should be possible to select one of the plans, and execute", function() {
                var possibleCells = [ [0, 1], [0, 3]];
                agent.developPlan(level);
                var plan = agent.currentPlan, step = agent.currentPlanStep;
                expect(possibleCells).toContain(plan.trail[1]);
                expect(step).toEqual(1);
            });
        });





    });

});
