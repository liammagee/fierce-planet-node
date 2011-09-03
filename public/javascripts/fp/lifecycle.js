/*!
 * Fierce Planet - Lifecycle
 * Lifecycle related methods
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */



var FiercePlanet = FiercePlanet || {};



/**
 * @namespace Contains lifecycle functions
 */
FiercePlanet.Lifecycle = FiercePlanet.Lifecycle || {};


(function() {
    /**
     * Called when a game is loaded
     */
    this.loadGame = function() {
        // Load required scripts dynamically
        FiercePlanet.Utils.loadScripts();

        // Load relevant settings, if available
        FiercePlanet.Orientation.adjustParameters(FiercePlanet.Orientation.DEFAULT_WORLD_WIDTH, FiercePlanet.Orientation.DEFAULT_WORLD_HEIGHT);

        // Load relevant settings, if available
        FiercePlanet.ProfileUI.loadProfileSettingsFromStorage();

        // Initialise World settings
        FiercePlanet.Utils.initialiseWorldSettings();

        // Retrieve properties
        World.settings.load();

        // Set up dialogs
        FiercePlanet.Dialogs.setupDialogs();

        // Handle resource drag and drop and click interactions
        FiercePlanet.ResourceUI.initialiseAndLoadResources();

        // Handle resource drag and drop and click interactions
        FiercePlanet.ResourceUI.setupResourceInteraction();

        // Add UI event listeners
        FiercePlanet.GeneralUI.hookUpUIEventListeners();

        // Process settings
        FiercePlanet.Utils.processSettings();

        // Add custom event listeners
        FiercePlanet.Event.hookUpCustomEventListeners();

        // Draw the game
        FiercePlanet.Lifecycle.newLevel();
    };


    /**
     * Called when a new game is commenced
     */
    this.newGame = function() {
        if (FiercePlanet.currentLevelPreset)
            FiercePlanet.currentLevelNumber = 1;
        FiercePlanet.currentProfile.resetScores();
        FiercePlanet.gameCounter = 0;
        FiercePlanet.Lifecycle.newLevel();
    };


    /**
     * Called when a new level is begun
     */
    this.newLevel = function() {
        FiercePlanet.inDesignMode = false;
        FiercePlanet.levelDelayCounter = 0;
        FiercePlanet.levelCounter = 0;
        FiercePlanet.maxLevelMoves = 0;
        FiercePlanet.currentProfile.updateScore();
//    if (FiercePlanet.currentLevel != undefined)
//        FiercePlanet.currentLevel.setResources([]);
        FiercePlanet.currentNotice = null;
        FiercePlanet.recordedLevels = [];
        FiercePlanet.Utils.bindVariables();

        FiercePlanet.Lifecycle._initialiseGame();

        FiercePlanet.currentNotice = FiercePlanet.currentLevel.tip;
        $("#notifications").toggle(World.settings.statusBarVisible);
        FiercePlanet.GeneralUI.notify("Starting level " + FiercePlanet.currentLevel.id + "...");
        if (World.settings.sendEventsToServer)
            FiercePlanet.Comms.notifyServerOfEvent("level", FiercePlanet.currentLevel.id);
        if (! World.settings.hideLevelInfo)
            FiercePlanet.GeneralUI.levelInfo();
    };


    /**
     * Called when a game is restarted
     */
    this.restartLevel = function() {
        // Reset the score
        FiercePlanet.currentProfile.revertScore();

        // Start a new level
        FiercePlanet.Lifecycle.newLevel();
    };



    /**
     * Called when a level is started
     */
    this.startLevel = function() {
        if (World.settings.sendEventsToServer) {
            FiercePlanet.Comms.notifyServerOfEvent("start", null);
        }

        FiercePlanet.Lifecycle._startAudio();
        FiercePlanet.Drawing.animateLevel();
        // Start a new level
        if (World.settings.firstPerson) {
            FiercePlanet.currentLevel.generateAgents(AgentTypes.CITIZEN_AGENT_TYPE, 1);
        }
        else {
            FiercePlanet.Lifecycle.newWave();
        }
    };

    /**
     * Called when a new wave is ready
     */
    this.newWave = function() {
        FiercePlanet.maxWaveMoves = 0;
        FiercePlanet.waveCounter = 0;
        FiercePlanet.waveDelayCounter = 0;
        FiercePlanet.currentProfile.currentLevelSavedThisWave = 0;

        FiercePlanet.currentLevel.generateAgents(AgentTypes.CITIZEN_AGENT_TYPE, FiercePlanet.numAgents);

        FiercePlanet.GeneralUI.notify("New wave coming...");

        FiercePlanet.Drawing.drawEntryPoints();
        FiercePlanet.Drawing.drawExitPoints();
        FiercePlanet.eventTarget.fire(new Event("game", this, "newWave", $fp.levelCounter, FiercePlanet.currentLevel));

        FiercePlanet.Lifecycle._startAgents();
    };


    /**
     * Called when a level is completed
     */
    this.completeWave = function() {
        FiercePlanet.currentWave++;
        FiercePlanet.numAgents++;
        FiercePlanet.Lifecycle._finaliseGame();
    };


    /**
     * Called when a level is completed
     */
    this.completeLevel = function() {
        if (FiercePlanet.currentLevel.teardown)
            FiercePlanet.currentLevel.teardown();
        FiercePlanet.currentProfile.compileProfileStats(FiercePlanet.currentLevel);
        if (FiercePlanet.currentLevel.isPresetLevel)
            FiercePlanet.currentLevelNumber++;
        FiercePlanet.Lifecycle._stopAudio();
        FiercePlanet.Lifecycle._finaliseGame();
        FiercePlanet.Dialogs.showCompleteLevelDialog();
    };


    /**
     * Called when a game is completed
     */
    this.completeGame = function() {
        if (FiercePlanet.currentLevel.teardown)
            FiercePlanet.currentLevel.teardown();
        FiercePlanet.currentProfile.compileProfileStats(FiercePlanet.currentLevel);
        FiercePlanet.Lifecycle._stopAudio();
        FiercePlanet.Lifecycle._finaliseGame();
        FiercePlanet.Dialogs.showCompleteGameDialog();
    };


    /**
     * Called when the game is over
     */
    this.gameOver = function() {
        if (FiercePlanet.currentLevel.teardown)
            FiercePlanet.currentLevel.teardown();
        FiercePlanet.currentProfile.revertScore();
        FiercePlanet.Lifecycle._stopAudio();
        FiercePlanet.Lifecycle._finaliseGame();
        FiercePlanet.Dialogs.showGameOverDialog();
    };


    /**
     * Plays the current game
     */
    this.playGame = function() {
        if (FiercePlanet.inPlay) {
            FiercePlanet.Lifecycle.pauseGame();
        }
        else {
            if (World.settings.sendEventsToServer) {
                FiercePlanet.Comms.notifyServerOfEvent("play", null);
            }
            FiercePlanet.Lifecycle._startAudio();
            $('#playAgents').removeClass('pausing');
            $('#playAgents').addClass('playing');
            if (FiercePlanet.waveCounter == 0)
                FiercePlanet.Lifecycle.newWave();
            else
                FiercePlanet.Lifecycle._startAgents();
        }
    };


    /**
     * Pauses the current game
     */
    this.pauseGame = function() {
        if (!FiercePlanet.inPlay)
            return;
        if (World.settings.sendEventsToServer) {
            FiercePlanet.Comms.notifyServerOfEvent("pause", null);
        }

        FiercePlanet.Lifecycle._stopAudio();
        FiercePlanet.Lifecycle._stopAgents();
    };


    /**
     * Slows down the rate of processing agents
     */
    this.slowDown = function() {
        if (FiercePlanet.interval < 10)
            FiercePlanet.interval += 1;
        else if (FiercePlanet.interval < 100)
            FiercePlanet.interval += 10;
        FiercePlanet.GeneralUI.notify("Now playing at: " + Math.round(1000 / FiercePlanet.interval) + " frames per second.");
        if (FiercePlanet.inPlay)
            FiercePlanet.Lifecycle._startAgents();
    };


    /**
     * Speeds up the rate of processing agents
     */
    this.speedUp = function() {
        if (FiercePlanet.interval > 10)
            FiercePlanet.interval -= 10;
        else if (FiercePlanet.interval > 1)
            FiercePlanet.interval -= 1;
        FiercePlanet.GeneralUI.notify("Now playing at: " + Math.round(1000 / FiercePlanet.interval) + " frames per second.");
        if (FiercePlanet.inPlay)
            FiercePlanet.Lifecycle._startAgents();
    };


    /**
     * Initialises level data
     */
    this._initialiseGame = function () {
        if (typeof console != "undefined")
            console.log("Initialising world...");

        // Stop any existing timers
        FiercePlanet.Lifecycle._stopAgents();

        if (FiercePlanet.currentLevelPreset && (FiercePlanet.currentLevelNumber < 0 || FiercePlanet.currentLevelNumber > 12))
            FiercePlanet.currentLevelNumber = 1;
        if (FiercePlanet.currentLevelPreset) {
            try {
                FiercePlanet.currentLevel = eval("FiercePlanet.PresetLevels.level" + FiercePlanet.currentLevelNumber.toString());
            }
            catch(err) {
                FiercePlanet.currentLevel = eval("FiercePlanet.PresetLevels.level1");
            }
        }
        else if (FiercePlanet.currentLevel == undefined) {
            FiercePlanet.currentLevel = eval("FiercePlanet.PresetLevels.level1");
        }

        if (FiercePlanet.waveOverride > 0) {
            FiercePlanet.currentLevel.waveNumber = (FiercePlanet.waveOverride);
            FiercePlanet.waveOverride = 0;
        }
        FiercePlanet.currentWave = 1;
        FiercePlanet.currentLevel.setCurrentAgents([]);
        FiercePlanet.currentLevel.resetResources();
        if (FiercePlanet.currentLevel.catastrophe != undefined)
            FiercePlanet.currentLevel.catastrophe.struck = false;

        // Start the audio
        FiercePlanet.Lifecycle._stopAudio();

//    score = 0;
        FiercePlanet.currentProfile.resetCurrentStats();
        FiercePlanet.Drawing.refreshGraph();


        FiercePlanet.resourceRecoveryCycle = Math.pow(World.settings.rateOfResourceRecovery, FiercePlanet.levelOfDifficulty - 1);

        FiercePlanet.numAgents = FiercePlanet.currentLevel.initialAgentNumber;
        FiercePlanet.Orientation.cellsAcross = FiercePlanet.currentLevel.cellsAcross;
        FiercePlanet.Orientation.cellsDown = FiercePlanet.currentLevel.cellsDown;
        FiercePlanet.Orientation.cellWidth = Math.round(FiercePlanet.Orientation.worldWidth / FiercePlanet.Orientation.cellsAcross);
        FiercePlanet.Orientation.cellHeight = Math.round(FiercePlanet.Orientation.worldHeight / FiercePlanet.Orientation.cellsDown);
        FiercePlanet.Orientation.pieceWidth = Math.round(FiercePlanet.Orientation.cellWidth * 0.5);
        FiercePlanet.Orientation.pieceHeight = Math.round(FiercePlanet.Orientation.cellHeight * 0.5);
        FiercePlanet.scrollingImage.src = "/images/yellow-rain.png";

        // Set up level
        if (FiercePlanet.currentLevel.setup)
            FiercePlanet.currentLevel.setup();

        // Draw the game
        FiercePlanet.Drawing.drawGame();
    };


    /**
     * Finalises game
     */
    this._finaliseGame = function() {
        FiercePlanet.Lifecycle._stopAgents();
        FiercePlanet.ProfileUI.storeProfileData();
        FiercePlanet.Drawing.drawScoreboard();
    };


    /**
     * Starts the processing of agents
     */
    this._startAgents = function () {
        FiercePlanet.startTime = new Date();
        if (typeof console != "undefined")
            console.log("Starting agents at " + (FiercePlanet.startTime));

        clearInterval(FiercePlanet.agentTimerId);
        FiercePlanet.agentTimerId = setInterval("FiercePlanet.Game.processAgents()", FiercePlanet.interval);
        FiercePlanet.inPlay = true;

        // Make sure button is on pause
        $('#playAgents').removeClass('pausing');
        $('#playAgents').addClass('playing');
    };

    /**
     * Stops the processing of agents
     */
    this._stopAgents = function () {
        FiercePlanet.stopTime = new Date();
        if (typeof console != "undefined")
            console.log("Pausing agents after " + (FiercePlanet.stopTime - FiercePlanet.startTime));

        // Make sure button is on play
        $('#playAgents').removeClass('playing');
        $('#playAgents').addClass('pausing');

        clearInterval(FiercePlanet.agentTimerId);
        FiercePlanet.inPlay = false;
    };

    /**
     * Starts the audio
     */
    this._startAudio = function () {
// Play sound, if any are set
        if (World.settings.soundsPlayable) {
            if (FiercePlanet.audio != undefined) {
                FiercePlanet.audio.play();
            }
            else if (FiercePlanet.currentLevel.soundSrc != undefined) {
                FiercePlanet.audio = new Audio(FiercePlanet.currentLevel.soundSrc);
                FiercePlanet.audio.loop = true;
                FiercePlanet.audio.addEventListener("ended", function() {
                    FiercePlanet.audio.currentTime = 0;
                    FiercePlanet.audio.play();
                }, false);
                FiercePlanet.audio.play();
            }
        }
    };

    /**
     * Stops the audio
     */
    this._stopAudio = function() {
        if (World.settings.soundsPlayable) {
            if (FiercePlanet.audio != undefined)
                FiercePlanet.audio.pause();
        }
    };

}).apply(FiercePlanet.Lifecycle);

