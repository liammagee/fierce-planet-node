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
    this.x = x, this.y = _y, this.figureWidth = _figureWidth, this.figureHeight = _figureHeight;
    this.wholeBodyLength = (this.figureHeight * 1);
    this.headRadius = (this.wholeBodyLength / 8) + 0.5 | 0;
    this.bodyLength = (this.wholeBodyLength / 3) + 0.5 | 0;
    this.shoulderPoint = (this.bodyLength / 3) + 0.5 | 0;
    this.shoulderToElbowLength = (this.wholeBodyLength / 8) + 0.5 | 0;
    this.elbowToHandLength = (this.wholeBodyLength / 8) + 0.5 | 0;
    this.handLength = (this.wholeBodyLength / 18) + 0.5 | 0;
    this.hipToKneeLength = (this.wholeBodyLength / 6) + 0.5 | 0;
    this.kneeToFootLength = (this.wholeBodyLength / 4) + 0.5 | 0;
    this.footLength = (this.wholeBodyLength / 12) + 0.5 | 0;
    this.startOfHeadY = this.y - this.headRadius;
    this.startOfBodyY = this.y + this.headRadius;
    this.startOfShoulderY = this.startOfBodyY + this.shoulderPoint;
    this.startOfHipY = this.startOfBodyY + this.bodyLength;

    this.defaultAngle = Math.PI / 4;
    this.headAngle = Math.PI / 2,
        this.fShoulderAngle = this.defaultAngle,
        this.fElbowAngle = this.defaultAngle,
        this.bShoulderAngle = this.defaultAngle,
        this.bElbowAngle = this.defaultAngle,
        this.fHipAngle = this.defaultAngle,
        this.fKneeAngle = this.defaultAngle,
        this.bHipAngle = this.defaultAngle,
        this.bKneeAngle = this.defaultAngle,
        this.fFootAngle = 0,
        this.bFootAngle = 0,
        this.fHandAngle = 0,
        this.bHandAngle = 0;
    this.headX, this.headY,
        this.fElbowX, this.fElbowY,
        this.bElbowX, this.bElbowY,
        this.fHandX, this.fHandY,
        this.bHandX, this.bHandY,
        this.fFingerX, this.fFingerY,
        this.bFingerX, this.bFingerY,
        this.fKneeX, this.fKneeY,
        this.bKneeX, this.bKneeY,
        this.fFootX, this.fFootY,
        this.bFootX, this.bFootY,
        this.fToeX, this.fToeY,
        this.bToeX, this.bToeY;

        // Stick figure actions
    this.run = function(frame, direction) {
        switch (frame) {
            case 0:
                this.fShoulderAngle = Math.PI * (12 / 12);
                this.fElbowAngle = Math.PI * (6 / 12);
                this.fHandAngle = Math.PI * (6 / 12);
                this.bShoulderAngle = Math.PI * (4 / 12);
                this.bElbowAngle = Math.PI * (20 / 12);
                this.bHandAngle = Math.PI * (20 / 12);

                this.fHipAngle = Math.PI * (9 / 12);
                this.fKneeAngle = Math.PI * (9 / 12);
                this.fFootAngle = Math.PI * (3 / 12);
                this.bHipAngle = Math.PI * (1 / 12);
                this.bKneeAngle = Math.PI * (7 / 12);
                this.bFootAngle = Math.PI * (1 / 12);
                break;
            case 1:
                this.fShoulderAngle = Math.PI * (9 / 12);
                this.fElbowAngle = Math.PI * (3 / 12);
                this.fHandAngle = Math.PI * (3 / 12);
                this.bShoulderAngle = Math.PI * (5 / 12);
                this.bElbowAngle = Math.PI * (21 / 12);
                this.bHandAngle = Math.PI * (21 / 12);

                this.fHipAngle = Math.PI * (10 / 12);
                this.fKneeAngle = Math.PI * (15 / 12);
                this.fFootAngle = Math.PI * (9 / 12);
                this.bHipAngle = Math.PI * (3 / 12);
                this.bKneeAngle = Math.PI * (4 / 12);
                this.bFootAngle = Math.PI * (-2 / 12);
                break;
            case 2:
                this.fShoulderAngle = Math.PI * (6 / 12);
                this.fElbowAngle = Math.PI * (0 / 12);
                this.fHandAngle = Math.PI * (0 / 12);
                this.bShoulderAngle = Math.PI * (9 / 12);
                this.bElbowAngle = Math.PI * (2 / 12);
                this.bHandAngle = Math.PI * (2 / 12);

                this.fHipAngle = Math.PI * (5 / 12);
                this.fKneeAngle = Math.PI * (13 / 12);
                this.fFootAngle = Math.PI * (7 / 12);
                this.bHipAngle = Math.PI * (6 / 12);
                this.bKneeAngle = Math.PI * (7 / 12);
                this.bFootAngle = Math.PI * (1 / 12);
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
                this.fShoulderAngle = Math.PI * (9 / 12);
                this.fElbowAngle = Math.PI * (8 / 12);
                this.fHandAngle = Math.PI * (8 / 12);
                this.bShoulderAngle = Math.PI * (4 / 12);
                this.bElbowAngle = Math.PI * (4 / 12);
                this.bHandAngle = Math.PI * (4 / 12);

                this.fHipAngle = Math.PI * (8 / 12);
                this.fKneeAngle = Math.PI * (9 / 12);
                this.fFootAngle = Math.PI * (3 / 12);
                this.bHipAngle = Math.PI * (4 / 12);
                this.bKneeAngle = Math.PI * (4 / 12);
                this.bFootAngle = Math.PI * (-2 / 12);
                break;
            case 1:
                this.fShoulderAngle = Math.PI * (7 / 12);
                this.fElbowAngle = Math.PI * (6 / 12);
                this.fHandAngle = Math.PI * (6 / 12);
                this.bShoulderAngle = Math.PI * (6 / 12);
                this.bElbowAngle = Math.PI * (5 / 12);
                this.bHandAngle = Math.PI * (5 / 12);

                this.fHipAngle = Math.PI * (7 / 12);
                this.fKneeAngle = Math.PI * (8 / 12);
                this.fFootAngle = Math.PI * (2 / 12);
                this.bHipAngle = Math.PI * (5 / 12);
                this.bKneeAngle = Math.PI * (6 / 12);
                this.bFootAngle = Math.PI * (0 / 12);
                break;
            case 2:
                this.fShoulderAngle = Math.PI * (5 / 12);
                this.fElbowAngle = Math.PI * (4 / 12);
                this.fHandAngle = Math.PI * (4 / 12);
                this.bShoulderAngle = Math.PI * (7 / 12);
                this.bElbowAngle = Math.PI * (7 / 12);
                this.bHandAngle = Math.PI * (7 / 12);

                this.fHipAngle = Math.PI * (5 / 12);
                this.fKneeAngle = Math.PI * (6 / 12);
                this.fFootAngle = Math.PI * (0 / 12);
                this.bHipAngle = Math.PI * (7 / 12);
                this.bKneeAngle = Math.PI * (8 / 12);
                this.bFootAngle = Math.PI * (2 / 12);
                break;
        }
        if (direction == 1) {
            this.flipHorizontalDirection();
        }
        this.generateCoordinates();
    };

    // Stick figure actions
    this.explode = function(frame, direction) {
        this.fShoulderAngle = Math.PI * (14 / 12);
        this.fElbowAngle = Math.PI * (14 / 12);
        this.bShoulderAngle = Math.PI * (22 / 12);
        this.bElbowAngle = Math.PI * (22 / 12);

        this.fHipAngle = Math.PI * (10 / 12);
        this.fKneeAngle = Math.PI * (10 / 12);
        this.bHipAngle = Math.PI * (2 / 12);
        this.bKneeAngle = Math.PI * (2 / 12);
        this.generateCoordinates();
    };

    // Stick figure actions
    this.expire = function(frame, direction) {
        this.fShoulderAngle = Math.PI * (14 / 12);
        this.fElbowAngle = Math.PI * (14 / 12);
        this.bShoulderAngle = Math.PI * (22 / 12);
        this.bElbowAngle = Math.PI * (22 / 12);

        this.fHipAngle = Math.PI * (10 / 12);
        this.fKneeAngle = Math.PI * (10 / 12);
        this.bHipAngle = Math.PI * (2 / 12);
        this.bKneeAngle = Math.PI * (2 / 12);
        this.generateCoordinates();
    };

    this.flipHorizontalDirection = function() {
        this.headAngle = (Math.PI / 2) + ((Math.PI / 2) - this.headAngle);

        this.fShoulderAngle = (Math.PI / 2) + ((Math.PI / 2) - this.fShoulderAngle);
        this.fElbowAngle = (Math.PI / 2) + ((Math.PI / 2) - this.fElbowAngle);
        this.bShoulderAngle = (Math.PI / 2) + ((Math.PI / 2) - this.bShoulderAngle);
        this.bElbowAngle = (Math.PI / 2) + ((Math.PI / 2) - this.bElbowAngle);

        this.fHipAngle = (Math.PI / 2) + ((Math.PI / 2) - this.fHipAngle);
        this.fKneeAngle = (Math.PI / 2) + ((Math.PI / 2) - this.fKneeAngle);
        this.fFootAngle = (Math.PI / 2) + ((Math.PI / 2) - this.fFootAngle);
        this.bHipAngle = (Math.PI / 2) + ((Math.PI / 2) - this.bHipAngle);
        this.bKneeAngle = (Math.PI / 2) + ((Math.PI / 2) - this.bKneeAngle);
        this.bFootAngle = (Math.PI / 2) + ((Math.PI / 2) - this.bFootAngle);
    };

    this.flipVerticalDirection = function() {
        this.y = this.y + this.figureHeight;
        this.wholeBodyLength = (this.figureHeight * 1);
        this.headRadius = (this.wholeBodyLength / 8) + 0.5 | 0;
        this.bodyLength = -this.bodyLength;
        this.shoulderPoint = -this.shoulderPoint;
        this.shoulderToElbowLength = -this.shoulderToElbowLength;
        this.elbowToHandLength = -this.elbowToHandLength;
        this.hipToKneeLength = -this.hipToKneeLength;
        this.kneeToFootLength = -this.kneeToFootLength;
        this.startOfHeadY = this.y + this.headRadius;
        this.startOfBodyY = this.y - this.headRadius;
        this.startOfShoulderY = this.startOfBodyY + this.shoulderPoint;
        this.startOfHipY = this.startOfBodyY + this.bodyLength;

    };

    this.generateCoordinates = function() {
        this.headX = Math.floor(this.x + Math.cos(this.headAngle) * this.headRadius);
        this.headY = Math.floor(this.startOfHeadY + Math.sin(this.headAngle) * this.headRadius);

        this.fElbowX = Math.floor(this.x + Math.cos(this.fShoulderAngle) * this.shoulderToElbowLength);
        this.fElbowY = Math.floor(this.startOfShoulderY + Math.sin(this.fShoulderAngle) * this.shoulderToElbowLength);
        this.fHandX = Math.floor(this.fElbowX + Math.cos(this.fElbowAngle) * this.elbowToHandLength);
        this.fHandY = Math.floor(this.fElbowY + Math.sin(this.fElbowAngle) * this.elbowToHandLength);
        this.fFingerX = Math.floor(this.fHandX + Math.cos(this.fHandAngle) * this.handLength);
        this.fFingerY = Math.floor(this.fHandY + Math.sin(this.fHandAngle) * this.handLength);

        this.bElbowX = Math.floor(this.x + Math.cos(this.bShoulderAngle) * this.shoulderToElbowLength);
        this.bElbowY = Math.floor(this.startOfShoulderY + Math.sin(this.bShoulderAngle) * this.shoulderToElbowLength);
        this.bHandX = Math.floor(this.bElbowX + Math.cos(this.bElbowAngle) * this.elbowToHandLength);
        this.bHandY = Math.floor(this.fElbowY + Math.sin(this.bElbowAngle) * this.elbowToHandLength);
        this.bFingerX = Math.floor(this.bHandX + Math.cos(this.bHandAngle) * this.handLength);
        this.bFingerY = Math.floor(this.bHandY + Math.sin(this.bHandAngle) * this.handLength);

        this.fKneeX = Math.floor(this.x + Math.cos(this.fHipAngle) * this.hipToKneeLength);
        this.fKneeY = Math.floor(this.startOfHipY + Math.sin(this.fHipAngle) * this.hipToKneeLength);
        this.fFootX = Math.floor(this.fKneeX + Math.cos(this.fKneeAngle) * this.kneeToFootLength);
        this.fFootY = Math.floor(this.fKneeY + Math.sin(this.fKneeAngle) * this.kneeToFootLength);
        this.fToeX = Math.floor(this.fFootX + Math.cos(this.fFootAngle) * this.footLength);
        this.fToeY = Math.floor(this.fFootY + Math.sin(this.fFootAngle) * this.footLength);

        this.bKneeX = Math.floor(this.x + Math.cos(this.bHipAngle) * this.hipToKneeLength);
        this.bKneeY = Math.floor(this.startOfHipY + Math.sin(this.bHipAngle) * this.hipToKneeLength);
        this.bFootX = Math.floor(this.bKneeX + Math.cos(this.bKneeAngle) * this.kneeToFootLength);
        this.bFootY = Math.floor(this.bKneeY + Math.sin(this.bKneeAngle) * this.kneeToFootLength);
        this.bToeX = Math.floor(this.bFootX + Math.cos(this.bFootAngle) * this.footLength);
        this.bToeY = Math.floor(this.bFootY + Math.sin(this.bFootAngle) * this.footLength);
    };

    this.generateSingleCoordinates = function(x, y, angle, length) {
        var newX = Math.floor(this.x + Math.cos(this.angle) * this.length);
        var newY = Math.floor(this.y + Math.sin(this.angle) * this.length);
        return [newX, newY];
    };

    this.drawFigure = function(context) {

        context.beginPath();

        // Head
        context.arc(this.headX, this.headY, this.headRadius, 0, Math.PI * 2, false);

        // Body
        context.moveTo(this.x, this.startOfBodyY);
        context.lineTo(this.x, this.startOfBodyY + this.bodyLength);

        // Front arm
        context.moveTo(this.x, this.startOfShoulderY);
        context.lineTo(this.fElbowX, this.fElbowY);
        context.moveTo(this.fElbowX, this.fElbowY);
        context.lineTo(this.fHandX, this.fHandY);
        context.moveTo(this.fHandX, this.fHandY);
        context.lineTo(this.fFingerX, this.fFingerY);

        // Back arm
        context.moveTo(this.x, this.startOfShoulderY);
        context.lineTo(this.bElbowX, this.bElbowY);
        context.moveTo(this.bElbowX, this.bElbowY);
        context.lineTo(this.bHandX, this.bHandY);
        context.moveTo(this.bHandX, this.bHandY);
        context.lineTo(this.bFingerX, this.bFingerY);

        // Front leg
        context.moveTo(this.x, this.startOfHipY);
        context.lineTo(this.fKneeX, this.fKneeY);
        context.moveTo(this.fKneeX, this.fKneeY);
        context.lineTo(this.fFootX, this.fFootY);
        context.moveTo(this.fFootX, this.fFootY);
        context.lineTo(this.fToeX, this.fToeY);

        // Back leg
        context.moveTo(this.x, this.startOfHipY);
        context.lineTo(this.bKneeX, this.bKneeY);
        context.moveTo(this.bKneeX, this.bKneeY);
        context.lineTo(this.bFootX, this.bFootY);
        context.moveTo(this.bFootX, this.bFootY);
        context.lineTo(this.bToeX, this.bToeY);

        context.closePath();
    };

    this.defaultAction = this.run;
};
