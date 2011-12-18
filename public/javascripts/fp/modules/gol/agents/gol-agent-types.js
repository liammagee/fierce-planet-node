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
//            , Beliefs.BeliefsAboutResources
//            , Beliefs.BeliefsBasedOnOtherAgentsBeliefs
        ];
        this.CELLULAR_AGENT_TYPE.desires = [
//            Desires.ExploreSpace
//            , Desires.Flee
//            , Desires.ImproveHealth
        ];
        this.CELLULAR_AGENT_TYPE.capabilities = [
            switchStateCapability
//            Capabilities.MoveRandomlyCapability
//            , Capabilities.ConsumeResourcesCapability
//            , Capabilities.RegenerateCapability
        ];
        this.CELLULAR_AGENT_TYPE.drawFunction = (function (ctx, agent, x, y, pieceWidth, pieceHeight, newColor, counter, direction) {

            var __ret = FiercePlanet.Drawing.getDrawingPosition(agent, Lifecycle.waveCounter);
            var xPos = __ret.intX;
            var yPos = __ret.intY;
            var nx = xPos * FiercePlanet.Orientation.cellWidth - (FiercePlanet.Orientation.worldWidth) / 2;
            var ny = yPos * FiercePlanet.Orientation.cellHeight - (FiercePlanet.Orientation.worldHeight) / 2;


//            var radius = (pieceWidth / 4);
//
//            ctx.lineWidth = 1.5;
//            ctx.beginPath();
//            ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2, false);
//            ctx.closePath();
            var color = (agent.isLiving ? "#fff" : "#000");
//            ctx.strokeStyle = color;
//            ctx.stroke();
            ctx.fillStyle = color;
            ctx.fillRect(nx, ny, FiercePlanet.Orientation.cellWidth, FiercePlanet.Orientation.cellHeight);
//            ctx.fill();

        });

        this.CELLULAR_AGENT_TYPE.initFunction = function (agent, level) {
            var r = Math.random();
            agent.gender = (r < 0.5 ? 'm' : 'f');
        }


        this.id = 'GOL-Agents';
        this.cultures = [GameOfLifeCultures.CELLULAR_AGENT_TYPE];
    }

}).apply(GameOfLifeCultures);


if (typeof(exports) != "undefined")
    exports.GameOfLifeCultures = GameOfLifeCultures;