/**
 * Called when a game is loaded
 */
FiercePlanet.loadGame = function() {
    // Load relevant settings, if available
    FiercePlanet.Orientation.adjustParameters(FiercePlanet.Orientation.DEFAULT_WORLD_WIDTH, FiercePlanet.Orientation.DEFAULT_WORLD_HEIGHT);

    // Load relevant settings, if available
    FiercePlanet.ProfileUI.loadProfileSettingsFromStorage();

    // Initialise World settings
    FiercePlanet.Utils.initialiseWorldSettings();

    // Retrieve properties
    World.settings.load();

    // Set up dialogs
    FiercePlanet.Dialogs.setupDialogs();

    // Handle resource drag and drop and click interactions
    FiercePlanet.ResourceUI.initialiseAndLoadResources();

    // Handle resource drag and drop and click interactions
    FiercePlanet.ResourceUI.setupResourceInteraction();

    // Add UI event listeners
    FiercePlanet.GeneralUI.hookUpUIEventListeners();

    // Process settings
    FiercePlanet.Utils.processSettings();

    // Add custom event listeners
    FiercePlanet.Event.hookUpCustomEventListeners();

    // Draw the game
    FiercePlanet.newLevel();
};


/**
 * Called when a new game is commenced
 */
FiercePlanet.newGame = function() {
    if (FiercePlanet.currentLevelPreset)
        FiercePlanet.currentLevelNumber = 1;
    FiercePlanet.currentProfile.resetScores();
    FiercePlanet.gameCounter = 0;
    FiercePlanet.newLevel();
};


