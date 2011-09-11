/*!
 * Fierce Planet - Profile
 * Profile related functions
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */



var FiercePlanet = FiercePlanet || {};



/**
 * @namespace Contains profile UI functions
 */
FiercePlanet.ProfileUI = FiercePlanet.ProfileUI || {};

(function() {

    /**
     * Logs out the current user
     */
    this.getProfile = function() {
        $.get('/profile/get', function(res) {
            if (res) {
                FiercePlanet.currentProfile = FiercePlanet.Utils.makeFromJSONObject(res.profile, Profile.prototype);
                FiercePlanet.currentProfile.saved = true;

                // Refresh the capabilities list
                FiercePlanet.GeneralUI.refreshSwatch();

                // Handle resource drag and drop and click interactions
                FiercePlanet.ResourceUI.setupResourceInteraction();

            }
        });
    };
    
    /**
     * Logs out the current user
     */
    this.editProfile = function() {
        FiercePlanet.ProfileUI.getProfile();
        $('#profile-nickname').val(FiercePlanet.currentProfile.nickname);
        $('#profile-profileClass').innerHTML = (FiercePlanet.currentProfile.profileClass);
        $('#profile-progressTowardsNextClass').innerHTML = (FiercePlanet.currentProfile.progressTowardsNextClass);
        $('#profile-credits').innerHTML = (FiercePlanet.currentProfile.credits);
        $('#profile-capabilities').innerHTML = (FiercePlanet.currentProfile.capabilities);
        $('#profile-totalSaved').innerHTML = (FiercePlanet.currentProfile.totalSaved);
        $('#profile-totalExpired').innerHTML = (FiercePlanet.currentProfile.totalExpired);
        $('#profile-totalResourcesSpent').innerHTML = (FiercePlanet.currentProfile.totalResourcesSpent);
        $('#profile-currentScore').innerHTML = (FiercePlanet.currentProfile.currentScore);
        $('#profile-highestScore').innerHTML = (FiercePlanet.currentProfile.highestScore);
        $('#profile-currentLevel').innerHTML = (FiercePlanet.currentProfile.currentLevel);
        $('#profile-highestLevel').innerHTML = (FiercePlanet.currentProfile.highestLevel);
        FiercePlanet.Dialogs.profileDialog.dialog('open');
    };

    /**
     * Loads available settings from local storage
     */
    this.loadProfileSettingsFromStorage = function () {
        FiercePlanet.currentLevelNumber = (localStorage.currentLevelNumber != undefined ? parseInt(localStorage.currentLevelNumber) : FiercePlanet.currentLevelNumber);
        FiercePlanet.currentLevelPreset = (localStorage.currentLevelPreset != undefined ? (localStorage.currentLevelPreset === 'true') : FiercePlanet.currentLevelPreset);
        FiercePlanet.currentScore = (localStorage.currentScore != undefined ? parseInt(localStorage.currentScore) : FiercePlanet.currentScore);
        if (localStorage.currentProfile) {
            var cp = localStorage.currentProfile;
    //        FiercePlanet.currentProfile = JSON.parse(cp);
        }

    };

    /**
     * Stores relevant profile data in local storage
     */
    this.storeProfileData = function() {
        localStorage.currentLevelNumber = FiercePlanet.currentLevelNumber;
        localStorage.currentLevelPreset = FiercePlanet.currentLevel.isPresetLevel;
        localStorage.currentProfile = JSON.stringify(FiercePlanet.currentProfile);
    };


    /**
     * Compiles statistics for this level
     */
    this.serializeProfile = function() {
        return { profile: JSON.stringify(FiercePlanet.currentProfile)};
    };

    /**
     * Saves current capabilities for this profile
     * @param func
     */
    this.saveProfile = function(callback) {
        try {
            $.post("/profile/update", FiercePlanet.ProfileUI.serializeProfile(), function(data) {
                callback(data);
            });
        }
        catch(err) {}
    };

    /**
     * Retrieves high scores
     * @param func
     */
    this.showHighScores = function() {
        $.post("/profiles/high_scores", function(data) {
            console.log(data);
        });
//        if (FiercePlanet.currentProfile.id > -1) {
//            $.post("/profile/update", FiercePlanet.ProfileUI.serializeProfile(), func);
//        }
    };

    /**
     * Saves current capabilities for this profile
     */
    this.saveCapabilities = function() {
        FiercePlanet.ProfileUI.saveProfile(function(data) { Log.info('Saved profile'); });
    };

    /**
     * Generates statistics for the current level
     */
    this.generateStats = function() {
        var stats = "<table>" +
                "<tr>" +
                "<td>Level:</td>" +
                "<td>" + FiercePlanet.currentLevel.id + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>Waves survived:</td>" +
                "<td>" + FiercePlanet.currentWave + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>Score:</td>" +
                "<td>" + FiercePlanet.currentProfile.currentScore + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>Citizens saved:</td>" +
                "<td>" + FiercePlanet.currentProfile.currentLevelSaved + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>Citizens expired:</td>" +
                "<td>" + FiercePlanet.currentProfile.currentLevelExpired + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>Resources spent:</td>" +
                "<td>" + FiercePlanet.currentProfile.currentLevelResourcesSpent + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>Resources remaining:</td>" +
                "<td>" + FiercePlanet.currentProfile.currentLevelResourcesInStore + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td></td>" +
                "<td></td>" +
                "</tr>" +
                "<tr>" +
                "<td>Total saved:</td>" +
                "<td>" + FiercePlanet.currentProfile.gameTotalSaved + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>Total expired:</td>" +
                "<td>" + FiercePlanet.currentProfile.gameTotalExpired + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>Total resources spent:</td>" +
                "<td>" + FiercePlanet.currentProfile.gameTotalResourcesSpent + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>Profile class:</td>" +
                "<td>" + FiercePlanet.currentProfile.profileClass + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>Credits:</td>" +
                "<td><span style='font-weight:bold'>" + FiercePlanet.currentProfile.credits + "</span></td>" +
                "</tr>" +
                "</table>";
        return stats;
    };


}).apply(FiercePlanet.ProfileUI);
