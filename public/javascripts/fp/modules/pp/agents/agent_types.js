/*!
 * Fierce Planet - AgentTypes
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


/*
Agent Type setup
 */

var AgentTypes = function() {};
FiercePlanet.PredatorPreyModule = FiercePlanet.PredatorPreyModule || {};
FiercePlanet.PredatorPreyModule.AgentTypes = FiercePlanet.PredatorPreyModule.AgentTypes || {};

/**
 * Register the default agent types
 */
(function() {

    this.init = function() {
        AgentTypes.PREDATOR_AGENT_TYPE = new AgentType("Predator", "#fbe53b", World.resourceCategories);
//        AgentTypes.PREDATOR_AGENT_TYPE.canHit = (true);
        AgentTypes.PREDATOR_AGENT_TYPE.drawFunction = (function(ctx, agent, intX, intY, pieceWidth, pieceHeight, newColor, counter, direction) {
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

        AgentTypes.PREDATOR_AGENT_TYPE.updateFunction = function(agent, level) {
            var x = agent.x;
            var y = agent.y;
            var agents = level.currentAgents;
            for (var j = 0; j < agents.length; j++) {
                var a = agents[j];
                var ax = a.x;
                var ay = a.y;
                if (Math.abs(ax - x) <= 1 && Math.abs(ay - y) <= 1) {
                    if (a.agentType == AgentTypes.CITIZEN_AGENT_TYPE) {
                        a.adjustGeneralHealth(-10);
                        agent.adjustGeneralHealth(10);
                    }
                }
            }
        }

        this.id = 'FP-Agents';
        this.agentTypes = [AgentTypes.CITIZEN_AGENT_TYPE, AgentTypes.PREDATOR_AGENT_TYPE];
    }

}).apply(FiercePlanet.PredatorPreyModule.AgentTypes);

