/*!
 * Fierce Planet - Levels
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */

/* NB: Level is defined in level.js */

var FiercePlanet = FiercePlanet || {};



/**
 * @namespace The namespace for preset levels
 */
FiercePlanet.PresetLevels = FiercePlanet.PresetLevels || {};

/**
 * @constant The number of preset levels
 */
FiercePlanet.PresetLevels.MAX_DEFAULT_LEVELS = 1000;

/* Level 0 Definition */

FiercePlanet.PresetLevels.level0 = new Level(0);
FiercePlanet.PresetLevels.level0.isPresetLevel = true;
FiercePlanet.PresetLevels.level0.addEntryPoint(0, 0);
FiercePlanet.PresetLevels.level0.addExitPoint(4, 4);
FiercePlanet.PresetLevels.level0.cellsAcross = 5;
FiercePlanet.PresetLevels.level0.cellsDown = 5;
FiercePlanet.PresetLevels.level0.initialAgentNumber = 1;
FiercePlanet.PresetLevels.level0.waveNumber = 3;
FiercePlanet.PresetLevels.level0.expiryLimit = 20;
FiercePlanet.PresetLevels.level0.name = ("Tutorial");
FiercePlanet.PresetLevels.level0.introduction = ("" +
        "<p>The citizens of Fierce Planet are in danger of extinction. Their cities have been destroyed &mdash; there is a shortage of food and water, law and order has broken down, and disease is rampant.</p>" +
        "<p>The aim of the game is to help citizens survive as they build a sustainable city. Their start point is marked by a green circle, and the goal by a white circle. Both circles reflect your progress as more waves of citizens come through.</p> " +
        "<p>You can save your citizens by placing <em>resources</em> on tiles around their path. You can click on tiles to select a resource, or drag resources from the panel on the right onto the game map.</p> " +
        "<p>Resources come in three kinds: economic, environmental and social. Your citizens need all of these to build a sustainable city. " +
        "If you don't provide enough resources of a particular kind, your citizens will start turning that colour. This indicates you need to put down some resources of that colour to help your citizens.</p> " +
        "<p>You start with a limited amount of resources. Saving citizens will allow you to place more resources, which will allow you to help others.</p> " +
        "<p>Begin by placing some resources on the map. When you are ready, click the 'Play' button in the Control Panel on the left. After a few seconds, citizens will start marching towards their goal.</p> "
        );
FiercePlanet.PresetLevels.level0.conclusion = ("Well done - you have completed the tutorial. Now time to help your citizens on Level 1.");

FiercePlanet.PresetLevels.level0.setup = function() {
    this.fillWithTiles();
    this.removeTiles(20, 5);
    this.removeTiles(15, 1);
    this.removeTiles(10, 5);
    this.removeTiles(9, 1);
    this.removeTiles(0, 5);
};


/* Level 1 Definition */

FiercePlanet.PresetLevels.level1 = new Level(1);
FiercePlanet.PresetLevels.level1.isPresetLevel = true;
FiercePlanet.PresetLevels.level1.addEntryPoint(0, 9);
FiercePlanet.PresetLevels.level1.addExitPoint(10, 1);
FiercePlanet.PresetLevels.level1.cellsAcross = 11;
FiercePlanet.PresetLevels.level1.cellsDown = 11;
FiercePlanet.PresetLevels.level1.initialAgentNumber = 1;
FiercePlanet.PresetLevels.level1.waveNumber = 10;
FiercePlanet.PresetLevels.level1.expiryLimit = 20;
FiercePlanet.PresetLevels.level1.name = ("Level 1: Welcome to Fierce Planet!");
FiercePlanet.PresetLevels.level1.introduction = (
        "<p>The citizens of Fierce Planet are in danger of extinction. Their cities have been destroyed &mdash; there is a shortage of food and water, law and order has broken down, and disease is rampant.</p>" +
                "<p>Help your citizens rebuild their world before they are wiped out!</p>"
);
FiercePlanet.PresetLevels.level1.conclusion = (
        "<p>Congratulations, you have helped the citizens of Fierce Planet start rebuilding their world... there is still a long way to go!</p>"
);
//"<p>The citizens of Fierce Planet are under threat. They are migrating in ever increasing numbers, seeking a promised land of peace and prosperity.</p>" +
//"<p>Help them by placing resources beside their path - before they expire!</p> "
FiercePlanet.PresetLevels.level1.tip = (new Notice("Drag or click the resources on the right (->), then add them to the map.", FiercePlanet.Orientation.worldWidth - FiercePlanet.WAVE_NOTICE_WIDTH, FiercePlanet.Orientation.halfWorldHeight));
FiercePlanet.PresetLevels.level1.soundSrc = ("http://db.tt/iFLVJKi");


FiercePlanet.PresetLevels.level1.setup = function() {
    this.fillWithTiles();
    this.removeTiles(99, 10);
    this.removeTiles(97, 1);
    this.removeTiles(78, 9);
    this.removeTiles(67, 1);
    this.removeTiles(56, 9);
    this.removeTiles(53, 1);
    this.removeTiles(34, 9);
    this.removeTiles(23, 1);
    this.removeTiles(12, 10);
    this.addTerrainToPath(new Terrain('#aaa', 0.8));

    // Add predators and rivals
    this.levelAgents = ([new Agent(AgentTypes.PREDATOR_AGENT_TYPE, 0, 9)]);
    this.waveAgents = ([new Agent(AgentTypes.RIVAL_AGENT_TYPE, 10, 1)]);
};


/* Level 2 Definition */

FiercePlanet.PresetLevels.level2 = new Level(2);
FiercePlanet.PresetLevels.level2.isPresetLevel = true;
FiercePlanet.PresetLevels.level2.addEntryPoint(0, 0);
FiercePlanet.PresetLevels.level2.addExitPoint(11, 1);
FiercePlanet.PresetLevels.level2.cellsAcross = 12;
FiercePlanet.PresetLevels.level2.cellsDown = 12;
FiercePlanet.PresetLevels.level2.initialAgentNumber = 1;
FiercePlanet.PresetLevels.level2.waveNumber = 10;
FiercePlanet.PresetLevels.level2.expiryLimit = 10;
FiercePlanet.PresetLevels.level2.initialResourceStore = 120 ;
FiercePlanet.PresetLevels.level2.name = ("Level 2: Twists and Turns");
FiercePlanet.PresetLevels.level2.introduction = (
        "<p>The citizens of Fierce Planet are slowly building their city. With your help they can make it a place of peace and prosperity.</p>"
//        "<p>The citizens of Fierce Planet have survived their first great challenge. But life is about to get much tougher...</p>"
);
FiercePlanet.PresetLevels.level2.conclusion = (
        "<p>Well done, you have completed level 2. The hard work must continue...</p>"
);
FiercePlanet.PresetLevels.level2.tip = (new Notice("You can pause at any time to add resources. You can place more resources as you save citizens.", 0, 0));
FiercePlanet.PresetLevels.level2.soundSrc = ("http://db.tt/Tyd9F6M");

FiercePlanet.PresetLevels.level2.setup = function() {
    this.fillWithTiles();
    this.removeTiles(121, 10);
    this.removeTiles(118, 1);
    this.removeTiles(109, 1);
    this.removeTiles(102, 5);
    this.removeTiles(97, 4);
    this.removeTiles(90, 1);
    this.removeTiles(88, 1);
    this.removeTiles(78, 5);
    this.removeTiles(73, 4);
    this.removeTiles(70, 1);
    this.removeTiles(61, 1);
    this.removeTiles(54, 5);
    this.removeTiles(49, 4);
    this.removeTiles(42, 1);
    this.removeTiles(40, 1);
    this.removeTiles(32, 3);
    this.removeTiles(30, 1);
    this.removeTiles(25, 4);
    this.removeTiles(22, 2);
    this.removeTiles(18, 3);
    this.removeTiles(13, 1);
    this.removeTiles(0, 2);
    
    this.addTerrainToPath(new Terrain('#BFB3A7', 0.8));
};


/* Level 3 Definition */

FiercePlanet.PresetLevels.level3 = new Level(3);
FiercePlanet.PresetLevels.level3.isPresetLevel = true;
FiercePlanet.PresetLevels.level3.addEntryPoint(5, 12);
FiercePlanet.PresetLevels.level3.addExitPoint(3, 3);
FiercePlanet.PresetLevels.level3.cellsAcross = 13;
FiercePlanet.PresetLevels.level3.cellsDown = 13;
FiercePlanet.PresetLevels.level3.initialAgentNumber = 1;
FiercePlanet.PresetLevels.level3.waveNumber = 10;
FiercePlanet.PresetLevels.level3.expiryLimit = 10;
FiercePlanet.PresetLevels.level3.initialResourceStore =150 ;
FiercePlanet.PresetLevels.level3.name = ("Level 3: Waves of Uncertainty");
FiercePlanet.PresetLevels.level3.introduction = (
        "<p>The rebuilding of Fierce Planet is proceeding well... but how can you plan for a random act of nature??!!! </p>"
//        "<p>So far, everything seems to be proceeding as planned. But on Fierce Planet, learn to expect the unexpected... </p>"
);
FiercePlanet.PresetLevels.level3.conclusion = (
        "<p>Phew - that was a rush! Perhaps the citizens will need to head inland for a while.</p>"
);
FiercePlanet.PresetLevels.level3.tip = new Notice("The levels get progressively larger, requiring more planning as to where you allocate resources. Aim to place resources at regular intervals along the path.");
FiercePlanet.PresetLevels.level3.soundSrc = "http://db.tt/7KPJ8Xi";
FiercePlanet.PresetLevels.level3.catastrophe = (new Catastrophe(TBL.ENV_CATEGORY, 1000 + (Math.random() * 1000), 250, 0.8, new Notice("A tsumani will soon hit the city - some of its resources will be depleted.", undefined, undefined, 500, 250, undefined, undefined, TBL.ENV_CATEGORY.color, "000000")));


FiercePlanet.PresetLevels.level3.setup = function() {
    this.fillWithTiles();
    this.removeTiles(161, 1);
    this.removeTiles(150, 5);
    this.removeTiles(148, 1);
    this.removeTiles(144, 3);
    this.removeTiles(141, 1);
    this.removeTiles(137, 1);
    this.removeTiles(135, 1);
    this.removeTiles(133, 1);
    this.removeTiles(131, 1);
    this.removeTiles(126, 3);
    this.removeTiles(124, 1);
    this.removeTiles(122, 1);
    this.removeTiles(120, 1);
    this.removeTiles(118, 1);
    this.removeTiles(113, 1);
    this.removeTiles(111, 1);
    this.removeTiles(109, 1);
    this.removeTiles(107, 1);
    this.removeTiles(105, 1);
    this.removeTiles(100, 3);
    this.removeTiles(96, 3);
    this.removeTiles(94, 1);
    this.removeTiles(92, 1);
    this.removeTiles(89, 1);
    this.removeTiles(81, 1);
    this.removeTiles(79, 1);
    this.removeTiles(68, 9);
    this.removeTiles(66, 1);
    this.removeTiles(53, 1);
    this.removeTiles(42, 9);
    this.removeTiles(40, 1);
    this.removeTiles(37, 1);
    this.removeTiles(27, 1);
    this.removeTiles(14, 11);
    
    this.addTerrainToPath(new Terrain('#BBB1B0', 0.8));
};


/* Level 4 Definition */

FiercePlanet.PresetLevels.level4 = new Level(4);
FiercePlanet.PresetLevels.level4.isPresetLevel = true;
FiercePlanet.PresetLevels.level4.addEntryPoint(6, 6);
FiercePlanet.PresetLevels.level4.addExitPoint(0, 0);
FiercePlanet.PresetLevels.level4.cellsAcross = 14;
FiercePlanet.PresetLevels.level4.cellsDown = 14;
FiercePlanet.PresetLevels.level4.initialAgentNumber = 1;
FiercePlanet.PresetLevels.level4.waveNumber = 10;
FiercePlanet.PresetLevels.level4.expiryLimit = 10;
FiercePlanet.PresetLevels.level4.initialResourceStore =180 ;
FiercePlanet.PresetLevels.level4.name = ("Level 4: Spiral of Doom");
FiercePlanet.PresetLevels.level4.introduction = (
        "<p>The only way out is via the long and winding road...</p>"
        );