/**
 * Called when a new level is begun
 */
FiercePlanet.newLevel = function() {
    FiercePlanet.inDesignMode = false;
    FiercePlanet.levelDelayCounter = 0;
    FiercePlanet.levelCounter = 0;
    FiercePlanet.maxLevelMoves = 0;
    FiercePlanet.currentProfile.updateScore();
//    if (FiercePlanet.currentLevel != undefined)
//        FiercePlanet.currentLevel.setResources([]);
    FiercePlanet.currentNotice = null;
    FiercePlanet.recordedLevels = [];
    FiercePlanet.Utils.bindVariables();

    FiercePlanet._initialiseGame();

    FiercePlanet.currentNotice = FiercePlanet.currentLevel.tip;
    $("#notifications").toggle(World.settings.statusBarVisible);
    FiercePlanet.GeneralUI.notify("Starting level " + FiercePlanet.currentLevel.id + "...");
    if (World.settings.sendEventsToServer)
        FiercePlanet.Comms.notifyServerOfEvent("level", FiercePlanet.currentLevel.id);
    if (! World.settings.hideLevelInfo)
        FiercePlanet.GeneralUI.levelInfo();
};


/**
 * Called when a game is restarted
 */
FiercePlanet.restartLevel = function() {
    // Reset the score
    FiercePlanet.currentProfile.revertScore();

    // Start a new level
    FiercePlanet.newLevel();
};



