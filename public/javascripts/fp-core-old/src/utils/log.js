/*!
 * Fierce Planet - A very simple Log wrapper
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var Log = (function() {


    var log = {
        FATAL: 0,
        ERROR:  1,
        WARN: 2,
        INFO:  3,
        DEBUG:  4,
        TRACE: 5,

        level: 3,

        isAt: function isAt(level) {
            return (level <= this.level);
        },

        fatal: function fatal(message) {
            this.say(message, this.FATAL);
        },

        error: function error(message) {
            this.say(message, this.ERROR);
        },

        warn: function warn(message) {
            this.say(message, this.WARN);
        },

        info: function info(message) {
            this.say(message, this.INFO);
        },

        debug: function debug(message) {
            this.say(message, this.DEBUG);
        },

        trace: function trace(message) {
            this.say(message, this.TRACE);
        },

        say: function say(message, level) {
            if (this.isAt(level)) {
                if (typeof(jqconsole) !== 'undefined') {
                    try {
                        jqconsole.Write(message + '\n', 'sys');
                    }
                    catch (err) {
                        // Fail silently
                    }
                }
                if (!_.isUndefined(console) && this.isAt(level))
                    console.log(message);
            }
        }

    };

    return log;
})();

