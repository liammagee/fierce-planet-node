/*!
 * Fierce Planet - Drawing
 * Functions for drawing aspects of the game
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var FiercePlanet = FiercePlanet || {};



/**
 * Stick Figure class definition
 *
 * @constructor
 * @param id
 */
FiercePlanet.StickFigure = function(x, _y, _figureWidth, _figureHeight) {
    var x = x, y = _y, figureWidth = _figureWidth, figureHeight = _figureHeight;
    var wholeBodyLength = (figureHeight * 1);
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

    var defaultAngle = Math.PI / 4;
    var fShoulderAngle = defaultAngle,
            fElbowAngle = defaultAngle,
            bShoulderAngle = defaultAngle,
            bElbowAngle = defaultAngle,
            fHipAngle = defaultAngle,
            fKneeAngle = defaultAngle,
            bHipAngle = defaultAngle,
            bKneeAngle = defaultAngle;
    var fElbowX, fElbowY,
        bElbowX, bElbowY,
        fHandX, fHandY,
        bHandX, bHandY,
        fKneeX, fKneeY,
        bKneeX, bKneeY,
        fFootX, fFootY,
        bFootX, bFootY;

    // Stick figure actions
    this.run = function(frame, direction) {
        switch (frame) {
            case 0:
                fShoulderAngle = Math.PI * (12 / 12);
                fElbowAngle = Math.PI * (6 / 12);
                bShoulderAngle = Math.PI * (4 / 12);
                bElbowAngle = Math.PI * (20 / 12);

                fHipAngle = Math.PI * (9 / 12);
                fKneeAngle = Math.PI * (9 / 12);
                bHipAngle = Math.PI * (1 / 12);
                bKneeAngle = Math.PI * (7 / 12);
                break;
            case 1:
                fShoulderAngle = Math.PI * (9 / 12);
                fElbowAngle = Math.PI * (3 / 12);
                bShoulderAngle = Math.PI * (5 / 12);
                bElbowAngle = Math.PI * (21 / 12);

                fHipAngle = Math.PI * (10 / 12);
                fKneeAngle = Math.PI * (15 / 12);
                bHipAngle = Math.PI * (3 / 12);
                bKneeAngle = Math.PI * (4 / 12);
                break;
            case 2:
                fShoulderAngle = Math.PI * (6 / 12);
                fElbowAngle = Math.PI * (0 / 12);
                bShoulderAngle = Math.PI * (9 / 12);
                bElbowAngle = Math.PI * (2 / 12);

                fHipAngle = Math.PI * (5 / 12);
                fKneeAngle = Math.PI * (13 / 12);
                bHipAngle = Math.PI * (6 / 12);
                bKneeAngle = Math.PI * (7 / 12);
                break;
        }
        if (direction == 1) {
            this.flipHorizontalDirection();
        }

        this.generateCoordinates();
    };

    // Stick figure actions
    this.runUpsideDown = function(frame, direction) {
        this.run(frame, direction);

        this.flipVerticalDirection();
        this.generateCoordinates();
    };

    // Stick figure actions
    this.walk = function(frame, direction) {
        switch (frame) {
            case 0:
                fShoulderAngle = Math.PI * (9 / 12);
                fElbowAngle = Math.PI * (8 / 12);
                bShoulderAngle = Math.PI * (4 / 12);
                bElbowAngle = Math.PI * (4 / 12);

                fHipAngle = Math.PI * (8 / 12);
                fKneeAngle = Math.PI * (9 / 12);
                bHipAngle = Math.PI * (4 / 12);
                bKneeAngle = Math.PI * (4 / 12);
                break;
            case 1:
                fShoulderAngle = Math.PI * (7 / 12);
                fElbowAngle = Math.PI * (6 / 12);
                bShoulderAngle = Math.PI * (6 / 12);
                bElbowAngle = Math.PI * (5 / 12);

                fHipAngle = Math.PI * (7 / 12);
                fKneeAngle = Math.PI * (8 / 12);
                bHipAngle = Math.PI * (5 / 12);
                bKneeAngle = Math.PI * (6 / 12);
                break;
            case 2:
                fShoulderAngle = Math.PI * (5 / 12);
                fElbowAngle = Math.PI * (4 / 12);
                bShoulderAngle = Math.PI * (7 / 12);
                bElbowAngle = Math.PI * (7 / 12);

                fHipAngle = Math.PI * (5 / 12);
                fKneeAngle = Math.PI * (6 / 12);
                bHipAngle = Math.PI * (7 / 12);
                bKneeAngle = Math.PI * (8 / 12);
                break;
        }
        if (direction == 1) {
            this.flipHorizontalDirection();
        }
        this.generateCoordinates();
    };

    // Stick figure actions
    this.explode = function(frame, direction) {
        fShoulderAngle = Math.PI * (14 / 12);
        fElbowAngle = Math.PI * (14 / 12);
        bShoulderAngle = Math.PI * (22 / 12);
        bElbowAngle = Math.PI * (22 / 12);

        fHipAngle = Math.PI * (10 / 12);
        fKneeAngle = Math.PI * (10 / 12);
        bHipAngle = Math.PI * (2 / 12);
        bKneeAngle = Math.PI * (2 / 12);
        this.generateCoordinates();
    };

    this.flipHorizontalDirection = function() {
        fShoulderAngle = (Math.PI / 2) + ((Math.PI / 2) - fShoulderAngle);
        fElbowAngle = (Math.PI / 2) + ((Math.PI / 2) - fElbowAngle);
        bShoulderAngle = (Math.PI / 2) + ((Math.PI / 2) - bShoulderAngle);
        bElbowAngle = (Math.PI / 2) + ((Math.PI / 2) - bElbowAngle);

        fHipAngle = (Math.PI / 2) + ((Math.PI / 2) - fHipAngle);
        fKneeAngle = (Math.PI / 2) + ((Math.PI / 2) - fKneeAngle);
        bHipAngle = (Math.PI / 2) + ((Math.PI / 2) - bHipAngle);
        bKneeAngle = (Math.PI / 2) + ((Math.PI / 2) - bKneeAngle);
    };

    this.flipVerticalDirection = function() {
        y = y + figureHeight;
        wholeBodyLength = (figureHeight * 1);
        headRadius = (wholeBodyLength / 8) + 0.5 | 0;
        bodyLength = -bodyLength;
        shoulderPoint = -shoulderPoint;
        shoulderToElbowLength = -shoulderToElbowLength;
        elbowToHandLength = -elbowToHandLength;
        hipToKneeLength = -hipToKneeLength;
        kneeToFootLength = -kneeToFootLength;
        startOfHeadY = y + headRadius;
        startOfBodyY = y - headRadius;
        startOfShoulderY = startOfBodyY + shoulderPoint;
        startOfHipY = startOfBodyY + bodyLength;

    };

    this.generateCoordinates = function() {
        fElbowX = (x + Math.cos(fShoulderAngle) * shoulderToElbowLength);
        fElbowY = (startOfShoulderY + Math.sin(fShoulderAngle) * shoulderToElbowLength);
        fHandX = (fElbowX + Math.cos(fElbowAngle) * elbowToHandLength);
        fHandY = (fElbowY + Math.sin(fElbowAngle) * elbowToHandLength);

        bElbowX = (x + Math.cos(bShoulderAngle) * shoulderToElbowLength);
        bElbowY = (startOfShoulderY + Math.sin(bShoulderAngle) * shoulderToElbowLength);
        bHandX = (bElbowX + Math.cos(bElbowAngle) * elbowToHandLength);
        bHandY = (fElbowY + Math.sin(bElbowAngle) * elbowToHandLength);

        fKneeX = (x + Math.cos(fHipAngle) * hipToKneeLength);
        fKneeY = (startOfHipY + Math.sin(fHipAngle) * hipToKneeLength);
        fFootX = (fKneeX + Math.cos(fKneeAngle) * kneeToFootLength);
        fFootY = (fKneeY + Math.sin(fKneeAngle) * kneeToFootLength);

        bKneeX = (x + Math.cos(bHipAngle) * hipToKneeLength);
        bKneeY = (startOfHipY + Math.sin(bHipAngle) * hipToKneeLength);
        bFootX = (bKneeX + Math.cos(bKneeAngle) * kneeToFootLength);
        bFootY = (bKneeY + Math.sin(bKneeAngle) * kneeToFootLength);
    };

    this.drawFigure = function(context) {

        context.beginPath();

        // Head
        context.arc(x, y, headRadius, 0, Math.PI * 2, false);

        // Body
        context.moveTo(x, startOfBodyY);
        context.lineTo(x, startOfBodyY + bodyLength);

        // Front arm
        context.moveTo(x, startOfShoulderY);
        context.lineTo(fElbowX, fElbowY);
        context.moveTo(fElbowX, fElbowY);
        context.lineTo(fHandX, fHandY);

        // Back arm
        context.moveTo(x, startOfShoulderY);
        context.lineTo(bElbowX, bElbowY);
        context.moveTo(bElbowX, bElbowY);
        context.lineTo(bHandX, bHandY);

        // Front leg
        context.moveTo(x, startOfHipY);
        context.lineTo(fKneeX, fKneeY);
        context.moveTo(fKneeX, fKneeY);
        context.lineTo(fFootX, fFootY);

        // Back leg
        context.moveTo(x, startOfHipY);
        context.lineTo(bKneeX, bKneeY);
        context.moveTo(bKneeX, bKneeY);
        context.lineTo(bFootX, bFootY);

        context.closePath();
    };

    this.defaultAction = this.run;
};