/**
 * Called when a level is started
 */
FiercePlanet.startLevel = function() {
    if (World.settings.sendEventsToServer) {
        FiercePlanet.Comms.notifyServerOfEvent("start", null);
    }

    FiercePlanet._startAudio();
    FiercePlanet.Drawing.animateLevel();
    // Start a new level
    if (World.settings.firstPerson) {
        FiercePlanet.currentLevel.generateAgents(AgentTypes.CITIZEN_AGENT_TYPE, 1);
    }
    else {
        FiercePlanet.newWave();
    }
};

/**
 * Called when a new wave is ready
 */
FiercePlanet.newWave = function() {
    FiercePlanet.maxWaveMoves = 0;
    FiercePlanet.waveCounter = 0;
    FiercePlanet.waveDelayCounter = 0;
    FiercePlanet.currentProfile.currentLevelSavedThisWave = 0;

    FiercePlanet.currentLevel.generateAgents(AgentTypes.CITIZEN_AGENT_TYPE, FiercePlanet.numAgents);

    FiercePlanet.GeneralUI.notify("New wave coming...");

    FiercePlanet.Drawing.drawEntryPoints();
    FiercePlanet.Drawing.drawExitPoints();
    FiercePlanet.eventTarget.fire(new Event("game", this, "newWave", $fp.levelCounter, FiercePlanet.currentLevel));

    FiercePlanet._startAgents();
};


