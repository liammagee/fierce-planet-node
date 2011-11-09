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
    Module.prototype._levelSets = {};
    Module.prototype._resourceSets = {};
    Module.prototype._agentSets = {};

    /**
     * Registers a module
     */
    Module.prototype.register = function() {
        FiercePlanet.ModuleManager.registerModule(this);
    };


    // Level sets

    /**
     * Registers a module
     */
    Module.prototype.registerLevelSet = function(levelSet) {
        this._levelSets = this._levelSets || {};

        if (typeof(levelSet) != "undefined" && levelSet.id)
            this._levelSets[levelSet.id] = levelSet;

    };

    /**
     * Retrieves  a level set
     */
    Module.prototype.getLevelSet = function(levelSetID) {
        return this._levelSets[levelSetID];
    };

    /**
     * Retrieves  a level set
     */
    Module.prototype.allLevelSets = function() {
        var levelSetArray = [];
        for (var i in this._levelSets) {
            if (this._levelSets.hasOwnProperty(i)) {
                levelSetArray.push(this._levelSets[i]);
            }
        }
        // Sort in reverse
        return levelSetArray.sort(function(a, b) {
            if (! a.position || ! b.position)
                return 0;
            return ((a.position > b.position) ? -1 : ((a.position < b.position) ? 1 : 0))
        });
    };


    /**
     * Retrieves  a module
     */
    Module.prototype.getLevel = function(levelSetID, level) {
        return this.getLevelSet(levelSetID).levels[level]
    };



    // Resource sets

    /**
     * Registers a module
     */
    Module.prototype.registerResourceSet = function(resourceSet) {
        this._resourceSets = this._resourceSets || {};

        if (typeof(resourceSet) != "undefined" && resourceSet.id) {
//            if (resourceSet.doSetup)
//                resourceSet.doSetup();

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
        return this._resourceSets;
    };


    // Agent sets

    /**
     * Registers a agent set
     */
    Module.prototype.registerAgentSet = function(agentSet) {
        this._agentSets = this._agentSets || {};

        if (typeof(agentSet) != "undefined" && agentSet.id)
            this._agentSets[agentSet.id] = agentSet;

    };

    /**
     * Retrieves  a agent set
     */
    Module.prototype.getAgentSet = function(agentSetID) {
        return this._agentSets[agentSetID];
    };

    /**
     * Retrieves  a agent set
     */
    Module.prototype.allAgentSets = function() {
        return this._agentSets;
    };


