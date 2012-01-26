/*!
 * Fierce Planet - Params
 * Declares game parameters
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */



var FiercePlanet = FiercePlanet || {};




/**
 * @namespace Manages modules
 */
function Module() {

    /**
     * Registers a module
     */
    this.registerSelf = function() {
        ModuleManager.registerModule(this);
    };


// World sets

    /**
     * Registers a module
     */
    this.registerCampaign = function(campaign) {
        this.campaigns = this.campaigns || {};

        if (typeof(campaign) != "undefined" && campaign.id)
            this.campaigns[campaign.id] = campaign;

    };

    /**
     * Retrieves  a world set
     */
    this.getCampaign = function(campaignID) {
        return this.campaigns[campaignID];
    };

    /**
     * Retrieves  a world set
     */
    this.allCampaigns = function() {
        var campaignArray = [];
        for (var i in this.campaigns) {
            if (this.campaigns.hasOwnProperty(i)) {
                campaignArray.push(this.campaigns[i]);
            }
        }
        // Sort in reverse
        return campaignArray.sort(function(a, b) {
            if (! a.position || ! b.position)
                return 0;
            return ((a.position > b.position) ? -1 : ((a.position < b.position) ? 1 : 0))
        });
    };


    /**
     * Retrieves  a module
     */
    this.getWorld = function(campaignID, world) {
        return this.getCampaign(campaignID).worlds[world];
    };


    /**
     * Registers a resource set (only one is allowed per module)
     */
    this.registerResourceSet = function(resourceSet) {
        if (typeof(resourceSet) != "undefined" && resourceSet.id) {
            if (resourceSet.doSetup)
                resourceSet.doSetup();

            this.resourceSet = resourceSet;
        }
    };

    this.resolveResourceType  = function(code) {
        for (var i = 0, l = this.resourceSet.types.length; i < l; i++) {
            var resourceType = this.resourceSet.types[i];
            if (resourceType.code == code)
                return resourceType;
        }
        return undefined;

    };


    /**
     * Registers a culture
     */
    this.registerCulture = function(culture) {
        this.cultures = this.cultures || [];
        this.cultures.push(culture);
    };

    /**
     * Retrieves  a agent set
     */
    this.allCultures = function() {
        return this.cultures;
    };

    this.setHealthCategoriesForAllCultures = function() {
        if (!_.isUndefined(this.cultures) && !_.isUndefined(this.resourceSet) && !_.isUndefined(this.resourceSet.categories)) {
            for (var i = 0, l = this.cultures.length; i < l; i++) {
                this.cultures[i].healthCategories = this.resourceSet.categories;
            }

        }
    };


    this.id;
    this.campaigns = {};
    this.resourceSet;
    this.cultures = [];
};



if (typeof exports !== "undefined")
    exports.Module = Module;