/**
 * Called when a level is completed
 */
FiercePlanet.completeWave = function() {
    FiercePlanet.currentWave++;
    FiercePlanet.numAgents++;
    FiercePlanet._finaliseGame();
};


/**
 * Called when a level is completed
 */
FiercePlanet.completeLevel = function() {
    if (FiercePlanet.currentLevel.teardown)
        FiercePlanet.currentLevel.teardown();
    FiercePlanet.currentProfile.compileProfileStats(FiercePlanet.currentLevel);
    if (FiercePlanet.currentLevel.isPresetLevel)
        FiercePlanet.currentLevelNumber++;
    FiercePlanet._stopAudio();
    FiercePlanet._finaliseGame();
    FiercePlanet.Dialogs.showCompleteLevelDialog();
};


/**
 * Called when a game is completed
 */
FiercePlanet.completeGame = function() {
    if (FiercePlanet.currentLevel.teardown)
        FiercePlanet.currentLevel.teardown();
    FiercePlanet.currentProfile.compileProfileStats(FiercePlanet.currentLevel);
    FiercePlanet._stopAudio();
    FiercePlanet._finaliseGame();
    FiercePlanet.Dialogs.showCompleteGameDialog();
};


/**
 * Called when the game is over
 */
FiercePlanet.gameOver = function() {
    if (FiercePlanet.currentLevel.teardown)
        FiercePlanet.currentLevel.teardown();
    FiercePlanet.currentProfile.revertScore();
    FiercePlanet._stopAudio();
    FiercePlanet._finaliseGame();
    FiercePlanet.Dialogs.showGameOverDialog();
};