FiercePlanet.PresetLevels.level4.tip = (new Notice("Be sure to allocate resources to the outer reaches of the path. Citizens will run faster when there is less to go around..."));
FiercePlanet.PresetLevels.level4.soundSrc = ("http://db.tt/9m8kuIs");
FiercePlanet.PresetLevels.level4.conclusion = ("Your citizens are feeling dizzy! But thankfully they have survived!");

FiercePlanet.PresetLevels.level4.setup = function() {
    this.fillWithTiles();
    this.removeTiles(168, 13);
    this.removeTiles(166, 1);
    this.removeTiles(154, 1);
    this.removeTiles(152, 1);
    this.removeTiles(142, 9);
    this.removeTiles(140, 1);
    this.removeTiles(138, 1);
    this.removeTiles(136, 1);
    this.removeTiles(128, 1);
    this.removeTiles(126, 1);
    this.removeTiles(124, 1);
    this.removeTiles(122, 1);
    this.removeTiles(116, 5);
    this.removeTiles(114, 1);
    this.removeTiles(112, 1);
    this.removeTiles(110, 1);
    this.removeTiles(108, 1);
    this.removeTiles(106, 1);
    this.removeTiles(102, 1);
    this.removeTiles(100, 1);
    this.removeTiles(98, 1);
    this.removeTiles(96, 1);
    this.removeTiles(94, 1);
    this.removeTiles(92, 1);
    this.removeTiles(90, 1);
    this.removeTiles(88, 1);
    this.removeTiles(86, 1);
    this.removeTiles(84, 1);
    this.removeTiles(82, 1);
    this.removeTiles(80, 1);
    this.removeTiles(76, 3);
    this.removeTiles(74, 1);
    this.removeTiles(72, 1);
    this.removeTiles(70, 1);
    this.removeTiles(68, 1);
    this.removeTiles(66, 1);
    this.removeTiles(60, 1);
    this.removeTiles(58, 1);
    this.removeTiles(56, 1);
    this.removeTiles(54, 1);
    this.removeTiles(46, 7);
    this.removeTiles(44, 1);
    this.removeTiles(42, 1);
    this.removeTiles(40, 1);
    this.removeTiles(30, 1);
    this.removeTiles(28, 1);
    this.removeTiles(16, 11);
    this.removeTiles(14, 1);
    this.removeTiles(0, 1);

    // Experimental terrain support
    this.addTerrainToPath(new Terrain('#CEA98F', 0.5));
    var lowerHalfTerrain = new Terrain('#645C51', 0.5);
    this.terrainMap[[0, 4]] = lowerHalfTerrain;
    this.terrainMap[[0, 5]] = lowerHalfTerrain;
    this.terrainMap[[0, 6]] = lowerHalfTerrain;
    this.terrainMap[[0, 7]] = lowerHalfTerrain;
    this.terrainMap[[0, 8]] = lowerHalfTerrain;
    this.terrainMap[[0, 9]] = lowerHalfTerrain;
    this.terrainMap[[0, 10]] = lowerHalfTerrain;
    this.terrainMap[[0, 11]] = lowerHalfTerrain;
    this.terrainMap[[0, 12]] = lowerHalfTerrain;
    this.terrainMap[[1, 12]] = lowerHalfTerrain;
    this.terrainMap[[2, 12]] = lowerHalfTerrain;
    this.terrainMap[[3, 12]] = lowerHalfTerrain;
    this.terrainMap[[2, 4]] = lowerHalfTerrain;
    this.terrainMap[[2, 5]] = lowerHalfTerrain;
    this.terrainMap[[2, 6]] = lowerHalfTerrain;
    this.terrainMap[[2, 7]] = lowerHalfTerrain;
    this.terrainMap[[2, 8]] = lowerHalfTerrain;
    this.terrainMap[[2, 9]] = lowerHalfTerrain;
    this.terrainMap[[2, 10]] = lowerHalfTerrain;
    this.terrainMap[[3, 10]] = lowerHalfTerrain;
    this.terrainMap[[4, 9]] = lowerHalfTerrain;
};


/* Level 5 Definition */

FiercePlanet.PresetLevels.level5 = new Level(5);
FiercePlanet.PresetLevels.level5.isPresetLevel = true;
FiercePlanet.PresetLevels.level5.addEntryPoint(13, 0);
FiercePlanet.PresetLevels.level5.addExitPoint(0, 1);
FiercePlanet.PresetLevels.level5.cellsAcross = 15;
FiercePlanet.PresetLevels.level5.cellsDown = 15;
FiercePlanet.PresetLevels.level5.initialAgentNumber = 1;
FiercePlanet.PresetLevels.level5.waveNumber = 10;
FiercePlanet.PresetLevels.level5.expiryLimit = 10;
FiercePlanet.PresetLevels.level5.initialResourceStore =200 ;
FiercePlanet.PresetLevels.level5.name = ("Level 5: A-mazing Grace");
FiercePlanet.PresetLevels.level5.introduction = (
        "<p>The citizens are hopeful that the promised land lies not too far ahead. Or does it?</p>"
        );
FiercePlanet.PresetLevels.level5.tip = (new Notice("Citizens are (sort of) smart - at forks in the road, they'll take the path which appears more plentiful. Place resources to help them choose the right path."));
FiercePlanet.PresetLevels.level5.soundSrc = ("http://db.tt/DIi4CW0");
FiercePlanet.PresetLevels.level5.conclusion = ("That really was a-mazing! Time to straighten things out...");


FiercePlanet.PresetLevels.level5.setup = function() {
    this.fillWithTiles();
    this.removeTiles(208, 1);
    this.removeTiles(204, 3);
    this.removeTiles(196, 7);
    this.removeTiles(193, 1);
    this.removeTiles(191, 1);
    this.removeTiles(189, 1);
    this.removeTiles(187, 1);
    this.removeTiles(183, 1);
    this.removeTiles(178, 1);
    this.removeTiles(176, 1);
    this.removeTiles(174, 1);
    this.removeTiles(172, 1);
    this.removeTiles(170, 1);
    this.removeTiles(166, 3);
    this.removeTiles(163, 1);
    this.removeTiles(161, 1);
    this.removeTiles(159, 1);
    this.removeTiles(157, 1);
    this.removeTiles(155, 1);
    this.removeTiles(151, 1);
    this.removeTiles(148, 1);
    this.removeTiles(146, 1);
    this.removeTiles(144, 1);
    this.removeTiles(142, 1);
    this.removeTiles(140, 1);
    this.removeTiles(138, 1);
    this.removeTiles(136, 1);
    this.removeTiles(131, 3);
    this.removeTiles(129, 1);
    this.removeTiles(127, 1);
    this.removeTiles(125, 1);
    this.removeTiles(123, 1);
    this.removeTiles(121, 1);
    this.removeTiles(118, 1);
    this.removeTiles(114, 1);
    this.removeTiles(112, 1);
    this.removeTiles(110, 1);
    this.removeTiles(108, 1);
    this.removeTiles(106, 1);
    this.removeTiles(103, 1);
    this.removeTiles(99, 3);
    this.removeTiles(95, 3);
    this.removeTiles(91, 3);
    this.removeTiles(88, 1);
    this.removeTiles(86, 1);
    this.removeTiles(80, 1);
    this.removeTiles(78, 1);
    this.removeTiles(76, 1);
    this.removeTiles(73, 1);
    this.removeTiles(71, 1);
    this.removeTiles(67, 3);
    this.removeTiles(65, 1);
    this.removeTiles(63, 1);
    this.removeTiles(61, 1);
    this.removeTiles(58, 1);
    this.removeTiles(56, 1);
    this.removeTiles(54, 1);
    this.removeTiles(52, 1);
    this.removeTiles(50, 1);
    this.removeTiles(48, 1);
    this.removeTiles(46, 1);
    this.removeTiles(43, 1);
    this.removeTiles(41, 1);
    this.removeTiles(39, 1);
    this.removeTiles(37, 1);
    this.removeTiles(35, 1);
    this.removeTiles(33, 1);
    this.removeTiles(28, 1);
    this.removeTiles(24, 3);
    this.removeTiles(20, 3);
    this.removeTiles(15, 4);
    this.removeTiles(13, 1);
    
    this.addTerrainToPath(new Terrain('#A7A493', 0.8));
};


/* Level 6 Definition */

FiercePlanet.PresetLevels.level6 = new Level(6);
FiercePlanet.PresetLevels.level6.isPresetLevel = true;
FiercePlanet.PresetLevels.level6.addEntryPoint(0, 1);
FiercePlanet.PresetLevels.level6.addExitPoint(2, 14);
FiercePlanet.PresetLevels.level6.cellsAcross = 16;
FiercePlanet.PresetLevels.level6.cellsDown = 16;
FiercePlanet.PresetLevels.level6.initialAgentNumber = 1;
FiercePlanet.PresetLevels.level6.waveNumber = 10;
FiercePlanet.PresetLevels.level6.expiryLimit = 10;
FiercePlanet.PresetLevels.level6.allowOffscreenCycling = (true);
FiercePlanet.PresetLevels.level6.initialResourceStore =350 ;
FiercePlanet.PresetLevels.level6.name = ("Level 6: Dire Straits");
FiercePlanet.PresetLevels.level6.introduction = (
        "<p>This level looks well resourced &mdash; but there are troubling signs ahead for the economy. your citizens are going to need all the help they can get... </p>");
//FiercePlanet.PresetLevels.level6.tip = (new Notice("Clicking on an existing resource allows you to delete or upgrade it. An upgraded resource will dispense more health to citizens passing by."));
FiercePlanet.PresetLevels.level6.tip = (new Notice("Clicking on an existing resource allows you to delete it, and give you back some of what you spent"));
FiercePlanet.PresetLevels.level6.conclusion = ("Back in surplus! Your citizens were able to pull through. Can they continue to work together through the challenges that lie ahead?");
FiercePlanet.PresetLevels.level6.soundSrc = ("http://db.tt/gre8MPS");
//FiercePlanet.PresetLevels.level6.catastrophe = (new Catastrophe(TBL.ECO_CATEGORY, 100 + (Math.random() * 100), 300, 0, new Notice("The city is suffering a financial crisis - all services will be temporarily discontinued...", undefined, undefined, 500, 250, undefined, undefined, TBL.ECO_CATEGORY.color)));
FiercePlanet.PresetLevels.level6.catastrophe = (new Catastrophe(TBL.ECO_CATEGORY, 500 + (Math.random() * 500), 250, 0.75, new Notice("The city is suffering a financial crisis - many services will be temporarily discontinued...", undefined, undefined, 500, 250, undefined, undefined, TBL.ECO_CATEGORY.color)));

FiercePlanet.PresetLevels.level6.setup = function() {
    this.fillWithTiles();
    this.removeTiles(226, 1);
    this.removeTiles(212, 12);
    this.removeTiles(208, 3);
    this.removeTiles(196, 1);
    this.removeTiles(182, 10);
    this.removeTiles(176, 5);
    this.removeTiles(166, 1);
    this.removeTiles(152, 8);
    this.removeTiles(144, 7);
    this.removeTiles(136, 1);
    this.removeTiles(122, 6);
    this.removeTiles(112, 9);
    this.removeTiles(106, 1);
    this.removeTiles(92, 4);
    this.removeTiles(80, 11);
    this.removeTiles(76, 1);
    this.removeTiles(62, 2);
    this.removeTiles(48, 13);
    this.removeTiles(46, 1);
    this.removeTiles(16, 15);

    this.addTerrainToPath(new Terrain('#EBBA99', 0.8));
};


/* Level 7 Definition */

