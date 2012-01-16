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
function Module() {};


    Module.prototype.id;
    Module.prototype._campaigns = {};
    Module.prototype._resourceSets = {};
    Module.prototype._cultures = [];

    /**
     * Registers a module
     */
    Module.prototype.register = function() {
        ModuleManager.registerModule(this);
    };


    // World sets

    /**
     * Registers a module
     */
    Module.prototype.registerCampaign = function(campaign) {
        this._campaigns = this._campaigns || {};

        if (typeof(campaign) != "undefined" && campaign.id)
            this._campaigns[campaign.id] = campaign;

    };

    /**
     * Retrieves  a world set
     */
    Module.prototype.getCampaign = function(campaignID) {
        return this._campaigns[campaignID];
    };

    /**
     * Retrieves  a world set
     */
    Module.prototype.allCampaigns = function() {
        var campaignArray = [];
        for (var i in this._campaigns) {
            if (this._campaigns.hasOwnProperty(i)) {
                campaignArray.push(this._campaigns[i]);
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
    Module.prototype.getWorld = function(campaignID, world) {
        return this.getCampaign(campaignID).worlds[world]
    };



    // Resource sets

    /**
     * Registers a module
     */
    Module.prototype.registerResourceSet = function(resourceSet) {
        this._resourceSets = this._resourceSets || {};

        if (typeof(resourceSet) != "undefined" && resourceSet.id) {
            if (resourceSet.doSetup)
                resourceSet.doSetup();

            this._resourceSets[resourceSet.id] = resourceSet;
        }

    };

    /**
     * Retrieves  a resource set
     */
    Module.prototype.getResourceSet = function(resourceSetID) {
        return this._resourceSets[resourceSetID];
    };

    /**
     * Retrieves  a resource set
     */
    Module.prototype.allResourceSets = function() {
        var resourceSets = [];
        for (var i in this._resourceSets) {
            if (this._resourceSets.hasOwnProperty(i)) {
                resourceSets.push(this._resourceSets[i]);
            }
        }
        return resourceSets;
    };


    // Agent sets

    /**
     * Registers a agent set
     */
    Module.prototype.registerCulture = function(culture) {
        this._cultures = this._cultures || [];
        this._cultures.push(culture);

//        if (typeof(agentSet) != "undefined" && agentSet.id)
//            this._agentSets[agentSet.id] = agentSet;

    };

    /**
     * Retrieves  a agent set
     */
    Module.prototype.getAgentSet = function(cultureID) {
        return this._cultures[cultureID];
    };

    /**
     * Retrieves  a agent set
     */
    Module.prototype.allCultures = function() {
        /*
        var agentTypes = [];
        for (var i in this._agentSets) {
            if (this._agentSets.hasOwnProperty(i)) {
                agentTypes.push(this._agentSets[i]);
            }
        }
        */
        return this._cultures;
    };


if (typeof exports !== "undefined")
    exports.Module = Module;

