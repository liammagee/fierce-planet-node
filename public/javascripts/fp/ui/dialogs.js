/*!
 * Fierce Planet - Dialogs
 * Declares dialogs used in the game
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */



var FiercePlanet = FiercePlanet || {};


/**
 * @namespace Contains dialog functions
 */
FiercePlanet.Dialogs = FiercePlanet.Dialogs || {};

(function() {

    this.gameOverDialog = null;
    this.completeLevelDialog = null;
    this.completeGameDialog = null;
    this.upgradeDeleteDialog = null;
    this.resourceGalleryDialog = null;
    this.newLevelDialog = null;
    this.settingsDialog = null;
    this.profileDialog = null;
    this.creditsDialog = null;
    this.genericDialog = null;
    this.highScores = null;
    this.login = null;

    // Level editor dialogs
    this.designFeaturesDialog = null;
    this.editPropertiesDialog = null;

    /**
     * Calculates the left position of the 'world' element
     */
    this.calculateWorldLeft = function () {
        var contentPane = $("#content-pane");
        var wrapper = $("#wrapper");
        var world = $("#world");
        var gameworld = $("#gameworld");
        var contentPaneX = contentPane.position().left;
        var wrapperX = wrapper.position().left;
        var worldX = world.position().left;
        var gameworldX = gameworld.position().left;
        var dialogX = contentPaneX + wrapperX + worldX + gameworldX;
        return dialogX;
    };


    /**
     * Calculates the top position of the 'world' element
     */
    this.calculateWorldTop = function () {
        var contentPane = $("#content-pane");
        var wrapper = $("#wrapper");
        var world = $("#world");
        var contentPaneY = contentPane.position().top;
        var wrapperY = wrapper.position().top;
        var worldY = world.position().top;
        var dialogY = contentPaneY + wrapperY + worldY;
        return dialogY;
//        return dialogY - 178;
    };



    /**
     * Sets up Fierce Planet dialogs
     */
    this.setupDialogs = function() {
        var dialogX = this.calculateWorldLeft();
        var dialogY = this.calculateWorldTop();
        var dfWidth = FiercePlanet.Orientation.worldWidth * 3 / 5;
        var dfHeight = FiercePlanet.Orientation.worldHeight * 3 / 4;
        var dfX = dialogX + ((FiercePlanet.Orientation.worldWidth - dfWidth) / 2);
        var dfY = dialogY + ((FiercePlanet.Orientation.worldHeight - dfHeight) / 2);

        // Dialogs

        this.newLevelDialog = $('<div></div>')
            .html('New Level')
            .dialog({
                position: [dialogX, dialogY],
                width: FiercePlanet.Orientation.worldWidth + 7,
                height: FiercePlanet.Orientation.worldHeight + 7,
                autoOpen: false,
                modal: true,
                title: 'New Level',
                buttons: {
                    "Play": function() {
                        // Animation effect
                        // For spinning, try: http://www.zachstronaut.com/posts/2009/08/07/jquery-animate-css-rotate-scale.html
                        $( this ).dialog( "close" );
                        Lifecycle.startLevel();
                    },
                    "Cancel": function() {
                        $( this ).dialog( "close" );
                    }
                },
                  open: function(){
                    $("#level-gallery-tabs").tabs();
                  }
            });

        this.completeLevelDialog = $('<div></div>')
            .html('Level Complete!')
            .dialog({
                                                          position: [dialogX, dialogY],
                                                          width: FiercePlanet.Orientation.worldWidth + 7,
                                                          height: FiercePlanet.Orientation.worldHeight + 7,
                autoOpen: false,
                 modal: true,
                title: 'Level Complete!',
                buttons: {
                    "Next Level": function() {
                        Lifecycle.newLevel();
                        $( this ).dialog( "close" );
                    },
                    "Cancel": function() {
                        $( this ).dialog( "close" );
                    }
                }
            });

        this.completeGameDialog = $('<div></div>')
            .html('Complete game!')
            .dialog({
                 position: [dialogX, dialogY],
                 width: FiercePlanet.Orientation.worldWidth + 7,
                 height: FiercePlanet.Orientation.worldHeight + 7,
                autoOpen: false,
                modal: true,
                title: 'Fierce Planet Complete!',
                buttons: {
                    "Bonus Level": function() {
                        Lifecycle.newLevel();
                        $( this ).dialog( "close" );
                    },
                    "New Game": function() {
                        Lifecycle.newGame();
                        $( this ).dialog( "close" );
                    },
                    "Cancel": function() {
                        $( this ).dialog( "close" );
                    }
                }

            });

        this.gameOverDialog = $('<div></div>')
            .html('Game Over!')
            .dialog({
                                                     position: [dialogX, dialogY],
                                                     width: FiercePlanet.Orientation.worldWidth + 7,
                                                     height: FiercePlanet.Orientation.worldHeight + 7,
                autoOpen: false,
                modal: true,
                title: 'Game Over!',
                buttons: {
                    "Restart Level": function() {
                        Lifecycle.restartLevel();
                        $( this ).dialog( "close" );
                    },
                    "New Game": function() {
                        Lifecycle.newGame();
                        $( this ).dialog( "close" );
                    }
                }
            });

        /* Upgrade / delete dialog */
        this.upgradeDeleteDialog = $('#delete-upgrade-dialog')
            .dialog({
                                                          position: [dialogX, dialogY],
                                                          width: FiercePlanet.Orientation.worldWidth + 7,
                                                          height: FiercePlanet.Orientation.worldHeight + 7,
                autoOpen: false,
                modal: true,
                title: 'Upgrade or Delete Resource',
                buttons: {
                    "Cancel": function() {
                        $( this ).dialog( "close" );
                    }
                }
            });

        this.resourceGalleryDialog = $('#resource-gallery-tabs')
            .dialog({
                                                            position: [dialogX, dialogY],
                                                            width: FiercePlanet.Orientation.worldWidth + 7,
                                                            height: FiercePlanet.Orientation.worldHeight + 7,
                autoOpen: false,
                modal: true,
                title: 'Resource Gallery',
                buttons: {
                    "Save Capabilities": function() {
                        FiercePlanet.GeneralUI.refreshSwatch();
                        FiercePlanet.ResourceUI.setupResourceInteraction();
                        FiercePlanet.ProfileUI.saveCapabilities();
                        $( this ).dialog( "close" );
                    },
                    "Cancel": function() {
                        $( this ).dialog( "close" );
                    }
                },
                    open: function() {
                        $('#resource-gallery-tabs').tabs();
                    }
            });

        FiercePlanet.LevelGallery.renderModules();
        this.levelGalleryDialog = $('#level-gallery-dialog')
            .dialog({
              position: [dialogX, dialogY],
                           width: FiercePlanet.Orientation.worldWidth + 7,
                           height: FiercePlanet.Orientation.worldHeight + 7,
                autoOpen: false,
                modal: true,
                title: 'Level Gallery',
                buttons: {
                    "Open level": function() {
                        Lifecycle.newLevel();
                        $( this ).dialog( "close" );
                    },
                    "Cancel": function() {
                        $( this ).dialog( "close" );
                    }
                },
                  open: function(){
                    $("#level-gallery-tabs").tabs();
                  }
            });

        this.levelEditorDialog = $('#level-editor-dialog')
            .dialog({
                                              position: [dialogX, dialogY],
                                                           width: FiercePlanet.Orientation.worldWidth + 7,
                                                           height: FiercePlanet.Orientation.worldHeight + 7,
                autoOpen: false,
                modal: true,
                title: 'Level Editor',
                buttons: {
                    "Open level": function() {
                        $( this ).dialog( "close" );
                    },
                    "Cancel": function() {
                        $( this ).dialog( "close" );
                    }
                },
                  open: function(){
//                    $("#level-editor-tabs").tabs();
                  }
            });

        this.settingsDialog = $('#settings-dialog')
            .dialog({
                                              position: [dialogX, dialogY],
                                                           width: FiercePlanet.Orientation.worldWidth + 7,
                                                           height: FiercePlanet.Orientation.worldHeight + 7,
                autoOpen: false,
                modal: true,
                title: 'Settings',
                buttons: {
                    "Save": function() {
                        FiercePlanet.Utils.setAndStoreProperties();
                        $( this ).dialog( "close" );
                    },
                    "Reset": function() {
                        var namespace = World.resourceTypeNamespace;
                        initWorld.apply(World);
                        FiercePlanet.Utils.initialiseWorldSettings();
                        World.resourceTypeNamespace = namespace;
                        if (World.resourceTypeNamespace.doSetup)
                            World.resourceTypeNamespace.doSetup();
                        FiercePlanet.Utils.getAndRetrieveProperties();
                    },
                    "Cancel": function() {
                        $( this ).dialog( "close" );
                    }
                },
                  open: function(){
                    $("#settings-tabs").tabs();
                  }
            });

        this.loginDialog = $('#login-dialog')
            .dialog({
                position: [dialogX, dialogY],
                width: FiercePlanet.Orientation.worldWidth + 7,
                height: FiercePlanet.Orientation.worldHeight + 7,
                autoOpen: false,
                modal: true,
                title: 'Login',
                buttons: {
                    "Login": function() {
                        $( this ).dialog( "close" );
                        Lifecycle.startLevel();
                    },
                    "Cancel": function() {
                        $( this ).dialog( "close" );
                    }
                }
            });

        this.profileDialog = $('#profile-dialog')
            .dialog({
                position: [dialogX, dialogY],
                width: FiercePlanet.Orientation.worldWidth + 7,
                height: FiercePlanet.Orientation.worldHeight + 7,
                autoOpen: false,
                modal: true,
                title: 'Profile',
                buttons: {
                    "Update profile": function() {
                        FiercePlanet.Game.currentProfile.nickname = $('#profile-nickname').val();
                        $( this ).dialog( "close" );

                        FiercePlanet.ProfileUI.saveProfile(function(res) {
                            if (res == '1')
                                $('#welcome-link')[0].innerHTML = 'Welcome ' + FiercePlanet.Game.currentProfile.nickname;
                        });
                    },
                    "Cancel": function() {
                        $( this ).dialog( "close" );
                    }
                }
            });

        // Add setting specific controls here
        $("#agentCostPerMove").slider({ value: World.settings.agentCostPerMove, min: -10, max: -1, step: 1, animate: "normal",
                slide: function( event, ui ) {
                    $("#agentCostPerMoveDisplay")[0].innerHTML = ( ui.value);
              }
        });
        $("#rateOfResourceRecovery").slider({ value: World.settings.rateOfResourceRecovery, min: 1, max: 10, step: 1, animate: "normal",
                slide: function( event, ui ) {
                    $("#rateOfResourceRecoveryDisplay")[0].innerHTML = ( ui.value);
              }
        });
        $( "#agentCostPerMoveDisplay" )[0].innerHTML = ( World.settings.agentCostPerMove );
        $( "#rateOfResourceRecoveryDisplay" )[0].innerHTML = (  World.settings.rateOfResourceRecovery );



        this.statsDialog = $('<div></div>')
            .dialog({
                                                    position: [dialogX, dialogY],
                                                        width: FiercePlanet.Orientation.worldWidth + 7,
                                                        height: FiercePlanet.Orientation.worldHeight + 7,
                autoOpen: false,
                modal: true,
                title: 'Vital Statistics',
                buttons: {
                    "OK": function() {
                        $( this ).dialog( "close" );
                    }
                }
            });




        this.designFeaturesDialog = $('#level-features')
            .dialog({
               position: [dfX, dfY],
               width: dfWidth,
               height: dfHeight,
                autoOpen: false,
                modal: true,
                title: 'Add design features',
                buttons: {
                    "Cancel": function() {
                        $( this ).dialog( "close" );
                    }
                }

            });

        this.levelListDialog = $('<div></div>')
                .html('Open level editor')
                .dialog({
                            position: [dialogX, dialogY],
                            width: 487,
                            height: 407,
                            autoOpen: false,
                            modal: true,
                            title: 'Level Setup',
                            buttons: {
                                "Cancel": function() {
                                    $(this).dialog("close");
                                }
                            },
                            open: function(){
                                $('#level-list-tabs').tabs();
                            }

                        });


        this.editPropertiesDialog = $('#level-properties-dialog')
            .dialog({
               position: [dialogX, dialogY],
               width: FiercePlanet.Orientation.worldWidth + 7,
               height: FiercePlanet.Orientation.worldHeight + 7,
                autoOpen: false,
                modal: true,
                title: 'Edit level properties',
                buttons: {
                    "Save Level": function() {
                        FiercePlanet.LevelUI.saveLevel();
                        //FiercePlanet.Drawing.drawGame();
                        $( this ).dialog( "close" );
                    },
                    "Cancel": function() {
                        $( this ).dialog( "close" );
                    }
                },
               open: function(){
                   $("#edit-properties-tabs").tabs();
					$('#level-name').focus();
					$('#level-name').select();
               }
            });

        this.creditsDialog = $('<div></div>')
            .html(
                "<div class='   credits'>Development Director</div>" +
                "<div>Liam Magee</div>" +
                "<div class='credits'>Art &amp; Design</div>" +
                "<div>Steven Harris</div>" +
                "<div class='credits'>Game Conception &amp; Testing</div>" +
                "<div>Joshua Magee</div>" +
                "<div>Jakki Mann</div>" +
                "<div class='credits'>Images and Sounds</div>" +
                "<div><a href='http://www.publicdomainpictures.net'>Public Domain Pictures</a></div>" +
                    "<div><a href='http://freesound.org'>thefreesoundproject</a></div>" +
                "<div><a href='http://opengameart.org'>OpenGameArt.org</a></div>"
                )
            .dialog({
                                                  position: [dialogX, dialogY],
                                                  width: 487,
                                                  height: 407,
                        autoOpen: false,
                        modal: true,
                        title: 'Credits',
                        buttons: {
                            "OK": function() {
                                $(this).dialog("close");
                            }
                        }

                    });

        $('#del-button').click(function() {FiercePlanet.deleteCurrentResource(); FiercePlanet.upgradeDeleteDialog.dialog('close'); });
        $('#upg-button').click(function() {FiercePlanet.upgradeCurrentResource(); FiercePlanet.upgradeDeleteDialog.dialog('close'); });

        $('#tutorial').click(function(e) {
            if (confirm("Stop current game and begin the tutorial?")) {
                FiercePlanet.Game.currentLevelNumber = 0;
                FiercePlanet.Game.currentLevelPreset = true;
                Lifecycle.restartLevel();
            }
        });


    };

    /**
     *
     */
    this.showGameOverDialog = function () {
//    FiercePlanet.Game.currentProfile.updateStats(FiercePlanet.Game.currentProfile.resources_in_store, FiercePlanet.Game.currentProfile.saved_agent_count);
        // Try to save results to the server
        if (FiercePlanet.Game.currentProfile.saved) {
            FiercePlanet.ProfileUI.saveProfile(function(data) {
                   this.openGameOverDialog();
               });
        }
        else {
            this.openGameOverDialog();
        }
    };

    /**
     *
     */
    this.openGameOverDialog = function() {
        this.gameOverDialog
                .html(
                "Unfortunately Fierce Planet has gotten the better of its citizens! Click 'Restart Level' or 'New Game' to try again." +
                        FiercePlanet.ProfileUI.generateStats()
                )
                .dialog('open');
    };

    /**
     * Update profile statistics, save statistics to the server if the user is logged in, and opn the complete game dialog
     */
    this.showCompleteGameDialog = function() {
        // Try to save results to the server
        if (FiercePlanet.Game.currentProfile.saved) {
            FiercePlanet.ProfileUI.saveProfile(function(data) {
                   FiercePlanet.Dialogs.openCompleteGameDialog();
               });
        }
        else {
            this.openCompleteGameDialog();
        }
    };

    /**
     * Open the completed game dialog
     */
    this.openCompleteGameDialog = function() {
        this.completeGameDialog.html(
                "Congratulations! In spite of challenges ahead, the citizens of Fierce Planet look forward to a bright and sustainable future!" +
                        FiercePlanet.ProfileUI.generateStats()
                ).dialog('open');
    };

    /**
     * Show the completed level dialog
     */
    this.showCompleteLevelDialog = function() {
        if (FiercePlanet.Game.currentProfile.saved) {
            FiercePlanet.ProfileUI.saveProfile(function(data) {
                   FiercePlanet.Dialogs.openCompleteLevelDialog();
               });
        }
        else {
            this.openCompleteLevelDialog();
        }
    };

    /**
     * Open the completed level dialog
     */
    this.openCompleteLevelDialog = function() {
        this.completeLevelDialog
                .html(
                "<div>" + FiercePlanet.Game.currentLevel.conclusion + "</div>" + FiercePlanet.ProfileUI.generateStats()
                ).dialog('open');
    };

    /**
     * Show the resource gallery, and allow the user to pick from a range of capabilities
     */
    this.showResourceGallery = function() {
        Lifecycle.pauseGame();

        $('#current-profile-class')[0].innerHTML = FiercePlanet.Game.currentProfile.profileClass;
        $('#current-credits')[0].innerHTML = FiercePlanet.Game.currentProfile.credits;
        $('#current-capabilities')[0].innerHTML = FiercePlanet.Game.currentProfile.capabilities.join(", ");

        var accessibleCapabilities = [];
        var purchasableItems = [];

        if (FiercePlanet.profileClass == FiercePlanet.Profile.PROFILE_CLASSES[0]) {
            accessibleCapabilities = FiercePlanet.NOVICE_CAPABILITIES;
        }
        else if (FiercePlanet.profileClass == FiercePlanet.Profile.PROFILE_CLASSES[1]) {
            accessibleCapabilities = FiercePlanet.PLANNER_CAPABILITIES;
        }
        else if (FiercePlanet.profileClass == FiercePlanet.Profile.PROFILE_CLASSES[2]) {
            accessibleCapabilities = FiercePlanet.EXPERT_CAPABILITIES;
        }
        else if (FiercePlanet.profileClass == FiercePlanet.Profile.PROFILE_CLASSES[3]) {
            accessibleCapabilities = FiercePlanet.VISIONARY_CAPABILITIES;
        }
        else if (FiercePlanet.profileClass == FiercePlanet.Profile.PROFILE_CLASSES[4]) {
            accessibleCapabilities = FiercePlanet.GENIUS_CAPABILITIES;
        }
        // TODO: Temporarily enable all capabilities
        accessibleCapabilities = FiercePlanet.GENIUS_CAPABILITIES;


        // Evaluate available capabilities
        var links = $('.purchase');
        for (var i = 0; i < links.length; i++) {
            var purchasableItem = links[i];
            var id = purchasableItem.id;
            var itemName = id.split("-purchase")[0];
            var cost = 0;
            if ($.inArray(itemName, FiercePlanet.PLANNER_CAPABILITIES) > -1) {
                cost = FiercePlanet.Profile.CAPABILITY_COSTS [1];
            }
            else if ($.inArray(itemName, FiercePlanet.EXPERT_CAPABILITIES) > -1) {
                cost = FiercePlanet.Profile.CAPABILITY_COSTS [2];
            }
            else if ($.inArray(itemName, FiercePlanet.VISIONARY_CAPABILITIES) > -1) {
                cost = FiercePlanet.Profile.CAPABILITY_COSTS [3];
            }
            else if ($.inArray(itemName, FiercePlanet.GENIUS_CAPABILITIES) > -1) {
                cost = FiercePlanet.Profile.CAPABILITY_COSTS [4];
            }
            // Make item available for purchase if: (1) the player's level permits it; (2) it is not among existing capabilities and (3) there is enough money
            if ($.inArray(itemName, accessibleCapabilities) > -1 && $.inArray(itemName, FiercePlanet.Game.currentProfile.capabilities) == -1 && cost < FiercePlanet.Game.currentProfile.credits) {
                // Make item purchasable
                purchasableItems.push(purchasableItem);
            }
            else {
//            $('#' + purchasableItem.id).css("border","1px solid white");
            }
        }
        for (var i = 0; i < purchasableItems.length; i++) {
            var purchasableItem = purchasableItems[i];
            var id = purchasableItem.id;
            var itemName = id.split("-purchase")[0];
            var cost = 0;
            if ($.inArray(itemName, FiercePlanet.PLANNER_CAPABILITIES)) {
                cost = FiercePlanet.Profile.CAPABILITY_COSTS [1];
            }
            else if ($.inArray(itemName, FiercePlanet.EXPERT_CAPABILITIES)) {
                cost = FiercePlanet.Profile.CAPABILITY_COSTS [2];
            }
            else if ($.inArray(itemName, FiercePlanet.VISIONARY_CAPABILITIES)) {
                cost = FiercePlanet.Profile.CAPABILITY_COSTS [3];
            }
            else if ($.inArray(itemName, FiercePlanet.GENIUS_CAPABILITIES)) {
                cost = FiercePlanet.Profile.CAPABILITY_COSTS [4];
            }

            purchasableItem.addEventListener('click', function(e) {
                var id = this.id;
                var swatchId = id.split("-purchase")[0];
                var itemName = $('#' + id + '')[0].title;
                if ($.inArray(swatchId, FiercePlanet.Game.currentProfile.capabilities) == -1) {
                    if (confirm('Purchase item "' + itemName + '"?')) {
                        FiercePlanet.Game.currentProfile.credits -= cost;
                        FiercePlanet.Game.currentProfile.capabilities.push(swatchId);
                        $('#current-credits')[0].innerHTML = FiercePlanet.Game.currentProfile.credits;
                        $('#current-capabilities')[0].innerHTML = FiercePlanet.Game.currentProfile.capabilities.join(", ");
                        $('#' + id).removeClass('active');
                        $('#' + id).addClass('inactive');
                    }
                }
                e.stopPropagation();
                return false;
            }, true );
//        purchasableItem.css("border","9px solid red");
//        $('#' + purchasableItem.id).css("border","3px solid white");
            $('#' + purchasableItem.id).removeClass('inactive');
            $('#' + purchasableItem.id).addClass('active');
        }

        FiercePlanet.Dialogs.resourceGalleryDialog.dialog('open');
    };

    /**
     * Shows the Fierce Planet settings
     */
    this.showSettings = function() {
        Lifecycle.pauseGame();
        FiercePlanet.Dialogs.settingsDialog.dialog('open');
    };

    /**
     * Shows the Fierce Planet level gallery
     */
    this.showLevelGallery = function() {
        Lifecycle.pauseGame();
        FiercePlanet.Dialogs.levelGalleryDialog.dialog('open');
    };


    /**
     * Shows the Fierce Planet credits
     */
    this.showCredits = function() {
        Lifecycle.pauseGame();
        FiercePlanet.Dialogs.creditsDialog.dialog('open');
    };

    /**
     * Shows the Fierce Planet login
     */
    this.showLogin = function() {
        Lifecycle.pauseGame();
        FiercePlanet.Dialogs.loginDialog.dialog('open');
    };

}).apply(FiercePlanet.Dialogs);

