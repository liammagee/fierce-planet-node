/*!
 * Fierce Planet - GeneralUI
 * General UI functions
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */



var FiercePlanet = FiercePlanet || {};


/**
 * @namespace Contains keyboard-related functions
 */
FiercePlanet.Keyboard = FiercePlanet.Keyboard || {};

(function() {


    /**
     *  Add key handling events
     */
    this.handleKeyboardShortcuts = function(e) {

        if (World.settings.disableKeyboardShortcuts)
            return;

        // Return if command keys are selected
        if (e.ctrlKey || e.altKey || e.metaKey)
            return;


        if (World.settings.firstPerson) {
            var myAgent = FiercePlanet.Game.currentLevel.currentAgents[0];
            if (myAgent) {
                switch (e.which) {
                    // +, -, 0: Zoom functions
                    case 37:
                    case 65:
                        if (myAgent.x > 0) {
                            myAgent.x = myAgent.x - 1;
                            FiercePlanet.Drawing.panByDrag(FiercePlanet.Orientation.cellWidth, 0);
                        }
                        break;
                    case 39:
                    case 68:
                        if (myAgent.x  < FiercePlanet.Orientation.cellsAcross) {
                            myAgent.x = myAgent.x + 1;
                            FiercePlanet.Drawing.panByDrag(-FiercePlanet.Orientation.cellWidth, 0);
                        }
                        break;
                    case 38:
                    case 87:
                        if (myAgent.y > 0) {
                            myAgent.y = myAgent.y - 1;
                            FiercePlanet.Drawing.panByDrag(0, FiercePlanet.Orientation.cellWidth);
                        }
                        break;
                    case 40:
                    case 83:
                        if (myAgent.y  < FiercePlanet.Orientation.cellsDown) {
                            myAgent.y = myAgent.y + 1;
                            FiercePlanet.Drawing.panByDrag(0, -FiercePlanet.Orientation.cellWidth);
                        }
                        break;
                }
//                FiercePlanet.Drawing.panByDrag(- FiercePlanet.Orientation.offsetX / FiercePlanet.Orientation.zoomLevel, - FiercePlanet.Orientation.offsetY / FiercePlanet.Orientation.zoomLevel);

//                FiercePlanet.Drawing.panByDrag(myAgent.x - FiercePlanet.Orientation.cellsAcross / 2, myAgent.y - FiercePlanet.Orientation.cellsDown / 2);
                myAgent.lastMemory.x = myAgent.x;
                myAgent.lastMemory.y = myAgent.y;

                FiercePlanet.Drawing.clearCanvas('#agentCanvas');
                FiercePlanet.Drawing.drawAgents();
            }
        }
        else {
            switch (e.which) {
                // tilda
                case 27:
                    jqconsole.Focus();
                    break;
                // tilda
                case 192:
                    if ($('#notifications').height() > 40) {
//                        $('#console').removeClass('tilda');
                        $('#console').css({height: 20});
                        $('#notifications').height(40);
                    }
                    else {
//                        $('#console').addClass('tilda');
                        $('#console').css({height: 180});
                        $('#notifications').height(200);
                    }

                    break;
                // +, -, 0: Zoom functions
                case 107:
                    FiercePlanet.Drawing.zoom(1);
                    break;
                case 109:
                    FiercePlanet.Drawing.zoom(-1);
                    break;
                case 96:
                    FiercePlanet.Drawing.zoom(0);
                    break;
                // Arrow buttons, 'h': Pan functions
                case 37:
                    FiercePlanet.Drawing.pan(2);
                    break;
                case 38:
                    FiercePlanet.Drawing.pan(0);
                    break;
                case 39:
                    FiercePlanet.Drawing.pan(3);
                    break;
                case 40:
                    FiercePlanet.Drawing.pan(1);
                    break;
                case 72:
                    FiercePlanet.Drawing.pan(4);
                    break;
                // 'p': Play/pause game
                case 80:
                    FiercePlanet.Lifecycle.playGame();
                    break;
                // 'n': New game
                case 78:
                    FiercePlanet.Lifecycle.newGame();
                    break;
                // 'r': Restart game
                case 82:
                    FiercePlanet.Lifecycle.restartLevel();
                    break;
                // 'w': Rewind
                case 87:
                    FiercePlanet.Lifecycle.slowDown();
                    break;
                // 'f': Fast forward
                case 70:
                    FiercePlanet.Lifecycle.speedUp();
                    break;
                // 't': Tutorial
                case 84:
                    $('#tutorial').click();
                    break;
                // 'g': Gallery
                case 71:
                    $('#level-gallery').click();
                    break;
                // 's': Settings
                case 83:
                    FiercePlanet.Dialogs.showSettings();
                    break;
                // 'e': Editor
                case 69:
                    $('#editor').click();
                    break;
                // '$': Resource Gallery
                case 52:
                    if (e.shiftKey)
                        FiercePlanet.Dialogs.showResourceGallery();
                    break;
            }

        }
    };

}).apply(FiercePlanet.Keyboard);
