/*!
 * Fierce Planet - Profile
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


/**
 * @namespace Holds functionality related to FiercePlanet
 */
var FiercePlanet = FiercePlanet || {};
FiercePlanet.Profile = FiercePlanet.Profile || {};

/** @constant The list of available profile classes */
FiercePlanet.Profile.PROFILE_CLASSES = ["Novice", "Planner", "Expert", "Visionary", "Genius"];
/** @constant The scores at which the profile class is incremented */
FiercePlanet.Profile.PROFILE_UPGRADE_SCORES = [500, 1000, 2500, 5000, 0];
/** @constant The costs of obtaining capabilities related to each profile class */
FiercePlanet.Profile.CAPABILITY_COSTS = [0, 100, 200, 300, 500];

FiercePlanet.Profile.NOVICE_CAPABILITIES = ["farm", "water", "clinic"];
FiercePlanet.Profile.PLANNER_CAPABILITIES = FiercePlanet.Profile.NOVICE_CAPABILITIES.concat(["shop", "park", "school"]);
FiercePlanet.Profile.EXPERT_CAPABILITIES = FiercePlanet.Profile.PLANNER_CAPABILITIES.concat(["bank", "air", "legal"]);
FiercePlanet.Profile.VISIONARY_CAPABILITIES = FiercePlanet.Profile.EXPERT_CAPABILITIES.concat(["factory", "energy", "democracy"]);
FiercePlanet.Profile.GENIUS_CAPABILITIES = FiercePlanet.Profile.VISIONARY_CAPABILITIES.concat(["stockmarket", "biodiversity", "festival"]);
FiercePlanet.Profile.STARTING_STORE = 0;

/**
 * Defines a user Profile.
 * (Note that properties use a Ruby rather than Java convention, for Rails + JSON compatibility)
 * @constructor
 */
function Profile() {
    // Profile-level properties, defining current class, capabilities and credits
    this.saved = false;
    this.id = -1;
    this.profileClass = FiercePlanet.Profile.PROFILE_CLASSES[0];
    this.capabilities = FiercePlanet.Profile.NOVICE_CAPABILITIES;
    this.progressTowardsNextClass = 0;
    this.status = '';
    this.credits = 0;

    this.highestLevel = 0;
    this.highestScore = 0;
    this.totalLevels = 0;

    this.totalSaved = 0;
    this.totalExpired = 0;
    this.totalResourcesSpent = 0;
    this.totalResourcesSpentByCategory = {};
    this.aveSaved = 0;
    this.aveExpired = 0;
    this.aveResourcesSpent = 0;
    this.aveResourcesSpentByCategory = {};


    // Game statistics - must be reset every new game
    this.gameTotalLevels = 0;
    this.gameHighestLevel = 0;
    this.gameScore = 0;

    this.gameTotalSaved = 0;
    this.gameTotalExpired = 0;
    this.gameTotalResourcesSpent = 0;
    this.gameTotalResourcesSpentByCategory = {};
    this.gameAveSaved = 0;
    this.gameAveExpired = 0;
    this.gameAveResourcesSpent = 0;
    this.gameAveResourcesSpentByCategory = {};


    // Level statistics
    this.currentLevel = 1;
    this.currentLevelIsPreset = true;
    this.currentScore = 0;
    this.currentLevelWaves = 0;
    this.currentLevelSavedThisWave = 0;

    this.currentLevelSaved = 0;
    this.currentLevelExpired = 0;
    this.currentLevelResourcesInStore = FiercePlanet.Profile.STARTING_STORE;
    this.currentLevelResourcesSpent = 0;
    this.currentLevelResourcesSpentByCategory = {};
}


/**
 * Initialises the Profile's non-persistent properties
 */
Profile.prototype._initialise = function() {
    this.currentLevelSaved = this.currentLevelSaved || 0;
    // TODO: These reference the FiercePlanet namespace
    this.currentLevelResourcesInStore = this.currentLevelResourcesInStore || FiercePlanet.Profile.Game.STARTING_STORE;
};


