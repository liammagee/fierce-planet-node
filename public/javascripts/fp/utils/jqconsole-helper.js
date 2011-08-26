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
      jqconsole.Write("Type help:\n");
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
          else if (command == 'zone') {
              showCurrentZone();
          }
          else {
              jqconsole.Write('Oops! Not sure what ');
              jqconsole.Write(command, 'quote');
              jqconsole.Write(' means.\n');
              showHelp();
          }
      }
    }

    jqconsole.Prompt(true, handler, function(command) {
      // Continue line if can't compile the command.
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
    });
  };

  var fpHandler = function(command) {
      if (command == 'settings' || command == 's') {
          for (var member in World.settings) {
              if (World.settings.hasOwnProperty(member)) {
                  jqconsole.Write(member + ': ' + World.settings[member] + '\n');
              }
          }
          jqconsole.Write('To something, type "set [value]" \n');
      }
      else if (command == 'debug' || command == 'd') {
          showHelp();
      }
      else if (command == 'show settings') {
          FiercePlanet.Dialogs.showSettings();
      }
      else if (command == 'help') {
          showHelp();
      }
      else {
          socket.emit('user message', command);
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

  // Initiate the first prompt.
  handler();
});


