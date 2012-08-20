/*!
 * Fierce Planet - Worlds
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */

/* NB: World is defined in world.js */

var FiercePlanet = FiercePlanet || {};

/**
 * @namespace The namespace for preset worlds
 */
var Basic = Basic || new Campaign();


(function() {

    this.init = function() {
        /* World 0 Definition */

        this.world0 = new World();
        this.world0.cellsAcross = 5;
        this.world0.cellsDown = 5;
        this.world0.id = 0;
        this.world0.isPresetWorld = true;
        this.world0.initialAgentNumber = 1;
        this.world0.waveNumber = 3;
        this.world0.expiryLimit = 20;
        this.world0.name = ("Tutorial");
        this.world0.noMap = true;
        this.world0.noSpeedChange = true;
        this.world0.noWander = true;
        this.world0.introduction = ("" +
                "<p>The citizens of Fierce Planet are in danger of extinction. Their cities have been destroyed &mdash; there is a shortage of food and water, law and order has broken down, and disease is rampant.</p>" +
                "<p>The aim of the game is to help citizens survive as they build a sustainable city. Their start point is marked by a green circle, and the goal by a white circle. Both circles reflect your progress as more waves of citizens come through.</p> " +
                "<p>You can save your citizens by placing <em>resources</em> on tiles around their path. You can click on tiles to select a resource, or drag resources from the panel on the right onto the game map.</p> " +
                "<p>Resources come in three kinds: economic, environmental and social. Your citizens need all of these to build a sustainable city. " +
                "If you don't provide enough resources of a particular kind, your citizens will start turning that colour. This indicates you need to put down some resources of that colour to help your citizens.</p> " +
                "<p>You start with a limited amount of resources. Saving citizens will allow you to place more resources, which will allow you to help others.</p> " +
                "<p>Begin by placing some resources on the map. When you are ready, click the 'Play' button in the Control Panel on the left. After a few seconds, citizens will start marching towards their goal.</p> "
                );
        this.world0.conclusion = ("Well done - you have completed the tutorial. Now time to help your citizens on World 1.");


        this.world0.setup = function() {
            this.addEntryPoint(0, 0);
            this.addExitPoint(4, 4);
            this.forbidAgentsOnAllCells();
            this.allowAgentsOnCellRange(20, 5);
            this.allowAgentsOnCellRange(15, 1);
            this.allowAgentsOnCellRange(10, 5);
            this.allowAgentsOnCellRange(9, 1);
            this.allowAgentsOnCellRange(0, 5);
            this.addTerrainToPath(new Terrain(one.color('#aaa').alpha(0.8)));
        };


        /* World 1 Definition */
        this.world1 = new World();
        this.world1.id = 1;
        this.world1.thumbnail = '/images/worlds/world-thumbnail-1.png';
        this.world1.isPresetWorld = true;
        this.world1.cellsAcross = 11;
        this.world1.cellsDown = 11;
        this.world1.initialAgentNumber = 1;
        this.world1.waveNumber = 10;
        this.world1.expiryLimit = 20;
        this.world1.name = ("World 1: Welcome to Fierce Planet!");
//        this.world1.noSpeedChange = true;
//        this.world1.noWander = true;
//        this.world1.dontClearCanvas = true;
        this.world1.introduction = (
                "<p>The citizens of Fierce Planet are in danger of extinction. Their cities have been destroyed &mdash; there is a shortage of food and water, law and order has broken down, and disease is rampant.</p>" +
                        "<p>Help your citizens rebuild their world before they are wiped out!</p>"
        );
        this.world1.conclusion = (
                "<p>Congratulations, you have helped the citizens of Fierce Planet start rebuilding their Universe... there is still a long way to go!</p>"
        );
        //"<p>The citizens of Fierce Planet are under threat. They are migrating in ever increasing numbers, seeking a promised land of peace and prosperity.</p>" +
        //"<p>Help them by placing resources beside their path - before they expire!</p> "
        // this.world1.tip = new Notice("Drag or click the resources on the right (->), then add them to the map.", FiercePlanet.Orientation.worldWidth - FiercePlanet.Game.WAVE_NOTICE_WIDTH, FiercePlanet.Orientation.halfWorldHeight);
//        this.world1.tip = new Notice("Drag or click the resources on the right (->), then add them to the map.");
        this.world1.soundSrc = ("http://db.tt/iFLVJKi");

        this.world1.setup = function() {
            this.addEntryPoint(0, 9);
            this.addExitPoint(10, 1);
            this.forbidAgentsOnAllCells();
            this.allowAgentsOnCellRange(99, 10);
            this.allowAgentsOnCellRange(97, 1);
            this.allowAgentsOnCellRange(78, 9);
            this.allowAgentsOnCellRange(67, 1);
            this.allowAgentsOnCellRange(56, 9);
            this.allowAgentsOnCellRange(53, 1);
            this.allowAgentsOnCellRange(34, 9);
            this.allowAgentsOnCellRange(23, 1);
            this.allowAgentsOnCellRange(12, 10);
            this.addTerrainToPath(new Terrain(one.color('#aaa').alpha(0.8)));

            // Add predators and rivals
//            this.worldAgents = ([new Agent(AgentTypes.PREDATOR_AGENT_TYPE, 0, 9)]);
//            this.waveAgents = ([new Agent(AgentTypes.RIVAL_AGENT_TYPE, 10, 1)]);
        };

        this.world1.postStartWorldCallback = function() {
            // Add hooks here for tutorial
            if (FiercePlanet.Game.tutorialMode) {
                FiercePlanet.Game.pauseGame();

                var firstResource = $('#farm'), firstBorder = firstResource.css('border');
                var topMostCanvas = FiercePlanet.GeneralUI.getTopMostCanvas(), topBorder = topMostCanvas.css('border');
                var score = $('#score'), scoreBorder = score.css('border');
                var notifications = $('#notifications'), notificationsBorder = notifications.css('border');
                var controls = $('#controls'), controlsBorder = controls.css('border');
                var play = $('#playAgents'), playBorder = play.css('border');
                var balloonableElements = [ firstResource, topMostCanvas, score, notifications, controls, play ];
                var balloonableElementBorders = [ firstBorder, topBorder, scoreBorder, notificationsBorder, controlsBorder, playBorder ];
                var highlight = {border: 'solid 4px red'};
                var tipSize = 24;
                var balloonCss = {
                    border: 'solid 4px #1F1F1F',
                    padding: '10px',
                    fontSize: '120%',
                    fontWeight: 'bold',
                    lineHeight: '3',
                    backgroundColor: 'rgba(31, 98, 193, 1.0)',
                    color: '#fff'
                };
                var autoTimeout = 4000;

                var step1 = function() {
                    firstResource.showBalloon({
                        contents: '<div>Your goal is to save the citizens of Fierce-Planet by placing resources along their path. </div><div>Start by clicking on a resource.</div><div class="closeBalloon">Close</div>',
                        tipSize: tipSize,
                        css: balloonCss,
                        position: "left"
                    });
                    firstResource.css(highlight);
                    firstResource.one('click', function(e) {
                        firstResource.css('border', firstBorder);
                        firstResource.hideBalloon();

                        topMostCanvas.showBalloon({
                            contents: 'Now click on a free cell on the map.',
                            tipSize: tipSize,
                            css: balloonCss,
                            position: "top"
                        });
                        topMostCanvas.css(highlight);

                        step2();
                    });
                };
                var step2 = function() {
                    topMostCanvas.one('click', function(e) {
                        topMostCanvas.css('border', topBorder);
                        topMostCanvas.hideBalloon();

                        score.css(highlight);
                        score.showBalloon({
                            contents: '<div>Your score and other information can be found here.</div>',
                            tipSize: tipSize,
                            css: balloonCss,
                            position: "left"
                        });
                        setTimeout(function() {
                            step3();


                        }, autoTimeout);

                    });

                };
                var step3 = function() {
                    notifications.css(highlight);
                    notifications.showBalloon({
                        contents: '<div>Advanced features, like commands, graphs and custom parameters, can be viewed and edited here.</div>',
                        tipSize: tipSize,
                        css: balloonCss,
                        position: "top"
                    })

                    score.hideBalloon();
                    score.css('border', scoreBorder);
                    setTimeout(function() {
                        step4();
                    }, autoTimeout);

                };
                var step4 = function() {
                    controls.css(highlight);
                    controls.showBalloon({
                        contents: '<div>You can play, change the speed, change levels, and zoom in and out using the controls here.</div>',
                        tipSize: tipSize,
                        css: balloonCss,
                        position: "right"
                    })

                    notifications.hideBalloon();
                    notifications.css('border', notificationsBorder);

                    setTimeout(function() {
                        step5();
                    }, autoTimeout);

                };
                var step5 = function() {
                    controls.hideBalloon();
                    controls.css('border', controlsBorder);

                    play.showBalloon({
                        contents: '<div>Click "Play" to continue the game!</div>',
                        tipSize: tipSize,
                        css: balloonCss,
                        position: "right"
                    })
                    play.one('click', function(e) {
                        play.hideBalloon();
                    });

                };

                step1();

                /*
                firstResource.showBalloon({
                    contents: '<div>Your goal is to save the citizens of Fierce-Planet by placing resources along their path. </div><div>Start by clicking on a resource.</div><div class="closeBalloon">Close</div>',
                    tipSize: tipSize,
                    css: balloonCss,
                    position: "left"
                });
                firstResource.css(highlight);
                firstResource.one('click', function(e) {
                    firstResource.css('border', firstBorder);
                    firstResource.hideBalloon();

                    topMostCanvas.showBalloon({
                        contents: 'Now click on a free cell on the map.',
                        tipSize: tipSize,
                        css: balloonCss,
                        position: "top"
                    });
                    topMostCanvas.css(highlight);
                });

                topMostCanvas.one('click', function(e) {
                    topMostCanvas.css('border', topBorder);
                    topMostCanvas.hideBalloon();

                    score.css(highlight);
                    score.showBalloon({
                        contents: '<div>Your score and other information can be found here.</div>',
                        tipSize: tipSize,
                        css: balloonCss,
                        position: "left"
                    });
                    setTimeout(function() {
                        notifications.css(highlight);
                        notifications.showBalloon({
                            contents: '<div>Advanced features, like commands, graphs and custom parameters, can be viewed and edited here.</div>',
                            tipSize: tipSize,
                            css: balloonCss,
                            position: "top"
                        })

                        score.hideBalloon();
                        score.css('border', scoreBorder);

                        setTimeout(function() {
                            controls.css(highlight);
                            controls.showBalloon({
                                contents: '<div>You can play, change the speed, change levels, and zoom in and out using the controls here.</div>',
                                tipSize: tipSize,
                                css: balloonCss,
                                position: "right"
                            })

                            notifications.hideBalloon();
                            notifications.css('border', notificationsBorder);
                            setTimeout(function() {
                                controls.hideBalloon();
                                controls.css('border', controlsBorder);

                                play.showBalloon({
                                    contents: '<div>Click "Play" to continue the game!</div>',
                                    tipSize: tipSize,
                                    css: balloonCss,
                                    position: "right"
                                })
                                play.one('click', function(e) {
                                    play.hideBalloon();
                                });
                            }, autoTimeout);
                        }, autoTimeout);

                    }, autoTimeout);

                });
                */

                var closeBalloon = $('.closeBalloon').one('click', function() {
                    for (var i = 0 ; i < balloonableElements; i++) {
                        var balloonable = balloonableElements[i];
                        var balloonableBorder = balloonableElementBorders[i];
                        balloonable.hideBalloon();
                        balloonable.css('border', balloonableBorder);
                    }
                    FiercePlanet.Game.tutorialMode = false;
                });
                FiercePlanet.Game.tutorialMode = false;
            }

        };


        /* World 2 Definition */
        this.world2 = new World();
        this.world2.id = 2;
        this.world2.thumbnail = '/images/worlds/world-thumbnail-2.png';
        this.world2.isPresetWorld = true;
        this.world2.cellsAcross = 12;
        this.world2.cellsDown = 12;
        this.world2.initialAgentNumber = 1;
        this.world2.waveNumber = 10;
        this.world2.expiryLimit = 10;
        this.world2.initialResourceStore = 120 ;
        this.world2.name = ("World 2: Twists and Turns");
        this.world2.introduction = (
                "<p>The citizens of Fierce Planet are slowly building their city. With your help they can make it a place of peace and prosperity.</p>"
        //        "<p>The citizens of Fierce Planet have survived their first great challenge. But life is about to get much tougher...</p>"
        );
        this.world2.conclusion = (
                "<p>Well done, you have completed world 2. The hard work must continue...</p>"
        );
        this.world2.tip = (new Notice("You can pause at any time to add resources. You can place more resources as you save citizens.", 0, 0));
        this.world2.soundSrc = ("http://db.tt/Tyd9F6M");

        this.world2.setup = function() {
            this.addEntryPoint(0, 0);
            this.addExitPoint(11, 1);

            this.forbidAgentsOnAllCells();
            this.allowAgentsOnCellRange(121, 10);
            this.allowAgentsOnCellRange(118, 1);
            this.allowAgentsOnCellRange(109, 1);
            this.allowAgentsOnCellRange(102, 5);
            this.allowAgentsOnCellRange(97, 4);
            this.allowAgentsOnCellRange(90, 1);
            this.allowAgentsOnCellRange(88, 1);
            this.allowAgentsOnCellRange(78, 5);
            this.allowAgentsOnCellRange(73, 4);
            this.allowAgentsOnCellRange(70, 1);
            this.allowAgentsOnCellRange(61, 1);
            this.allowAgentsOnCellRange(54, 5);
            this.allowAgentsOnCellRange(49, 4);
            this.allowAgentsOnCellRange(42, 1);
            this.allowAgentsOnCellRange(40, 1);
            this.allowAgentsOnCellRange(32, 3);
            this.allowAgentsOnCellRange(30, 1);
            this.allowAgentsOnCellRange(25, 4);
            this.allowAgentsOnCellRange(22, 2);
            this.allowAgentsOnCellRange(18, 3);
            this.allowAgentsOnCellRange(13, 1);
            this.allowAgentsOnCellRange(0, 2);

            this.addTerrainToPath(new Terrain(one.color('#BFB3A7').alpha(0.8)));
//            FiercePlanet.Effects.currentEffect = FiercePlanet.Effects.Rain;
        };


        /* World 3 Definition */

        this.world3 = new World();
        this.world3.id = 3;
        this.world3.thumbnail = '/images/worlds/world-thumbnail-3.png';
        this.world3.isPresetWorld = true;
        this.world3.cellsAcross = 13;
        this.world3.cellsDown = 13;
        this.world3.initialAgentNumber = 1;
        this.world3.waveNumber = 10;
        this.world3.expiryLimit = 10;
        this.world3.initialResourceStore = 150;
        this.world3.name = ("World 3: Waves of Uncertainty");
        this.world3.introduction = (
                "<p>The rebuilding of Fierce Planet is proceeding well... but how can you plan for a random act of nature??!!! </p>"
        //        "<p>So far, everything seems to be proceeding as planned. But on Fierce Planet, learn to expect the unexpected... </p>"
        );
        this.world3.conclusion = (
                "<p>Phew - that was a rush! Perhaps the citizens will need to head inland for a while.</p>"
        );
        this.world3.tip = new Notice("The worlds get progressively larger, requiring more planning as to where you allocate resources. Aim to place resources at regular intervals along the path.");
        this.world3.soundSrc = "http://db.tt/7KPJ8Xi";
        this.world3.catastrophe = (new Catastrophe(new ResourceCategory("Environmental", "env", "ABBB2A"), 1000 + (Math.random() * 1000), 250, 0.8, new Notice("A tsumani will soon hit the city - some of its resources will be depleted.", undefined, undefined, 500, 250, undefined, undefined, "ABBB2A", "000000")));
//        this.world3.catastrophe = (new Catastrophe(TBL.ENV_CATEGORY, 1000 + (Math.random() * 1000), 250, 0.8, new Notice("A tsumani will soon hit the city - some of its resources will be depleted.", undefined, undefined, 500, 250, undefined, undefined, TBL.ENV_CATEGORY.color, "000000")));


        this.world3.setup = function() {
            this.forbidAgentsOnAllCells();
            this.allowAgentsOnCellRange(161, 1);
            this.allowAgentsOnCellRange(150, 5);
            this.allowAgentsOnCellRange(148, 1);
            this.allowAgentsOnCellRange(144, 3);
            this.allowAgentsOnCellRange(141, 1);
            this.allowAgentsOnCellRange(137, 1);
            this.allowAgentsOnCellRange(135, 1);
            this.allowAgentsOnCellRange(133, 1);
            this.allowAgentsOnCellRange(131, 1);
            this.allowAgentsOnCellRange(126, 3);
            this.allowAgentsOnCellRange(124, 1);
            this.allowAgentsOnCellRange(122, 1);
            this.allowAgentsOnCellRange(120, 1);
            this.allowAgentsOnCellRange(118, 1);
            this.allowAgentsOnCellRange(113, 1);
            this.allowAgentsOnCellRange(111, 1);
            this.allowAgentsOnCellRange(109, 1);
            this.allowAgentsOnCellRange(107, 1);
            this.allowAgentsOnCellRange(105, 1);
            this.allowAgentsOnCellRange(100, 3);
            this.allowAgentsOnCellRange(96, 3);
            this.allowAgentsOnCellRange(94, 1);
            this.allowAgentsOnCellRange(92, 1);
            this.allowAgentsOnCellRange(89, 1);
            this.allowAgentsOnCellRange(81, 1);
            this.allowAgentsOnCellRange(79, 1);
            this.allowAgentsOnCellRange(68, 9);
            this.allowAgentsOnCellRange(66, 1);
            this.allowAgentsOnCellRange(53, 1);
            this.allowAgentsOnCellRange(42, 9);
            this.allowAgentsOnCellRange(40, 1);
            this.allowAgentsOnCellRange(37, 1);
            this.allowAgentsOnCellRange(27, 1);
            this.allowAgentsOnCellRange(14, 11);

            this.addTerrainToPath(new Terrain(one.color('#BBB1B0').alpha(0.8)));
            this.addEntryPoint(5, 12);
            this.addExitPoint(3, 3);
        };


        /* World 4 Definition */

        this.world4 = new World();
        this.world4.id = 4;
        this.world4.thumbnail = '/images/worlds/world-thumbnail-4.png';
        this.world4.isPresetWorld = true;
        this.world4.cellsAcross = 14;
        this.world4.cellsDown = 14;
        this.world4.initialAgentNumber = 1;
        this.world4.waveNumber = 10;
        this.world4.expiryLimit = 10;
        this.world4.initialResourceStore =180 ;
        this.world4.name = ("World 4: Spiral of Doom");
        this.world4.introduction = (
                "<p>The only way out is via the long and winding road...</p>"
                );
        this.world4.tip = (new Notice("Be sure to allocate resources to the outer reaches of the path. Citizens will run faster when there is less to go around..."));
        this.world4.soundSrc = ("http://db.tt/9m8kuIs");
        this.world4.conclusion = ("Your citizens are feeling dizzy! But thankfully they have survived!");

        this.world4.setup = function() {
            this.forbidAgentsOnAllCells();
            this.allowAgentsOnCellRange(168, 13);
            this.allowAgentsOnCellRange(166, 1);
            this.allowAgentsOnCellRange(154, 1);
            this.allowAgentsOnCellRange(152, 1);
            this.allowAgentsOnCellRange(142, 9);
            this.allowAgentsOnCellRange(140, 1);
            this.allowAgentsOnCellRange(138, 1);
            this.allowAgentsOnCellRange(136, 1);
            this.allowAgentsOnCellRange(128, 1);
            this.allowAgentsOnCellRange(126, 1);
            this.allowAgentsOnCellRange(124, 1);
            this.allowAgentsOnCellRange(122, 1);
            this.allowAgentsOnCellRange(116, 5);
            this.allowAgentsOnCellRange(114, 1);
            this.allowAgentsOnCellRange(112, 1);
            this.allowAgentsOnCellRange(110, 1);
            this.allowAgentsOnCellRange(108, 1);
            this.allowAgentsOnCellRange(106, 1);
            this.allowAgentsOnCellRange(102, 1);
            this.allowAgentsOnCellRange(100, 1);
            this.allowAgentsOnCellRange(98, 1);
            this.allowAgentsOnCellRange(96, 1);
            this.allowAgentsOnCellRange(94, 1);
            this.allowAgentsOnCellRange(92, 1);
            this.allowAgentsOnCellRange(90, 1);
            this.allowAgentsOnCellRange(88, 1);
            this.allowAgentsOnCellRange(86, 1);
            this.allowAgentsOnCellRange(84, 1);
            this.allowAgentsOnCellRange(82, 1);
            this.allowAgentsOnCellRange(80, 1);
            this.allowAgentsOnCellRange(76, 3);
            this.allowAgentsOnCellRange(74, 1);
            this.allowAgentsOnCellRange(72, 1);
            this.allowAgentsOnCellRange(70, 1);
            this.allowAgentsOnCellRange(68, 1);
            this.allowAgentsOnCellRange(66, 1);
            this.allowAgentsOnCellRange(60, 1);
            this.allowAgentsOnCellRange(58, 1);
            this.allowAgentsOnCellRange(56, 1);
            this.allowAgentsOnCellRange(54, 1);
            this.allowAgentsOnCellRange(46, 7);
            this.allowAgentsOnCellRange(44, 1);
            this.allowAgentsOnCellRange(42, 1);
            this.allowAgentsOnCellRange(40, 1);
            this.allowAgentsOnCellRange(30, 1);
            this.allowAgentsOnCellRange(28, 1);
            this.allowAgentsOnCellRange(16, 11);
            this.allowAgentsOnCellRange(14, 1);
            this.allowAgentsOnCellRange(0, 1);

            // Experimental terrain support
            this.addTerrainToPath(new Terrain(one.color('#CEA98F').alpha(0.5)));
            var lowerHalfTerrain = new Terrain(one.color('#645C51').alpha(0.5));
            
            this.getCell(0, 4).terrain = lowerHalfTerrain;
            this.getCell(0, 5).terrain = lowerHalfTerrain;
            this.getCell(0, 6).terrain = lowerHalfTerrain;
            this.getCell(0, 7).terrain = lowerHalfTerrain;
            this.getCell(0, 8).terrain = lowerHalfTerrain;
            this.getCell(0, 9).terrain = lowerHalfTerrain;
            this.getCell(0, 10).terrain = lowerHalfTerrain;
            this.getCell(0, 11).terrain = lowerHalfTerrain;
            this.getCell(0, 12).terrain = lowerHalfTerrain;
            this.getCell(1, 12).terrain = lowerHalfTerrain;
            this.getCell(2, 12).terrain = lowerHalfTerrain;
            this.getCell(3, 12).terrain = lowerHalfTerrain;
            this.getCell(2, 4).terrain = lowerHalfTerrain;
            this.getCell(2, 5).terrain = lowerHalfTerrain;
            this.getCell(2, 6).terrain = lowerHalfTerrain;
            this.getCell(2, 7).terrain = lowerHalfTerrain;
            this.getCell(2, 8).terrain = lowerHalfTerrain;
            this.getCell(2, 9).terrain = lowerHalfTerrain;
            this.getCell(2, 10).terrain = lowerHalfTerrain;
            this.getCell(3, 10).terrain = lowerHalfTerrain;
            this.getCell(4, 9).terrain = lowerHalfTerrain;
            
            this.addEntryPoint(6, 6);
            this.addExitPoint(0, 0);
        };


        /* World 5 Definition */

        this.world5 = new World();
        this.world5.id = 5;
        this.world5.thumbnail = '/images/worlds/world-thumbnail-5.png';
        this.world5.isPresetWorld = true;
        this.world5.cellsAcross = 15;
        this.world5.cellsDown = 15;
        this.world5.initialAgentNumber = 1;
        this.world5.waveNumber = 10;
        this.world5.expiryLimit = 10;
        this.world5.initialResourceStore =200 ;
        this.world5.name = ("World 5: A-mazing Grace");
        this.world5.introduction = (
                "<p>The citizens are hopeful that the promised land lies not too far ahead. Or does it?</p>"
                );
        this.world5.tip = (new Notice("Citizens are (sort of) smart - at forks in the road, they'll take the path which appears more plentiful. Place resources to help them choose the right path."));
        this.world5.soundSrc = ("http://db.tt/DIi4CW0");
        this.world5.conclusion = ("That really was a-mazing! Time to straighten things out...");


        this.world5.setup = function() {
            this.forbidAgentsOnAllCells();
            this.allowAgentsOnCellRange(208, 1);
            this.allowAgentsOnCellRange(204, 3);
            this.allowAgentsOnCellRange(196, 7);
            this.allowAgentsOnCellRange(193, 1);
            this.allowAgentsOnCellRange(191, 1);
            this.allowAgentsOnCellRange(189, 1);
            this.allowAgentsOnCellRange(187, 1);
            this.allowAgentsOnCellRange(183, 1);
            this.allowAgentsOnCellRange(178, 1);
            this.allowAgentsOnCellRange(176, 1);
            this.allowAgentsOnCellRange(174, 1);
            this.allowAgentsOnCellRange(172, 1);
            this.allowAgentsOnCellRange(170, 1);
            this.allowAgentsOnCellRange(166, 3);
            this.allowAgentsOnCellRange(163, 1);
            this.allowAgentsOnCellRange(161, 1);
            this.allowAgentsOnCellRange(159, 1);
            this.allowAgentsOnCellRange(157, 1);
            this.allowAgentsOnCellRange(155, 1);
            this.allowAgentsOnCellRange(151, 1);
            this.allowAgentsOnCellRange(148, 1);
            this.allowAgentsOnCellRange(146, 1);
            this.allowAgentsOnCellRange(144, 1);
            this.allowAgentsOnCellRange(142, 1);
            this.allowAgentsOnCellRange(140, 1);
            this.allowAgentsOnCellRange(138, 1);
            this.allowAgentsOnCellRange(136, 1);
            this.allowAgentsOnCellRange(131, 3);
            this.allowAgentsOnCellRange(129, 1);
            this.allowAgentsOnCellRange(127, 1);
            this.allowAgentsOnCellRange(125, 1);
            this.allowAgentsOnCellRange(123, 1);
            this.allowAgentsOnCellRange(121, 1);
            this.allowAgentsOnCellRange(118, 1);
            this.allowAgentsOnCellRange(114, 1);
            this.allowAgentsOnCellRange(112, 1);
            this.allowAgentsOnCellRange(110, 1);
            this.allowAgentsOnCellRange(108, 1);
            this.allowAgentsOnCellRange(106, 1);
            this.allowAgentsOnCellRange(103, 1);
            this.allowAgentsOnCellRange(99, 3);
            this.allowAgentsOnCellRange(95, 3);
            this.allowAgentsOnCellRange(91, 3);
            this.allowAgentsOnCellRange(88, 1);
            this.allowAgentsOnCellRange(86, 1);
            this.allowAgentsOnCellRange(80, 1);
            this.allowAgentsOnCellRange(78, 1);
            this.allowAgentsOnCellRange(76, 1);
            this.allowAgentsOnCellRange(73, 1);
            this.allowAgentsOnCellRange(71, 1);
            this.allowAgentsOnCellRange(67, 3);
            this.allowAgentsOnCellRange(65, 1);
            this.allowAgentsOnCellRange(63, 1);
            this.allowAgentsOnCellRange(61, 1);
            this.allowAgentsOnCellRange(58, 1);
            this.allowAgentsOnCellRange(56, 1);
            this.allowAgentsOnCellRange(54, 1);
            this.allowAgentsOnCellRange(52, 1);
            this.allowAgentsOnCellRange(50, 1);
            this.allowAgentsOnCellRange(48, 1);
            this.allowAgentsOnCellRange(46, 1);
            this.allowAgentsOnCellRange(43, 1);
            this.allowAgentsOnCellRange(41, 1);
            this.allowAgentsOnCellRange(39, 1);
            this.allowAgentsOnCellRange(37, 1);
            this.allowAgentsOnCellRange(35, 1);
            this.allowAgentsOnCellRange(33, 1);
            this.allowAgentsOnCellRange(28, 1);
            this.allowAgentsOnCellRange(24, 3);
            this.allowAgentsOnCellRange(20, 3);
            this.allowAgentsOnCellRange(15, 4);
            this.allowAgentsOnCellRange(13, 1);

            this.addTerrainToPath(new Terrain(one.color('#A7A493').alpha(0.8)));
            this.addEntryPoint(13, 0);
            this.addExitPoint(0, 1);
        };


        /* World 6 Definition */

        this.world6 = new World();
        this.world6.id = 6;
        this.world6.thumbnail = '/images/worlds/world-thumbnail-6.png';
        this.world6.isPresetWorld = true;
        this.world6.cellsAcross = 16;
        this.world6.cellsDown = 16;
        this.world6.initialAgentNumber = 1;
        this.world6.waveNumber = 10;
        this.world6.expiryLimit = 10;
        this.world6.allowOffscreenCycling = (true);
        this.world6.initialResourceStore =350 ;
        this.world6.name = ("World 6: Dire Straits");
        this.world6.introduction = (
                "<p>This world looks well resourced &mdash; but there are troubling signs ahead for the economy. your citizens are going to need all the help they can get... </p>");
        //this.world6.tip = (new Notice("Clicking on an existing resource allows you to delete or upgrade it. An upgraded resource will dispense more health to citizens passing by."));
        this.world6.tip = (new Notice("Clicking on an existing resource allows you to delete it, and give you back some of what you spent"));
        this.world6.conclusion = ("Back in surplus! Your citizens were able to pull through. Can they continue to work together through the challenges that lie ahead?");
        this.world6.soundSrc = ("http://db.tt/gre8MPS");
//        this.world6.catastrophe = (new Catastrophe(TBL.ECO_CATEGORY, 500 + (Math.random() * 500), 250, 0.75, new Notice("The city is suffering a financial crisis - many services will be temporarily discontinued...", undefined, undefined, 500, 250, undefined, undefined, TBL.ECO_CATEGORY.color)));
        this.world6.catastrophe = (new Catastrophe(new ResourceCategory("Economic", "eco", "44ABE0"), 500 + (Math.random() * 500), 250, 0.75, new Notice("The city is suffering a financial crisis - many services will be temporarily discontinued...", undefined, undefined, 500, 250, undefined, undefined, "44ABE0")));

        this.world6.setup = function() {
            this.forbidAgentsOnAllCells();
            this.allowAgentsOnCellRange(226, 1);
            this.allowAgentsOnCellRange(212, 12);
            this.allowAgentsOnCellRange(208, 3);
            this.allowAgentsOnCellRange(196, 1);
            this.allowAgentsOnCellRange(182, 10);
            this.allowAgentsOnCellRange(176, 5);
            this.allowAgentsOnCellRange(166, 1);
            this.allowAgentsOnCellRange(152, 8);
            this.allowAgentsOnCellRange(144, 7);
            this.allowAgentsOnCellRange(136, 1);
            this.allowAgentsOnCellRange(122, 6);
            this.allowAgentsOnCellRange(112, 9);
            this.allowAgentsOnCellRange(106, 1);
            this.allowAgentsOnCellRange(92, 4);
            this.allowAgentsOnCellRange(80, 11);
            this.allowAgentsOnCellRange(76, 1);
            this.allowAgentsOnCellRange(62, 2);
            this.allowAgentsOnCellRange(48, 13);
            this.allowAgentsOnCellRange(46, 1);
            this.allowAgentsOnCellRange(16, 15);

            this.addTerrainToPath(new Terrain(one.color('#EBBA99').alpha(0.8)));
            this.addEntryPoint(0, 1);
            this.addExitPoint(2, 14);
        };


        /* World 7 Definition */

        this.world7 = new World();
        this.world7.id = 7;
        this.world7.thumbnail = '/images/worlds/world-thumbnail-7.png';
        this.world7.isPresetWorld = true;
        this.world7.cellsAcross = 17;
        this.world7.cellsDown = 17;
        this.world7.initialAgentNumber = 1;
        this.world7.waveNumber = 10;
        this.world7.expiryLimit = 10;
        this.world7.allowResourcesOnPath = (true);
        // TODO: Testing - remove for production deployment
        this.world7.initialResourceStore = 200;
        this.world7.agentGoToNearestExit = true;
        this.world7.resourcesOwnTilesExclusively = true;
        this.world7.name = ("World 7: Like, Totally Random...");
        this.world7.introduction = (
                "<p>Ahead lies a vast and empty expanse. Your citizens are understandably nervous. Left unaided, they will try not to backtrack, but could find themselves hopelessly lost.</p>");
        this.world7.tip = (new Notice("You can add resources to the paths (the white squares) on this world, to direct citizens to their goal."));
        this.world7.conclusion = ("Spaced out! Time to move back to the (apparent) comforts of the city.");
        this.world7.soundSrc = ("http://db.tt/7SRv0qP");

        this.world7.setup = function() {
            this.forbidAgentsOnAllCells();
            this.allowAgentsOnCellRange(280, 1);
            this.allowAgentsOnCellRange(262, 3);
            this.allowAgentsOnCellRange(244, 5);
            this.allowAgentsOnCellRange(226, 7);
            this.allowAgentsOnCellRange(208, 9);
            this.allowAgentsOnCellRange(190, 11);
            this.allowAgentsOnCellRange(172, 13);
            this.allowAgentsOnCellRange(154, 15);
            this.allowAgentsOnCellRange(136, 17);
            this.allowAgentsOnCellRange(120, 15);
            this.allowAgentsOnCellRange(104, 13);
            this.allowAgentsOnCellRange(88, 11);
            this.allowAgentsOnCellRange(72, 9);
            this.allowAgentsOnCellRange(56, 7);
            this.allowAgentsOnCellRange(40, 5);
            this.allowAgentsOnCellRange(24, 3);
            this.allowAgentsOnCellRange(8, 1);

            this.addTerrainToPath(new Terrain(one.color('#DCDCDE').alpha(0.9)));
            // Add predators and rivals
        //    this.addWorldAgent(new Agent(AgentTypes.PREDATOR_AGENT_TYPE, 8, 4));
        //    this.addWaveAgent(new Agent(AgentTypes.RIVAL_AGENT_TYPE, 9, 4));
            this.addEntryPoint(0, 8);
            this.addExitPoint(16, 8);
        };




        /* World 8 Definition */

        this.world8 = new World();
        this.world8.id = 8;
        this.world8.thumbnail = '/images/worlds/world-thumbnail-8.png';
        this.world8.isPresetWorld = true;
        this.world8.cellsAcross = 18;
        this.world8.cellsDown = 18;
        this.world8.initialAgentNumber = 1;
        this.world8.waveNumber = 10;
        this.world8.expiryLimit = 10;
        this.world8.initialResourceStore =300 ;
        this.world8.name = ("World 8: A Fork (or Two) in the Road");
        this.world8.introduction = (
                "<p>Life for the citizens of Fierce Planet is never simple. They are now faced with difficult dilemmas about which way to turn.</p>");
        this.world8.tip = (new Notice("You'll need to direct citizen through numerous forks in the road, by strategic placement of resources along the path."));
        this.world8.conclusion = ("Un-fork-ettable! After all that running around, time for a refreshing break...");
        this.world8.soundSrc = ("http://db.tt/0ynKmXS");


        this.world8.setup = function() {
            this.forbidAgentsOnAllCells();
            this.allowAgentsOnCellRange(322, 2);
            this.allowAgentsOnCellRange(289, 16);
            this.allowAgentsOnCellRange(286, 1);
            this.allowAgentsOnCellRange(271, 1);
            this.allowAgentsOnCellRange(255, 14);
            this.allowAgentsOnCellRange(253, 1);
            this.allowAgentsOnCellRange(250, 1);
            this.allowAgentsOnCellRange(248, 1);
            this.allowAgentsOnCellRange(246, 1);
            this.allowAgentsOnCellRange(237, 1);
            this.allowAgentsOnCellRange(235, 1);
            this.allowAgentsOnCellRange(232, 1);
            this.allowAgentsOnCellRange(230, 1);
            this.allowAgentsOnCellRange(221, 8);
            this.allowAgentsOnCellRange(219, 1);
            this.allowAgentsOnCellRange(217, 1);
            this.allowAgentsOnCellRange(214, 1);
            this.allowAgentsOnCellRange(212, 1);
            this.allowAgentsOnCellRange(210, 1);
            this.allowAgentsOnCellRange(203, 1);
            this.allowAgentsOnCellRange(201, 1);
            this.allowAgentsOnCellRange(199, 1);
            this.allowAgentsOnCellRange(196, 1);
            this.allowAgentsOnCellRange(194, 1);
            this.allowAgentsOnCellRange(187, 6);
            this.allowAgentsOnCellRange(185, 1);
            this.allowAgentsOnCellRange(183, 1);
            this.allowAgentsOnCellRange(181, 1);
            this.allowAgentsOnCellRange(178, 1);
            this.allowAgentsOnCellRange(176, 1);
            this.allowAgentsOnCellRange(174, 1);
            this.allowAgentsOnCellRange(172, 1);
            this.allowAgentsOnCellRange(169, 1);
            this.allowAgentsOnCellRange(167, 1);
            this.allowAgentsOnCellRange(165, 1);
            this.allowAgentsOnCellRange(163, 1);
            this.allowAgentsOnCellRange(160, 1);
            this.allowAgentsOnCellRange(158, 1);
            this.allowAgentsOnCellRange(156, 1);
            this.allowAgentsOnCellRange(154, 1);
            this.allowAgentsOnCellRange(151, 1);
            this.allowAgentsOnCellRange(149, 1);
            this.allowAgentsOnCellRange(147, 1);
            this.allowAgentsOnCellRange(145, 1);
            this.allowAgentsOnCellRange(142, 1);
            this.allowAgentsOnCellRange(140, 1);
            this.allowAgentsOnCellRange(138, 1);
            this.allowAgentsOnCellRange(131, 6);
            this.allowAgentsOnCellRange(129, 1);
            this.allowAgentsOnCellRange(127, 1);
            this.allowAgentsOnCellRange(124, 1);
            this.allowAgentsOnCellRange(122, 1);
            this.allowAgentsOnCellRange(120, 1);
            this.allowAgentsOnCellRange(113, 1);
            this.allowAgentsOnCellRange(111, 1);
            this.allowAgentsOnCellRange(109, 1);
            this.allowAgentsOnCellRange(106, 1);
            this.allowAgentsOnCellRange(104, 1);
            this.allowAgentsOnCellRange(95, 8);
            this.allowAgentsOnCellRange(93, 1);
            this.allowAgentsOnCellRange(91, 1);
            this.allowAgentsOnCellRange(88, 1);
            this.allowAgentsOnCellRange(86, 1);
            this.allowAgentsOnCellRange(77, 1);
            this.allowAgentsOnCellRange(75, 1);
            this.allowAgentsOnCellRange(73, 1);
            this.allowAgentsOnCellRange(70, 1);
            this.allowAgentsOnCellRange(55, 14);
            this.allowAgentsOnCellRange(52, 1);
            this.allowAgentsOnCellRange(37, 1);
            this.allowAgentsOnCellRange(19, 16);
            this.allowAgentsOnCellRange(0, 2);

            this.addTerrainToPath(new Terrain(one.color('#CCB09A').alpha(0.9)));
            this.addEntryPoint(0, 0);
            this.addExitPoint(17, 17);
        };


        /* World 9 Definition */

        this.world9 = new World();
        this.world9.id = 9;
        this.world9.thumbnail = '/images/worlds/world-thumbnail-9.png';
        this.world9.isPresetWorld = true;
        this.world9.cellsAcross = 19;
        this.world9.cellsDown = 19;
        this.world9.initialAgentNumber = 1;
        this.world9.waveNumber = 10;
        this.world9.expiryLimit = 10;
        this.world9.initialResourceStore =280 ;
        this.world9.name = ("World 9: Cascades");
        this.world9.introduction = (
                "<p>Time is running out. But the citizens of Fierce Planet still need some rest and relaxation. Doesn't a trip to the beach sound like a good idea?</p>");
        this.world9.tip = (new Notice("No tip! You've gotten this far..."));
        this.world9.conclusion = ("This seaside journey nearly brought about their downfall! Now time for the final stretch...");
        this.world9.soundSrc = ("http://db.tt/LMyYRtH");

        this.world9.setup = function() {
            this.forbidAgentsOnAllCells();
            this.allowAgentsOnCellRange(351, 1);
            this.allowAgentsOnCellRange(330, 5);
        //    this.clearTiles(315, 1);
            this.allowAgentsOnCellRange(311, 1);
            this.allowAgentsOnCellRange(296, 3);
            this.allowAgentsOnCellRange(294, 1);
            this.allowAgentsOnCellRange(290, 3);
            this.allowAgentsOnCellRange(279, 1);
            this.allowAgentsOnCellRange(275, 1);
            this.allowAgentsOnCellRange(271, 1);
            this.allowAgentsOnCellRange(260, 3);
            this.allowAgentsOnCellRange(254, 5);
            this.allowAgentsOnCellRange(250, 3);
            this.allowAgentsOnCellRange(243, 1);
            this.allowAgentsOnCellRange(239, 1);
            this.allowAgentsOnCellRange(235, 1);
            this.allowAgentsOnCellRange(231, 1);
            this.allowAgentsOnCellRange(224, 3);
            this.allowAgentsOnCellRange(214, 9);
            this.allowAgentsOnCellRange(210, 3);
            this.allowAgentsOnCellRange(207, 1);
            this.allowAgentsOnCellRange(203, 1);
            this.allowAgentsOnCellRange(195, 1);
            this.allowAgentsOnCellRange(191, 1);
            this.allowAgentsOnCellRange(182, 7);
            this.allowAgentsOnCellRange(178, 1);
            this.allowAgentsOnCellRange(172, 5);
            this.allowAgentsOnCellRange(163, 1);
            this.allowAgentsOnCellRange(159, 1);
            this.allowAgentsOnCellRange(144, 3);
            this.allowAgentsOnCellRange(138, 3);
            this.allowAgentsOnCellRange(127, 1);
            this.allowAgentsOnCellRange(125, 1);
            this.allowAgentsOnCellRange(121, 1);
            this.allowAgentsOnCellRange(119, 1);
            this.allowAgentsOnCellRange(108, 3);
            this.allowAgentsOnCellRange(106, 1);
            this.allowAgentsOnCellRange(102, 1);
            this.allowAgentsOnCellRange(98, 3);
            this.allowAgentsOnCellRange(91, 1);
            this.allowAgentsOnCellRange(87, 1);
            this.allowAgentsOnCellRange(83, 1);
            this.allowAgentsOnCellRange(79, 1);
            this.allowAgentsOnCellRange(72, 3);
            this.allowAgentsOnCellRange(62, 9);
            this.allowAgentsOnCellRange(58, 3);
            this.allowAgentsOnCellRange(55, 1);
            this.allowAgentsOnCellRange(39, 1);
            this.allowAgentsOnCellRange(20, 17);
            this.allowAgentsOnCellRange(9, 1);

            this.addTerrainToPath(new Terrain(one.color('#ECDDCA').alpha(0.9)));
            this.addEntryPoint(9, 0);
            this.addExitPoint(9, 18);

        };



        /* World 10 Definition */

        this.world10 = new World();
        this.world10.id = 10;
        this.world10.thumbnail = '/images/worlds/world-thumbnail-10.png';
        this.world10.isPresetWorld = true;
        this.world10.cellsAcross = 20;
        this.world10.cellsDown = 20;
        this.world10.initialAgentNumber = 1;
        this.world10.waveNumber = 5;
        this.world10.expiryLimit = 1;
        this.world10.initialResourceStore =500 ;
        this.world10.name = ("World 10: Fields of Ma(i)ze");
        this.world10.introduction = (
                "<p>Pastures of plenty and a new sustainable future lie in store for the citizens of Fierce Planet. </p>" +
                "<p>With few remaining resources, they are starting to fight among themselves. Can they withstand a revolution from within?</p>");
        this.world10.tip = (new Notice("Remember to resource dead end paths, or your citizens will fade away, dazed and confused..."));
        this.world10.soundSrc = ("http://db.tt/DIi4CW0");
        this.world10.catastrophe = (new Catastrophe(new ResourceCategory("Social", "soc", "DE1F2A"), 500 + (Math.random() * 100), 250, 0.6, new Notice("Oh no! A revolution is coming...", undefined, undefined, 500, 250, undefined, undefined, "DE1F2A")));

        this.world10.setup = function() {
            this.forbidAgentsOnAllCells();
            this.allowAgentsOnCellRange(398, 1);
            this.allowAgentsOnCellRange(396, 1);
            this.allowAgentsOnCellRange(378, 1);
            this.allowAgentsOnCellRange(361, 16);
            this.allowAgentsOnCellRange(358, 1);
            this.allowAgentsOnCellRange(356, 1);
            this.allowAgentsOnCellRange(345, 1);
            this.allowAgentsOnCellRange(341, 1);
            this.allowAgentsOnCellRange(338, 1);
            this.allowAgentsOnCellRange(334, 3);
            this.allowAgentsOnCellRange(325, 8);
            this.allowAgentsOnCellRange(323, 1);
            this.allowAgentsOnCellRange(321, 1);
            this.allowAgentsOnCellRange(318, 1);
            this.allowAgentsOnCellRange(312, 1);
            this.allowAgentsOnCellRange(305, 1);
            this.allowAgentsOnCellRange(303, 1);
            this.allowAgentsOnCellRange(301, 1);
            this.allowAgentsOnCellRange(298, 1);
            this.allowAgentsOnCellRange(292, 5);
            this.allowAgentsOnCellRange(287, 4);
            this.allowAgentsOnCellRange(285, 1);
            this.allowAgentsOnCellRange(281, 3);
            this.allowAgentsOnCellRange(278, 1);
            this.allowAgentsOnCellRange(267, 1);
            this.allowAgentsOnCellRange(265, 1);
            this.allowAgentsOnCellRange(247, 12);
            this.allowAgentsOnCellRange(241, 5);
            this.allowAgentsOnCellRange(238, 1);
            this.allowAgentsOnCellRange(221, 1);
            this.allowAgentsOnCellRange(218, 1);
            this.allowAgentsOnCellRange(215, 1);
            this.allowAgentsOnCellRange(211, 3);
            this.allowAgentsOnCellRange(207, 3);
            this.allowAgentsOnCellRange(205, 1);
            this.allowAgentsOnCellRange(203, 1);
            this.allowAgentsOnCellRange(201, 1);
            this.allowAgentsOnCellRange(195, 4);
            this.allowAgentsOnCellRange(193, 1);
            this.allowAgentsOnCellRange(189, 3);
            this.allowAgentsOnCellRange(183, 5);
            this.allowAgentsOnCellRange(181, 1);
            this.allowAgentsOnCellRange(178, 1);
            this.allowAgentsOnCellRange(173, 1);
            this.allowAgentsOnCellRange(164, 1);
            this.allowAgentsOnCellRange(161, 1);
            this.allowAgentsOnCellRange(158, 1);
            this.allowAgentsOnCellRange(153, 4);
            this.allowAgentsOnCellRange(146, 6);
            this.allowAgentsOnCellRange(141, 4);
            this.allowAgentsOnCellRange(138, 1);
            this.allowAgentsOnCellRange(136, 1);
            this.allowAgentsOnCellRange(131, 1);
            this.allowAgentsOnCellRange(126, 1);
            this.allowAgentsOnCellRange(118, 1);
            this.allowAgentsOnCellRange(114, 3);
            this.allowAgentsOnCellRange(108, 5);
            this.allowAgentsOnCellRange(106, 1);
            this.allowAgentsOnCellRange(101, 4);
            this.allowAgentsOnCellRange(98, 1);
            this.allowAgentsOnCellRange(94, 1);
            this.allowAgentsOnCellRange(91, 1);
            this.allowAgentsOnCellRange(88, 1);
            this.allowAgentsOnCellRange(86, 1);
            this.allowAgentsOnCellRange(84, 1);
            this.allowAgentsOnCellRange(81, 1);
            this.allowAgentsOnCellRange(78, 1);
            this.allowAgentsOnCellRange(76, 1);
            this.allowAgentsOnCellRange(71, 4);
            this.allowAgentsOnCellRange(68, 2);
            this.allowAgentsOnCellRange(63, 4);
            this.allowAgentsOnCellRange(61, 1);
            this.allowAgentsOnCellRange(58, 1);
            this.allowAgentsOnCellRange(56, 1);
            this.allowAgentsOnCellRange(41, 1);
            this.allowAgentsOnCellRange(21, 18);

            this.addTerrainToPath(new Terrain(one.color('#FAF6ED').alpha(0.9)));
            this.addEntryPoint(18, 19);
            this.addExitPoint(16, 19);
        };



        /* World 11 Definition */

        this.world11 = new World();
        this.world11.id = 11;
        this.world11.thumbnail = '/images/worlds/world-thumbnail-11.png';
        this.world11.isPresetWorld = true;
        this.world11.cellsAcross = 30;
        this.world11.cellsDown = 25;
        this.world11.initialAgentNumber = 4;
        this.world11.waveNumber = 3;
        this.world11.expiryLimit = 10;
        this.world11.initialResourceStore = 3000;
        this.world11.allowOffscreenCycling = (true);
        this.world11.name = ("World 11: It's a Mad World");
        this.world11.isTerminalWorld = true;
        this.world11.introduction = (
                "<p>The citizens are safe! There's no mad rush &mdash; time to sit back and watch the world go by....");
        this.world11.tip = (new Notice("'There is a place. Like no place on Earth. A land full of wonder, mystery, and danger! Some say to survive it: You need to be as mad as a hatter. ' (The Mad Hatter)"));

        this.world11.setup = function() {
            this.allowAgentsOnCellPositions(JSON.parse('[{"color":"0FFF1F","x":0,"y":0},null,{"color":"0FFF1F","x":2,"y":0},{"color":"0FFF1F","x":3,"y":0},{"color":"0FFF1F","x":4,"y":0},{"color":"0FFF1F","x":5,"y":0},{"color":"0FFF1F","x":6,"y":0},{"color":"0FFF1F","x":7,"y":0},{"color":"0FFF1F","x":8,"y":0},{"color":"0FFF1F","x":9,"y":0},{"color":"0FFF1F","x":10,"y":0},{"color":"0FFF1F","x":11,"y":0},{"color":"0FFF1F","x":12,"y":0},{"color":"0FFF1F","x":13,"y":0},{"color":"0FFF1F","x":14,"y":0},{"color":"0FFF1F","x":15,"y":0},{"color":"0FFF1F","x":16,"y":0},{"color":"0FFF1F","x":17,"y":0},{"color":"0FFF1F","x":18,"y":0},{"color":"0FFF1F","x":19,"y":0},{"color":"0FFF1F","x":20,"y":0},{"color":"0FFF1F","x":21,"y":0},{"color":"0FFF1F","x":22,"y":0},{"color":"0FFF1F","x":23,"y":0},{"color":"0FFF1F","x":24,"y":0},{"color":"0FFF1F","x":25,"y":0},{"color":"0FFF1F","x":26,"y":0},{"color":"0FFF1F","x":27,"y":0},null,{"color":"0FFF1F","x":29,"y":0},null,null,null,{"color":"0FFF1F","x":3,"y":1},{"color":"0FFF1F","x":4,"y":1},{"color":"0FFF1F","x":5,"y":1},null,null,null,{"color":"0FFF1F","x":9,"y":1},{"color":"0FFF1F","x":10,"y":1},{"color":"0FFF1F","x":11,"y":1},null,null,null,{"color":"0FFF1F","x":15,"y":1},{"color":"0FFF1F","x":16,"y":1},{"color":"0FFF1F","x":17,"y":1},{"color":"0FFF1F","x":18,"y":1},{"color":"0FFF1F","x":19,"y":1},null,null,null,{"color":"0FFF1F","x":23,"y":1},{"color":"0FFF1F","x":24,"y":1},{"color":"0FFF1F","x":25,"y":1},{"color":"0FFF1F","x":26,"y":1},{"color":"0FFF1F","x":27,"y":1},null,null,{"color":"0FFF1F","x":0,"y":2},{"color":"0FFF1F","x":1,"y":2},null,null,{"color":"0FFF1F","x":4,"y":2},null,null,{"color":"0FFF1F","x":7,"y":2},null,null,{"color":"0FFF1F","x":10,"y":2},null,null,{"color":"0FFF1F","x":13,"y":2},null,null,{"color":"0FFF1F","x":16,"y":2},{"color":"0FFF1F","x":17,"y":2},{"color":"0FFF1F","x":18,"y":2},null,null,{"color":"0FFF1F","x":21,"y":2},null,null,{"color":"0FFF1F","x":24,"y":2},{"color":"0FFF1F","x":25,"y":2},{"color":"0FFF1F","x":26,"y":2},null,null,{"color":"0FFF1F","x":29,"y":2},{"color":"0FFF1F","x":0,"y":3},{"color":"0FFF1F","x":1,"y":3},{"color":"0FFF1F","x":2,"y":3},null,null,null,{"color":"0FFF1F","x":6,"y":3},{"color":"0FFF1F","x":7,"y":3},{"color":"0FFF1F","x":8,"y":3},null,null,null,{"color":"0FFF1F","x":12,"y":3},{"color":"0FFF1F","x":13,"y":3},{"color":"0FFF1F","x":14,"y":3},null,{"color":"0FFF1F","x":16,"y":3},{"color":"0FFF1F","x":17,"y":3},null,null,{"color":"0FFF1F","x":20,"y":3},{"color":"0FFF1F","x":21,"y":3},{"color":"0FFF1F","x":22,"y":3},null,null,{"color":"0FFF1F","x":25,"y":3},null,null,{"color":"0FFF1F","x":28,"y":3},{"color":"0FFF1F","x":29,"y":3},{"color":"0FFF1F","x":0,"y":4},{"color":"0FFF1F","x":1,"y":4},{"color":"0FFF1F","x":2,"y":4},{"color":"0FFF1F","x":3,"y":4},null,{"color":"0FFF1F","x":5,"y":4},{"color":"0FFF1F","x":6,"y":4},{"color":"0FFF1F","x":7,"y":4},{"color":"0FFF1F","x":8,"y":4},{"color":"0FFF1F","x":9,"y":4},null,{"color":"0FFF1F","x":11,"y":4},{"color":"0FFF1F","x":12,"y":4},{"color":"0FFF1F","x":13,"y":4},null,null,null,{"color":"0FFF1F","x":17,"y":4},{"color":"0FFF1F","x":18,"y":4},{"color":"0FFF1F","x":19,"y":4},{"color":"0FFF1F","x":20,"y":4},{"color":"0FFF1F","x":21,"y":4},{"color":"0FFF1F","x":22,"y":4},{"color":"0FFF1F","x":23,"y":4},null,null,null,{"color":"0FFF1F","x":27,"y":4},{"color":"0FFF1F","x":28,"y":4},{"color":"0FFF1F","x":29,"y":4},{"color":"0FFF1F","x":0,"y":5},{"color":"0FFF1F","x":1,"y":5},{"color":"0FFF1F","x":2,"y":5},null,null,null,{"color":"0FFF1F","x":6,"y":5},{"color":"0FFF1F","x":7,"y":5},{"color":"0FFF1F","x":8,"y":5},null,null,null,{"color":"0FFF1F","x":12,"y":5},{"color":"0FFF1F","x":13,"y":5},{"color":"0FFF1F","x":14,"y":5},{"color":"0FFF1F","x":15,"y":5},{"color":"0FFF1F","x":16,"y":5},{"color":"0FFF1F","x":17,"y":5},{"color":"0FFF1F","x":18,"y":5},null,null,null,{"color":"0FFF1F","x":22,"y":5},{"color":"0FFF1F","x":23,"y":5},null,{"color":"0FFF1F","x":25,"y":5},null,null,{"color":"0FFF1F","x":28,"y":5},{"color":"0FFF1F","x":29,"y":5},{"color":"0FFF1F","x":0,"y":6},{"color":"0FFF1F","x":1,"y":6},null,null,{"color":"0FFF1F","x":4,"y":6},{"color":"0FFF1F","x":5,"y":6},{"color":"0FFF1F","x":6,"y":6},null,{"color":"0FFF1F","x":8,"y":6},{"color":"0FFF1F","x":9,"y":6},{"color":"0FFF1F","x":10,"y":6},{"color":"0FFF1F","x":11,"y":6},{"color":"0FFF1F","x":12,"y":6},{"color":"0FFF1F","x":13,"y":6},null,null,{"color":"0FFF1F","x":16,"y":6},{"color":"0FFF1F","x":17,"y":6},null,null,{"color":"0FFF1F","x":20,"y":6},null,null,{"color":"0FFF1F","x":23,"y":6},{"color":"0FFF1F","x":24,"y":6},{"color":"0FFF1F","x":25,"y":6},{"color":"0FFF1F","x":26,"y":6},null,null,{"color":"0FFF1F","x":29,"y":6},{"color":"0FFF1F","x":0,"y":7},null,null,{"color":"0FFF1F","x":3,"y":7},{"color":"0FFF1F","x":4,"y":7},{"color":"0FFF1F","x":5,"y":7},{"color":"0FFF1F","x":6,"y":7},null,null,null,{"color":"0FFF1F","x":10,"y":7},null,null,null,null,{"color":"0FFF1F","x":15,"y":7},{"color":"0FFF1F","x":16,"y":7},null,null,{"color":"0FFF1F","x":19,"y":7},{"color":"0FFF1F","x":20,"y":7},{"color":"0FFF1F","x":21,"y":7},null,null,null,{"color":"0FFF1F","x":25,"y":7},{"color":"0FFF1F","x":26,"y":7},{"color":"0FFF1F","x":27,"y":7},null,{"color":"0FFF1F","x":29,"y":7},{"color":"0FFF1F","x":0,"y":8},null,{"color":"0FFF1F","x":2,"y":8},{"color":"0FFF1F","x":3,"y":8},null,null,{"color":"0FFF1F","x":6,"y":8},{"color":"0FFF1F","x":7,"y":8},null,{"color":"0FFF1F","x":9,"y":8},{"color":"0FFF1F","x":10,"y":8},{"color":"0FFF1F","x":11,"y":8},null,{"color":"0FFF1F","x":13,"y":8},null,null,{"color":"0FFF1F","x":16,"y":8},{"color":"0FFF1F","x":17,"y":8},{"color":"0FFF1F","x":18,"y":8},{"color":"0FFF1F","x":19,"y":8},{"color":"0FFF1F","x":20,"y":8},{"color":"0FFF1F","x":21,"y":8},{"color":"0FFF1F","x":22,"y":8},null,{"color":"0FFF1F","x":24,"y":8},{"color":"0FFF1F","x":25,"y":8},{"color":"0FFF1F","x":26,"y":8},null,null,{"color":"0FFF1F","x":29,"y":8},{"color":"0FFF1F","x":0,"y":9},null,null,{"color":"0FFF1F","x":3,"y":9},{"color":"0FFF1F","x":4,"y":9},null,null,null,null,{"color":"0FFF1F","x":9,"y":9},{"color":"0FFF1F","x":10,"y":9},null,null,{"color":"0FFF1F","x":13,"y":9},{"color":"0FFF1F","x":14,"y":9},null,{"color":"0FFF1F","x":16,"y":9},{"color":"0FFF1F","x":17,"y":9},null,null,null,{"color":"0FFF1F","x":21,"y":9},{"color":"0FFF1F","x":22,"y":9},null,null,{"color":"0FFF1F","x":25,"y":9},null,null,{"color":"0FFF1F","x":28,"y":9},{"color":"0FFF1F","x":29,"y":9},{"color":"0FFF1F","x":0,"y":10},{"color":"0FFF1F","x":1,"y":10},null,null,{"color":"0FFF1F","x":4,"y":10},{"color":"0FFF1F","x":5,"y":10},null,{"color":"0FFF1F","x":7,"y":10},null,null,null,null,{"color":"0FFF1F","x":12,"y":10},{"color":"0FFF1F","x":13,"y":10},null,null,{"color":"0FFF1F","x":16,"y":10},null,null,{"color":"0FFF1F","x":19,"y":10},null,null,{"color":"0FFF1F","x":22,"y":10},{"color":"0FFF1F","x":23,"y":10},null,null,null,{"color":"0FFF1F","x":27,"y":10},{"color":"0FFF1F","x":28,"y":10},{"color":"0FFF1F","x":29,"y":10},{"color":"0FFF1F","x":0,"y":11},{"color":"0FFF1F","x":1,"y":11},{"color":"0FFF1F","x":2,"y":11},null,null,null,null,{"color":"0FFF1F","x":7,"y":11},{"color":"0FFF1F","x":8,"y":11},{"color":"0FFF1F","x":9,"y":11},{"color":"0FFF1F","x":10,"y":11},{"color":"0FFF1F","x":11,"y":11},{"color":"0FFF1F","x":12,"y":11},{"color":"0FFF1F","x":13,"y":11},null,{"color":"0FFF1F","x":15,"y":11},{"color":"0FFF1F","x":16,"y":11},null,{"color":"0FFF1F","x":18,"y":11},{"color":"0FFF1F","x":19,"y":11},{"color":"0FFF1F","x":20,"y":11},null,null,{"color":"0FFF1F","x":23,"y":11},{"color":"0FFF1F","x":24,"y":11},{"color":"0FFF1F","x":25,"y":11},null,null,null,{"color":"0FFF1F","x":29,"y":11},{"color":"0FFF1F","x":0,"y":12},null,{"color":"0FFF1F","x":2,"y":12},{"color":"0FFF1F","x":3,"y":12},{"color":"0FFF1F","x":4,"y":12},{"color":"0FFF1F","x":5,"y":12},null,null,{"color":"0FFF1F","x":8,"y":12},{"color":"0FFF1F","x":9,"y":12},{"color":"0FFF1F","x":10,"y":12},null,null,{"color":"0FFF1F","x":13,"y":12},null,null,{"color":"0FFF1F","x":16,"y":12},null,null,{"color":"0FFF1F","x":19,"y":12},{"color":"0FFF1F","x":20,"y":12},{"color":"0FFF1F","x":21,"y":12},null,null,{"color":"0FFF1F","x":24,"y":12},{"color":"0FFF1F","x":25,"y":12},{"color":"0FFF1F","x":26,"y":12},{"color":"0FFF1F","x":27,"y":12},{"color":"0FFF1F","x":28,"y":12},{"color":"0FFF1F","x":29,"y":12},{"color":"0FFF1F","x":0,"y":13},null,null,null,{"color":"0FFF1F","x":4,"y":13},{"color":"0FFF1F","x":5,"y":13},{"color":"0FFF1F","x":6,"y":13},null,null,{"color":"0FFF1F","x":9,"y":13},{"color":"0FFF1F","x":10,"y":13},{"color":"0FFF1F","x":11,"y":13},null,{"color":"0FFF1F","x":13,"y":13},{"color":"0FFF1F","x":14,"y":13},null,{"color":"0FFF1F","x":16,"y":13},{"color":"0FFF1F","x":17,"y":13},{"color":"0FFF1F","x":18,"y":13},{"color":"0FFF1F","x":19,"y":13},{"color":"0FFF1F","x":20,"y":13},{"color":"0FFF1F","x":21,"y":13},{"color":"0FFF1F","x":22,"y":13},null,null,null,null,{"color":"0FFF1F","x":27,"y":13},{"color":"0FFF1F","x":28,"y":13},{"color":"0FFF1F","x":29,"y":13},{"color":"0FFF1F","x":0,"y":14},{"color":"0FFF1F","x":1,"y":14},{"color":"0FFF1F","x":2,"y":14},null,null,null,{"color":"0FFF1F","x":6,"y":14},{"color":"0FFF1F","x":7,"y":14},null,null,{"color":"0FFF1F","x":10,"y":14},null,null,{"color":"0FFF1F","x":13,"y":14},null,null,{"color":"0FFF1F","x":16,"y":14},{"color":"0FFF1F","x":17,"y":14},null,null,null,null,{"color":"0FFF1F","x":22,"y":14},null,{"color":"0FFF1F","x":24,"y":14},{"color":"0FFF1F","x":25,"y":14},null,null,{"color":"0FFF1F","x":28,"y":14},{"color":"0FFF1F","x":29,"y":14},{"color":"0FFF1F","x":0,"y":15},{"color":"0FFF1F","x":1,"y":15},null,null,{"color":"0FFF1F","x":4,"y":15},null,null,{"color":"0FFF1F","x":7,"y":15},{"color":"0FFF1F","x":8,"y":15},null,null,null,{"color":"0FFF1F","x":12,"y":15},{"color":"0FFF1F","x":13,"y":15},null,{"color":"0FFF1F","x":15,"y":15},{"color":"0FFF1F","x":16,"y":15},null,null,{"color":"0FFF1F","x":19,"y":15},{"color":"0FFF1F","x":20,"y":15},null,null,null,null,{"color":"0FFF1F","x":25,"y":15},{"color":"0FFF1F","x":26,"y":15},null,null,{"color":"0FFF1F","x":29,"y":15},{"color":"0FFF1F","x":0,"y":16},null,null,{"color":"0FFF1F","x":3,"y":16},{"color":"0FFF1F","x":4,"y":16},{"color":"0FFF1F","x":5,"y":16},null,{"color":"0FFF1F","x":7,"y":16},{"color":"0FFF1F","x":8,"y":16},{"color":"0FFF1F","x":9,"y":16},{"color":"0FFF1F","x":10,"y":16},{"color":"0FFF1F","x":11,"y":16},{"color":"0FFF1F","x":12,"y":16},{"color":"0FFF1F","x":13,"y":16},null,null,{"color":"0FFF1F","x":16,"y":16},null,{"color":"0FFF1F","x":18,"y":16},{"color":"0FFF1F","x":19,"y":16},{"color":"0FFF1F","x":20,"y":16},null,{"color":"0FFF1F","x":22,"y":16},{"color":"0FFF1F","x":23,"y":16},null,null,{"color":"0FFF1F","x":26,"y":16},{"color":"0FFF1F","x":27,"y":16},null,{"color":"0FFF1F","x":29,"y":16},{"color":"0FFF1F","x":0,"y":17},null,{"color":"0FFF1F","x":2,"y":17},{"color":"0FFF1F","x":3,"y":17},{"color":"0FFF1F","x":4,"y":17},null,null,null,{"color":"0FFF1F","x":8,"y":17},{"color":"0FFF1F","x":9,"y":17},{"color":"0FFF1F","x":10,"y":17},null,null,{"color":"0FFF1F","x":13,"y":17},{"color":"0FFF1F","x":14,"y":17},null,null,null,null,{"color":"0FFF1F","x":19,"y":17},null,null,null,{"color":"0FFF1F","x":23,"y":17},{"color":"0FFF1F","x":24,"y":17},{"color":"0FFF1F","x":25,"y":17},{"color":"0FFF1F","x":26,"y":17},null,null,{"color":"0FFF1F","x":29,"y":17},{"color":"0FFF1F","x":0,"y":18},null,null,{"color":"0FFF1F","x":3,"y":18},{"color":"0FFF1F","x":4,"y":18},{"color":"0FFF1F","x":5,"y":18},{"color":"0FFF1F","x":6,"y":18},null,null,{"color":"0FFF1F","x":9,"y":18},null,null,{"color":"0FFF1F","x":12,"y":18},{"color":"0FFF1F","x":13,"y":18},null,null,{"color":"0FFF1F","x":16,"y":18},{"color":"0FFF1F","x":17,"y":18},{"color":"0FFF1F","x":18,"y":18},{"color":"0FFF1F","x":19,"y":18},{"color":"0FFF1F","x":20,"y":18},{"color":"0FFF1F","x":21,"y":18},null,{"color":"0FFF1F","x":23,"y":18},{"color":"0FFF1F","x":24,"y":18},{"color":"0FFF1F","x":25,"y":18},null,null,{"color":"0FFF1F","x":28,"y":18},{"color":"0FFF1F","x":29,"y":18},{"color":"0FFF1F","x":0,"y":19},{"color":"0FFF1F","x":1,"y":19},null,null,{"color":"0FFF1F","x":4,"y":19},null,{"color":"0FFF1F","x":6,"y":19},{"color":"0FFF1F","x":7,"y":19},null,null,null,{"color":"0FFF1F","x":11,"y":19},{"color":"0FFF1F","x":12,"y":19},{"color":"0FFF1F","x":13,"y":19},{"color":"0FFF1F","x":14,"y":19},{"color":"0FFF1F","x":15,"y":19},{"color":"0FFF1F","x":16,"y":19},{"color":"0FFF1F","x":17,"y":19},null,null,null,{"color":"0FFF1F","x":21,"y":19},{"color":"0FFF1F","x":22,"y":19},{"color":"0FFF1F","x":23,"y":19},null,null,null,{"color":"0FFF1F","x":27,"y":19},{"color":"0FFF1F","x":28,"y":19},{"color":"0FFF1F","x":29,"y":19},{"color":"0FFF1F","x":0,"y":20},{"color":"0FFF1F","x":1,"y":20},{"color":"0FFF1F","x":2,"y":20},null,null,null,{"color":"0FFF1F","x":6,"y":20},{"color":"0FFF1F","x":7,"y":20},{"color":"0FFF1F","x":8,"y":20},{"color":"0FFF1F","x":9,"y":20},{"color":"0FFF1F","x":10,"y":20},{"color":"0FFF1F","x":11,"y":20},{"color":"0FFF1F","x":12,"y":20},null,null,null,{"color":"0FFF1F","x":16,"y":20},{"color":"0FFF1F","x":17,"y":20},{"color":"0FFF1F","x":18,"y":20},null,{"color":"0FFF1F","x":20,"y":20},{"color":"0FFF1F","x":21,"y":20},{"color":"0FFF1F","x":22,"y":20},{"color":"0FFF1F","x":23,"y":20},{"color":"0FFF1F","x":24,"y":20},null,{"color":"0FFF1F","x":26,"y":20},{"color":"0FFF1F","x":27,"y":20},{"color":"0FFF1F","x":28,"y":20},{"color":"0FFF1F","x":29,"y":20},{"color":"0FFF1F","x":0,"y":21},{"color":"0FFF1F","x":1,"y":21},null,null,{"color":"0FFF1F","x":4,"y":21},null,null,{"color":"0FFF1F","x":7,"y":21},{"color":"0FFF1F","x":8,"y":21},{"color":"0FFF1F","x":9,"y":21},null,null,{"color":"0FFF1F","x":12,"y":21},{"color":"0FFF1F","x":13,"y":21},null,{"color":"0FFF1F","x":15,"y":21},{"color":"0FFF1F","x":16,"y":21},{"color":"0FFF1F","x":17,"y":21},null,null,null,{"color":"0FFF1F","x":21,"y":21},{"color":"0FFF1F","x":22,"y":21},{"color":"0FFF1F","x":23,"y":21},null,null,null,{"color":"0FFF1F","x":27,"y":21},{"color":"0FFF1F","x":28,"y":21},{"color":"0FFF1F","x":29,"y":21},{"color":"0FFF1F","x":0,"y":22},null,null,{"color":"0FFF1F","x":3,"y":22},{"color":"0FFF1F","x":4,"y":22},{"color":"0FFF1F","x":5,"y":22},null,null,{"color":"0FFF1F","x":8,"y":22},null,null,{"color":"0FFF1F","x":11,"y":22},{"color":"0FFF1F","x":12,"y":22},{"color":"0FFF1F","x":13,"y":22},null,null,{"color":"0FFF1F","x":16,"y":22},null,null,{"color":"0FFF1F","x":19,"y":22},null,null,{"color":"0FFF1F","x":22,"y":22},null,null,{"color":"0FFF1F","x":25,"y":22},null,null,{"color":"0FFF1F","x":28,"y":22},{"color":"0FFF1F","x":29,"y":22},null,null,{"color":"0FFF1F","x":2,"y":23},{"color":"0FFF1F","x":3,"y":23},{"color":"0FFF1F","x":4,"y":23},{"color":"0FFF1F","x":5,"y":23},{"color":"0FFF1F","x":6,"y":23},null,null,null,{"color":"0FFF1F","x":10,"y":23},{"color":"0FFF1F","x":11,"y":23},{"color":"0FFF1F","x":12,"y":23},{"color":"0FFF1F","x":13,"y":23},{"color":"0FFF1F","x":14,"y":23},null,null,null,{"color":"0FFF1F","x":18,"y":23},{"color":"0FFF1F","x":19,"y":23},{"color":"0FFF1F","x":20,"y":23},null,null,null,{"color":"0FFF1F","x":24,"y":23},{"color":"0FFF1F","x":25,"y":23},{"color":"0FFF1F","x":26,"y":23},null,null,null,{"color":"0FFF1F","x":0,"y":24},null,{"color":"0FFF1F","x":2,"y":24},{"color":"0FFF1F","x":3,"y":24},{"color":"0FFF1F","x":4,"y":24},{"color":"0FFF1F","x":5,"y":24},{"color":"0FFF1F","x":6,"y":24},{"color":"0FFF1F","x":7,"y":24},{"color":"0FFF1F","x":8,"y":24},{"color":"0FFF1F","x":9,"y":24},{"color":"0FFF1F","x":10,"y":24},{"color":"0FFF1F","x":11,"y":24},{"color":"0FFF1F","x":12,"y":24},{"color":"0FFF1F","x":13,"y":24},{"color":"0FFF1F","x":14,"y":24},{"color":"0FFF1F","x":15,"y":24},{"color":"0FFF1F","x":16,"y":24},{"color":"0FFF1F","x":17,"y":24},{"color":"0FFF1F","x":18,"y":24},{"color":"0FFF1F","x":19,"y":24},{"color":"0FFF1F","x":20,"y":24},{"color":"0FFF1F","x":21,"y":24},{"color":"0FFF1F","x":22,"y":24},{"color":"0FFF1F","x":23,"y":24},{"color":"0FFF1F","x":24,"y":24},{"color":"0FFF1F","x":25,"y":24},{"color":"0FFF1F","x":26,"y":24},{"color":"0FFF1F","x":27,"y":24},null,{"  color":"0FFF1F","x":29,"y":24}]'));
            this.addEntryPoint(11, 12);
            this.addEntryPoint(18, 12);
            this.addExitPoint(12, 17);
            this.addExitPoint(17, 7);
            this.addTerrainToPath(new Terrain(one.color('#848A64').alpha(0.7)));
            if (! this.preState) {
                this.preState = {};
                this.preState.ignoreResourceBalance = Universe.settings.ignoreResourceBalance;
                this.preState.useInlineResourceSwatch = Universe.settings.useInlineResourceSwatch;
                this.preState.interval = Lifecycle.interval;
                this.preState.capabilities = FiercePlanet.Game.currentProfile.capabilities;
            }
            Universe.settings.ignoreResourceBalance = true;
            Universe.settings.useInlineResourceSwatch = false;
            Lifecycle.interval = 10;
            FiercePlanet.Game.currentProfile.capabilities = FiercePlanet.Profile.GENIUS_CAPABILITIES;
            FiercePlanet.GeneralUI.refreshSwatch();
            this.noSpeedChange = true;
        };

        this.world11.teardown = function() {
            if (!this.preState)
                return;
            Universe.settings.ignoreResourceBalance = this.preState.ignoreResourceBalance;
            Universe.settings.useInlineResourceSwatch = this.preState.useInlineResourceSwatch;
            Lifecycle.interval = this.preState.interval;
            FiercePlanet.Game.currentProfile.capabilities = this.preState.capabilities;
            FiercePlanet.GeneralUI.refreshSwatch();
        };




        // Checked and authorised
        this.world1.image =( "/images/worlds/world-1-art.jpg");
        this.world1.imageAttribution = ('<a tabindex="-1" target="_blank" href="http://nuclearsyndrom.deviantart.com/"><em>Nuclear Winter</em></a>. Kindly reproduced courtesy of NuclearSyndrom.');
        this.world2.image =( "/images/worlds/world-2-art.jpg");
        this.world2.imageAttribution = ('<a tabindex="-1" target="_blank" href="http://www.slv.vic.gov.au/pictoria/b/2/8/doc/b28555.shtml"><em>Canvas Town, between Princess Bridge and South Melbourne in 1850\'s</em></a>. De Gruchy & Leigh, 1850-1860.');
        this.world3.image =( "/images/worlds/world-3-art.jpg");
        this.world3.imageAttribution = ('<a tabindex="-1" target="_blank" href="http://www.mynameisyakub.com"><em>The Apocalypse</em></a>. Kindly reproduced courtesy of Yakub.');
        this.world4.image =( "/images/worlds/world-4-art.jpg");
        this.world4.imageAttribution = ('<a tabindex="-1" target="_blank" href="http://en.wikipedia.org/wiki/File:Brueghel-tower-of-babel.jpg"><em>The Tower of Babel</em></a>. Pieter Bruegel the Elder, 1563.');
        this.world5.image =( "/images/worlds/world-5-art.jpg");
        this.world5.imageAttribution = ('<a tabindex="-1" target="_blank" href="http://http://en.wikipedia.org/wiki/File:Dore_London.jpg"><em>Over London–by Rail from London: A Pilgrimage</em></a>. Gustave Doré, 1870.');
        this.world6.image =( "/images/worlds/world-6-art.jpg");
        this.world6.imageAttribution = ('<a tabindex="-1" target="_blank" href="http://entertainment.howstuffworks.com/arts/artwork/claude-monet-paintings-1900-19082.htm"><em>Waterloo Bridge</em></a>. Claude Monet, 1900.');
        this.world7.image =( "/images/worlds/world-7-art.jpg");
        this.world7.imageAttribution = ('<a tabindex="-1" target="_blank" href="http://en.wikipedia.org/wiki/File:Ballarat_1853-54_von_guerard.jpg"><em>Ballarat 1853-54</em></a>. Eugene von Guerard, 1884.');
        this.world8.image =( "/images/worlds/world-8-art.jpg");
        this.world8.imageAttribution = ('<a tabindex="-1" target="_blank" href="http://en.wikipedia.org/wiki/File:Gustave_Caillebotte_-_Jour_de_pluie_%C3%A0_Paris.jpg"><em>A Rainy Day in Paris</em></a>. Gustave Caillebotte, 1877.');
        this.world9.image =( "/images/worlds/world-9-art.jpg");
        this.world9.imageAttribution = ('<a tabindex="-1" target="_blank" href="http://en.wikipedia.org/wiki/File:Renoir16.jpg"><em>Children on the Beach of Guernesey</em></a>. Pierre-Auguste Renoir, 1883.');
        this.world10.image =( "/images/worlds/world-10-art.jpg");
        this.world10.imageAttribution = ('<a tabindex="-1" target="_blank" href="http://nuclearsyndrom.deviantart.com/"><em>Nuclear Summer</em></a>. Kindly reproduced courtesy of NuclearSyndrom.');
        this.world11.image =( "/images/worlds/world-11-art.jpg");
        this.world11.imageAttribution = ('<a tabindex="-1" target="_blank" href="http://nuclearsyndrom.deviantart.com/"><em>Mad Tea Party</em></a>. Sir John Tenniel, 1865.');




        /* Google Map links */
        if (typeof google !== "undefined" && typeof google.maps !== "undefined") {
	        this.world1.mapOptions = ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(-30.0305, -51.2270), zoom: 18, tilt: 45}); // Porto Allegre: -30.031137, -51.232837
	        this.world2.mapOptions = ({mapTypeId: google.maps.MapTypeId.SATELLITE, rotate: -0, center: new google.maps.LatLng(37.390296, -5.954579), zoom: 18, tilt: 45}); // Seville: 37.390296,-5.954579
	        this.world3.mapOptions = ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(45.433607, 12.338124), zoom: 18, tilt: 45}); // Venice: 45.433607,12.338124
	        this.world4.mapOptions = ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(41.890384354793554, 12.49228627979709), zoom: 19, tilt: 45}); // Rome, Colosseum: 41.890384354793554, 12.49228627979709
	        this.world5.mapOptions = ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(-33.434969, -70.655254), zoom: 18, tilt: 45}); // Santiago: -33.434969,-70.655254
	        this.world6.mapOptions = ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(47.487229, 19.07513), zoom: 18, tilt: 45}); // Budapest: 47.487229,19.07513
	        this.world7.mapOptions = ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(30.006533, -90.158792), zoom: 18, tilt: 45}); // New Orleans: 30.006533,-90.158792
	        this.world8.mapOptions = ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(33.441393, -112.077407), zoom: 18, tilt: 45}); // Phoenix, Arizona: 33.441393,-112.077407
	        this.world9.mapOptions = ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(21.281500, -157.839000), zoom: 18, tilt: 45}); // Honululu: 21.283355,-157.837787
	        this.world10.mapOptions = ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(30.265450, -97.744524), zoom: 18, tilt: 45}); // Austin, Texas: 30.265452,-97.744524
	        this.world11.mapOptions = ({mapTypeId: google.maps.MapTypeId.SATELLITE, center: new google.maps.LatLng(51, 73), zoom: 2}); // The World
		}


        // Prepare as a module
        this.id = "Default";
        this.name = "Default";
        this.position = 1;
        this.worlds = [this.world0, this.world1, this.world2, this.world3, this.world4, this.world5, this.world6, this.world7, this.world8, this.world9, this.world10, this.world11 ];
    };

    this.init();

}).apply(Basic);

if (typeof exports !== "undefined")
    exports.Basic = Basic;
