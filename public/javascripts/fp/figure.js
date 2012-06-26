
//$LAB.script('http://maps.googleapis.com/maps/api/js?sensor=true').wait()


$LAB
    .setOptions({BasePath:'/javascripts/'})


    // Load JQuery
   .script('jquery/jquery-1.7.1.min.js')

    // Load JQuery UI & Plug-ins
    .script([
        'jquery-ui-1.8.16.custom/js/jquery-ui-1.8.16.custom.min.js'
        , 'jquery.mousewheel.3.0.2/jquery.mousewheel.js'
        , 'jquery/jquery-animate-css-rotate-scale.js'
        , 'jquery/jquery.zoom.js'
    ])

    // Load other libraries
    .script([
        'underscore/underscore-min.js'
        , 'one-color/one-color-all.js'
        , 'spin.js/spin.min.js'
        , 'sylvester/sylvester.js'
        , 'flot-0.7/flot/jquery.flot.min.js'
        , 'jstat-2.0/jstat.js'
        , 'jpicker-1.1.6/jpicker-1.1.6.js'
        , 'jq-console/jqconsole-2.7.min.js'
        , 'CodeMirror-2.2/lib/codemirror.js'
        , 'CodeMirror-2.2/mode/javascript/javascript.js'
    ])

        // Load FiercePlanet other plugins
   .script([
        'fp/core/universe.js'
    , 'fp/core/catastrophe.js'
       , 'fp/core/agent/agent.js' , 'fp/core/agent/culture.js' , 'fp/core/agent/beliefs.js' , 'fp/core/agent/desires.js' , 'fp/core/agent/capabilities.js' , 'fp/core/agent/characteristics.js' , 'fp/core/agent/plans.js'
    , 'fp/core/campaign.js', 'fp/core/cell.js', 'fp/core/world.js', 'fp/core/wave.js', 'fp/core/resource.js', 'fp/core/species.js', 'fp/core/terrain.js', 'fp/core/tile.js'
    , 'fp/core/module-manager.js' , 'fp/core/module.js', 'fp/core/lifecycle.js', 'fp/core/statistics.js'

       , 'fp/profile/profile.js', 'fp/profile/profile_class.js', 'fp/event/event.js'
    , 'fp/graphics/drawing.js', 'fp/graphics/orientation.js', 'fp/graphics/isometric.js', 'fp/graphics/fullscreen.js', 'fp/graphics/stick-figure.js'

       , 'fp/ui/dialogs/dialogs.js'
       , 'fp/ui/controls.js'
       , 'fp/ui/keyboard.js'
       , 'fp/ui/mouse.js'
       , 'fp/ui/editor.js'
       , 'fp/ui/general-ui.js'
        , 'fp/ui/world-gallery.js'
       , 'fp/ui/world-ui.js'
       , 'fp/ui/notice.js'
       , 'fp/ui/profile-ui.js'
       , 'fp/ui/resource-ui.js'
       , 'fp/ui/graph.js'
       , 'fp/ui/slider.js'
       , 'fp/ui/module-editor.js'
       , 'fp/ui/parameters.js'
       , 'fp/ui/console.js'
       , 'fp/ui/storyboard.js'
    , 'fp/ui/google-map.js'

       , 'fp/utils/fp-utils.js', 'fp/utils/log.js', 'fp/utils/recording.js', 'fp/utils/url-params.js'
       , 'fp/game.js'
   ])
//    .wait(function() {
//    })

    .script([
    , 'fp/core/agent/defaults/default_cultures.js'

    ])
    .script([
        'fp/modules/default/default-module.js'
        , 'fp/modules/default/worlds/basic.js'
        , 'fp/modules/default/worlds/additional.js'
        , 'fp/modules/default/resources/tbl.js'
        , 'fp/modules/default/resources/cos.js'
       , 'fp/modules/default/resources/resource_types.js'

    ])
    .wait(function() {
        var frame = 0
            , maxFrames = 3;
        var direction = 0;
        var canvasName = '#resourceCanvas';
        var defaultY = 25;
        var running = false;
        drawFigure = function() {
            var y = defaultY;
            var action = $('input:radio[name=action]:checked').val();
            var reverse = $('input:checkbox[name=reverse]:checked').val();
            var exaggerated = $('input:checkbox[name=exaggerated]:checked').val();
            direction = (reverse == 'on' ? 1 : 0);
            if (action == 'run') {
                switch (frame) {
                    case 0:
                        y = y - 5;
                        break;
                    case 1:
                        y = y - 10;
                        break;
                    case 2:
                        y = y - 5;
                        break;
                    case 3:
                        break;
                }
            }
            var sf = new FiercePlanet.StickFigure(150, y, 100, 100, exaggerated);
            sf.defaultAction = eval('sf. ' + action);
            sf.defaultAction(frame, direction);
            var canvas = $(canvasName)[0];
            var ctx = canvas.getContext('2d');
            FiercePlanet.Drawing.clearCanvas(canvasName);
            sf.drawFigure(ctx);
            ctx.lineWidth = 2;
            ctx.lineCap = "round";
            ctx.strokeStyle = '#000';
            ctx.stroke();
//        ctx.fillStyle = '#000';
//        ctx.fill();

            ctx.strokeRect(150, y, 100, 100);

            $('#display').html(frame);
            frame = (frame == maxFrames ? 0 : frame + 1)
        }
        $('#step').click(drawFigure);
        $('#play').click(function() {
                if (running) {
                    clearInterval(Lifecycle.agentTimerId);
                    running = false;
                }
                else {
                    Lifecycle.agentTimerId = setInterval(drawFigure, 200);
                    running = true;
                }
            }
        );

    })

