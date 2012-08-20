require('./helper.spec.js')

describe("world-related classes", function() {

  var world;

  beforeEach(function() {
      TestModule.init();
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
        beforeEach(function() {
            world.allowOffscreenCycling = false;
        });
        it("should have the correct positions", function() {
            var surroundingPositions = world.getVonNeumannNeighbourhood(0, 0);
            expect(surroundingPositions.length).toEqual(2);
            expect(surroundingPositions).toContain({x: 0, y: 1});
            expect(surroundingPositions).toContain({x: 1, y: 0});

            surroundingPositions = world.getVonNeumannNeighbourhood(10, 10);
            expect(surroundingPositions.length).toEqual(4);
            expect(surroundingPositions).toContain({x: 11, y: 10});
            expect(surroundingPositions).toContain({x: 10, y: 11});
            expect(surroundingPositions).toContain({x: 9, y: 10});
            expect(surroundingPositions).toContain({x: 10, y: 9});

            surroundingPositions = world.getVonNeumannNeighbourhood(19, 19);
            expect(surroundingPositions.length).toEqual(2);
            expect(surroundingPositions).toContain({x: 18, y: 19});
            expect(surroundingPositions).toContain({x: 19, y: 18});
        });

        describe("get surrounding cells, when grid is toroidal", function() {
            beforeEach(function() {
                world.allowOffscreenCycling = true;
            });
            it("should have the correct positions", function() {
                var surroundingPositions = world.getVonNeumannNeighbourhood(0, 0);
                expect(surroundingPositions.length).toEqual(4);
                expect(surroundingPositions).toContain({x: 1, y: 0});
                expect(surroundingPositions).toContain({x: 0, y: 1});
                expect(surroundingPositions).toContain({x: 19, y: 0});
                expect(surroundingPositions).toContain({x: 0, y: 19});
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
                world.cells.forEach(function(cell) {
                    cell.resourcesAllowed = true;
                })
                world.resetResources();
                resource = new Resource(ModuleManager.currentModule.resourceSet.types[0], 11, 10);
                world.addResource(resource)
            });

            it("should have a resource", function() {
                expect(world.resources.length).toEqual(1);
            });

            it("should have a resource in the content map", function() {
                var testResource = world.getResourcesAtCell(11, 10)[0];
                expect(testResource).toEqual(resource);
            });

            it("should have show position is occupied by the resource", function() {
                expect(world.isPositionOccupiedByResource(11, 10)).toBeTruthy();
            });

            it("should have no resources after a reset", function() {
                world.resetResources();
                expect(world.resources.length).toEqual(0)
            })

            it("should have no world-level resources", function() {
                expect(world.worldResources.length).toEqual(0)
            })

            it("should correctly set a new array of resources", function() {
                var newResources = [];
                world.setResources(newResources)
                expect(world.resources.length).toEqual(0)
                newResources = [resource];
                world.setResources(newResources)
                expect(world.resources.length).toEqual(1)
            })

            it("should have the correct category counts", function() {
                var counts  = world.resourceCategoryCounts,
                    categories = ModuleManager.currentModule.resourceSet.categories;
                expect(counts[categories[0].code]).toEqual(1)
                expect(counts[categories[1].code]).toEqual(0)
                expect(counts[categories[2].code]).toEqual(0)
            })

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


            describe("adding and removing resources", function() {
                var x = 9, y = 10;
                it("should be possible to add another resource", function() {
                    var resourceCount = world.resources.length;
                    var newResource = new Resource(ModuleManager.currentModule.resourceSet.types[1], x, y);
                    world.addResource(newResource)
                    expect(world.resources.length).toEqual(resourceCount + 1)
                    expect(world.isPositionOccupiedByResource(x, y)).toBeTruthy()
                })

                it("should be possible to add another resource randomly", function() {
                    var resourceType = ModuleManager.currentModule.resourceSet.types[5];
                    var counts  = world.resourceCategoryCounts
                    expect(counts[resourceType.category.code]).toEqual(0)
                    world.addResourceRandomly(resourceType)
                    expect(counts[resourceType.category.code]).toEqual(1)
                })

                it("should be possible to remove a resource", function() {
                    var resourceCount = world.resources.length;
                    var newResource = new Resource(ModuleManager.currentModule.resourceSet.types[1], x, y);
                    world.addResource(newResource)
                    expect(world.resources.length).toEqual(resourceCount + 1)
                    world.removeResource(newResource);
                    expect(world.resources.length).toEqual(resourceCount)
                    expect(world.isPositionOccupiedByResource(x, y)).toBeFalsy()
                    expect(world.getResourcesAtCell(x, y)[0]).not.toBeDefined()
                });

                it("should be possible to remove resource by position", function() {
                    var resourceCount = world.resources.length;
                    var newResource = new Resource(ModuleManager.currentModule.resourceSet.types[1], x, y);
                    world.addResource(newResource)
                    expect(world.resources.length).toEqual(resourceCount + 1)
                    world.removeResourceByPosition(x, y)
                    expect(world.resources.length).toEqual(resourceCount)
                    expect(world.isPositionOccupiedByResource(x, y)).toBeFalsy()
                    expect(world.getResourcesAtCell(x, y)[0]).not.toBeDefined()
                })
            })


            describe("world-level resources", function() {
                beforeEach(function() {
                    world.initialResourceNumber = 20;
                    world.randomiseResources = true;
                })

                it("should generate world-level resources", function() {
                    world.generateWorldResources();
                    expect(world.resources.length).toEqual(20)
                })

                it("should remove all generated world-level resources", function() {
                    world.generateWorldResources();
                    expect(world.resources.length).toEqual(20)
                    world.removeWorldResources();
                    expect(world.resources.length).toEqual(0)
                })

                afterEach(function() {
                    world.removeWorldResources();
                    world.initialResourceNumber = 0;
                    world.randomiseResources = false;
                })
            })


            describe("resource counts", function() {
                beforeEach(function() {
                })

                it("should generate the correct resource counts", function() {
                    var categories = ModuleManager.currentModule.resourceSet.categories;
                    expect(world.resourceCategoryCounts[categories[0].code]).toEqual(1)
                    expect(world.resourceCategoryCounts[categories[1].code]).toEqual(0)
                    expect(world.resourceCategoryCounts[categories[2].code]).toEqual(0)
                    // Add an environmental type
                    world.resources.push(new Resource(ModuleManager.currentModule.resourceSet.types[5], 0, 0));
                    expect(world.resourceCategoryCounts[categories[1].code]).toEqual(0)
                    world.resetResourceCategoryCounts()
                    expect(world.resourceCategoryCounts[categories[1].code]).toEqual(1)
                })

            })

			describe("determining resource mix", function() {
				var stats;
				
				beforeEach(function() {
					stats = world.resourceStats()
				});
				
				it("should have an uneven mix", function() {
					expect(stats.min).toEqual(0)
					expect(stats.max).toEqual(1)
					expect(stats.len).toEqual(3)
					expect(stats.sum).toEqual(1)
					expect(stats.range).toEqual(1)
					expect(stats.stdev).toEqual(0.4714045207910317)
					expect(stats.coeffvar).toEqual(1.4142135623730951)
					expect(stats.cappedCoeffvar).toEqual(1)
				})
			})

			describe("determining a resource mix with equal resources", function() {
				var stats;

				beforeEach(function() {
                    world.removeWorldResources();
                    for (var i = 0; i < 10; i ++) {
                        world.addResource(new Resource(ModuleManager.currentModule.resourceSet.types[0], i, i))
                        world.addResource(new Resource(ModuleManager.currentModule.resourceSet.types[5], i + 1, i))
                        world.addResource(new Resource(ModuleManager.currentModule.resourceSet.types[10], i + 2, i))
                    }
					stats = world.resourceStats()
				});

				it("should have an uneven mix", function() {
					expect(stats.min).toEqual(10)
					expect(stats.max).toEqual(10)
					expect(stats.len).toEqual(3)
					expect(stats.sum).toEqual(30)
					expect(stats.range).toEqual(0)
					expect(stats.stdev).toEqual(0)
					expect(stats.coeffvar).toEqual(0)
					expect(stats.cappedCoeffvar).toEqual(0)
				})
			})

        });

        describe("get agents in the environment", function() {
            var agent;
            beforeEach(function() {
                world.currentAgents = [];
                world.removeAllAgentsFromCells();
                agent = new Agent(ModuleManager.currentModule.cultures[0], 10, 10);
                world.currentAgents.push(agent);
                world.addAgentToCell(agent);
            });

            it("should have a agent", function() {
                expect(world.currentAgents.length).toEqual(1);
            });

            it("should have an agent at a specified cell", function() {
                var testAgent = world.getAgentsAtCell(10, 10)[0];
                expect(testAgent).toEqual(agent);
            });

            it("should have a first agent at a specified cell", function() {
                var testAgent = world.getFirstAgentAtCell(10, 10);
                expect(testAgent).toEqual(agent);
            });

            it("should have no agent at another location", function() {
                var testAgent = world.getAgentsAtCell(0, 0);
                expect(testAgent).toEqual([]);
                testAgent = world.getFirstAgentAtCell(0, 0);
                expect(testAgent).toBeUndefined();
            });

            it("remove a agent", function() {
                world.currentAgents = [];
                world.removeAgentFromCell(agent);
                var testAgent = world.getAgentsAtCell(10, 10)[0];
                expect(testAgent).toBeUndefined();
            });


            it("make an agent die", function() {
                agent.die(world);
                var testAgent = world.getAgentsAtCell(10, 10)[0];
                expect(world.currentAgents.length).toEqual(0);
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
            expect(world.currentAgents.length).toEqual(10);
            expect(world.getCurrentAgents().length).toEqual(10);
        });
        describe("returning a subset of current agents from a world", function() {
            var agent;
            beforeEach(function() {
                agent = new Agent(ModuleManager.currentModule.cultures[0], 10, 10);
                world.currentAgents.push(agent);
                world.addAgentToCell(agent);
                world.currentAgentsFunction = function(agent) { if (agent.x == 10 && agent.y == 10) { return agent; } };
            });

            it("should have the right number of agents when a function is provided", function() {
                expect(world.currentAgents.length).toEqual(11);
                expect(world.getCurrentAgents().length).toEqual(1);
            });

            it("should have the right number of agents when no function is provided", function() {
                world.currentAgentsFunction = undefined;
                expect(world.getCurrentAgents().length).toEqual(11);
            });
        });
    });

    describe("finding locations", function() {
        describe("finding cells in a grid space", function() {
            beforeEach(function() {
                world.allowOffscreenCycling = false;
            });
            it("should retrieve cells at a linear distance from a cell location, with cycling", function() {
                var cells = world.getCellsAtDistance(0, 0, 1),
                    positions = _.map(cells, function(cell){ return { x: cell.x, y: cell.y} });
                expect(cells.length).toEqual(3);

                expect(positions).toContain({x: 0, y: 1});
                expect(positions).toContain({x: 1, y: 0});
                expect(positions).toContain({x: 1, y: 1});

                cells = world.getCellsAtDistance(19, 19, 1, Distance.CHEBYSHEV_DISTANCE),
                    positions = _.map(cells, function(cell){ return { x: cell.x, y: cell.y} })
                expect(cells.length).toEqual(3);
                expect(positions).toContain({x: 18, y: 19});
                expect(positions).toContain({x: 18, y: 18});
                expect(positions).toContain({x: 19, y: 18});
                cells = world.getCellsAtDistance(10, 10, 1),
                    positions = _.map(cells, function(cell){ return { x: cell.x, y: cell.y} })
                expect(cells.length).toEqual(8);
                expect(positions).toContain({x: 9, y: 9});
                expect(positions).toContain({x: 10, y: 9});
                expect(positions).toContain({x: 11, y: 9});
                expect(positions).toContain({x: 9, y: 10});
                expect(positions).toContain({x: 11, y: 10});
                expect(positions).toContain({x: 9, y: 11});
                expect(positions).toContain({x: 10, y: 11});
                expect(positions).toContain({x: 11, y: 11});
            });
            it("should retrieve cells at a linear distance from a cell location", function() {
                expect(world.getCellsAtDistance(10, 10, 1, Distance.CHEBYSHEV_DISTANCE).length).toEqual(8);
                expect(world.getCellsAtDistance(10, 10, 2, Distance.CHEBYSHEV_DISTANCE).length).toEqual(24);
                expect(world.getCellsAtDistance(10, 10, 3, Distance.CHEBYSHEV_DISTANCE).length).toEqual(48);
                expect(world.getCellsAtDistance(10, 10, 4, Distance.CHEBYSHEV_DISTANCE).length).toEqual(80);
                expect(world.getCellsAtDistance(10, 10, 5, Distance.CHEBYSHEV_DISTANCE).length).toEqual(120);
            });

            it("should retrieve cells within a radius", function() {
                var cells = world.getCellsAtDistance(10, 10, 1, Distance.MINKOWSKI_DISTANCE),
                    positions = _.map(cells, function(cell){ return { x: cell.x, y: cell.y} })
                expect(cells.length).toEqual(4);
                expect(positions).toContain({x: 10, y: 9});
                expect(positions).toContain({x: 9, y: 10});
                expect(positions).toContain({x: 11, y: 10});
                expect(positions).toContain({x: 10, y: 11});
            });
            it("should retrieve the correct number of cells using a radial strategy", function() {
                expect(world.getCellsAtDistance(10, 10, 1, Distance.MINKOWSKI_DISTANCE).length).toEqual(4);
                expect(world.getCellsAtDistance(10, 10, 2, Distance.MINKOWSKI_DISTANCE).length).toEqual(12);
                expect(world.getCellsAtDistance(10, 10, 3, Distance.MINKOWSKI_DISTANCE).length).toEqual(28);
                expect(world.getCellsAtDistance(10, 10, 4, Distance.MINKOWSKI_DISTANCE).length).toEqual(48);
                expect(world.getCellsAtDistance(10, 10, 5, Distance.MINKOWSKI_DISTANCE).length).toEqual(80);
            });

            it("should retrieve cells within a diagonal distance", function() {
                var cells = world.getCellsAtDistance(10, 10, 1, Distance.TAXICAB_DISTANCE),
                    positions = _.map(cells, function(cell){ return { x: cell.x, y: cell.y} })
                expect(cells.length).toEqual(4);
                expect(positions).toContain({x: 10, y: 9});
                expect(positions).toContain({x: 9, y: 10});
                expect(positions).toContain({x: 11, y: 10});
                expect(positions).toContain({x: 10, y: 11});
                cells = world.getCellsAtDistance(10, 10, 2, 2),
                    positions = _.map(cells, function(cell){ return { x: cell.x, y: cell.y} })
                expect(cells.length).toEqual(12);
                cells = world.getCellsAtDistance(10, 10, 3, 2),
                    positions = _.map(cells, function(cell){ return { x: cell.x, y: cell.y} })
                expect(cells.length).toEqual(24);
            });
            it("should retrieve the correct number of cells using a diagonal (taxicab distance) strategy", function() {
                expect(world.getCellsAtDistance(10, 10, 1, Distance.TAXICAB_DISTANCE).length).toEqual(4);
                expect(world.getCellsAtDistance(10, 10, 2, Distance.TAXICAB_DISTANCE).length).toEqual(12);
                expect(world.getCellsAtDistance(10, 10, 3, Distance.TAXICAB_DISTANCE).length).toEqual(24);
                expect(world.getCellsAtDistance(10, 10, 4, Distance.TAXICAB_DISTANCE).length).toEqual(40);
                expect(world.getCellsAtDistance(10, 10, 5, Distance.TAXICAB_DISTANCE).length).toEqual(60);
            });

            it("should retrieve the cell at this original position", function() {
                var cells = world.getCellsAtDistance(10, 10, 1, 0, true),
                    positions = _.map(cells, function(cell){ return { x: cell.x, y: cell.y} })
                expect(cells.length).toEqual(9);
                expect(positions).toContain({x: 10, y: 10});
            });
        });

        describe("finding cells in a toroidal space", function() {
            beforeEach(function() {
                world.allowOffscreenCycling = true;
            });
            it("should retrieve cells at a linear distance from a cell location", function() {
                var cells = world.getCellsAtDistance(0, 0, 1),
                    positions = _.map(cells, function(cell){ return { x: cell.x, y: cell.y} });
                expect(cells.length).toEqual(8);
                expect(positions).toContain({x: 0, y: 1});
                expect(positions).toContain({x: 1, y: 0});
                expect(positions).toContain({x: 1, y: 1});
                expect(positions).toContain({x: 19, y: 0});
                expect(positions).toContain({x: 19, y: 1});
                expect(positions).toContain({x: 19, y: 19});
                expect(positions).toContain({x: 0, y: 19});
                expect(positions).toContain({x: 1, y: 19});
                cells = world.getCellsAtDistance(19, 19, 1),
                    positions = _.map(cells, function(cell){ return { x: cell.x, y: cell.y} })
                expect(cells.length).toEqual(8);
                expect(positions).toContain({x: 0, y: 19});
                expect(positions).toContain({x: 0, y: 0});
                expect(positions).toContain({x: 19, y: 0});
                expect(positions).toContain({x: 18, y: 0});
                expect(positions).toContain({x: 18, y: 19});
                expect(positions).toContain({x: 18, y: 18});
                expect(positions).toContain({x: 19, y: 18});
                expect(positions).toContain({x: 0, y: 18});
                cells = world.getCellsAtDistance(10, 10, 1),
                    positions = _.map(cells, function(cell){ return { x: cell.x, y: cell.y} })
                expect(cells.length).toEqual(8);
                expect(positions).toContain({x: 9, y: 9});
                expect(positions).toContain({x: 10, y: 9});
                expect(positions).toContain({x: 11, y: 9});
                expect(positions).toContain({x: 9, y: 10});
                expect(positions).toContain({x: 11, y: 10});
                expect(positions).toContain({x: 9, y: 11});
                expect(positions).toContain({x: 10, y: 11});
                expect(positions).toContain({x: 11, y: 11});
            });

            xit("should retrieve cells within a radius", function() {
                var cells = world.getCellsAtDistance(10, 10, 1, Distance.MINKOWSKI_DISTANCE),
                    positions = _.map(cells, function(cell){ return { x: cell.x, y: cell.y} })
                expect(cells.length).toEqual(4);
                expect(positions).toContain({x: 10, y: 9});
                expect(positions).toContain({x: 9, y: 10});
                expect(positions).toContain({x: 11, y: 10});
                expect(positions).toContain({x: 10, y: 11});
            });

            it("should retrieve cells within a diagonal distance", function() {
                var cells = world.getCellsAtDistance(0, 0, 1, Distance.TAXICAB_DISTANCE),
                    positions = _.map(cells, function(cell){ return { x: cell.x, y: cell.y} })
                expect(cells.length).toEqual(4);
                expect(positions).toContain({x: 0, y: 1});
                expect(positions).toContain({x: 1, y: 0});
                expect(positions).toContain({x: 0, y: 19});
                expect(positions).toContain({x: 19, y: 0});
            });
        });

        describe("finding cells in common neighbourhoods", function() {
            it("should retrieve cells in von Neumann neighbourhood", function() {
                var positions = world.getVonNeumannNeighbourhood(10, 10, false);
                expect(positions.length).toEqual(4);
            });
            it("should retrieve cells in Moore neighbourhood", function() {
                var positions = world.getMooreNeighbourhood(10, 10, false);
                expect(positions.length).toEqual(8);
            });
        });
    });



});