FiercePlanet.PresetLevels.level7 = new Level(7);
FiercePlanet.PresetLevels.level7.isPresetLevel = true;
FiercePlanet.PresetLevels.level7.cellsAcross = 17;
FiercePlanet.PresetLevels.level7.cellsDown = 17;
FiercePlanet.PresetLevels.level7.addEntryPoint(0, 8);
FiercePlanet.PresetLevels.level7.addExitPoint(16, 8);
FiercePlanet.PresetLevels.level7.initialAgentNumber = 1;
FiercePlanet.PresetLevels.level7.waveNumber = 10;
FiercePlanet.PresetLevels.level7.expiryLimit = 10;
FiercePlanet.PresetLevels.level7.allowResourcesOnPath = (true);
FiercePlanet.PresetLevels.level7.initialResourceStore =200 ;
FiercePlanet.PresetLevels.level7.name = ("Level 7: Like, Totally Random...");
FiercePlanet.PresetLevels.level7.introduction = (
        "<p>Ahead lies a vast and empty expanse. Your citizens are understandably nervous. Left unaided, they will try not to backtrack, but could find themselves hopelessly lost.</p>");
FiercePlanet.PresetLevels.level7.tip = (new Notice("You can add resources to the paths (the white squares) on this level, to direct citizens to their goal."));
FiercePlanet.PresetLevels.level7.conclusion = ("Spaced out! Time to move back to the (apparent) comforts of the city.");
FiercePlanet.PresetLevels.level7.soundSrc = ("http://db.tt/7SRv0qP");

FiercePlanet.PresetLevels.level7.setup = function() {
    this.fillWithTiles();
    this.removeTiles(280, 1);
    this.removeTiles(262, 3);
    this.removeTiles(244, 5);
    this.removeTiles(226, 7);
    this.removeTiles(208, 9);
    this.removeTiles(190, 11);
    this.removeTiles(172, 13);
    this.removeTiles(154, 15);
    this.removeTiles(136, 17);
    this.removeTiles(120, 15);
    this.removeTiles(104, 13);
    this.removeTiles(88, 11);
    this.removeTiles(72, 9);
    this.removeTiles(56, 7);
    this.removeTiles(40, 5);
    this.removeTiles(24, 3);
    this.removeTiles(8, 1);
    
    this.addTerrainToPath(new Terrain('#DCDCDE', 0.9));
    // Add predators and rivals
//    this.addLevelAgent(new Agent(AgentTypes.PREDATOR_AGENT_TYPE, 8, 4));
//    this.addWaveAgent(new Agent(AgentTypes.RIVAL_AGENT_TYPE, 9, 4));
};




/* Level 8 Definition */

FiercePlanet.PresetLevels.level8 = new Level(8);
FiercePlanet.PresetLevels.level8.isPresetLevel = true;
FiercePlanet.PresetLevels.level8.addEntryPoint(0, 0);
FiercePlanet.PresetLevels.level8.addExitPoint(17, 17);
FiercePlanet.PresetLevels.level8.cellsAcross = 18;
FiercePlanet.PresetLevels.level8.cellsDown = 18;
FiercePlanet.PresetLevels.level8.initialAgentNumber = 1;
FiercePlanet.PresetLevels.level8.waveNumber = 10;
FiercePlanet.PresetLevels.level8.expiryLimit = 10;
FiercePlanet.PresetLevels.level8.initialResourceStore =300 ;
FiercePlanet.PresetLevels.level8.name = ("Level 8: A Fork (or Two) in the Road");
FiercePlanet.PresetLevels.level8.introduction = (
        "<p>Life for the citizens of Fierce Planet is never simple. They are now faced with difficult dilemmas about which way to turn.</p>");
FiercePlanet.PresetLevels.level8.tip = (new Notice("You'll need to direct citizen through numerous forks in the road, by strategic placement of resources along the path."));
FiercePlanet.PresetLevels.level8.conclusion = ("Un-fork-ettable! After all that running around, time for a refreshing break...");
FiercePlanet.PresetLevels.level8.soundSrc = ("http://db.tt/0ynKmXS");


FiercePlanet.PresetLevels.level8.setup = function() {
    this.fillWithTiles();
    this.removeTiles(322, 2);
    this.removeTiles(289, 16);
    this.removeTiles(286, 1);
    this.removeTiles(271, 1);
    this.removeTiles(255, 14);
    this.removeTiles(253, 1);
    this.removeTiles(250, 1);
    this.removeTiles(248, 1);
    this.removeTiles(246, 1);
    this.removeTiles(237, 1);
    this.removeTiles(235, 1);
    this.removeTiles(232, 1);
    this.removeTiles(230, 1);
    this.removeTiles(221, 8);
    this.removeTiles(219, 1);
    this.removeTiles(217, 1);
    this.removeTiles(214, 1);
    this.removeTiles(212, 1);
    this.removeTiles(210, 1);
    this.removeTiles(203, 1);
    this.removeTiles(201, 1);
    this.removeTiles(199, 1);
    this.removeTiles(196, 1);
    this.removeTiles(194, 1);
    this.removeTiles(187, 6);
    this.removeTiles(185, 1);
    this.removeTiles(183, 1);
    this.removeTiles(181, 1);
    this.removeTiles(178, 1);
    this.removeTiles(176, 1);
    this.removeTiles(174, 1);
    this.removeTiles(172, 1);
    this.removeTiles(169, 1);
    this.removeTiles(167, 1);
    this.removeTiles(165, 1);
    this.removeTiles(163, 1);
    this.removeTiles(160, 1);
    this.removeTiles(158, 1);
    this.removeTiles(156, 1);
    this.removeTiles(154, 1);
    this.removeTiles(151, 1);
    this.removeTiles(149, 1);
    this.removeTiles(147, 1);
    this.removeTiles(145, 1);
    this.removeTiles(142, 1);
    this.removeTiles(140, 1);
    this.removeTiles(138, 1);
    this.removeTiles(131, 6);
    this.removeTiles(129, 1);
    this.removeTiles(127, 1);
    this.removeTiles(124, 1);
    this.removeTiles(122, 1);
    this.removeTiles(120, 1);
    this.removeTiles(113, 1);
    this.removeTiles(111, 1);
    this.removeTiles(109, 1);
    this.removeTiles(106, 1);
    this.removeTiles(104, 1);
    this.removeTiles(95, 8);
    this.removeTiles(93, 1);
    this.removeTiles(91, 1);
    this.removeTiles(88, 1);
    this.removeTiles(86, 1);
    this.removeTiles(77, 1);
    this.removeTiles(75, 1);
    this.removeTiles(73, 1);
    this.removeTiles(70, 1);
    this.removeTiles(55, 14);
    this.removeTiles(52, 1);
    this.removeTiles(37, 1);
    this.removeTiles(19, 16);
    this.removeTiles(0, 2);
    
    this.addTerrainToPath(new Terrain('#CCB09A', 0.9));
};


/* Level 9 Definition */

FiercePlanet.PresetLevels.level9 = new Level(9);
FiercePlanet.PresetLevels.level9.isPresetLevel = true;
FiercePlanet.PresetLevels.level9.addEntryPoint(9, 0);
FiercePlanet.PresetLevels.level9.addExitPoint(9, 18);
FiercePlanet.PresetLevels.level9.cellsAcross = 19;
FiercePlanet.PresetLevels.level9.cellsDown = 19;
FiercePlanet.PresetLevels.level9.initialAgentNumber = 1;
FiercePlanet.PresetLevels.level9.waveNumber = 10;
FiercePlanet.PresetLevels.level9.expiryLimit = 10;
FiercePlanet.PresetLevels.level9.initialResourceStore =280 ;
FiercePlanet.PresetLevels.level9.name = ("Level 9: Cascades");
FiercePlanet.PresetLevels.level9.introduction = (
        "<p>Time is running out. But the citizens of Fierce Planet still need some rest and relaxation. Doesn't a trip to the beach sound like a good idea?</p>");
FiercePlanet.PresetLevels.level9.tip = (new Notice("No tip! You've gotten this far..."));
FiercePlanet.PresetLevels.level9.conclusion = ("This seaside journey nearly brought about their downfall! Now time for the final stretch...");
FiercePlanet.PresetLevels.level9.soundSrc = ("http://db.tt/LMyYRtH");

FiercePlanet.PresetLevels.level9.setup = function() {
    this.fillWithTiles();
    this.removeTiles(351, 1);
    this.removeTiles(330, 5);
//    this.clearTiles(315, 1);
    this.removeTiles(311, 1);
    this.removeTiles(296, 3);
    this.removeTiles(294, 1);
    this.removeTiles(290, 3);
    this.removeTiles(279, 1);
    this.removeTiles(275, 1);
    this.removeTiles(271, 1);
    this.removeTiles(260, 3);
    this.removeTiles(254, 5);
    this.removeTiles(250, 3);
    this.removeTiles(243, 1);
    this.removeTiles(239, 1);
    this.removeTiles(235, 1);
    this.removeTiles(231, 1);
    this.removeTiles(224, 3);
    this.removeTiles(214, 9);
    this.removeTiles(210, 3);
    this.removeTiles(207, 1);
    this.removeTiles(203, 1);
    this.removeTiles(195, 1);
    this.removeTiles(191, 1);
    this.removeTiles(182, 7);
    this.removeTiles(178, 1);
    this.removeTiles(172, 5);
    this.removeTiles(163, 1);
    this.removeTiles(159, 1);
    this.removeTiles(144, 3);
    this.removeTiles(138, 3);
    this.removeTiles(127, 1);
    this.removeTiles(125, 1);
    this.removeTiles(121, 1);
    this.removeTiles(119, 1);
    this.removeTiles(108, 3);
    this.removeTiles(106, 1);
    this.removeTiles(102, 1);
    this.removeTiles(98, 3);
    this.removeTiles(91, 1);
    this.removeTiles(87, 1);
    this.removeTiles(83, 1);
    this.removeTiles(79, 1);
    this.removeTiles(72, 3);
    this.removeTiles(62, 9);
    this.removeTiles(58, 3);
    this.removeTiles(55, 1);
    this.removeTiles(39, 1);
    this.removeTiles(20, 17);
    this.removeTiles(9, 1);

    this.addTerrainToPath(new Terrain('#ECDDCA', 0.9));

};



/* Level 10 Definition */

FiercePlanet.PresetLevels.level10 = new Level(10);
FiercePlanet.PresetLevels.level10.isPresetLevel = true;
FiercePlanet.PresetLevels.level10.addEntryPoint(18, 19);
FiercePlanet.PresetLevels.level10.addExitPoint(16, 19);
FiercePlanet.PresetLevels.level10.cellsAcross = 20;
FiercePlanet.PresetLevels.level10.cellsDown = 20;
FiercePlanet.PresetLevels.level10.initialAgentNumber = 1;
FiercePlanet.PresetLevels.level10.waveNumber = 5;
FiercePlanet.PresetLevels.level10.expiryLimit = 1;
FiercePlanet.PresetLevels.level10.initialResourceStore =500 ;
FiercePlanet.PresetLevels.level10.name = ("Level 10: Fields of Ma(i)ze");
FiercePlanet.PresetLevels.level10.introduction = (
        "<p>Pastures of plenty and a new sustainable future lie in store for the citizens of Fierce Planet. </p>" +
        "<p>With few remaining resources, they are starting to fight among themselves. Can they withstand a revolution from within?</p>");
FiercePlanet.PresetLevels.level10.tip = (new Notice("Remember to resource dead end paths, or your citizens will fade away, dazed and confused..."));
FiercePlanet.PresetLevels.level10.soundSrc = ("http://db.tt/DIi4CW0");
FiercePlanet.PresetLevels.level10.catastrophe = (new Catastrophe(TBL.SOC_CATEGORY, 500 + (Math.random() * 100), 250, 0.6, new Notice("Oh no! A revolution is coming...", undefined, undefined, 500, 250, undefined, undefined, TBL.SOC_CATEGORY.color)));

