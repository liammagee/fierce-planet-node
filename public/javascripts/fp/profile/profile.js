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

    this.highestWorld = 0;
    this.highestScore = 0;
    this.totalWorlds = 0;

    this.totalSaved = 0;
    this.totalExpired = 0;
    this.totalResourcesSpent = 0;
    this.totalResourcesSpentByCategory = {};
    this.aveSaved = 0;
    this.aveExpired = 0;
    this.aveResourcesSpent = 0;
    this.aveResourcesSpentByCategory = {};


    // Game statistics - must be reset every new game
    this.gameTotalWorlds = 0;
    this.gameHighestWorld = 0;
    this.gameScore = 0;

    this.gameTotalSaved = 0;
    this.gameTotalExpired = 0;
    this.gameTotalResourcesSpent = 0;
    this.gameTotalResourcesSpentByCategory = {};
    this.gameAveSaved = 0;
    this.gameAveExpired = 0;
    this.gameAveResourcesSpent = 0;
    this.gameAveResourcesSpentByCategory = {};


    // World statistics
    this.currentWorld = 1;
    this.currentWorldIsPreset = true;
    this.currentScore = 0;
    this.currentWorldWaves = 0;
    this.currentWorldSavedThisWave = 0;

    this.currentWorldSaved = 0;
    this.currentWorldExpired = 0;
    this.currentWorldResourcesInStore = FiercePlanet.Profile.STARTING_STORE;
    this.currentWorldResourcesSpent = 0;
    this.currentWorldResourcesSpentByCategory = {};
}


/**
 * Initialises the Profile's non-persistent properties
 */
Profile.prototype._initialise = function() {
    this.currentWorldSaved = this.currentWorldSaved || 0;
    // TODO: These reference the FiercePlanet namespace
    this.currentWorldResourcesInStore = this.currentWorldResourcesInStore || FiercePlanet.Profile.Game.STARTING_STORE;
};


/**
 * Resets the current statistics 
 */
Profile.prototype.resetCurrentStats = function() {
    this.currentWorldSaved = 0;
    this.currentWorldExpired = 0;

    this.currentWorldResourcesInStore = Lifecycle.currentWorld.initialResourceStore || FiercePlanet.Profile.STARTING_STORE;
    this.currentWorldResourcesSpent = 0;
    this.currentWorldResourcesSpentByCategory = {};
    for (var i = 0; i < ModuleManager.currentModule.resourceSet.categories.length; i++) {
        var category = ModuleManager.currentModule.resourceSet.categories[i];
        this.currentWorldResourcesSpentByCategory[category.code] = 0;
    }
};


/**
 * Initialises the Profile's non-persistent properties
 */
Profile.prototype.initialiseResourceStore = function(initialStore) {
    this.currentWorldResourcesInStore = initialStore || FiercePlanet.Profile.STARTING_STORE;
};



/**
 * Compiles statistics for the current world
 */
Profile.prototype.compileProfileStats = function(currentWorld) {
    // Update world data
    this.currentWorld = currentWorld._id || this.currentWorld;
    this.currentWorldIsPreset = currentWorld.isPresetWorld || this.currentWorldIsPreset;

    // Update world data

    // Update game data
    if (this.gameHighestWorld < this.currentWorld)
        this.gameHighestWorld = this.currentWorld;
    if (this.gameScore < this.currentScore)
        this.gameScore = this.currentScore;
    this.gameTotalWorlds ++;
    this.gameTotalSaved += this.currentWorldSaved;
    this.gameTotalExpired += this.currentWorldExpired;
    this.gameTotalResourcesSpent += this.currentWorldResourcesSpent;
    this.gameAveSaved = this.gameTotalSaved / this.gameTotalWorlds;
    this.gameAveExpired = this.gameTotalExpired / this.gameTotalWorlds;
    this.gameAveResourcesSpent = this.gameTotalResourcesSpent / this.gameTotalWorlds;
    var ks = Object.keys(this.currentWorldResourcesSpentByCategory);
    for (var i = 0; i < ks.length; i++) {
        var key = ks[i];
        var current_world_count = this.currentWorldResourcesSpentByCategory[key];
        var game_count = this.gameTotalResourcesSpentByCategory[key] || 0;
        game_count += current_world_count;
        this.gameTotalResourcesSpentByCategory[key] = game_count;
        this.gameAveResourcesSpentByCategory[key] = game_count / this.gameTotalWorlds;
    }


    // Update profile data
    if (this.highestScore < this.currentScore)
        this.highestScore = this.currentScore;
    if (this.highestWorld < this.currentWorld)
        this.highestWorld = this.currentWorld;
    this.credits += this.currentWorldResourcesInStore;
    this.totalWorlds ++;
    this.totalSaved += this.currentWorldSaved;
    this.totalExpired += this.currentWorldExpired;
    this.totalResourcesSpent += this.currentWorldResourcesSpent;
    this.aveSaved = this.totalSaved / this.totalWorlds;
    this.aveExpired = this.totalExpired / this.totalWorlds;
    this.aveResourcesSpent = this.totalResourcesSpent / this.totalWorlds;
    for (var i = 0; i < ks.length; i++) {
        var key = ks[i];
        var current_world_count = this.currentWorldResourcesSpentByCategory[key];
        var total_count = this.totalResourcesSpentByCategory[key] || 0;
        total_count += current_world_count;
        this.totalResourcesSpentByCategory[key] = total_count;
        this.aveResourcesSpentByCategory[key] = total_count / this.totalWorlds;
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
    this.currentWorldSaved++;
    this.currentWorldSavedThisWave++;
    var resource_bonus = (currentWave < 5 ? 4 : (currentWave < 10 ? 3 : (currentWave < 20 ? 2 : 1)));
    this.currentWorldResourcesInStore += resource_bonus;
};



/**
 * Updates statistics based on a spent resource
 */
Profile.prototype.spendResource = function(resource) {
    var resourceCategory = resource.category.code;
    this.currentWorldResourcesInStore -= resource.cost;
    this.currentWorldResourcesSpent += resource.cost;
    this.currentWorldResourcesSpentByCategory[resourceCategory] += 1;
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

if (typeof exports !== "undefined")
    exports.Profile = Profile;
