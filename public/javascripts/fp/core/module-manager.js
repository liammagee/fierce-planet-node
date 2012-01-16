/*!
 * Fierce Planet - Params
 * Declares game parameters
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */

/**
 * @namespace Manages modules
 */
var ModuleManager = ModuleManager || {};


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
    this.getModuleWorld = function(worldSetID, world) {
        return this.currentModule.getWorld(moduleID).worlds[world]
    };


    /**
     * Retrieves  a module
     */
    this.setCurrentModule = function(moduleID) {
        this.currentModule = this.getModule(moduleID);
    };



}).apply(ModuleManager);


if (typeof exports !== "undefined")
    exports.ModuleManager = ModuleManager;