/**
 * Resets the current statistics 
 */
Profile.prototype.resetCurrentStats = function(initialStore) {
    this.currentLevelSaved = 0;
    this.currentLevelExpired = 0;

    this.currentLevelResourcesInStore = FiercePlanet.Game.currentLevel.initialResourceStore || FiercePlanet.Profile.STARTING_STORE;
    this.currentLevelResourcesSpent = 0;
    this.currentLevelResourcesSpentByCategory = {};
    for (var i = 0; i < World.resourceCategories.length; i++) {
        var category = World.resourceCategories[i];
        this.currentLevelResourcesSpentByCategory[category.code] = 0;
    }
};


/**
 * Initialises the Profile's non-persistent properties
 */
Profile.prototype.initialiseResourceStore = function(initialStore) {
    this.currentLevelResourcesInStore = initialStore || FiercePlanet.Profile.STARTING_STORE;
};



/**
 * Compiles statistics for the current level
 */
Profile.prototype.compileProfileStats = function(currentLevel) {
    // Update level data
    this.currentLevel = currentLevel._id || this.currentLevel;
    this.currentLevelIsPreset = currentLevel.isPresetLevel || this.currentLevelIsPreset;

    // Update level data

    // Update game data
    if (this.gameHighestLevel < this.currentLevel)
        this.gameHighestLevel = this.currentLevel;
    if (this.gameScore < this.currentScore)
        this.gameScore = this.currentScore;
    this.gameTotalLevels ++;
    this.gameTotalSaved += this.currentLevelSaved;
    this.gameTotalExpired += this.currentLevelExpired;
    this.gameTotalResourcesSpent += this.currentLevelResourcesSpent;
    this.gameAveSaved = this.gameTotalSaved / this.gameTotalLevels;
    this.gameAveExpired = this.gameTotalExpired / this.gameTotalLevels;
    this.gameAveResourcesSpent = this.gameTotalResourcesSpent / this.gameTotalLevels;
    var ks = Object.keys(this.currentLevelResourcesSpentByCategory);
    for (var i = 0; i < ks.length; i++) {
        var key = ks[i];
        var current_level_count = this.currentLevelResourcesSpentByCategory[key];
        var game_count = this.gameTotalResourcesSpentByCategory[key] || 0;
        game_count += current_level_count;
        this.gameTotalResourcesSpentByCategory[key] = game_count;
        this.gameAveResourcesSpentByCategory[key] = game_count / this.gameTotalLevels;
    }


    // Update profile data
    if (this.highestScore < this.currentScore)
        this.highestScore = this.currentScore;
    if (this.highestLevel < this.currentLevel)
        this.highestLevel = this.currentLevel;
    this.credits += this.currentLevelResourcesInStore;
    this.totalLevels ++;
    this.totalSaved += this.currentLevelSaved;
    this.totalExpired += this.currentLevelExpired;
    this.totalResourcesSpent += this.currentLevelResourcesSpent;
    this.aveSaved = this.totalSaved / this.totalLevels;
    this.aveExpired = this.totalExpired / this.totalLevels;
    this.aveResourcesSpent = this.totalResourcesSpent / this.totalLevels;
    for (var i = 0; i < ks.length; i++) {
        var key = ks[i];
        var current_level_count = this.currentLevelResourcesSpentByCategory[key];
        var total_count = this.totalResourcesSpentByCategory[key] || 0;
        total_count += current_level_count;
        this.totalResourcesSpentByCategory[key] = total_count;
        this.aveResourcesSpentByCategory[key] = total_count / this.totalLevels;
    }

    this.evaluateProfileClass();

};




/**
 * Reverts the current profile score to the previous game score
 */
Profile.prototype.resetScores = function() {
    this.currentScore = this.gameScore = 0;
};



