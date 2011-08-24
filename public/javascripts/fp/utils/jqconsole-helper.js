$(function() {
  // Creating the console.
  var header = 'Welcome to Fierce Planet!\n' +
               '\n' +
               'Type \'help\' to review a list of commands.\n'
      ;
  window.jqconsole = $('#console').jqconsole(header, '> ');
  //window.jqconsole = $('#notifications').jqconsole(header, 'JS> ');

  // Abort prompt on Ctrl+Z.
  jqconsole.RegisterShortcut('Z', function() {
    jqconsole.AbortPrompt();
      jqconsole.JSMode = false;
      jqconsole.Write('Leaving JS mode\n');
    handler();
  });

  jqconsole.JSMode = false;
  jqconsole.RegisterMatching('{', '}', 'brace');
  jqconsole.RegisterMatching('(', ')', 'paran');
  jqconsole.RegisterMatching('[', ']', 'bracket');
  // Handle a command.
  var handler = function(command) {
    if (command) {
      if (! jqconsole.JSMode) {
          if (command == 'help') {
              jqconsole.Write('help\n');
          }
          else if (command == 'js') {
              jqconsole.Write('Now going to JS mode\n');
              jqconsole.JSMode = true;
          }
      }
      else {
          try {
            jqconsole.Write('==> ' + window.eval(command) + '\n');
              jqconsole.prompt_label_main = 'js>';
          } catch (e) {
            jqconsole.Write('ERROR: ' + e.message + '\n');
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

  // Initiate the first prompt.
  handler();
});


