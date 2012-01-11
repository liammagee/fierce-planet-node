/*!
 * Fierce Planet - AgentTypes
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


/*
 Agent Type setup
 */
var GameOfLifeCultures = GameOfLifeCultures || {};

/**
 * Register the default agent types
 */
(function () {

    this.init = function () {
        var switchStateCapability = {} ;
        switchStateCapability.exercise = function(agent, level) {
            var x = agent.x;
            var y = agent.y;

            var positions = level.getMooreNeighbourhood(x, y, false);
            var agentCounter = 0;
            positions.forEach(function(position) {
                var pX = position.x, pY = position.y;
                var agents = level.getAgentsAtContentMap(pX, pY);
                if (agents && agents.length > 0 && agents[0].isLiving)
                    agentCounter++;
            })
            if (! agent.isLiving) {
                if (agentCounter == 3)
                    agent.isLiving = true;
            }
            else  {
                if (agentCounter < 2 || agentCounter > 3) {
                    agent.isLiving = false;
                }
            }
        };

        this.CELLULAR_AGENT_TYPE = new Culture("Cell", "000", World.resourceCategories);

        this.CELLULAR_AGENT_TYPE.birthProbability = 0.0;
        this.CELLULAR_AGENT_TYPE.reproductionAge = 15;
        this.CELLULAR_AGENT_TYPE.moveCost = 0;
        this.CELLULAR_AGENT_TYPE.waveNumber = 50;


        this.CELLULAR_AGENT_TYPE.characteristics = {
            isLiving: false
        };
        this.CELLULAR_AGENT_TYPE.beliefs = [
            Beliefs.BeliefsAboutPaths
        ];
        this.CELLULAR_AGENT_TYPE.desires = [
        ];
        this.CELLULAR_AGENT_TYPE.capabilities = [
            switchStateCapability
        ];

        this.CELLULAR_AGENT_TYPE.drawFunction = (function (ctx, agent, x, y, pieceWidth, pieceHeight, newColor, counter, direction) {
            var __ret = FiercePlanet.Drawing.getDrawingPosition(agent, Lifecycle.waveCounter);
            var xPos = __ret.intX;
            var yPos = __ret.intY;
            var nx = xPos * FiercePlanet.Orientation.cellWidth;
            var ny = yPos * FiercePlanet.Orientation.cellHeight;

            var color = (agent.isLiving ? "#fff" : "#000");
            ctx.fillStyle = color;
            if ((World.settings.skewTiles || Lifecycle.currentLevel.isometric)) {
                var newOrigin = FiercePlanet.Isometric.doIsometricOffset(xPos, yPos);
                nx = newOrigin.x;
                ny = newOrigin.y;
                var originXp = newOrigin.x + FiercePlanet.Orientation.cellWidth / 2;
                var originYp = newOrigin.y + FiercePlanet.Orientation.cellHeight;

                // Rotation logic here - TODO: Refactor out
                originXp = originXp - (FiercePlanet.Orientation.halfWorldWidth);
                originYp = originYp - (FiercePlanet.Orientation.halfWorldHeight);

                FiercePlanet.Isometric.draw3DTile(ctx, [originXp, originYp], FiercePlanet.Orientation.cellHeight);
                ctx.fill();
            }
            else {
                nx = nx - (FiercePlanet.Orientation.worldWidth) / 2;
                ny = ny - (FiercePlanet.Orientation.worldHeight) / 2;

                ctx.fillRect(nx, ny, FiercePlanet.Orientation.cellWidth, FiercePlanet.Orientation.cellHeight);
            }

        });

        this.CELLULAR_AGENT_TYPE.initFunction = function (agent, level) {
            var r = Math.random();
            agent.gender = (r < 0.5 ? 'm' : 'f');
        }


        this.id = 'GOL-Agents';
        this.cultures = [GameOfLifeCultures.CELLULAR_AGENT_TYPE];
    }

}).apply(GameOfLifeCultures);


if (typeof exports !== "undefined")
    exports.GameOfLifeCultures = GameOfLifeCultures;
