jQuery(document).ready(function($) {
$('#terminal').terminal(function(command, term) {
        var result = window.eval(command);
        if (result != undefined) {
            term.echo(String(result));
        }
    }, {
        greetings: 'Javascript Interpreter',
        name: 'js_demo',
        height: 200,
        prompt: 'js>'});
});
