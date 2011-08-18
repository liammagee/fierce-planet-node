/*
 * Fierce Planet - Chat utilities
 * Various utility methods
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */



    function message(obj){
      var el = document.createElement('p');
      el.innerHTML = '<b>' + esc(obj[0]) + ':</b> ' + esc(obj[1]);
      document.getElementById('chat').appendChild(el);
    }

    function receiveEvent(obj){
        var eventType = obj[0];
        console.log(eventType);
        if (eventType == 'level') {
            var levelNumber = obj[1];
            if (World.settings.spectate) {
                FiercePlanet.currentLevelNumber = levelNumber;
                FiercePlanet.currentLevelPreset = true;
                FiercePlanet.newLevel();
//                FiercePlanet.startLevel();
            }
            FiercePlanet.Drawing.drawMirrorGame();
            $('#alt_gameworld').show();
        }
        else if (eventType == 'start') {
            if (World.settings.spectate) {
                FiercePlanet.Dialogs.newLevelDialog.dialog('close');
//                FiercePlanet.startLevel();
            }
        }
        else if (eventType == 'play') {
            if (World.settings.spectate) {
//                FiercePlanet.pauseGame();
            }
        }
        else if (eventType == 'pause') {
            if (World.settings.spectate) {
                FiercePlanet.pauseGame();
            }
        }
        else if (eventType == 'resources') {
//            if (World.settings.spectate) {
                var resources = obj[1];
                for (var i in resources) {
                    FiercePlanet.Utils.makeFromJSONObject(resources[i], Resource.prototype);
                }
//                FiercePlanet.currentLevel.addResource(resource);
                FiercePlanet.Drawing.drawResources('alt_resourceCanvas', resources);
//            }
        }
        else if (eventType == 'agents') {
//            if (World.settings.spectate) {
                var agents = obj[1];
//                for (var i in agents) {
//                    Level.makeLevelFromJSONObject(agents[i], Agent.prototype);
//                }
                // Co-op mode
//                FiercePlanet.currentLevel.setCurrentAgents(agents);
//                FiercePlanet.Drawing.clearCanvas('#agentCanvas');
//                FiercePlanet.Drawing.drawAgents();
                FiercePlanet.Drawing.clearCanvas('#alt_agentCanvas');
                FiercePlanet.Drawing.drawAgents('#alt_agentCanvas', agents);
                if (World.settings.spectate) {
                    FiercePlanet.processAgents();
                    FiercePlanet._stopAgents();
//                FiercePlanet.drawCanvases();
                }
//            }
        }
    }

    function notifyEvent(eventType, obj){
        socket.emit('event', [eventType, obj]);
    }

    function send(){
      var nickname = document.getElementById('nickname').value;
      var val = document.getElementById('messageText').value;
      socket.emit('message', [nickname, val]);
      document.getElementById('messageText').value = '';
      message([nickname, val])
    }

    function esc(msg){
      return msg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };

    var socket = io.connect();
    socket.on('message', function (data) {
      message(data);
    });
    socket.on('event', function (data) {
      receiveEvent(data);
    });



//  CUT  ///////////////////////////////////////////////////////////////////
/* This license and copyright apply to all code until the next "CUT"
http://github.com/jherdman/javascript-relative-time-helpers/

The MIT License

Copyright (c) 2009 James F. Herdman

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


 * Returns a description of this past date in relative terms.
 * Takes an optional parameter (default: 0) setting the threshold in ms which
 * is considered "Just now".
 *
 * Examples, where new Date().toString() == "Mon Nov 23 2009 17:36:51 GMT-0500 (EST)":
 *
 * new Date().toRelativeTime()
 * --> 'Just now'
 *
 * new Date("Nov 21, 2009").toRelativeTime()
 * --> '2 days ago'
 *
 * // One second ago
 * new Date("Nov 23 2009 17:36:50 GMT-0500 (EST)").toRelativeTime()
 * --> '1 second ago'
 *
 * // One second ago, now setting a now_threshold to 5 seconds
 * new Date("Nov 23 2009 17:36:50 GMT-0500 (EST)").toRelativeTime(5000)
 * --> 'Just now'
 *
 */
Date.prototype.toRelativeTime = function(now_threshold) {
  var delta = new Date() - this;

  now_threshold = parseInt(now_threshold, 10);

  if (isNaN(now_threshold)) {
    now_threshold = 0;
  }

  if (delta <= now_threshold) {
    return 'Just now';
  }

  var units = null;
  var conversions = {
    millisecond: 1, // ms    -> ms
    second: 1000,   // ms    -> sec
    minute: 60,     // sec   -> min
    hour:   60,     // min   -> hour
    day:    24,     // hour  -> day
    month:  30,     // day   -> month (roughly)
    year:   12      // month -> year
  };

  for (var key in conversions) {
    if (delta < conversions[key]) {
      break;
    } else {
      units = key; // keeps track of the selected key over the iteration
      delta = delta / conversions[key];
    }
  }

  // pluralize a unit when the difference is greater than 1.
  delta = Math.floor(delta);
  if (delta !== 1) { units += "s"; }
  return [delta, units].join(" ");
};

/*
 * Wraps up a common pattern used with this plugin whereby you take a String
 * representation of a Date, and want back a date object.
 */
Date.fromString = function(str) {
  return new Date(Date.parse(str));
};

//  CUT  ///////////////////////////////////////////////////////////////////
