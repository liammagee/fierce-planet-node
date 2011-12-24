/*!
 * Fierce Planet - GeneralUI
 * General UI functions
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var FiercePlanet = FiercePlanet || {};


/**
 * @namespace Contains generic UI functions
 */
FiercePlanet.LevelGallery = FiercePlanet.LevelGallery || {};

(function() {

    /**
     * Initialise level gallery
     */
    this.init = function() {
        $('#difficulty-input-' + FiercePlanet.Game.levelOfDifficulty).attr('checked', 'checked');
        $(".difficultyInput").click(FiercePlanet.LevelGallery.changeDifficulty);
        var tnID = 'tn-' + Lifecycle.currentLevelSetID + '-' + Lifecycle.currentLevelNumber;
        FiercePlanet.LevelGallery.highlightGalleryItem(tnID, Lifecycle.currentLevelNumber);
    };

    /**
     * Renders modules and levels in the level gallery
     */
    this.renderCampaigns = function() {
        var campaigns = ModuleManager.currentModule.allCampaigns();
        for (var i = 0, l = campaigns.length; i < l; i++) {
            var campaign = campaigns[i];
            $('#level-gallery-tabs>ul').prepend('<li><a href="#' + campaign.id + '"> ' + campaign.name + '</a></li>');
            var modHTML = $('<div class="quests" id="' + campaign.id + '"></div>');
            var tnHTML = $('<div class="thumbnails"></div>');
            $('#level-gallery-tabs').append(modHTML);
            modHTML.append(tnHTML);
            for (var j in campaign.levels) {
                var level = campaign.levels[j];
                var img = (level.thumbnail ? level.thumbnail : '/images/levels/level-thumbnail-default.png');
                var thumbnail = $('<div class="thumbnail" id="'
                    + 'tn-' + i + '-' + j
                    + '">'
                    + '<img src="'
                    + img
                    + '"/>'
                    + '<div><strong>Level ' + j + ':</strong>'
                    + '</div>'
                    + '<div>'
                    + level.name
                    + '</div>'
                    + '</div>');
                thumbnail.data('set', campaign.id);
                thumbnail.data('level', j);
                tnHTML.append(thumbnail);
            }
        }
        $('.thumbnail, .customLevel').click(FiercePlanet.LevelGallery.changePresetLevelDirectly);
    };


    /**
     * Changes the preset level
     */
    this.changePresetLevel = function() {
        var level = $('#levelInput').val();
        Lifecycle.currentLevelNumber = FiercePlanet.Utils.checkInteger(level);
        Lifecycle.currentLevelPreset = true;
        // Remember this level, along with other data
        FiercePlanet.ProfileUI.storeProfileData();
    };

    /**
     * Changes the preset level
     */
    this.changePresetLevelDirectly = function() {
        //    $('.thumbnail').css({color: 'inherit', backgroundColor: 'inherit' });
        //    $(this).animate({
        //        color: "#000",
        //        backgroundColor: "#ffffaa"
        //      }, 500 );
        var tnID = $(this).attr('id');
        var set = $(this).data('set');
        var level = $(this).data('level');
        var thumbnailID = 'tn-' + set + '-' + level;
        FiercePlanet.LevelGallery.highlightGalleryItem(tnID, level);
        Lifecycle.currentLevelSetID = set;
        Lifecycle.currentLevelNumber = FiercePlanet.Utils.checkInteger(level);
        Lifecycle.currentLevelPreset = true;
        // Remember this level, along with other data
        FiercePlanet.ProfileUI.storeProfileData();
    };

    /**
     * Changes the preset level
     */
    this.changeLevelDirectly = function() {
        var level = $(this).attr('id');
        level = level.substring(11);
        FiercePlanet.LevelUI.openLevelFromServer(level);
    };


    /**
     * Changes the preset level
     */
    this.highlightGalleryItem = function(tnID, level) {
        $('.thumbnail').css({color:'inherit', backgroundColor:'inherit' });
        if (level && level >= 0 && level <= 1000) {
            $('#' + tnID).animate({
                color:"#000",
                backgroundColor:"#ffffaa"
            }, 500);
        }
    };


    /**
     * Changes the difficulty
     */
    this.changeDifficulty = function() {
        var difficulty = $("input[@name=difficultyInput]:checked").val();
        FiercePlanet.Game.levelOfDifficulty = FiercePlanet.Utils.checkInteger(difficulty);
    };

}).apply(FiercePlanet.LevelGallery);