FiercePlanet.PresetLevels.level10.setup = function() {
    this.fillWithTiles();
    this.removeTiles(398, 1);
    this.removeTiles(396, 1);
    this.removeTiles(378, 1);
    this.removeTiles(361, 16);
    this.removeTiles(358, 1);
    this.removeTiles(356, 1);
    this.removeTiles(345, 1);
    this.removeTiles(341, 1);
    this.removeTiles(338, 1);
    this.removeTiles(334, 3);
    this.removeTiles(325, 8);
    this.removeTiles(323, 1);
    this.removeTiles(321, 1);
    this.removeTiles(318, 1);
    this.removeTiles(312, 1);
    this.removeTiles(305, 1);
    this.removeTiles(303, 1);
    this.removeTiles(301, 1);
    this.removeTiles(298, 1);
    this.removeTiles(292, 5);
    this.removeTiles(287, 4);
    this.removeTiles(285, 1);
    this.removeTiles(281, 3);
    this.removeTiles(278, 1);
    this.removeTiles(267, 1);
    this.removeTiles(265, 1);
    this.removeTiles(247, 12);
    this.removeTiles(241, 5);
    this.removeTiles(238, 1);
    this.removeTiles(221, 1);
    this.removeTiles(218, 1);
    this.removeTiles(215, 1);
    this.removeTiles(211, 3);
    this.removeTiles(207, 3);
    this.removeTiles(205, 1);
    this.removeTiles(203, 1);
    this.removeTiles(201, 1);
    this.removeTiles(195, 4);
    this.removeTiles(193, 1);
    this.removeTiles(189, 3);
    this.removeTiles(183, 5);
    this.removeTiles(181, 1);
    this.removeTiles(178, 1);
    this.removeTiles(173, 1);
    this.removeTiles(164, 1);
    this.removeTiles(161, 1);
    this.removeTiles(158, 1);
    this.removeTiles(153, 4);
    this.removeTiles(146, 6);
    this.removeTiles(141, 4);
    this.removeTiles(138, 1);
    this.removeTiles(136, 1);
    this.removeTiles(131, 1);
    this.removeTiles(126, 1);
    this.removeTiles(118, 1);
    this.removeTiles(114, 3);
    this.removeTiles(108, 5);
    this.removeTiles(106, 1);
    this.removeTiles(101, 4);
    this.removeTiles(98, 1);
    this.removeTiles(94, 1);
    this.removeTiles(91, 1);
    this.removeTiles(88, 1);
    this.removeTiles(86, 1);
    this.removeTiles(84, 1);
    this.removeTiles(81, 1);
    this.removeTiles(78, 1);
    this.removeTiles(76, 1);
    this.removeTiles(71, 4);
    this.removeTiles(68, 2);
    this.removeTiles(63, 4);
    this.removeTiles(61, 1);
    this.removeTiles(58, 1);
    this.removeTiles(56, 1);
    this.removeTiles(41, 1);
    this.removeTiles(21, 18);
    
    this.addTerrainToPath(new Terrain('#FAF6ED', 0.9));
};



/* Level 11 Definition */

FiercePlanet.PresetLevels.level11 = new Level(11);
FiercePlanet.PresetLevels.level11.isPresetLevel = true;
FiercePlanet.PresetLevels.level11.addEntryPoint(11, 12);
FiercePlanet.PresetLevels.level11.addEntryPoint(18, 12);
FiercePlanet.PresetLevels.level11.addExitPoint(12, 17);
FiercePlanet.PresetLevels.level11.addExitPoint(17, 7);
FiercePlanet.PresetLevels.level11.cellsAcross = 30;
FiercePlanet.PresetLevels.level11.cellsDown = 25;
FiercePlanet.PresetLevels.level11.initialAgentNumber = 4;
FiercePlanet.PresetLevels.level11.waveNumber = 3;
FiercePlanet.PresetLevels.level11.expiryLimit = 10;
FiercePlanet.PresetLevels.level11.initialResourceStore = 3000;
FiercePlanet.PresetLevels.level11.allowOffscreenCycling = (true);
FiercePlanet.PresetLevels.level11.name = ("Level 11: It's a Mad World");
FiercePlanet.PresetLevels.level11.isTerminalLevel = true;
FiercePlanet.PresetLevels.level11.introduction = (
        "<p>The citizens are safe! There's no mad rush &mdash; time to sit back and watch the world go by....");
FiercePlanet.PresetLevels.level11.tip = (new Notice("'There is a place. Like no place on Earth. A land full of wonder, mystery, and danger! Some say to survive it: You need to be as mad as a hatter. ' (The Mad Hatter)"));

