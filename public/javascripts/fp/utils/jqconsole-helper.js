/*
 * Fierce Planet - Chat utilities
 * Various utility methods
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var FiercePlanet = FiercePlanet || {};

FiercePlanet.Console = FiercePlanet.Console || {};

(function() {

    /**
     * Minimises the console
     */
    this.minimise = function() {
        $('.jqconsole').height(20);
        $('#notifications').height(40);
    };

    /**
     * Maximises the console
     */
    this.maximise = function() {
        $('.jqconsole').height(180);
        $('#notifications').height(200);
    };

    this.registerEvents = function() {
        $('textarea').blur(function() {
            FiercePlanet.Console.minimise();
        });
        $('textarea').focus(function() {
            FiercePlanet.Console.maximise();
        });
    }
}).apply(FiercePlanet.Console);

$(function() {
  // Creating the console.
  var header = 'Welcome to Fierce Planet!\n' +
               '\n' +
               'Type \'help\' to review a list of commands.\n'
      ;
  window.jqconsole = $('#console').jqconsole(header, '> ');
  //window.jqconsole = $('#notifications').jqconsole(header, 'JS> ');

  jqconsole.zone = {};
  jqconsole.JSMode = false;

  // Abort prompt on Ctrl+Z.
  jqconsole.RegisterShortcut('Z', function() {
    jqconsole.AbortPrompt();
      jqconsole.prompt_label_main = '> ';
      if (jqconsole.zone.name) {
          jqconsole.Write('Bye - you\'re leaving the ');
          jqconsole.Write(jqconsole.zone.name, 'quote');
          jqconsole.Write(' zone.\n');
          jqconsole.zone = {};
      }
    handler();
  });

  // Toggle size on ~.
  jqconsole.RegisterShortcut('`', function() {
      console.log('got here');
      $('#console').css({height: 30});
      jqconsole.Reset();
    handler();
  });

  jqconsole.RegisterMatching('{', '}', 'brace');
  jqconsole.RegisterMatching('(', ')', 'paran');
  jqconsole.RegisterMatching('[', ']', 'bracket');

  // Handle a command.
  var showHelp = function() {
      jqconsole.Write("Hi! I'm here to help...\n");
      jqconsole.Write("Here's some commands that tell me what to do:\n");
      jqconsole.Write("help", 'code');
      jqconsole.Write(" - this thing right here!\n");
      jqconsole.Write("js", 'code');
      jqconsole.Write(" - enter JavaScript zone.\n");
      jqconsole.Write("chat", 'code');
      jqconsole.Write(" - enter Chat zone.\n");
      jqconsole.Write("fp", 'code');
      jqconsole.Write(" - enter 'Fierce Planet' zone.\n");
      jqconsole.Write("tutorial", 'code');
      jqconsole.Write(" - enter Tutorial zone.\n");
      jqconsole.Write("zone", 'code');
      jqconsole.Write(" - tells you what zone you're in!\n");
      //jqconsole.Write("Type help:\n");
  }

  var showConsoleTutorial = function() {
      jqconsole.Write("Let's work together!\n\n");
      jqconsole.Write("You tell me some things to do, and I try to do them.\n\n");
  }

  var showZone = function() {
      jqconsole.Write('You\'re now entering the ');
      jqconsole.Write(jqconsole.zone.name, 'quote');
      jqconsole.Write(' zone.\n');
      showEscape();
  }

  var showEscape = function() {
      jqconsole.Write('Leave the ');
      jqconsole.Write(jqconsole.zone.name, 'quote');
      jqconsole.Write(' zone by typing: ');
      jqconsole.Write('Ctrl + Z', 'quote');
      jqconsole.Write('.\n');
  }

  var showCurrentZone = function() {
      if (jqconsole.zone.name) {
          jqconsole.Write('You\'re in the ');
          jqconsole.Write(jqconsole.zone.name, 'quote');
          jqconsole.Write(' zone.\n');
      }
      else {
          jqconsole.Write('You\'re not in any zone at all!\n');
      }
  }

  var handler = function(command) {
//      jqconsole.SetPromptText('hello')
    if (command) {
      if (jqconsole.zone.js) {
          jsHandler(command);
      }
      else if (jqconsole.zone.fp) {
          fpHandler(command);
      }
      else if (jqconsole.zone.chat) {
          chatHandler(command);
      }
      else if (jqconsole.zone.duel) {
          duelHandler(command);
      }
      else if (jqconsole.zone.login) {
          loginHandler(command);
      }
      else if (jqconsole.zone.password) {
          passwordHandler(command);
      }
      else if (jqconsole.zone.agent) {
          agentHandler(command);
      }
      else {
          if (command == 'help' || command == 'h' || command == '?') {
              showHelp();
          }
          else if (command == 'js') {
              jqconsole.prompt_label_main = 'js> ';
              jqconsole.JSMode = true;
              jqconsole.zone.name = 'JavaScript';
              jqconsole.zone.js = true;
              showZone();
              jqconsole.Write('Try entering a JavaScript command, like this:\n\n');
              jqconsole.Write("alert('Hello Fierce Planet!')\n\n", 'code');
          }
          else if (command == 'fp') {
              jqconsole.prompt_label_main = 'fp> ';
              jqconsole.zone.name = 'Fierce Planet';
              jqconsole.zone.fp = true;
              showZone();
              jqconsole.Write('Now you can play with Fierce Planet settings!\n\n');
              jqconsole.Write('For example, try the following: \n\n');
          }
          else if (command == 'chat') {
              jqconsole.prompt_label_main = 'chatty> ';
              jqconsole.zone.name = 'Chat';
              jqconsole.zone.chat = true;
              showZone();
          }
          else if (command == 'tute' || command == 'tutorial') {
              jqconsole.prompt_label_main = 'tute> ';
              jqconsole.zone.name = 'Tutorial';
              jqconsole.zone.chat = true;
              showZone();
          }
          else if (command == 'agent') {
              jqconsole.prompt_label_main = 'agent> ';
              jqconsole.zone.name = 'Agent';
              jqconsole.zone.agent = true;
              showZone();
              jqconsole.Write('\nNow you can set up an agent simulation!\n');
              jqconsole.Write('Type "new" to set one up\n\n');
          }
          else if (command == 'login') {
              jqconsole.Write("Please tell me who you are.\n\n");
              jqconsole.Write("Email:\n\n");
              jqconsole.zone.name = 'Login';
              jqconsole.zone.login = true;
          }
          else if (command == 'zone') {
              showCurrentZone();
          }
          else {
              jqconsole.Write('Oops! Not sure what ');
              jqconsole.Write(command, 'quote');
              jqconsole.Write(' means.\n\n');
              showHelp();
          }
      }
    }

    jqconsole.Prompt(true, handler, function(command) {
      // Continue line if can't compile the command.
        return /\\$/.test(command);
        /*
      try {
        Function(command);
      } catch (e) {
        if (/[\[\{\(]$/.test(command)) {
          return 1;
        } else {
          return 0;
        }
      }
      return false;
        */
    });
  };

    //adjustParameters
  var fpHandler = function(command) {
      if (command == 'settings' || command == 's') {
          for (var member in World.settings) {
              if (World.settings.hasOwnProperty(member)) {
                  jqconsole.Write(member + ': ' + World.settings[member] + '\n');
              }
          }
          jqconsole.Write('To something, type "set [value]" \n');
      }
      else if (command == 'login' || command == 'li') {
          FiercePlanet.Dialogs.showLogin();
      }
      else if (command == 'logout' || command == 'lo') {
          FiercePlanet.ProfileUI.logout();
      }
      else if (command == 'play' || command == 'p') {
          FiercePlanet.Lifecycle.playGame();
      }
      else if (command == 'draw' || command == 'd') {
          FiercePlanet.Drawing.drawGame();
      }
      else if (command == 'speed-up' || command == 'su') {
          FiercePlanet.Lifecycle.speedUp();
      }
      else if (command == 'slow-down' || command == 'sd') {
          FiercePlanet.Lifecycle.slowDown();
      }
      else if (command == 'new-game' || command == 'ng') {
          FiercePlanet.Lifecycle.newGame();
      }
      else if (command == 'restart-level' || command == 'rl') {
          FiercePlanet.Lifecycle.restartLevel();
      }
      else if (command == 'show-resources' || command == 'srg') {
          FiercePlanet.Dialogs.showResourceGallery();
      }
      else if (command == 'pan-up' || command == 'pu') {
          FiercePlanet.Drawing.pan(0);
      }
      else if (command == 'pan-down' || command == 'pd') {
          FiercePlanet.Drawing.pan(1);
      }
      else if (command == 'pan-left' || command == 'pl') {
          FiercePlanet.Drawing.pan(2);
      }
      else if (command == 'pan-right' || command == 'pr') {
          FiercePlanet.Drawing.pan(3);
      }
      else if (command == 'pan-reset' || command == 'ps') {
          FiercePlanet.Drawing.pan(4);
      }
      else if (command == 'zoom-in' || command == 'zi') {
          FiercePlanet.Drawing.zoom(1);
      }
      else if (command == 'zoom-out' || command == 'zo') {
          FiercePlanet.Drawing.zoom(-1);
      }
      else if (command == 'zoom-reset' || command == 'zr') {
          FiercePlanet.Drawing.zoom(0);
      }
      else if (command == 'settings') {
          FiercePlanet.Dialogs.showSettings();
      }
      else if (command == 'credits') {
          FiercePlanet.Dialogs.showCredits();
      }
      else if (command == 'gallery' || command == 'gal') {
          FiercePlanet.Dialogs.showLevelGallery();
      }
      else if (command == 'editor' || command == 'ed') {
          FiercePlanet.LevelUI.showLevelEditor();
      }
      else if (command == 'toggle' || command == 'tog') {
          FiercePlanet.Drawing.toggle3d();
      }
      else if (command == '3d') {
          World.settings.skewTiles = true;
          $('#3d')[0].innerHTML = 'View 2D';
      }
      else if (command == '2d') {
          World.settings.skewTiles = false;
          $('#3d')[0].innerHTML = 'View 3D';
      }
      else if (command == 'tilt-up' || command == 'tu') {
          FiercePlanet.Drawing.tiltUp();
      }
      else if (command == 'tilt-down' || command == 'td') {
          FiercePlanet.Drawing.tiltDown();
      }
      else if (command == 'rotate-left' || command == 'rl') {
          FiercePlanet.Drawing.rotateLeft();
      }
      else if (command == 'rotate-right' || command == 'rr') {
          FiercePlanet.Drawing.rotateRight();
      }
      else if (command == 'reset' || command == 'r') {
          FiercePlanet.Drawing.resetView();
      }
      else if (command == 'debug' || command == 'd') {
          FiercePlanet.Game.processAgents();
      }
      else if (command == 'storyboard' || command == 'sb') {
          FiercePlanet.Dev.showStoryboard();
      }
      else if (/set/.test(command)) {
          try {
              var t = command.split('=').reverse();
              var args = t.splice(0, 1);
              var rest = t.splice(1, 2);
              var property = rest.replace(/set/, '').trim();
              if (property.length > 0 && args.length > 0) {
                  World.settings[property] = args;
                  jqconsole.Write('Set ' + property + ': ' + World.settings[property] + '\n');
              }
          }
          catch (e) {
              jqconsole.Write('Correct syntax: set [property name] [property value]\n\n');
          }
      }
      else if (/resize/.test(command)) {
          jqconsole.Write(command + '\n')
          try {
              var params = command.split(' ');
              var width = params[1];
              var height = params[2];
              jqconsole.Write(width + '\n')
              jqconsole.Write(height + '\n')
              FiercePlanet.Orientation.adjustParameters(width, height);
              FiercePlanet.Drawing.drawGame();
          }
          catch (e) {
              jqconsole.Write(e + '\n')
          }
      }
      else if (command == 'help') {
          jqconsole.Write('settings || s\n');
          jqconsole.Write('play || p\n');
          jqconsole.Write('draw || p\n');
          jqconsole.Write('login || li\n');
          jqconsole.Write('logout || lo\n');
          jqconsole.Write('speed-up || su\n');
          jqconsole.Write('slow-down || sd\n');
          jqconsole.Write('credits\n');
          jqconsole.Write('gallery\n');
          jqconsole.Write('show-resources\n');
          jqconsole.Write('pan-up || pu\n');
          jqconsole.Write('pan-down || pd\n');
          jqconsole.Write('pan-left || pl\n');
          jqconsole.Write('pan-right || pr\n');
          jqconsole.Write('pan-reset || ps\n');
          jqconsole.Write('zoom-in || zi\n');
          jqconsole.Write('zoom-out || zi\n');
          jqconsole.Write('zoom-reset || zr\n');
          jqconsole.Write('3d\n');
          jqconsole.Write('2d\n');
          jqconsole.Write('reset\n');
          jqconsole.Write('debug\n');
          jqconsole.Write('storyboard || sb\n');
          jqconsole.Write('set [parameter = value]\n');
          jqconsole.Write('resize [width, height]\n');
      }
      else {
//          socket.emit('user message', command);
      }
  }

  var chatHandler = function(command) {
      if (command == 'list') {
          showHelp();
      }
      else if (command == 'help') {
          showHelp();
      }
      else {
          jqconsole.Write('me: ' + command + '\n');
          socket.emit('user message', command);
      }
  }

  var duelHandler = function(command) {
      if (command == 'list') {
          showHelp();
      }
      else if (command == 'help') {
          showHelp();
      }
      else {
          socket.emit('user message', command);
      }
  }

  var jsHandler = function(command) {
      try {
        jqconsole.Write('==> ' + window.eval(command) + '\n');
      } catch (e) {
        jqconsole.Write('ERROR: ' + e.message + '\n', 'error');
      }
  }

    var loginHandler = function(command) {
        jqconsole.userCredentials = jqconsole.userCredentials || {};
        jqconsole.userCredentials['email'] = command;
        jqconsole.Write("Please now enter your password:\n\n");
        jqconsole.zone.login = false;
        jqconsole.zone.password = true;
    }

    var passwordHandler = function(command) {
        if (typeof(jqconsole.userCredentials) === 'undefined') {
            jqconsole.Write("Please enter your login details:\n");
        }
        else {
            jqconsole.userCredentials['password'] = command;
            // Authenticate
            $.post('/login', { email: jqconsole.userCredentials['email'], password: jqconsole.userCredentials['password'] }, function(res) {
                jqconsole.Write(res);
                jqconsole.zone.password = false;
            });
        }
    }

    var agentHandler = function(command) {
        if (jqconsole.zone.agentSetup > -1) {
            switch(jqconsole.zone.agentSetup) {
                case 1:
                    // Level width
                    FiercePlanet.currentLevel.cellsAcross = parseInt(command);
                    FiercePlanet.currentLevel.generatePath();
                    FiercePlanet.Orientation.cellsAcross = FiercePlanet.currentLevel.cellsAcross;
                    FiercePlanet.Orientation.recalibrateParameters();
                    FiercePlanet.Drawing.drawCanvases();
                    jqconsole.zone.agentSetup = 2;
                    jqconsole.Write("The level width is " + FiercePlanet.currentLevel.cellsDown + ".\n");
                    jqconsole.Write("What height would you like?\n");
                    break;
                case 2:
                    // Level height
                    FiercePlanet.currentLevel.cellsDown = parseInt(command);
                    FiercePlanet.currentLevel.generatePath();
                    FiercePlanet.Orientation.cellsDown = FiercePlanet.currentLevel.cellsDown;
                    FiercePlanet.Orientation.recalibrateParameters();
                    FiercePlanet.Drawing.drawCanvases();
                    jqconsole.zone.agentSetup = 3;
                    jqconsole.Write("The level height is " + FiercePlanet.currentLevel.cellsDown + ".\n");
                    jqconsole.Write("How many agents would you like?\n");
                    break;
                case 3:
                    // Agent number
                    FiercePlanet.currentLevel.initialAgentNumber = parseInt(command);
                    FiercePlanet.numAgents = FiercePlanet.currentLevel.initialAgentNumber;
                    FiercePlanet.currentLevel.expiryLimit = FiercePlanet.currentLevel.initialAgentNumber;
                    jqconsole.Write("You've got " + FiercePlanet.currentLevel.initialAgentNumber + " agents!\n");
                    jqconsole.Write("How many resources would you like?\n");
                    jqconsole.zone.agentSetup = 4;
                    break;
                case 4:
                    // Resource number
                    FiercePlanet.currentLevel.initialResourceNumber = parseInt(command);
                    jqconsole.Write("You've got " + FiercePlanet.currentLevel.initialResourceNumber + " resources!\n");
                    FiercePlanet.currentLevel.generateLevelResources();
                    FiercePlanet.Drawing.drawCanvases();
                    jqconsole.zone.agentSetup = -1;
                    break;
            }
        }
        else {
            if (command == 'new') {
                FiercePlanet.currentLevel = new Level(-1);
                FiercePlanet.currentLevel.randomiseAgents = true;
                FiercePlanet.currentLevel.randomiseResources = true;
                FiercePlanet.currentLevel.waveNumber = 1;
                FiercePlanet.Drawing.drawGame();
                jqconsole.Write("What width would you like?\n");
                jqconsole.zone.agentSetup = 1;
            }
            else if (command == 'start') {
                FiercePlanet.Lifecycle.newWave();
            }
            else if (command == 'help') {
                showAgentHelp();
            }
        }
    }

  // Initiate the first prompt.
  handler();
});


