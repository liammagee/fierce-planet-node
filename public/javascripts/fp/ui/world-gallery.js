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
FiercePlanet.WorldGallery = FiercePlanet.WorldGallery || {};

(function() {

    /**
     * Initialise world gallery
     */
    this.init = function() {
        $('#difficulty-input-' + FiercePlanet.Game.levelOfDifficulty).attr('checked', 'checked');
        $(".difficultyInput").click(FiercePlanet.WorldGallery.changeDifficulty);
        var tnID = 'tn-' + Lifecycle.currentCampaignID + '-' + Lifecycle.currentWorldNumber;
        FiercePlanet.WorldGallery.highlightGalleryItem(tnID, Lifecycle.currentWorldNumber);
    };

    /**
     * Renders modules and worlds in the world gallery
     */
    this.renderCampaigns = function() {
        var campaigns = ModuleManager.currentModule.allCampaigns();
        for (var i = 0, l = campaigns.length; i < l; i++) {
            var campaign = campaigns[i];
            $('#world-gallery-tabs>ul').prepend('<li><a href="#' + campaign.id + '"> ' + campaign.name + '</a></li>');
            var modHTML = $('<div class="quests" id="' + campaign.id + '"></div>');
            var tnHTML = $('<div class="thumbnails"></div>');
            $('#world-gallery-tabs').append(modHTML);
            modHTML.append(tnHTML);
//            for (var j in campaign.worlds) {
            for (var j = 0, len = campaign.worlds.length; j < len; j ++) {
                var world = campaign.worlds[j];
                var img = (world.thumbnail ? world.thumbnail : '/images/worlds/world-thumbnail-default.png');
                var thumbnail = $('<div class="thumbnail" id="'
                    + 'tn-' + i + '-' + world.id
                    + '">'
                    + '<img src="'
                    + img
                    + '"/>'
                    + '<div><strong>World ' + world.id + ':</strong>'
                    + '</div>'
                    + '<div>'
                    + world.name
                    + '</div>'
                    + '</div>');
                thumbnail.data('set', campaign.id);
                thumbnail.data('world', j);
                tnHTML.append(thumbnail);
            }
        }
        $('.thumbnail, .customWorld').click(FiercePlanet.WorldGallery.changePresetWorldDirectly);
    };


    /**
     * Changes the preset world
     */
    this.changePresetWorld = function() {
        var world = $('#worldInput').val();
        Lifecycle.currentWorldNumber = FiercePlanet.Utils.checkInteger(world);
        Lifecycle.currentWorldPreset = true;
        // Remember this world, along with other data
        FiercePlanet.ProfileUI.storeProfileData();
    };

    /**
     * Changes the preset world
     */
    this.changePresetWorldDirectly = function() {
        //    $('.thumbnail').css({color: 'inherit', backgroundColor: 'inherit' });
        //    $(this).animate({
        //        color: "#000",
        //        backgroundColor: "#ffffaa"
        //      }, 500 );
        var tnID = $(this).attr('id');
        var set = $(this).data('set');
        var world = $(this).data('world');
        var thumbnailID = 'tn-' + set + '-' + world;
        FiercePlanet.WorldGallery.highlightGalleryItem(tnID, world);
        Lifecycle.currentCampaignID = set;
        Lifecycle.currentWorldNumber = FiercePlanet.Utils.checkInteger(world);
        Lifecycle.currentWorldPreset = true;
        // Remember this world, along with other data
        FiercePlanet.ProfileUI.storeProfileData();
    };

    /**
     * Changes the preset world
     */
    this.changeWorldDirectly = function() {
        var world = $(this).attr('id');
        world = world.substring(11);
        FiercePlanet.WorldUI.openWorldFromServer(world);
    };


    /**
     * Changes the preset world
     */
    this.highlightGalleryItem = function(tnID, world) {
        $('.thumbnail').css({color:'inherit', backgroundColor:'inherit' });
        if (world >= 0 && world <= 1000) {
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

}).apply(FiercePlanet.WorldGallery);