FiercePlanet.PresetLevels.level11.setup = function() {
    this.setTiles(JSON.parse('[{"color":"0FFF1F","x":0,"y":0},null,{"color":"0FFF1F","x":2,"y":0},{"color":"0FFF1F","x":3,"y":0},{"color":"0FFF1F","x":4,"y":0},{"color":"0FFF1F","x":5,"y":0},{"color":"0FFF1F","x":6,"y":0},{"color":"0FFF1F","x":7,"y":0},{"color":"0FFF1F","x":8,"y":0},{"color":"0FFF1F","x":9,"y":0},{"color":"0FFF1F","x":10,"y":0},{"color":"0FFF1F","x":11,"y":0},{"color":"0FFF1F","x":12,"y":0},{"color":"0FFF1F","x":13,"y":0},{"color":"0FFF1F","x":14,"y":0},{"color":"0FFF1F","x":15,"y":0},{"color":"0FFF1F","x":16,"y":0},{"color":"0FFF1F","x":17,"y":0},{"color":"0FFF1F","x":18,"y":0},{"color":"0FFF1F","x":19,"y":0},{"color":"0FFF1F","x":20,"y":0},{"color":"0FFF1F","x":21,"y":0},{"color":"0FFF1F","x":22,"y":0},{"color":"0FFF1F","x":23,"y":0},{"color":"0FFF1F","x":24,"y":0},{"color":"0FFF1F","x":25,"y":0},{"color":"0FFF1F","x":26,"y":0},{"color":"0FFF1F","x":27,"y":0},null,{"color":"0FFF1F","x":29,"y":0},null,null,null,{"color":"0FFF1F","x":3,"y":1},{"color":"0FFF1F","x":4,"y":1},{"color":"0FFF1F","x":5,"y":1},null,null,null,{"color":"0FFF1F","x":9,"y":1},{"color":"0FFF1F","x":10,"y":1},{"color":"0FFF1F","x":11,"y":1},null,null,null,{"color":"0FFF1F","x":15,"y":1},{"color":"0FFF1F","x":16,"y":1},{"color":"0FFF1F","x":17,"y":1},{"color":"0FFF1F","x":18,"y":1},{"color":"0FFF1F","x":19,"y":1},null,null,null,{"color":"0FFF1F","x":23,"y":1},{"color":"0FFF1F","x":24,"y":1},{"color":"0FFF1F","x":25,"y":1},{"color":"0FFF1F","x":26,"y":1},{"color":"0FFF1F","x":27,"y":1},null,null,{"color":"0FFF1F","x":0,"y":2},{"color":"0FFF1F","x":1,"y":2},null,null,{"color":"0FFF1F","x":4,"y":2},null,null,{"color":"0FFF1F","x":7,"y":2},null,null,{"color":"0FFF1F","x":10,"y":2},null,null,{"color":"0FFF1F","x":13,"y":2},null,null,{"color":"0FFF1F","x":16,"y":2},{"color":"0FFF1F","x":17,"y":2},{"color":"0FFF1F","x":18,"y":2},null,null,{"color":"0FFF1F","x":21,"y":2},null,null,{"color":"0FFF1F","x":24,"y":2},{"color":"0FFF1F","x":25,"y":2},{"color":"0FFF1F","x":26,"y":2},null,null,{"color":"0FFF1F","x":29,"y":2},{"color":"0FFF1F","x":0,"y":3},{"color":"0FFF1F","x":1,"y":3},{"color":"0FFF1F","x":2,"y":3},null,null,null,{"color":"0FFF1F","x":6,"y":3},{"color":"0FFF1F","x":7,"y":3},{"color":"0FFF1F","x":8,"y":3},null,null,null,{"color":"0FFF1F","x":12,"y":3},{"color":"0FFF1F","x":13,"y":3},{"color":"0FFF1F","x":14,"y":3},null,{"color":"0FFF1F","x":16,"y":3},{"color":"0FFF1F","x":17,"y":3},null,null,{"color":"0FFF1F","x":20,"y":3},{"color":"0FFF1F","x":21,"y":3},{"color":"0FFF1F","x":22,"y":3},null,null,{"color":"0FFF1F","x":25,"y":3},null,null,{"color":"0FFF1F","x":28,"y":3},{"color":"0FFF1F","x":29,"y":3},{"color":"0FFF1F","x":0,"y":4},{"color":"0FFF1F","x":1,"y":4},{"color":"0FFF1F","x":2,"y":4},{"color":"0FFF1F","x":3,"y":4},null,{"color":"0FFF1F","x":5,"y":4},{"color":"0FFF1F","x":6,"y":4},{"color":"0FFF1F","x":7,"y":4},{"color":"0FFF1F","x":8,"y":4},{"color":"0FFF1F","x":9,"y":4},null,{"color":"0FFF1F","x":11,"y":4},{"color":"0FFF1F","x":12,"y":4},{"color":"0FFF1F","x":13,"y":4},null,null,null,{"color":"0FFF1F","x":17,"y":4},{"color":"0FFF1F","x":18,"y":4},{"color":"0FFF1F","x":19,"y":4},{"color":"0FFF1F","x":20,"y":4},{"color":"0FFF1F","x":21,"y":4},{"color":"0FFF1F","x":22,"y":4},{"color":"0FFF1F","x":23,"y":4},null,null,null,{"color":"0FFF1F","x":27,"y":4},{"color":"0FFF1F","x":28,"y":4},{"color":"0FFF1F","x":29,"y":4},{"color":"0FFF1F","x":0,"y":5},{"color":"0FFF1F","x":1,"y":5},{"color":"0FFF1F","x":2,"y":5},null,null,null,{"color":"0FFF1F","x":6,"y":5},{"color":"0FFF1F","x":7,"y":5},{"color":"0FFF1F","x":8,"y":5},null,null,null,{"color":"0FFF1F","x":12,"y":5},{"color":"0FFF1F","x":13,"y":5},{"color":"0FFF1F","x":14,"y":5},{"color":"0FFF1F","x":15,"y":5},{"color":"0FFF1F","x":16,"y":5},{"color":"0FFF1F","x":17,"y":5},{"color":"0FFF1F","x":18,"y":5},null,null,null,{"color":"0FFF1F","x":22,"y":5},{"color":"0FFF1F","x":23,"y":5},null,{"color":"0FFF1F","x":25,"y":5},null,null,{"color":"0FFF1F","x":28,"y":5},{"color":"0FFF1F","x":29,"y":5},{"color":"0FFF1F","x":0,"y":6},{"color":"0FFF1F","x":1,"y":6},null,null,{"color":"0FFF1F","x":4,"y":6},{"color":"0FFF1F","x":5,"y":6},{"color":"0FFF1F","x":6,"y":6},null,{"color":"0FFF1F","x":8,"y":6},{"color":"0FFF1F","x":9,"y":6},{"color":"0FFF1F","x":10,"y":6},{"color":"0FFF1F","x":11,"y":6},{"color":"0FFF1F","x":12,"y":6},{"color":"0FFF1F","x":13,"y":6},null,null,{"color":"0FFF1F","x":16,"y":6},{"color":"0FFF1F","x":17,"y":6},null,null,{"color":"0FFF1F","x":20,"y":6},null,null,{"color":"0FFF1F","x":23,"y":6},{"color":"0FFF1F","x":24,"y":6},{"color":"0FFF1F","x":25,"y":6},{"color":"0FFF1F","x":26,"y":6},null,null,{"color":"0FFF1F","x":29,"y":6},{"color":"0FFF1F","x":0,"y":7},null,null,{"color":"0FFF1F","x":3,"y":7},{"color":"0FFF1F","x":4,"y":7},{"color":"0FFF1F","x":5,"y":7},{"color":"0FFF1F","x":6,"y":7},null,null,null,{"color":"0FFF1F","x":10,"y":7},null,null,null,null,{"color":"0FFF1F","x":15,"y":7},{"color":"0FFF1F","x":16,"y":7},null,null,{"color":"0FFF1F","x":19,"y":7},{"color":"0FFF1F","x":20,"y":7},{"color":"0FFF1F","x":21,"y":7},null,null,null,{"color":"0FFF1F","x":25,"y":7},{"color":"0FFF1F","x":26,"y":7},{"color":"0FFF1F","x":27,"y":7},null,{"color":"0FFF1F","x":29,"y":7},{"color":"0FFF1F","x":0,"y":8},null,{"color":"0FFF1F","x":2,"y":8},{"color":"0FFF1F","x":3,"y":8},null,null,{"color":"0FFF1F","x":6,"y":8},{"color":"0FFF1F","x":7,"y":8},null,{"color":"0FFF1F","x":9,"y":8},{"color":"0FFF1F","x":10,"y":8},{"color":"0FFF1F","x":11,"y":8},null,{"color":"0FFF1F","x":13,"y":8},null,null,{"color":"0FFF1F","x":16,"y":8},{"color":"0FFF1F","x":17,"y":8},{"color":"0FFF1F","x":18,"y":8},{"color":"0FFF1F","x":19,"y":8},{"color":"0FFF1F","x":20,"y":8},{"color":"0FFF1F","x":21,"y":8},{"color":"0FFF1F","x":22,"y":8},null,{"color":"0FFF1F","x":24,"y":8},{"color":"0FFF1F","x":25,"y":8},{"color":"0FFF1F","x":26,"y":8},null,null,{"color":"0FFF1F","x":29,"y":8},{"color":"0FFF1F","x":0,"y":9},null,null,{"color":"0FFF1F","x":3,"y":9},{"color":"0FFF1F","x":4,"y":9},null,null,null,null,{"color":"0FFF1F","x":9,"y":9},{"color":"0FFF1F","x":10,"y":9},null,null,{"color":"0FFF1F","x":13,"y":9},{"color":"0FFF1F","x":14,"y":9},null,{"color":"0FFF1F","x":16,"y":9},{"color":"0FFF1F","x":17,"y":9},null,null,null,{"color":"0FFF1F","x":21,"y":9},{"color":"0FFF1F","x":22,"y":9},null,null,{"color":"0FFF1F","x":25,"y":9},null,null,{"color":"0FFF1F","x":28,"y":9},{"color":"0FFF1F","x":29,"y":9},{"color":"0FFF1F","x":0,"y":10},{"color":"0FFF1F","x":1,"y":10},null,null,{"color":"0FFF1F","x":4,"y":10},{"color":"0FFF1F","x":5,"y":10},null,{"color":"0FFF1F","x":7,"y":10},null,null,null,null,{"color":"0FFF1F","x":12,"y":10},{"color":"0FFF1F","x":13,"y":10},null,null,{"color":"0FFF1F","x":16,"y":10},null,null,{"color":"0FFF1F","x":19,"y":10},null,null,{"color":"0FFF1F","x":22,"y":10},{"color":"0FFF1F","x":23,"y":10},null,null,null,{"color":"0FFF1F","x":27,"y":10},{"color":"0FFF1F","x":28,"y":10},{"color":"0FFF1F","x":29,"y":10},{"color":"0FFF1F","x":0,"y":11},{"color":"0FFF1F","x":1,"y":11},{"color":"0FFF1F","x":2,"y":11},null,null,null,null,{"color":"0FFF1F","x":7,"y":11},{"color":"0FFF1F","x":8,"y":11},{"color":"0FFF1F","x":9,"y":11},{"color":"0FFF1F","x":10,"y":11},{"color":"0FFF1F","x":11,"y":11},{"color":"0FFF1F","x":12,"y":11},{"color":"0FFF1F","x":13,"y":11},null,{"color":"0FFF1F","x":15,"y":11},{"color":"0FFF1F","x":16,"y":11},null,{"color":"0FFF1F","x":18,"y":11},{"color":"0FFF1F","x":19,"y":11},{"color":"0FFF1F","x":20,"y":11},null,null,{"color":"0FFF1F","x":23,"y":11},{"color":"0FFF1F","x":24,"y":11},{"color":"0FFF1F","x":25,"y":11},null,null,null,{"color":"0FFF1F","x":29,"y":11},{"color":"0FFF1F","x":0,"y":12},null,{"color":"0FFF1F","x":2,"y":12},{"color":"0FFF1F","x":3,"y":12},{"color":"0FFF1F","x":4,"y":12},{"color":"0FFF1F","x":5,"y":12},null,null,{"color":"0FFF1F","x":8,"y":12},{"color":"0FFF1F","x":9,"y":12},{"color":"0FFF1F","x":10,"y":12},null,null,{"color":"0FFF1F","x":13,"y":12},null,null,{"color":"0FFF1F","x":16,"y":12},null,null,{"color":"0FFF1F","x":19,"y":12},{"color":"0FFF1F","x":20,"y":12},{"color":"0FFF1F","x":21,"y":12},null,null,{"color":"0FFF1F","x":24,"y":12},{"color":"0FFF1F","x":25,"y":12},{"color":"0FFF1F","x":26,"y":12},{"color":"0FFF1F","x":27,"y":12},{"color":"0FFF1F","x":28,"y":12},{"color":"0FFF1F","x":29,"y":12},{"color":"0FFF1F","x":0,"y":13},null,null,null,{"color":"0FFF1F","x":4,"y":13},{"color":"0FFF1F","x":5,"y":13},{"color":"0FFF1F","x":6,"y":13},null,null,{"color":"0FFF1F","x":9,"y":13},{"color":"0FFF1F","x":10,"y":13},{"color":"0FFF1F","x":11,"y":13},null,{"color":"0FFF1F","x":13,"y":13},{"color":"0FFF1F","x":14,"y":13},null,{"color":"0FFF1F","x":16,"y":13},{"color":"0FFF1F","x":17,"y":13},{"color":"0FFF1F","x":18,"y":13},{"color":"0FFF1F","x":19,"y":13},{"color":"0FFF1F","x":20,"y":13},{"color":"0FFF1F","x":21,"y":13},{"color":"0FFF1F","x":22,"y":13},null,null,null,null,{"color":"0FFF1F","x":27,"y":13},{"color":"0FFF1F","x":28,"y":13},{"color":"0FFF1F","x":29,"y":13},{"color":"0FFF1F","x":0,"y":14},{"color":"0FFF1F","x":1,"y":14},{"color":"0FFF1F","x":2,"y":14},null,null,null,{"color":"0FFF1F","x":6,"y":14},{"color":"0FFF1F","x":7,"y":14},null,null,{"color":"0FFF1F","x":10,"y":14},null,null,{"color":"0FFF1F","x":13,"y":14},null,null,{"color":"0FFF1F","x":16,"y":14},{"color":"0FFF1F","x":17,"y":14},null,null,null,null,{"color":"0FFF1F","x":22,"y":14},null,{"color":"0FFF1F","x":24,"y":14},{"color":"0FFF1F","x":25,"y":14},null,null,{"color":"0FFF1F","x":28,"y":14},{"color":"0FFF1F","x":29,"y":14},{"color":"0FFF1F","x":0,"y":15},{"color":"0FFF1F","x":1,"y":15},null,null,{"color":"0FFF1F","x":4,"y":15},null,null,{"color":"0FFF1F","x":7,"y":15},{"color":"0FFF1F","x":8,"y":15},null,null,null,{"color":"0FFF1F","x":12,"y":15},{"color":"0FFF1F","x":13,"y":15},null,{"color":"0FFF1F","x":15,"y":15},{"color":"0FFF1F","x":16,"y":15},null,null,{"color":"0FFF1F","x":19,"y":15},{"color":"0FFF1F","x":20,"y":15},null,null,null,null,{"color":"0FFF1F","x":25,"y":15},{"color":"0FFF1F","x":26,"y":15},null,null,{"color":"0FFF1F","x":29,"y":15},{"color":"0FFF1F","x":0,"y":16},null,null,{"color":"0FFF1F","x":3,"y":16},{"color":"0FFF1F","x":4,"y":16},{"color":"0FFF1F","x":5,"y":16},null,{"color":"0FFF1F","x":7,"y":16},{"color":"0FFF1F","x":8,"y":16},{"color":"0FFF1F","x":9,"y":16},{"color":"0FFF1F","x":10,"y":16},{"color":"0FFF1F","x":11,"y":16},{"color":"0FFF1F","x":12,"y":16},{"color":"0FFF1F","x":13,"y":16},null,null,{"color":"0FFF1F","x":16,"y":16},null,{"color":"0FFF1F","x":18,"y":16},{"color":"0FFF1F","x":19,"y":16},{"color":"0FFF1F","x":20,"y":16},null,{"color":"0FFF1F","x":22,"y":16},{"color":"0FFF1F","x":23,"y":16},null,null,{"color":"0FFF1F","x":26,"y":16},{"color":"0FFF1F","x":27,"y":16},null,{"color":"0FFF1F","x":29,"y":16},{"color":"0FFF1F","x":0,"y":17},null,{"color":"0FFF1F","x":2,"y":17},{"color":"0FFF1F","x":3,"y":17},{"color":"0FFF1F","x":4,"y":17},null,null,null,{"color":"0FFF1F","x":8,"y":17},{"color":"0FFF1F","x":9,"y":17},{"color":"0FFF1F","x":10,"y":17},null,null,{"color":"0FFF1F","x":13,"y":17},{"color":"0FFF1F","x":14,"y":17},null,null,null,null,{"color":"0FFF1F","x":19,"y":17},null,null,null,{"color":"0FFF1F","x":23,"y":17},{"color":"0FFF1F","x":24,"y":17},{"color":"0FFF1F","x":25,"y":17},{"color":"0FFF1F","x":26,"y":17},null,null,{"color":"0FFF1F","x":29,"y":17},{"color":"0FFF1F","x":0,"y":18},null,null,{"color":"0FFF1F","x":3,"y":18},{"color":"0FFF1F","x":4,"y":18},{"color":"0FFF1F","x":5,"y":18},{"color":"0FFF1F","x":6,"y":18},null,null,{"color":"0FFF1F","x":9,"y":18},null,null,{"color":"0FFF1F","x":12,"y":18},{"color":"0FFF1F","x":13,"y":18},null,null,{"color":"0FFF1F","x":16,"y":18},{"color":"0FFF1F","x":17,"y":18},{"color":"0FFF1F","x":18,"y":18},{"color":"0FFF1F","x":19,"y":18},{"color":"0FFF1F","x":20,"y":18},{"color":"0FFF1F","x":21,"y":18},null,{"color":"0FFF1F","x":23,"y":18},{"color":"0FFF1F","x":24,"y":18},{"color":"0FFF1F","x":25,"y":18},null,null,{"color":"0FFF1F","x":28,"y":18},{"color":"0FFF1F","x":29,"y":18},{"color":"0FFF1F","x":0,"y":19},{"color":"0FFF1F","x":1,"y":19},null,null,{"color":"0FFF1F","x":4,"y":19},null,{"color":"0FFF1F","x":6,"y":19},{"color":"0FFF1F","x":7,"y":19},null,null,null,{"color":"0FFF1F","x":11,"y":19},{"color":"0FFF1F","x":12,"y":19},{"color":"0FFF1F","x":13,"y":19},{"color":"0FFF1F","x":14,"y":19},{"color":"0FFF1F","x":15,"y":19},{"color":"0FFF1F","x":16,"y":19},{"color":"0FFF1F","x":17,"y":19},null,null,null,{"color":"0FFF1F","x":21,"y":19},{"color":"0FFF1F","x":22,"y":19},{"color":"0FFF1F","x":23,"y":19},null,null,null,{"color":"0FFF1F","x":27,"y":19},{"color":"0FFF1F","x":28,"y":19},{"color":"0FFF1F","x":29,"y":19},{"color":"0FFF1F","x":0,"y":20},{"color":"0FFF1F","x":1,"y":20},{"color":"0FFF1F","x":2,"y":20},null,null,null,{"color":"0FFF1F","x":6,"y":20},{"color":"0FFF1F","x":7,"y":20},{"color":"0FFF1F","x":8,"y":20},{"color":"0FFF1F","x":9,"y":20},{"color":"0FFF1F","x":10,"y":20},{"color":"0FFF1F","x":11,"y":20},{"color":"0FFF1F","x":12,"y":20},null,null,null,{"color":"0FFF1F","x":16,"y":20},{"color":"0FFF1F","x":17,"y":20},{"color":"0FFF1F","x":18,"y":20},null,{"color":"0FFF1F","x":20,"y":20},{"color":"0FFF1F","x":21,"y":20},{"color":"0FFF1F","x":22,"y":20},{"color":"0FFF1F","x":23,"y":20},{"color":"0FFF1F","x":24,"y":20},null,{"color":"0FFF1F","x":26,"y":20},{"color":"0FFF1F","x":27,"y":20},{"color":"0FFF1F","x":28,"y":20},{"color":"0FFF1F","x":29,"y":20},{"color":"0FFF1F","x":0,"y":21},{"color":"0FFF1F","x":1,"y":21},null,null,{"color":"0FFF1F","x":4,"y":21},null,null,{"color":"0FFF1F","x":7,"y":21},{"color":"0FFF1F","x":8,"y":21},{"color":"0FFF1F","x":9,"y":21},null,null,{"color":"0FFF1F","x":12,"y":21},{"color":"0FFF1F","x":13,"y":21},null,{"color":"0FFF1F","x":15,"y":21},{"color":"0FFF1F","x":16,"y":21},{"color":"0FFF1F","x":17,"y":21},null,null,null,{"color":"0FFF1F","x":21,"y":21},{"color":"0FFF1F","x":22,"y":21},{"color":"0FFF1F","x":23,"y":21},null,null,null,{"color":"0FFF1F","x":27,"y":21},{"color":"0FFF1F","x":28,"y":21},{"color":"0FFF1F","x":29,"y":21},{"color":"0FFF1F","x":0,"y":22},null,null,{"color":"0FFF1F","x":3,"y":22},{"color":"0FFF1F","x":4,"y":22},{"color":"0FFF1F","x":5,"y":22},null,null,{"color":"0FFF1F","x":8,"y":22},null,null,{"color":"0FFF1F","x":11,"y":22},{"color":"0FFF1F","x":12,"y":22},{"color":"0FFF1F","x":13,"y":22},null,null,{"color":"0FFF1F","x":16,"y":22},null,null,{"color":"0FFF1F","x":19,"y":22},null,null,{"color":"0FFF1F","x":22,"y":22},null,null,{"color":"0FFF1F","x":25,"y":22},null,null,{"color":"0FFF1F","x":28,"y":22},{"color":"0FFF1F","x":29,"y":22},null,null,{"color":"0FFF1F","x":2,"y":23},{"color":"0FFF1F","x":3,"y":23},{"color":"0FFF1F","x":4,"y":23},{"color":"0FFF1F","x":5,"y":23},{"color":"0FFF1F","x":6,"y":23},null,null,null,{"color":"0FFF1F","x":10,"y":23},{"color":"0FFF1F","x":11,"y":23},{"color":"0FFF1F","x":12,"y":23},{"color":"0FFF1F","x":13,"y":23},{"color":"0FFF1F","x":14,"y":23},null,null,null,{"color":"0FFF1F","x":18,"y":23},{"color":"0FFF1F","x":19,"y":23},{"color":"0FFF1F","x":20,"y":23},null,null,null,{"color":"0FFF1F","x":24,"y":23},{"color":"0FFF1F","x":25,"y":23},{"color":"0FFF1F","x":26,"y":23},null,null,null,{"color":"0FFF1F","x":0,"y":24},null,{"color":"0FFF1F","x":2,"y":24},{"color":"0FFF1F","x":3,"y":24},{"color":"0FFF1F","x":4,"y":24},{"color":"0FFF1F","x":5,"y":24},{"color":"0FFF1F","x":6,"y":24},{"color":"0FFF1F","x":7,"y":24},{"color":"0FFF1F","x":8,"y":24},{"color":"0FFF1F","x":9,"y":24},{"color":"0FFF1F","x":10,"y":24},{"color":"0FFF1F","x":11,"y":24},{"color":"0FFF1F","x":12,"y":24},{"color":"0FFF1F","x":13,"y":24},{"color":"0FFF1F","x":14,"y":24},{"color":"0FFF1F","x":15,"y":24},{"color":"0FFF1F","x":16,"y":24},{"color":"0FFF1F","x":17,"y":24},{"color":"0FFF1F","x":18,"y":24},{"color":"0FFF1F","x":19,"y":24},{"color":"0FFF1F","x":20,"y":24},{"color":"0FFF1F","x":21,"y":24},{"color":"0FFF1F","x":22,"y":24},{"color":"0FFF1F","x":23,"y":24},{"color":"0FFF1F","x":24,"y":24},{"color":"0FFF1F","x":25,"y":24},{"color":"0FFF1F","x":26,"y":24},{"color":"0FFF1F","x":27,"y":24},null,{"  color":"0FFF1F","x":29,"y":24}]'));
    this.addTerrainToPath(new Terrain('#848A64', 0.7));
    this.preState = {};
    this.preState.agentsCanCommunicate = World.settings.agentsCanCommunicate;
    this.preState.ignoreResourceBalance = World.settings.ignoreResourceBalance;
    this.preState.agentsCanCommunicate = World.settings.useInlineResourceSwatch;
    this.preState.interval = FiercePlanet.interval;
    this.preState.capabilities = FiercePlanet.currentProfile.capabilities;
    World.settings.agentsCanCommunicate = true;
    World.settings.ignoreResourceBalance = true;
    World.settings.useInlineResourceSwatch = false;
    FiercePlanet.interval = 10;
    FiercePlanet.currentProfile.capabilities = FiercePlanet.GENIUS_CAPABILITIES;
    FiercePlanet.GeneralUI.refreshSwatch();
    this.noSpeedChange = (true);
//    this.setNoWander(true);
//    var resources = [];
//    for (var i = 0; i < this.cellsAcross; i++) {
//        for (var j = 0; j < this.worldHeight; j++) {
//            if (this.getTile(i, j) != null) {
//                var val = Math.floor(Math.random() * 3);
//                var rk = null;
//                switch(val) {
//                    case 0:
//                        rk = FiercePlanet.STOCKMARKET_RESOURCE_TYPE;
//                        break;
//                    case 1:
//                        rk = FiercePlanet.BIODIVERSITY_RESOURCE_TYPE;
//                        break;
//                    case 2:
//                        rk = FiercePlanet.FESTIVAL_RESOURCE_TYPE;
//                        break;
//                }
//                rk.image =( null);
//                rk.setTotalYield(1000);
//                var resource = new Resource(rk, i, j);
//                resources.push(resource);
//            }
//        }
//    }
//    this.setResources(resources);
};
FiercePlanet.PresetLevels.level11.teardown = function() {
    if (!this.preState)
        return;
    World.settings.agentsCanCommunicate = this.preState.agentsCanCommunicate;
    World.settings.ignoreResourceBalance = this.preState.ignoreResourceBalance;
    World.settings.useInlineResourceSwatch = this.preState.agentsCanCommunicate;
    FiercePlanet.interval = this.preState.interval;
    FiercePlanet.currentProfile.capabilities = this.preState.capabilities;
    FiercePlanet.GeneralUI.refreshSwatch();
};


