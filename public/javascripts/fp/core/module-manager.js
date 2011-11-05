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
FiercePlanet.ModuleManager = FiercePlanet.ModuleManager || {};


(function() {

    var _modules = {};
    this.currentModule;

    /**
     * Registers a module
     */
    this.registerModule = function(module) {
        _modules = _modules || {};

        if (typeof(module) != "undefined" && module.id)
            _modules[module.id] = module;

        if (module.init)
            module.init();

        this.currentModule = module;
    };

    /**
     * Retrieves  a module
     */
    this.getModule = function(moduleID) {
        return _modules[moduleID];
    };

    /**
     * Retrieves  a module
     */
    this.allModules = function() {
        return _modules;
    };


    /**
     * Retrieves  a module
     */
    this.getModuleLevel = function(levelSetID, level) {
        return this.currentModule.getLevel(moduleID).levels[level]
    };


    /**
     * Retrieves  a module
     */
    this.setCurrentModule = function(moduleID) {
        this.currentModule = this.getModule(moduleID);
    };



}).apply(FiercePlanet.ModuleManager);