/**
 * Plays the current game
 */
FiercePlanet.playGame = function() {
    if (FiercePlanet.inPlay) {
        FiercePlanet.pauseGame();
    }
    else {
        if (World.settings.sendEventsToServer) {
            FiercePlanet.Comms.notifyServerOfEvent("play", null);
        }
        FiercePlanet._startAudio();
        $('#playAgents').removeClass('pausing');
        $('#playAgents').addClass('playing');
        if (FiercePlanet.waveCounter == 0)
            FiercePlanet.newWave();
        else
            FiercePlanet._startAgents();
    }
};


/**
 * Pauses the current game
 */
FiercePlanet.pauseGame = function() {
    if (!FiercePlanet.inPlay)
        return;
    if (World.settings.sendEventsToServer) {
        FiercePlanet.Comms.notifyServerOfEvent("pause", null);
    }

    FiercePlanet._stopAudio();
    FiercePlanet._stopAgents();
};


/**
 * Slows down the rate of processing agents
 */
FiercePlanet.slowDown = function() {
    if (FiercePlanet.interval < 10)
        FiercePlanet.interval += 1;
    else if (FiercePlanet.interval < 100)
        FiercePlanet.interval += 10;
    FiercePlanet.GeneralUI.notify("Now playing at: " + Math.round(1000 / FiercePlanet.interval) + " frames per second.");
    if (FiercePlanet.inPlay)
        FiercePlanet._startAgents();
};


/**
 * Speeds up the rate of processing agents
 */
FiercePlanet.speedUp = function() {
    if (FiercePlanet.interval > 10)
        FiercePlanet.interval -= 10;
    else if (FiercePlanet.interval > 1)
        FiercePlanet.interval -= 1;
    FiercePlanet.GeneralUI.notify("Now playing at: " + Math.round(1000 / FiercePlanet.interval) + " frames per second.");
    if (FiercePlanet.inPlay)
        FiercePlanet._startAgents();
};


/**
 * Initialises level data
 */