/* QUEST 2 */

/* Level 12 Definition */

FiercePlanet.PresetLevels.level12 = new Level(12);
FiercePlanet.PresetLevels.level12.allowResourcesOnPath = false;
FiercePlanet.PresetLevels.level12.initialResourceStore = 100;
FiercePlanet.PresetLevels.level12.isPresetLevel = true;
FiercePlanet.PresetLevels.level12.allowOffscreenCycling = true;
FiercePlanet.PresetLevels.level12.addEntryPoint(0, 10);
FiercePlanet.PresetLevels.level12.addExitPoint(11, 1);
FiercePlanet.PresetLevels.level12.cellsAcross = 12;
FiercePlanet.PresetLevels.level12.cellsDown = 12;
FiercePlanet.PresetLevels.level12.initialAgentNumber = 1;
FiercePlanet.PresetLevels.level12.waveNumber = 10;
FiercePlanet.PresetLevels.level12.expiryLimit = 20;
FiercePlanet.PresetLevels.level12.name = ("New York, New York...");
FiercePlanet.PresetLevels.level12.introduction = (""
        + "<p>The world is in peril. But for now the citizens just want to get across Times Square...</p>"
        );
FiercePlanet.PresetLevels.level12.conclusion = ("Traffic isn't much fun. But the citizens made it through.");

FiercePlanet.PresetLevels.level12.setup = function() {
    this.setTiles(JSON.parse('[{"color":"0FFF1F","x":0,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":5,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":7,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":5,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":7,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":0,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":5,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":7,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":0,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":7,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":0,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,{"color":"0FFF1F","x":10,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":7,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":5,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":7,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":3,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":7,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":1,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":7,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":1,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":5,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":7,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":5,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":7,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":11,"terrain":{"color":"0FFF1F","alpha":1}}]'));
    this.addTerrainToPath(new Terrain('#bbb', 0.7));
};

/* Level 13 Definition */

FiercePlanet.PresetLevels.level13 = new Level(13);
FiercePlanet.PresetLevels.level13.allowResourcesOnPath = false;
FiercePlanet.PresetLevels.level13.initialResourceStore = 100;
FiercePlanet.PresetLevels.level13.isPresetLevel = true;
FiercePlanet.PresetLevels.level13.addEntryPoint(0, 6);
FiercePlanet.PresetLevels.level13.addEntryPoint(9, 6);
FiercePlanet.PresetLevels.level13.addExitPoint(3, 6);
FiercePlanet.PresetLevels.level13.addExitPoint(12, 6);
FiercePlanet.PresetLevels.level13.cellsAcross = 13;
FiercePlanet.PresetLevels.level13.cellsDown = 13;
FiercePlanet.PresetLevels.level13.initialAgentNumber = 1;
FiercePlanet.PresetLevels.level13.waveNumber = 10;
FiercePlanet.PresetLevels.level13.expiryLimit = 10;
FiercePlanet.PresetLevels.level13.name = ("Welcome to Baghdad...");
FiercePlanet.PresetLevels.level13.introduction = (""
        + "<p>New threats have emerged....</p>"
        );
FiercePlanet.PresetLevels.level13.conclusion = ("Well done.");

FiercePlanet.PresetLevels.level13.setup = function() {
    this.setTiles(JSON.parse('[{"color":"0FFF1F","x":0,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,null,{"color":"0FFF1F","x":9,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":5,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":11,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":3,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":7,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":11,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":3,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,null,{"color":"0FFF1F","x":9,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":12,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":2,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":5,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":9,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":2,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":5,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":10,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":1,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":4,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":2,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":5,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":10,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":0,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":2,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":5,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":9,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":3,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,null,{"color":"0FFF1F","x":9,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":12,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":3,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":7,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":11,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":5,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":11,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,null,{"color":"0FFF1F","x":9,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":12,"terrain":{"color":"0FFF1F","alpha":1}}]'));
    this.addTerrainToPath(new Terrain('#FCE0AE', 0.8));
};

/* Level 14 Definition */

FiercePlanet.PresetLevels.level14 = new Level(14);
FiercePlanet.PresetLevels.level14.allowResourcesOnPath = false;
FiercePlanet.PresetLevels.level14.initialResourceStore = 100;
FiercePlanet.PresetLevels.level14.isPresetLevel = true;
FiercePlanet.PresetLevels.level14.addEntryPoint(0, 13);
FiercePlanet.PresetLevels.level14.addExitPoint(13, 0);
FiercePlanet.PresetLevels.level14.cellsAcross = 14;
FiercePlanet.PresetLevels.level14.cellsDown = 14;
FiercePlanet.PresetLevels.level14.initialAgentNumber = 1;
FiercePlanet.PresetLevels.level14.waveNumber = 10;
FiercePlanet.PresetLevels.level14.expiryLimit = 10;
FiercePlanet.PresetLevels.level14.name = ("Round and about in Mumbai");
FiercePlanet.PresetLevels.level14.introduction = (""
        + "<p>Easy to get lost in the hazy of the sweltering metropolis.</p>"
        );
FiercePlanet.PresetLevels.level14.conclusion = ("Well done.");

FiercePlanet.PresetLevels.level14.setup = function() {
    this.setTiles(JSON.parse('[null,null,null,{"color":"0FFF1F","x":3,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":10,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":1,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":3,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":8,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,null,null,null,null,null,{"color":"0FFF1F","x":6,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":10,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":0,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":4,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":6,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,null,{"color":"0FFF1F","x":0,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":6,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":10,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":8,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":6,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":10,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":0,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":5,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":8,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":0,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":4,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":10,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,null,null,{"color":"0FFF1F","x":3,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":-2,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":-1,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":1,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":5,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":13,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":1,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":3,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,null,{"color":"0FFF1F","x":9,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":11,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":13,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":1,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":5,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":7,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":9,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":13,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":1,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":9,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":13,"terrain":{"color":"0FFF1F","alpha":1}}]'));
    this.addTerrainToPath(new Terrain('#A39C8A', 0.8));
};