/**
 * Reverts the current profile score to the previous game score
 */
Profile.prototype.revertScore = function() {
    this.currentScore = this.gameScore;
};


/**
 * Updates the current profile score 
 */
Profile.prototype.updateScore = function() {
    this.gameScore = this.currentScore;
};




/**
 * Reverts the current profile score to the previous game score
 */
Profile.prototype.processSavedAgent = function(currentWave) {
    this.currentScore += FiercePlanet.Game.SAVE_SCORE;
    this.currentLevelSaved++;
    this.currentLevelSavedThisWave++;
    var resource_bonus = (currentWave < 5 ? 4 : (currentWave < 10 ? 3 : (currentWave < 20 ? 2 : 1)));
    this.currentLevelResourcesInStore += resource_bonus;
};



/**
 * Updates statistics based on a spent resource
 */
Profile.prototype.spendResource = function(resource) {
    var resourceCategory = resource.category.code;
    this.currentLevelResourcesInStore -= resource.cost;
    this.currentLevelResourcesSpent += resource.cost;
    this.currentLevelResourcesSpentByCategory[resourceCategory] += 1;
};


/**
 * Adjust the profile class, based on the total number of agents saved
 */
Profile.prototype.evaluateProfileClass = function() {
    if (this.totalSaved > FiercePlanet.Profile.PROFILE_UPGRADE_SCORES[3]) {
        this.profileClass = FiercePlanet.Profile.PROFILE_CLASSES[4];
        this.progressTowardsNextClass = FiercePlanet.Profile.PROFILE_UPGRADE_SCORES[0];
    }
    else if (this.totalSaved > FiercePlanet.Profile.PROFILE_UPGRADE_SCORES[2]) {
        this.profileClass = FiercePlanet.Profile.PROFILE_CLASSES[3];
        this.progressTowardsNextClass = FiercePlanet.Profile.PROFILE_UPGRADE_SCORES[3] - this.totalSaved;
    }
    else if (this.totalSaved > FiercePlanet.Profile.PROFILE_UPGRADE_SCORES[1]) {
        this.profileClass = FiercePlanet.Profile.PROFILE_CLASSES[2];
        this.progressTowardsNextClass = FiercePlanet.Profile.PROFILE_UPGRADE_SCORES[2] - this.totalSaved;
    }
    else if (this.totalSaved > FiercePlanet.Profile.PROFILE_UPGRADE_SCORES[0]) {
        this.profileClass = FiercePlanet.Profile.PROFILE_CLASSES[1];
        this.progressTowardsNextClass = FiercePlanet.Profile.PROFILE_UPGRADE_SCORES[1] - this.totalSaved;
    }
    else {
        this.progressTowardsNextClass = FiercePlanet.Profile.PROFILE_UPGRADE_SCORES[0] - this.totalSaved;
    }
};

/**
 * Add functions to JSON-restored object
 */
Profile.makeProfile = function(proxyProfile) {
    proxyProfile.evaluateProfileClass = Profile.prototype.evaluateProfileClass;

    proxyProfile.spendResource = Profile.prototype.spendResource;
    proxyProfile.processSavedAgent = Profile.prototype.processSavedAgent;
    proxyProfile.updateScore = Profile.prototype.updateScore;
    proxyProfile.revertScore = Profile.prototype.revertScore;
    proxyProfile.resetScores = Profile.prototype.resetScores;
    proxyProfile.updateScore = Profile.prototype.updateScore;
    proxyProfile.initialiseResourceStore = Profile.prototype.initialiseResourceStore;
    proxyProfile.resetCurrentStats = Profile.prototype.resetCurrentStats;
    proxyProfile.compileProfileStats = Profile.prototype.compileProfileStats;

    proxyProfile._initialise = Profile.prototype._initialise;
    proxyProfile._initialise();

};

if (typeof(exports) != "undefined")
    exports.Profile = Profile;
