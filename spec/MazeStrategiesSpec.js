describe("Maze Strategies", function() {

    var level;

  beforeEach(function() {
      level = new Level(1);
  });



    describe("handling critical path", function() {
        var resource;
        var WORLD_SIZE_A = 17;
        var WORLD_SIZE_D = 17;
        beforeEach(function() {
            level.cellsAcross = WORLD_SIZE_A;
            level.cellsDown = WORLD_SIZE_D;
            level.allowOffscreenCycling = false;
            /*
            level.fillWithTiles();
            level.removeTiles(280, 1);
            level.removeTiles(262, 3);
            level.removeTiles(244, 5);
            level.removeTiles(226, 7);
            level.removeTiles(208, 9);
            level.removeTiles(190, 11);
            level.removeTiles(172, 13);
            level.removeTiles(154, 15);
            level.removeTiles(136, 17);
            level.removeTiles(120, 15);
            level.removeTiles(104, 13);
            level.removeTiles(88, 11);
            level.removeTiles(72, 9);
            level.removeTiles(56, 7);
            level.removeTiles(40, 5);
            level.removeTiles(24, 3);
            level.removeTiles(8, 1);
            */
            level.addExitPoint(WORLD_SIZE_A - 1, 8);
//            level.addExitPoint(WORLD_SIZE_A - 1, WORLD_SIZE_D - 1);
            resource = new Resource(World.resourceTypes[0], 8, 8);
            var resource2 = new Resource(World.resourceTypes[0], 8, 5);
            var resource3 = new Resource(World.resourceTypes[0], 8, 7);
            level.setResources([resource, resource2, resource3]);
            World.settings.resourcesOwnTilesExclusively = true;
        });

        it("should have 1 resource", function() {
          expect(level.resources.length).toEqual(3);
        });

        it("should have an exit point", function() {
          expect(level.exitPoints.length).toEqual(1);
        });

        it("should have 100 cells", function() {
          expect(level.cellsAcross).toEqual(WORLD_SIZE_A);
          expect(level.cellsDown).toEqual(WORLD_SIZE_D);
        });

        it("should have have a critical path", function() {
//            var a = level.criticalPath(0, 9)
//            var a = level.criticalPath(0, 0)
//            var b = level.criticalPath(1, 0)
            var c = FiercePlanet.Framework.MazeStrategies.criticalPath(level, 0, 8)
//            var d = level.criticalPath(2, 2)
//            var e = level.criticalPath(3, 0)
//          console.log(a);
//            console.log(b);
          console.log(c.trail);
          console.log(c.res);
//          console.log(d);
//          console.log(e);
//          expect(level.criticalPath(0, 0)).toEqual(10);
        });

    });



});