/* Level 15 Definition */

FiercePlanet.PresetLevels.level15 = new Level(15);
FiercePlanet.PresetLevels.level15.allowResourcesOnPath = false;
FiercePlanet.PresetLevels.level15.initialResourceStore = 150;
FiercePlanet.PresetLevels.level15.isPresetLevel = true;
FiercePlanet.PresetLevels.level15.addEntryPoint(4, 5);
FiercePlanet.PresetLevels.level15.addExitPoint(14, 0);
FiercePlanet.PresetLevels.level15.cellsAcross = 15;
FiercePlanet.PresetLevels.level15.cellsDown = 15;
FiercePlanet.PresetLevels.level15.initialAgentNumber = 1;
FiercePlanet.PresetLevels.level15.waveNumber = 10;
FiercePlanet.PresetLevels.level15.expiryLimit = 10;
FiercePlanet.PresetLevels.level15.name = ("Gremlins in the Kremlin...");
FiercePlanet.PresetLevels.level15.introduction = (""
        + "<p>Looks safe - but things are about to get nasty.</p>"
        );
FiercePlanet.PresetLevels.level15.conclusion = ("Well done.");

FiercePlanet.PresetLevels.level15.setup = function() {
    this.setTiles(JSON.parse('[null,null,null,null,null,null,null,null,null,null,null,{"color":"0FFF1F","x":11,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,{"color":"0FFF1F","x":1,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":11,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":13,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":1,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,null,null,null,{"color":"0FFF1F","x":9,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":11,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,{"color":"0FFF1F","x":1,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":3,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":9,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":11,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":13,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":1,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":3,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":7,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":9,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":11,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":13,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":1,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":3,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":5,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":7,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":9,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":11,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,{"color":"0FFF1F","x":1,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":3,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":7,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":9,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":11,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":1,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,null,{"color":"0FFF1F","x":7,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":9,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":11,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,{"color":"0FFF1F","x":1,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":9,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":11,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":13,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,null,null,null,null,null,null,{"color":"0FFF1F","x":9,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":11,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":0,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":11,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,null,null,null,null,null,null,null,null,null,null,{"color":"0FFF1F","x":11,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":13,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":1,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":7,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":9,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,{"color":"0FFF1F","x":1,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":3,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":5,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":7,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":9,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":11,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":13,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,{"color":"0FFF1F","x":3,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":7,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,null,{"color":"0FFF1F","x":13,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},null]'));
    this.addTerrainToPath(new Terrain('#B09B98', 0.8));
};
//
/* Level 16 Definition */

FiercePlanet.PresetLevels.level16 = new Level(16);
FiercePlanet.PresetLevels.level16.isometric = false;
FiercePlanet.PresetLevels.level16.allowOffscreenCycling = true;
FiercePlanet.PresetLevels.level16.allowResourcesOnPath = false;
FiercePlanet.PresetLevels.level16.initialResourceStore = 200;
FiercePlanet.PresetLevels.level16.isPresetLevel = true;
FiercePlanet.PresetLevels.level16.addEntryPoint(0, 14);
FiercePlanet.PresetLevels.level16.addEntryPoint(9, 0);
FiercePlanet.PresetLevels.level16.addEntryPoint(15, 4);
FiercePlanet.PresetLevels.level16.addEntryPoint(15, 10);
FiercePlanet.PresetLevels.level16.addExitPoint(1, 4);
FiercePlanet.PresetLevels.level16.cellsAcross = 16;
FiercePlanet.PresetLevels.level16.cellsDown = 16;
FiercePlanet.PresetLevels.level16.initialAgentNumber = 1;
FiercePlanet.PresetLevels.level16.waveNumber = 5;
FiercePlanet.PresetLevels.level16.expiryLimit = 10;
FiercePlanet.PresetLevels.level16.name = ("On the straight and narrow");
FiercePlanet.PresetLevels.level16.introduction = (""
        + "<p>The citizens have a train to catch out of Helsinki. Help them to get to the station in time.</p>"
        + "<p>Hint: You probably want a bird's perspective on this problem.</p>"
        );
FiercePlanet.PresetLevels.level16.conclusion = ("Well done.");

FiercePlanet.PresetLevels.level16.setup = function() {
    this.setTiles(JSON.parse('[{"color":"0FFF1F","x":0,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":7,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":14,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":7,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":14,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,null,null,null,{"color":"0FFF1F","x":10,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":14,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":4,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":7,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":14,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":2,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":4,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":7,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":0,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":2,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":4,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":7,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":14,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":2,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":4,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":7,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":14,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":2,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":4,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":7,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":14,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,null,null,null,{"color":"0FFF1F","x":7,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":14,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":7,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":14,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,null,null,null,null,null,null,null,null,null,{"color":"0FFF1F","x":0,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":4,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":8,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":14,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":4,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":8,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":14,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":4,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":8,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":14,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,{"color":"0FFF1F","x":15,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":4,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":8,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":14,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":15,"terrain":{"color":"0FFF1F","alpha":1}}]'));
    this.addTerrainToPath(new Terrain('#bbb', 0.7));
};

/* Level 17 Definition */

FiercePlanet.PresetLevels.level17 = new Level(17);
FiercePlanet.PresetLevels.level15.allowResourcesOnPath = false;
FiercePlanet.PresetLevels.level17.initialResourceStore = 150;
FiercePlanet.PresetLevels.level17.isPresetLevel = true;
FiercePlanet.PresetLevels.level17.addEntryPoint(7, 0);
FiercePlanet.PresetLevels.level17.addEntryPoint(1, 10);
FiercePlanet.PresetLevels.level17.addEntryPoint(9, 10);
FiercePlanet.PresetLevels.level17.addExitPoint(9, 8);
FiercePlanet.PresetLevels.level17.cellsAcross = 17;
FiercePlanet.PresetLevels.level17.cellsDown = 17;
FiercePlanet.PresetLevels.level17.initialAgentNumber = 1;
FiercePlanet.PresetLevels.level17.waveNumber = 10;
FiercePlanet.PresetLevels.level17.expiryLimit = 10;
FiercePlanet.PresetLevels.level17.name = ("Laying out the red carpet");
FiercePlanet.PresetLevels.level17.introduction = (""
        + "<p>It's time the citizens were recognised for being the stars they are. After all, they just needed to be pointed in the right direction...</p>"
        );
FiercePlanet.PresetLevels.level17.conclusion = ("Well done.");

FiercePlanet.PresetLevels.level17.setup = function() {
    this.setTiles(JSON.parse('[null,null,null,null,null,null,null,null,{"color":"0FFF1F","x":8,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":12,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":1,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":1,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":1,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":1,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":1,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":1,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":2,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":2,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,null,null,{"color":"0FFF1F","x":0,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":2,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,{"color":"0FFF1F","x":3,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":12,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":1,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":3,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":1,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":3,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":1,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":3,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":1,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":3,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":1,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":3,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":1,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,null,null,null,null,{"color":"0FFF1F","x":10,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,null,null]'));
    this.addTerrainToPath(new Terrain('#9C9A9F', 0.8));
};

/* Level 18 Definition */

FiercePlanet.PresetLevels.level18 = new Level(18);
FiercePlanet.PresetLevels.level18.isometric = true;
FiercePlanet.PresetLevels.level18.allowResourcesOnPath = false;
FiercePlanet.PresetLevels.level18.initialResourceStore = 150;
FiercePlanet.PresetLevels.level18.isPresetLevel = true;
FiercePlanet.PresetLevels.level18.addEntryPoint(14, 1);
FiercePlanet.PresetLevels.level18.addExitPoint(15, 2);
FiercePlanet.PresetLevels.level18.cellsAcross = 18;
FiercePlanet.PresetLevels.level18.cellsDown = 18;
FiercePlanet.PresetLevels.level18.initialAgentNumber = 1;
FiercePlanet.PresetLevels.level18.waveNumber = 10;
FiercePlanet.PresetLevels.level18.expiryLimit = 10;
FiercePlanet.PresetLevels.level18.name = ("Clocks and Cheese");
FiercePlanet.PresetLevels.level18.introduction = (""
        + "<p>Welcome to Switzerland!</p>"
        );
FiercePlanet.PresetLevels.level18.conclusion = ("Well done.");

FiercePlanet.PresetLevels.level18.setup = function() {
    this.setTiles(JSON.parse('[{"color":"0FFF1F","x":0,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":4,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,null,{"color":"0FFF1F","x":13,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":4,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":9,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":15,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":4,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":8,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":17,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":3,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":7,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":17,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":3,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":6,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":0,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":2,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":6,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":2,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":5,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":2,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":4,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,{"color":"0FFF1F","x":2,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":6,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":17,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,null,null,null,null,null,{"color":"0FFF1F","x":10,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":16,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":4,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,null,null,null,{"color":"0FFF1F","x":16,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":4,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":13,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":17,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":2,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":4,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":12,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":17,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":5,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":11,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":0,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":5,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":10,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":6,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":9,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,{"color":"0FFF1F","x":9,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":9,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":17,"terrain":{"color":"0FFF1F","alpha":1}}]'));
    this.addTerrainToPath(new Terrain('#E3E1D5', 0.8));
};

/* Level 19 Definition */

FiercePlanet.PresetLevels.level19 = new Level(19);
FiercePlanet.PresetLevels.level19.isometric = true;
FiercePlanet.PresetLevels.level19.allowResourcesOnPath = false;
FiercePlanet.PresetLevels.level19.initialResourceStore = 150;
FiercePlanet.PresetLevels.level19.isPresetLevel = true;
FiercePlanet.PresetLevels.level19.addEntryPoint(18, 2);
FiercePlanet.PresetLevels.level19.addExitPoint(9, 18);
FiercePlanet.PresetLevels.level19.cellsAcross = 19;
FiercePlanet.PresetLevels.level19.cellsDown = 19;
FiercePlanet.PresetLevels.level19.initialAgentNumber = 1;
FiercePlanet.PresetLevels.level19.waveNumber = 10;
FiercePlanet.PresetLevels.level19.expiryLimit = 10;
FiercePlanet.PresetLevels.level19.name = ("A day in Dubai.");
FiercePlanet.PresetLevels.level19.introduction = (""
        + "<p>Things have gotten a little palm-shaped. Can you help the citizens reach their luxury resort?</p>"
        + "<p>Hint: sometimes it pays to look at things from a different point of view.</p>"
        );
FiercePlanet.PresetLevels.level19.conclusion = ("Well done.");

FiercePlanet.PresetLevels.level19.setup = function() {
    this.setTiles(JSON.parse('[{"color":"0FFF1F","x":0,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":18,"y":0,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":13,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":18,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":13,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":0,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":13,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":18,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":11,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":16,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":18,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":11,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":15,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":18,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":11,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":14,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":18,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,null,null,null,null,null,null,{"color":"0FFF1F","x":13,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":18,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":4,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":11,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,{"color":"0FFF1F","x":0,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,null,null,null,{"color":"0FFF1F","x":11,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,{"color":"0FFF1F","x":16,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":18,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":5,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":13,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":18,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":3,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,{"color":"0FFF1F","x":11,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":18,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":8,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,null,{"color":"0FFF1F","x":14,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":18,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,{"color":"0FFF1F","x":7,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":15,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":18,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":4,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":10,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":16,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":18,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":3,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":8,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":18,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":2,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":6,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":18,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":5,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":18,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":0,"y":18,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":18,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":18,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":4,"y":18,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":18,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":18,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":18,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":18,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":10,"y":18,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":18,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":18,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":18,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":18,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":18,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":18,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":18,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":18,"y":18,"terrain":{"color":"0FFF1F","alpha":1}}]'));
    this.addTerrainToPath(new Terrain('#C5C3C6', 0.9));
};



/* Level 20 Definition */

