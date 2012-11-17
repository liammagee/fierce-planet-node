/*!
 * Fierce Planet - Event
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */

var FiercePlanet = FiercePlanet || {};

/**
 * Possible events:
 *  - Lifecycle events
 *  - Agent events (create, change, destroy)
 *  - Resource events (create, change, destroy)
 *
 *  Event listeners:
 *  - Logging
 *  - Recording
 *  - Notifying
 *
 *  Event structure:
 *  - Source (game, world, agent, resource)
 *  - Event (new, complete, change)
 *  - Data
 *  - Time (gameCounter)
 *  - Context (currentWorld)
 *
 * @constructor
 * @param type
 * @param source
 * @param event
 * @param time
 * @param worldContext
 * @param data
 */
function Event(type, source, event, time, worldContext, data){
    this.type = type;
    this.source = source;
    this.event = event;
    this.time = time;
    this.worldContext = worldContext;
    this.data = data;
}


//Copyright (c) 2010 Nicholas C. Zakas. All rights reserved.
//MIT License
/**
 * @constructor
 */
function EventTarget(){
    this.listeners = {};
}

EventTarget.prototype = {

    constructor: EventTarget,

    addListener: function(type, listener){
        if (_.isUndefined(this.listeners[type])) {
            this.listeners[type] = [];
        }

        this.listeners[type].push(listener);
    },

    fire: function(event){
        if (typeof event == "string"){
            event = { type: event };
        }
        if (!event.target){
            event.target = this;
        }

        if (!event.type){  //falsy
            throw new Error("Event object missing 'type' property.");
        }

        if (this.listeners[event.type] instanceof Array){
            var listeners = this.listeners[event.type];
            for (var i=0, len=listeners.length; i < len; i++){
                listeners[i].call(this, event);
            }
        }
    },

    removeListener: function(type, listener){
        if (this.listeners[type] instanceof Array){
            var listeners = this.listeners[type];
            for (var i=0, len=listeners.length; i < len; i++){
                if (listeners[i] === listener){
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    }
};




/**
 * @namespace Contains event functions
 */
FiercePlanet.Event = FiercePlanet.Event || {};

(function() {

    /**
     * Hooks up custom events
     */
    this.hookUpCustomEventListeners = function() {

        // Add logging event listeners
        FiercePlanet.Game.eventTarget.addListener("game", function(e) {
            if (_.isUndefined(console))
               console.log("Game event " + e.event + " logged at:" + e.time);
        });

        // Add notice event listeners
    //    FiercePlanet.eventTarget.addListener("game", function(e) {
    //        if (e._event == "newWave" && e._time == 0) {
    //            FiercePlanet.Game.currentNotice = e._worldContext.getTip();
    //        }
    //    });

        // Add resource listener
        FiercePlanet.Game.eventTarget.addListener("resource", function(e) {
            var resource = e.source;
            var world = e.worldContext;
            if (world.id == 1) {
                var resourceCategory = resource.category;
                var resourceCategoryName = resourceCategory.name;
                var resourceCategoryColor = resourceCategory.color;
                var resourceCategoryCode = resourceCategory.code;
                var categoryCount = Lifecycle.currentWorld.resourceCategoryCounts[resourceCategoryCode];
                if (categoryCount == 1) {
                    Log.info("Well done! You've added your first " + resourceCategoryName + " resource!");
                    /*
                    FiercePlanet.Game.currentNotice = new Notice("Well done! You've added your first " + resourceCategoryName + " resource!");
                    FiercePlanet.Game.currentNotice.height = 80;
                    FiercePlanet.Game.currentNotice.foregroundColor = 'rgba(0, 0, 0)';
                    FiercePlanet.Game.currentNotice.backgroundColor = resourceCategoryColor;
                    */
                }
            }
        });

    };

}).apply(FiercePlanet.Event);