FiercePlanet._initialiseGame = function () {
    if (typeof console != "undefined")
        console.log("Initialising world...");

    // Stop any existing timers
    FiercePlanet._stopAgents();

    if (FiercePlanet.currentLevelPreset && (FiercePlanet.currentLevelNumber < 0 || FiercePlanet.currentLevelNumber > 12))
        FiercePlanet.currentLevelNumber = 1;
    if (FiercePlanet.currentLevelPreset) {
        try {
            FiercePlanet.currentLevel = eval("FiercePlanet.PresetLevels.level" + FiercePlanet.currentLevelNumber.toString());
        }
        catch(err) {
            FiercePlanet.currentLevel = eval("FiercePlanet.PresetLevels.level1");
        }
    }
    else if (FiercePlanet.currentLevel == undefined) {
        FiercePlanet.currentLevel = eval("FiercePlanet.PresetLevels.level1");
    }

    if (FiercePlanet.waveOverride > 0) {
        FiercePlanet.currentLevel.waveNumber = (FiercePlanet.waveOverride);
        FiercePlanet.waveOverride = 0;
    }
    FiercePlanet.currentWave = 1;
    FiercePlanet.currentLevel.setCurrentAgents([]);
    FiercePlanet.currentLevel.resetResources();
    if (FiercePlanet.currentLevel.catastrophe != undefined)
        FiercePlanet.currentLevel.catastrophe.struck = false;

    // Start the audio
    FiercePlanet._stopAudio();

//    score = 0;
    FiercePlanet.currentProfile.resetCurrentStats();
    FiercePlanet.Drawing.refreshGraph();


    FiercePlanet.resourceRecoveryCycle = Math.pow(World.settings.rateOfResourceRecovery, FiercePlanet.levelOfDifficulty - 1);

    FiercePlanet.numAgents = FiercePlanet.currentLevel.initialAgentNumber;
    FiercePlanet.Orientation.cellsAcross = FiercePlanet.currentLevel.cellsAcross;
    FiercePlanet.Orientation.cellsDown = FiercePlanet.currentLevel.cellsDown;
    FiercePlanet.Orientation.cellWidth = Math.round(FiercePlanet.Orientation.worldWidth / FiercePlanet.Orientation.cellsAcross);
    FiercePlanet.Orientation.cellHeight = Math.round(FiercePlanet.Orientation.worldHeight / FiercePlanet.Orientation.cellsDown);
    FiercePlanet.Orientation.pieceWidth = Math.round(FiercePlanet.Orientation.cellWidth * 0.5);
    FiercePlanet.Orientation.pieceHeight = Math.round(FiercePlanet.Orientation.cellHeight * 0.5);
    FiercePlanet.scrollingImage.src = "/images/yellow-rain.png";

    // Set up level
    if (FiercePlanet.currentLevel.setup)
        FiercePlanet.currentLevel.setup();

    // Draw the game
    FiercePlanet.Drawing.drawGame();
};


/**
 * Finalises game
 */
FiercePlanet._finaliseGame = function() {
    FiercePlanet._stopAgents();
    FiercePlanet.ProfileUI.storeProfileData();
    FiercePlanet.Drawing.drawScoreboard();
};


/**
 * Starts the processing of agents
 */
FiercePlanet._startAgents = function () {
    FiercePlanet.startTime = new Date();
    if (typeof console != "undefined")
        console.log("Starting agents at " + (FiercePlanet.startTime));

    clearInterval(FiercePlanet.agentTimerId);
    FiercePlanet.agentTimerId = setInterval("FiercePlanet.Game.processAgents()", FiercePlanet.interval);
    FiercePlanet.inPlay = true;

    // Make sure button is on pause
    $('#playAgents').removeClass('pausing');
    $('#playAgents').addClass('playing');
};

/**
 * Stops the processing of agents
 */
FiercePlanet._stopAgents = function () {
    FiercePlanet.stopTime = new Date();
    if (typeof console != "undefined")
        console.log("Pausing agents after " + (FiercePlanet.stopTime - FiercePlanet.startTime));

    // Make sure button is on play
    $('#playAgents').removeClass('playing');
    $('#playAgents').addClass('pausing');

    clearInterval(FiercePlanet.agentTimerId);
    FiercePlanet.inPlay = false;
};

/**
 * Starts the audio
 */
FiercePlanet._startAudio = function () {
// Play sound, if any are set
    if (World.settings.soundsPlayable) {
        if (FiercePlanet.audio != undefined) {
            FiercePlanet.audio.play();
        }
        else if (FiercePlanet.currentLevel.soundSrc != undefined) {
            FiercePlanet.audio = new Audio(FiercePlanet.currentLevel.soundSrc);
            FiercePlanet.audio.loop = true;
            FiercePlanet.audio.addEventListener("ended", function() {
                FiercePlanet.audio.currentTime = 0;
                FiercePlanet.audio.play();
            }, false);
            FiercePlanet.audio.play();
        }
    }
};

/**
 * Stops the audio
 */
FiercePlanet._stopAudio = function() {
    if (World.settings.soundsPlayable) {
        if (FiercePlanet.audio != undefined)
            FiercePlanet.audio.pause();
    }
};
