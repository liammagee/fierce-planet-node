/*!
 * Fierce Planet - AgentTypes
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


/*
 Agent Type setup
 */
var PredatorPreyCultures = PredatorPreyCultures || {};

/**
 * Register the default agent types
 */
(function () {

    this.init = function () {
        this.PREY_AGENT_TYPE = new Culture("Prey", "000", ModuleManager.currentModule.resourceSet.categories);
        this.PREDATOR_AGENT_TYPE = new Culture("Predator", "f00", ModuleManager.currentModule.resourceSet.categories);
        this.TEST_AGENT_TYPE = new Culture("Test", "fbe53b", ModuleManager.currentModule.resourceSet.categories);

        this.PREY_AGENT_TYPE.waveNumber = 50;
        this.PREY_AGENT_TYPE.speed = 1;
        this.PREY_AGENT_TYPE.moveCost = -2;
        this.PREY_AGENT_TYPE.birthProbability = 0.1;
        this.PREY_AGENT_TYPE.reproductionAge = 15;

        this.PREDATOR_AGENT_TYPE.waveNumber = 20;
        this.PREY_AGENT_TYPE.speed = 1;
        this.PREDATOR_AGENT_TYPE.moveCost = -5;
        this.PREDATOR_AGENT_TYPE.birthProbability = 0.2;
        this.PREDATOR_AGENT_TYPE.reproductionAge = 25;

        this.PREDATOR_AGENT_TYPE.preyProbability = 0.2;
        this.PREDATOR_AGENT_TYPE.predatorGain = 20;
        this.PREDATOR_AGENT_TYPE.preyCost = -20;



        this.PREY_AGENT_TYPE.characteristics = [
        ];
        this.PREY_AGENT_TYPE.beliefs = [
            Beliefs.BeliefsBasedOnOtherAgentsBeliefs
            , Beliefs.BeliefsAboutResources
            , Beliefs.BeliefsAboutPaths
        ];
        this.PREY_AGENT_TYPE.desires = [
            Desires.ExploreSpace
            , Desires.Flee
            , Desires.ImproveHealth
        ];
        this.PREY_AGENT_TYPE.capabilities = [
             Capabilities.ConsumeResourcesCapability
            , Capabilities.RegenerateCapability
        ];
        this.PREY_AGENT_TYPE.drawFunction = (function (ctx, agent, x, y, pieceWidth, pieceHeight, newColor, counter, direction) {

            if (pieceWidth < (8 ) || pieceHeight < (8 )) {
                //        if (false) {
                var radius = (pieceWidth / 4);

                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2, false);
                ctx.closePath();
                ctx.strokeStyle = "#ccc";
                ctx.stroke();
                ctx.fillStyle = "#" + newColor;
                ctx.fill();
            }
            else {
                // Define agent elements here
                var frames = 3;
                var speed = agent.speed;
                var countdown = agent.countdownToMove;
                var frame = Math.floor((countdown / (speed + 1)) * frames);


                // Category Health
                var yHealthOffset = -5;
                for (var j in agent.culture.healthCategories) {
                    var rc = agent.culture.healthCategories[j];
                    var h = agent.getHealthForResourceCategory(rc);
                    var barLength = Math.floor((h / agent.culture.initialHealth) * pieceWidth / 2);

                    ctx.lineWidth = 3;
                    ctx.lineCap = "round";

                    // Draw white line background first
                    /*
                     ctx.beginPath();
                     ctx.moveTo(x - pieceWidth / 4, y + yHealthOffset);
                     ctx.lineTo(x + pieceWidth / 4, y + yHealthOffset);
                     ctx.closePath();

                     ctx.strokeStyle = "#fff";
                     ctx.stroke();
                     */

                    // Draw health line next
                    ctx.beginPath();
                    ctx.moveTo(x - pieceWidth / 4, y + yHealthOffset);
                    ctx.lineTo(x - pieceWidth / 4 + barLength, y + yHealthOffset);
                    ctx.closePath();

                    ctx.strokeStyle = "#" + rc.color;
                    ctx.stroke();

                    yHealthOffset -= 3;
                }

                // General Health
                /*
                 ctx.beginPath();
                 ctx.moveTo(x - pieceWidth / 4, y - 5);
                 var barLength = (agent.health / DEFAULT_INITIAL_HEALTH) * pieceWidth / 2;
                 ctx.lineTo(x - pieceWidth / 4 + barLength, y - 5);
                 ctx.closePath();
                 ctx.lineWidth = 3;
                 //                ctx.strokeStyle = "#" + newColor;
                 ctx.strokeStyle = "#f00";
                 ctx.lineCap = "round";
                 ctx.stroke();
                 */


                var sf = new FiercePlanet.StickFigure(x, y, pieceWidth, pieceHeight);
                if (speed > 12)
                    sf.defaultAction = sf.walk;
                else
                    sf.defaultAction = sf.run;
                sf.defaultAction(frame, direction);
                sf.drawFigure(ctx);


                // Now draw the figure
                ctx.lineWidth = 1.5;
                //                ctx.strokeStyle = "#" + newColor;
                ctx.strokeStyle = "#000";
                ctx.lineCap = "round";
                ctx.stroke();
                //                ctx.fillStyle = "#" + newColor;
                ctx.fillStyle = "#000";
                ctx.fill();
            }
        });
        this.PREY_AGENT_TYPE._drawExpired = function (ctx, agent, x, y, pieceWidth, pieceHeight, newColor, counter, direction) {
            // Draw an explosion here
            var explosionX = x;
            var explosionY = y + pieceWidth / 2;

            var radgrad = ctx.createRadialGradient(explosionX, explosionY, 0, explosionX, explosionY, pieceWidth / 2);
            radgrad.addColorStop(0, 'rgba(255, 168, 81,1)');
            radgrad.addColorStop(0.8, '#FFF354');
            radgrad.addColorStop(1, 'rgba(255, 168, 81,0)');
            ctx.fillStyle = radgrad;
            ctx.fillRect(x - pieceWidth / 2, y, pieceWidth, pieceHeight);


            if (pieceWidth < 8 || pieceHeight < 8) {
                var radius = (pieceWidth / 4);

                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2, false);
                ctx.closePath();
                ctx.strokeStyle = "#ccc";
                ctx.stroke();
                ctx.fillStyle = "#" + newColor;
                ctx.fill();
            }
            else {
                // Define agent elements here

                // Quick round: + 0.5 | 0
                var wholeBodyLength = (pieceWidth * 1);
                var headRadius = (wholeBodyLength / 8) + 0.5 | 0;
                var bodyLength = (wholeBodyLength / 3) + 0.5 | 0;
                var shoulderPoint = (bodyLength / 3) + 0.5 | 0;
                var shoulderToElbowLength = (wholeBodyLength / 8) + 0.5 | 0;
                var elbowToHandLength = (wholeBodyLength / 6) + 0.5 | 0;
                var hipToKneeLength = (wholeBodyLength / 6) + 0.5 | 0;
                var kneeToFootLength = (wholeBodyLength / 6) + 0.5 | 0;
                var startOfHeadY = y - headRadius;
                var startOfBodyY = y + headRadius;
                var startOfShoulderY = startOfBodyY + shoulderPoint;
                var startOfHipY = startOfBodyY + bodyLength;

                ctx.lineWidth = 1;
                ctx.beginPath();

                // Angles
                var fShoulderAngle, fElbowAngle, bShoulderAngle, bElbowAngle;
                var fHipAngle, fKneeAngle, bHipAngle, bKneeAngle;

                fShoulderAngle = Math.PI * (14 / 12);
                fElbowAngle = Math.PI * (14 / 12);
                bShoulderAngle = Math.PI * (22 / 12);
                bElbowAngle = Math.PI * (22 / 12);

                fHipAngle = Math.PI * (10 / 12);
                fKneeAngle = Math.PI * (10 / 12);
                bHipAngle = Math.PI * (2 / 12);
                bKneeAngle = Math.PI * (2 / 12);

                // Head
                ctx.arc(x, y, headRadius, 0, Math.PI * 2, false);

                // Body
                ctx.moveTo(x, startOfBodyY);
                ctx.lineTo(x, startOfBodyY + bodyLength);

                // Front arm
                ctx.moveTo(x, startOfShoulderY);
                var fElbowX = (x + Math.cos(fShoulderAngle) * shoulderToElbowLength);
                var fElbowY = (startOfShoulderY + Math.sin(fShoulderAngle) * shoulderToElbowLength);
                ctx.lineTo(fElbowX, fElbowY);
                ctx.moveTo(fElbowX, fElbowY);
                var fHandX = (fElbowX + Math.cos(fElbowAngle) * elbowToHandLength);
                var fHandY = (fElbowY + Math.sin(fElbowAngle) * elbowToHandLength);
                ctx.lineTo(fHandX, fHandY);

                // Back arm
                ctx.moveTo(x, startOfShoulderY);
                var bElbowX = (x + Math.cos(bShoulderAngle) * shoulderToElbowLength);
                var bElbowY = (startOfShoulderY + Math.sin(bShoulderAngle) * shoulderToElbowLength);
                ctx.lineTo(bElbowX, bElbowY);
                ctx.moveTo(bElbowX, bElbowY);
                var bHandX = (bElbowX + Math.cos(bElbowAngle) * elbowToHandLength);
                var bHandY = (fElbowY + Math.sin(bElbowAngle) * elbowToHandLength);
                ctx.lineTo(bHandX, bHandY);


                // Front leg
                ctx.moveTo(x, startOfHipY);
                var fKneeX = (x + Math.cos(fHipAngle) * hipToKneeLength);
                var fKneeY = (startOfHipY + Math.sin(fHipAngle) * hipToKneeLength);
                ctx.lineTo(fKneeX, fKneeY);
                ctx.moveTo(fKneeX, fKneeY);
                var fFootX = (fKneeX + Math.cos(fKneeAngle) * kneeToFootLength);
                var fFootY = (fKneeY + Math.sin(fKneeAngle) * kneeToFootLength);
                ctx.lineTo(fFootX, fFootY);

                // Back leg
                ctx.moveTo(x, startOfHipY);
                var bKneeX = (x + Math.cos(bHipAngle) * hipToKneeLength);
                var bKneeY = (startOfHipY + Math.sin(bHipAngle) * hipToKneeLength);
                ctx.lineTo(bKneeX, bKneeY);
                ctx.moveTo(bKneeX, bKneeY);
                var bFootX = (bKneeX + Math.cos(bKneeAngle) * kneeToFootLength);
                var bFootY = (bKneeY + Math.sin(bKneeAngle) * kneeToFootLength);
                ctx.lineTo(bFootX, bFootY);

                ctx.closePath();
                ctx.strokeStyle = "#" + newColor;
                ctx.lineCap = "round";
                ctx.stroke();
                ctx.fillStyle = "#" + newColor;
                ctx.fill();
            }
        };

        this.PREY_AGENT_TYPE.initFunction = function (agent, world) {
            var r = Math.random();
            agent.gender = (r < 0.5 ? 'm' : 'f');
        }


        // Predator definition
        this.PREDATOR_AGENT_TYPE.beliefs = [
            Beliefs.BeliefsAboutPaths
        ];
        this.PREDATOR_AGENT_TYPE.drawFunction = (function (ctx, agent, x, y, pieceWidth, pieceHeight, newColor, counter, direction) {
            newColor = agent.culture.color;
            if (pieceWidth < (8 ) || pieceHeight < (8 )) {
                //        if (false) {
                var radius = (pieceWidth / 4);

                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2, false);
                ctx.closePath();
                ctx.strokeStyle = "#ccc";
                ctx.stroke();
                ctx.fillStyle = "#" + newColor;
                ctx.fill();
            }
            else {
                // Define agent elements here
                var frames = 3;
                var speed = agent.speed;
                var countdown = agent.countdownToMove;
                var frame = Math.floor((countdown / (speed + 1)) * frames);

                var sf = new FiercePlanet.StickFigure(x, y, pieceWidth, pieceHeight);
                sf.defaultAction = sf.runUpsideDown;
                sf.defaultAction(frame, direction);
                sf.drawFigure(ctx);


                // Now draw the figure
                ctx.lineWidth = 1.5;
                ctx.strokeStyle = "#" + newColor;
                ctx.lineCap = "round";
                ctx.stroke();
                ctx.fillStyle = "#" + newColor;
                ctx.fill();
            }
        });
        this.PREDATOR_AGENT_TYPE.initFunction = function (agent, world) {
            var r = Math.random();
            agent.gender = (r < 0.5 ? 'm' : 'f');
        }
        this.PREDATOR_AGENT_TYPE.capabilities = [
            Capabilities.PreyOnOtherAgentsCapability
            , Capabilities.RegenerateCapability
        ];

        this.id = 'FP-Agents';
        this.cultures = [PredatorPreyCultures.PREY_AGENT_TYPE, PredatorPreyCultures.PREDATOR_AGENT_TYPE];
    }

}).apply(PredatorPreyCultures);


if (typeof exports !== "undefined")
    exports.PredatorPreyCultures = PredatorPreyCultures;