FiercePlanet.PresetLevels.level20 = new Level(20);
FiercePlanet.PresetLevels.level20.isometric = false;
FiercePlanet.PresetLevels.level20.allowResourcesOnPath = false;
FiercePlanet.PresetLevels.level20.initialResourceStore = 1000;
FiercePlanet.PresetLevels.level20.isPresetLevel = true;
FiercePlanet.PresetLevels.level20.addEntryPoint(19, 0);
FiercePlanet.PresetLevels.level20.addExitPoint(0, 19);
FiercePlanet.PresetLevels.level20.cellsAcross = 20;
FiercePlanet.PresetLevels.level20.cellsDown = 20;
FiercePlanet.PresetLevels.level20.initialAgentNumber = 1;
FiercePlanet.PresetLevels.level20.waveNumber = 5;
FiercePlanet.PresetLevels.level20.expiryLimit = 20;
FiercePlanet.PresetLevels.level20.name = ("Spaced Out!");
FiercePlanet.PresetLevels.level20.isTerminalLevel = true;
FiercePlanet.PresetLevels.level20.introduction = (""
        + "<p>Somewhere out there in space there is a...</p>"
        );
FiercePlanet.PresetLevels.level20.conclusion = ("Well done.");

FiercePlanet.PresetLevels.level20.setup = function() {
    this.setTiles(JSON.parse('[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,{"color":"0FFF1F","x":1,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":18,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":19,"y":1,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":1,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":3,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,{"color":"0FFF1F","x":12,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":18,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":19,"y":2,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":1,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":9,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":16,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":18,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":19,"y":3,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":3,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":7,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,{"color":"0FFF1F","x":12,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":14,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":16,"y":4,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,{"color":"0FFF1F","x":1,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":3,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":5,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":10,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":14,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":18,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":19,"y":5,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":1,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":3,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":7,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":9,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":11,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":14,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":6,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,{"color":"0FFF1F","x":1,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":3,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":5,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":9,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":12,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":14,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":16,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":18,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":19,"y":7,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":1,"y":8,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,{"color":"0FFF1F","x":0,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":1,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":4,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":5,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":18,"y":9,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,null,null,{"color":"0FFF1F","x":5,"y":10,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,{"color":"0FFF1F","x":1,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":3,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":5,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":19,"y":11,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":1,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":3,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":5,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":19,"y":12,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":3,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":5,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":6,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":7,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":8,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":9,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":10,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":11,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":13,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":14,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":15,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":16,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":19,"y":13,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":1,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":5,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":9,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":11,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,{"color":"0FFF1F","x":17,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":19,"y":14,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":1,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":5,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":7,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":9,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":12,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":14,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":16,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":19,"y":15,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":1,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":5,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":9,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,{"color":"0FFF1F","x":14,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":17,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":19,"y":16,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":1,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":5,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":7,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":9,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":11,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},null,null,{"color":"0FFF1F","x":14,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":16,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":19,"y":17,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":1,"y":18,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":18,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":18,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":5,"y":18,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":7,"y":18,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":9,"y":18,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":11,"y":18,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":18,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":14,"y":18,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":16,"y":18,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":17,"y":18,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":19,"y":18,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":1,"y":19,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":2,"y":19,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":3,"y":19,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":7,"y":19,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,{"color":"0FFF1F","x":11,"y":19,"terrain":{"color":"0FFF1F","alpha":1}},{"color":"0FFF1F","x":12,"y":19,"terrain":{"color":"0FFF1F","alpha":1}},null,{"color":"0FFF1F","x":14,"y":19,"terrain":{"color":"0FFF1F","alpha":1}},null,null,null,null,{"color":"0FFF1F","x":19,"y":19,"terrain":{"color":"0FFF1F","alpha":1}}]'));
};

/* Level 21 Definition */

FiercePlanet.PresetLevels.level21 = new Level(20);
FiercePlanet.PresetLevels.level21.isometric = true;
FiercePlanet.PresetLevels.level21.allowResourcesOnPath = true;
FiercePlanet.PresetLevels.level21.initialResourceStore = 1000;
FiercePlanet.PresetLevels.level21.isPresetLevel = true;
FiercePlanet.PresetLevels.level21.addEntryPoint(19, 0);
FiercePlanet.PresetLevels.level21.addExitPoint(0, 19);
FiercePlanet.PresetLevels.level21.cellsAcross = 20;
FiercePlanet.PresetLevels.level21.cellsDown = 20;
FiercePlanet.PresetLevels.level21.initialAgentNumber = 1;
FiercePlanet.PresetLevels.level21.waveNumber = 5;
FiercePlanet.PresetLevels.level21.expiryLimit = 20;
FiercePlanet.PresetLevels.level21.name = ("Spaced Out!");
FiercePlanet.PresetLevels.level21.isTerminalLevel = true;
FiercePlanet.PresetLevels.level21.introduction = (""
        + "<p>Somewhere out there in space there is a...</p>"
        );
FiercePlanet.PresetLevels.level21.conclusion = ("Well done.");

FiercePlanet.PresetLevels.level21.setup = function() {
};


// Checked and authorised
FiercePlanet.PresetLevels.level1.image =( "/images/levels/level-1-art.jpg");
FiercePlanet.PresetLevels.level1.imageAttribution = ('<a tabindex="-1" target="_blank" href="http://nuclearsyndrom.deviantart.com/"><em>Nuclear Winter</em></a>. Kindly reproduced courtesy of NuclearSyndrom.');
FiercePlanet.PresetLevels.level2.image =( "/images/levels/level-2-art.jpg");
FiercePlanet.PresetLevels.level2.imageAttribution = ('<a tabindex="-1" target="_blank" href="http://www.slv.vic.gov.au/pictoria/b/2/8/doc/b28555.shtml"><em>Canvas Town, between Princess Bridge and South Melbourne in 1850\'s</em></a>. De Gruchy & Leigh, 1850-1860.');
FiercePlanet.PresetLevels.level3.image =( "/images/levels/level-3-art.jpg");
FiercePlanet.PresetLevels.level3.imageAttribution = ('<a tabindex="-1" target="_blank" href="http://www.mynameisyakub.com"><em>The Apocalypse</em></a>. Kindly reproduced courtesy of Yakub.');
FiercePlanet.PresetLevels.level4.image =( "/images/levels/level-4-art.jpg");
FiercePlanet.PresetLevels.level4.imageAttribution = ('<a tabindex="-1" target="_blank" href="http://en.wikipedia.org/wiki/File:Brueghel-tower-of-babel.jpg"><em>The Tower of Babel</em></a>. Pieter Bruegel the Elder, 1563.');
FiercePlanet.PresetLevels.level5.image =( "/images/levels/level-5-art.jpg");
FiercePlanet.PresetLevels.level5.imageAttribution = ('<a tabindex="-1" target="_blank" href="http://http://en.wikipedia.org/wiki/File:Dore_London.jpg"><em>Over London–by Rail from London: A Pilgrimage</em></a>. Gustave Doré, 1870.');
FiercePlanet.PresetLevels.level6.image =( "/images/levels/level-6-art.jpg");
FiercePlanet.PresetLevels.level6.imageAttribution = ('<a tabindex="-1" target="_blank" href="http://entertainment.howstuffworks.com/arts/artwork/claude-monet-paintings-1900-19082.htm"><em>Waterloo Bridge</em></a>. Claude Monet, 1900.');
FiercePlanet.PresetLevels.level7.image =( "/images/levels/level-7-art.jpg");
FiercePlanet.PresetLevels.level7.imageAttribution = ('<a tabindex="-1" target="_blank" href="http://en.wikipedia.org/wiki/File:Ballarat_1853-54_von_guerard.jpg"><em>Ballarat 1853-54</em></a>. Eugene von Guerard, 1884.');
FiercePlanet.PresetLevels.level8.image =( "/images/levels/level-8-art.jpg");
FiercePlanet.PresetLevels.level8.imageAttribution = ('<a tabindex="-1" target="_blank" href="http://en.wikipedia.org/wiki/File:Gustave_Caillebotte_-_Jour_de_pluie_%C3%A0_Paris.jpg"><em>A Rainy Day in Paris</em></a>. Gustave Caillebotte, 1877.');
FiercePlanet.PresetLevels.level9.image =( "/images/levels/level-9-art.jpg");
FiercePlanet.PresetLevels.level9.imageAttribution = ('<a tabindex="-1" target="_blank" href="http://en.wikipedia.org/wiki/File:Renoir16.jpg"><em>Children on the Beach of Guernesey</em></a>. Pierre-Auguste Renoir, 1883.');
FiercePlanet.PresetLevels.level10.image =( "/images/levels/level-10-art.jpg");
FiercePlanet.PresetLevels.level10.imageAttribution = ('<a tabindex="-1" target="_blank" href="http://nuclearsyndrom.deviantart.com/"><em>Nuclear Summer</em></a>. Kindly reproduced courtesy of NuclearSyndrom.');
FiercePlanet.PresetLevels.level11.image =( "/images/levels/level-11-art.jpg");
FiercePlanet.PresetLevels.level11.imageAttribution = ('<a tabindex="-1" target="_blank" href="http://nuclearsyndrom.deviantart.com/"><em>Mad Tea Party</em></a>. Sir John Tenniel, 1865.');





/* Google Map links */
FiercePlanet.PresetLevels.level1.mapOptions = ({mapTypeId: 'mars_infrared', center: new google.maps.LatLng(-80.73270997231712, 85.09268911182834), zoom: 3, tilt: 0}); // Budapest: 47.5153, 19.0782
FiercePlanet.PresetLevels.level2.mapOptions = ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(37.390296, -5.954579), zoom: 18, tilt: 45}); // Seville: 37.390296,-5.954579
FiercePlanet.PresetLevels.level3.mapOptions = ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(45.433607, 12.338124), zoom: 18, tilt: 45}); // Venice: 45.433607,12.338124
FiercePlanet.PresetLevels.level4.mapOptions = ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(41.890384354793554, 12.49228627979709), zoom: 19, tilt: 45}); // Rome, Colosseum: 41.890384354793554, 12.49228627979709
FiercePlanet.PresetLevels.level5.mapOptions = ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(-33.434969, -70.655254), zoom: 18, tilt: 45}); // Santiago: -33.434969,-70.655254
FiercePlanet.PresetLevels.level6.mapOptions = ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(47.487229, 19.07513), zoom: 18, tilt: 45}); // Budapest: 47.487229,19.07513
FiercePlanet.PresetLevels.level7.mapOptions = ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(30.006533, -90.158792), zoom: 18, tilt: 45}); // New Orleans: 30.006533,-90.158792
FiercePlanet.PresetLevels.level8.mapOptions = ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(33.441393, -112.077407), zoom: 18, tilt: 45}); // Phoenix, Arizona: 33.441393,-112.077407
FiercePlanet.PresetLevels.level9.mapOptions = ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(21.281500, -157.839000), zoom: 18, tilt: 45}); // Honululu: 21.283355,-157.837787
FiercePlanet.PresetLevels.level10.mapOptions = ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(30.265450, -97.744524), zoom: 18, tilt: 45}); // Austin, Texas: 30.265452,-97.744524
FiercePlanet.PresetLevels.level11.mapOptions = ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(51, 73), zoom: 2}); // The World

FiercePlanet.PresetLevels.level12.mapOptions = ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(40.75537849652072, -73.98745089769363), zoom: 19}); // The World
FiercePlanet.PresetLevels.level13.mapOptions = ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(33.30839307429315, 44.388874769210815), zoom: 18}); // The World
FiercePlanet.PresetLevels.level14.mapOptions = ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(19.04721318329498, 72.85507321357727), zoom: 18}); // The World
FiercePlanet.PresetLevels.level15.mapOptions = ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(55.75085915446095, 37.61694610118866), zoom: 18}); // The World
FiercePlanet.PresetLevels.level16.mapOptions = ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(60.170506720026374, 24.94619607925415), zoom: 16}); // The World
FiercePlanet.PresetLevels.level17.mapOptions = ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(34.101668544907994, -118.33886727690697), zoom: 19, tilt: 45}); // The World
FiercePlanet.PresetLevels.level18.mapOptions = ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(46.52007450279348, 6.633171018458763), zoom: 18, tilt: 45}); // The World
FiercePlanet.PresetLevels.level19.mapOptions = ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(25.119408837358463, 55.12870788574219), zoom: 14}); // The World

