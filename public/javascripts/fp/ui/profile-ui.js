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
        try {
            $.get('/profile/get', function(res) {
                if (res && res.currentScore) {
                    FiercePlanet.Game.currentProfile = FiercePlanet.Utils.makeFromJSONObject(res.profile, Profile.prototype);
                    FiercePlanet.Game.currentProfile.saved = true;

                    // Refresh the capabilities list
                    FiercePlanet.GeneralUI.refreshSwatch();

                    // Handle resource drag and drop and click interactions
                    FiercePlanet.ResourceUI.setupResourceInteraction();

                }
            });
        }
        catch (e) {}
    };
    
    /**
     * Logs out the current user
     */
    this.editProfile = function() {
        FiercePlanet.ProfileUI.getProfile();
        $('#profile-nickname').val(FiercePlanet.Game.currentProfile.nickname);
        $('#profile-profileClass').innerHTML = (FiercePlanet.Game.currentProfile.profileClass);
        $('#profile-progressTowardsNextClass').innerHTML = (FiercePlanet.Game.currentProfile.progressTowardsNextClass);
        $('#profile-credits').innerHTML = (FiercePlanet.Game.currentProfile.credits);
        $('#profile-capabilities').innerHTML = (FiercePlanet.Game.currentProfile.capabilities);
        $('#profile-totalSaved').innerHTML = (FiercePlanet.Game.currentProfile.totalSaved);
        $('#profile-totalExpired').innerHTML = (FiercePlanet.Game.currentProfile.totalExpired);
        $('#profile-totalResourcesSpent').innerHTML = (FiercePlanet.Game.currentProfile.totalResourcesSpent);
        $('#profile-currentScore').innerHTML = (FiercePlanet.Game.currentProfile.currentScore);
        $('#profile-highestScore').innerHTML = (FiercePlanet.Game.currentProfile.highestScore);
        $('#profile-currentWorld').innerHTML = (FiercePlanet.Game.currentProfile.currentWorld);
        $('#profile-highestWorld').innerHTML = (FiercePlanet.Game.currentProfile.highestWorld);
        FiercePlanet.Dialogs.profileDialog.dialog('open');
    };

    /**
     * Loads available settings from local storage
     */
    this.loadProfileSettingsFromStorage = function () {
        Lifecycle.currentWorldNumber = (localStorage.currentWorldNumber != undefined ? parseInt(localStorage.currentWorldNumber) : Lifecycle.currentWorldNumber);
        Lifecycle.currentWorldPreset = (localStorage.currentWorldPreset != undefined ? (localStorage.currentWorldPreset === 'true') : Lifecycle.currentWorldPreset);
        FiercePlanet.Game.currentScore = (localStorage.currentScore != undefined ? parseInt(localStorage.currentScore) : FiercePlanet.Game.currentScore);
        if (localStorage.currentProfile) {
            var cp = localStorage.currentProfile;
    //        FiercePlanet.Game.currentProfile = JSON.parse(cp);
        }

    };

    /**
     * Stores relevant profile data in local storage
     */
    this.storeProfileData = function() {
        try {
            localStorage.currentWorldNumber = Lifecycle.currentWorldNumber;
            if (Lifecycle.currentCampaignID)
                localStorage.currentCampaignID = Lifecycle.currentCampaignID;
            if (Lifecycle.currentWorld)
                localStorage.currentWorldPreset = Lifecycle.currentWorld.isPresetWorld;
            //localStorage.currentProfile = JSON.stringify(FiercePlanet.Game.currentProfile);
        }
        catch (e) {
            // An 'QUOTA_EXCEEDED_ERR' is thrown on iPad (iOS 5)
            // See http://stackoverflow.com/questions/9077101/iphone-localstorage-quota-exceeded-err-issue
        }
    };


    /**
     * Compiles statistics for this world
     */
    this.serializeProfile = function() {
        return { profile: JSON.stringify(FiercePlanet.Game.currentProfile)};
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
//        if (FiercePlanet.Game.currentProfile.id > -1) {
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
     * Generates statistics for the current world
     */
    this.generateStats = function() {
        var stats = "<table>" +
                "<tr>" +
                "<td>World:</td>" +
                "<td>" + Lifecycle.currentWorld.id + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>Waves survived:</td>" +
                "<td>" + FiercePlanet.Game.currentWave + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>Score:</td>" +
                "<td>" + FiercePlanet.Game.currentProfile.currentScore + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>Citizens saved:</td>" +
                "<td>" + FiercePlanet.Game.currentProfile.currentWorldSaved + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>Citizens expired:</td>" +
                "<td>" + FiercePlanet.Game.currentProfile.currentWorldExpired + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>Resources spent:</td>" +
                "<td>" + FiercePlanet.Game.currentProfile.currentWorldResourcesSpent + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>Resources remaining:</td>" +
                "<td>" + FiercePlanet.Game.currentProfile.currentWorldResourcesInStore + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td></td>" +
                "<td></td>" +
                "</tr>" +
                "<tr>" +
                "<td>Total saved:</td>" +
                "<td>" + FiercePlanet.Game.currentProfile.gameTotalSaved + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>Total expired:</td>" +
                "<td>" + FiercePlanet.Game.currentProfile.gameTotalExpired + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>Total resources spent:</td>" +
                "<td>" + FiercePlanet.Game.currentProfile.gameTotalResourcesSpent + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>Profile class:</td>" +
                "<td>" + FiercePlanet.Game.currentProfile.profileClass + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td>Credits:</td>" +
                "<td><span style='font-weight:bold'>" + FiercePlanet.Game.currentProfile.credits + "</span></td>" +
                "</tr>" +
                "</table>";
        return stats;
    };


}).apply(FiercePlanet.ProfileUI);
