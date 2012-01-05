
$LAB
    .setOptions({BasePath:'/javascripts/'})


    // Load JQuery
   .script("jquery/jquery.min.js")
    .wait()

    // Load JQuery UI
    .script(['jquery-jquery-ui-fe1b0dc/ui/jquery.ui.core.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.ui.widget.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.ui.mouse.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.ui.accordion.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.ui.autocomplete.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.ui.button.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.ui.datepicker.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.ui.dialog.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.ui.draggable.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.ui.droppable.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.ui.position.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.ui.progressbar.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.ui.resizable.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.ui.selectable.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.ui.slider.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.ui.sortable.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.ui.tabs.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.effects.core.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.effects.blind.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.effects.bounce.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.effects.clip.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.effects.drop.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.effects.explode.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.effects.fold.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.effects.highlight.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.effects.pulsate.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.effects.scale.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.effects.shake.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.effects.slide.js'
    , 'jquery-jquery-ui-fe1b0dc/ui/jquery.effects.transfer.js'])

    // Load JQuery Plug-ins
   .script("jquery.mousewheel.3.0.2/jquery.mousewheel.js")
   .script("jquery-animate-css-rotate-scale.js")
   .script("jquery/jquery.zoom.js")

    // Load other plugins
   .script("spin.js/spin.min.js")
   .script("sylvester/sylvester.js")
   .script("flot-0.7/flot/jquery.flot.min.js")
   //.script("jstat-1.0.0/js/jstat-0.1.0.min.js")
   .script("jstat-1.0.0/js/jstat.js")
   .script("jpicker-1.1.6/jpicker-1.1.6.js")
   .script("jq-console/demo/jqconsole-min.js")
   // .script("/socket.io/socket.io.js")
   .script("CodeMirror-2.2/lib/codemirror.js")
   .script("CodeMirror-2.2/mode/javascript/javascript.js")
    .wait()

        // Load FiercePlanet other plugins
   .script([
        'fp/core/world.js', 'fp/core/catastrophe.js'
       , 'fp/core/agent/agent.js' , 'fp/core/agent/culture.js' , 'fp/core/agent/beliefs.js' , 'fp/core/agent/desires.js' , 'fp/core/agent/capabilities.js' , 'fp/core/agent/characteristics.js' , 'fp/core/agent/plans.js'

       , 'fp/core/campaign.js'
       , 'fp/core/level.js'
       , 'fp/core/wave.js'
       , 'fp/core/resource.js'
       , 'fp/core/species.js'
       , 'fp/core/terrain.js'
       , 'fp/core/tile.js'
//       , 'fp/core/maze-strategies.js'
    , 'fp/core/module-manager.js'
    , 'fp/core/module.js'
    , 'fp/core/lifecycle.js'
    , 'fp/core/statistics.js'

       , 'fp/profile/profile.js'
       , 'fp/profile/profile_class.js'

       , 'fp/event/event.js'


    , 'fp/graphics/drawing.js'
    , 'fp/graphics/orientation.js'
    , 'fp/graphics/isometric.js'
    , 'fp/graphics/fullscreen.js'
    , 'fp/graphics/stick-figure.js'


       , 'fp/ui/dialogs.js'
       , 'fp/ui/controls.js'
       , 'fp/ui/keyboard.js'
       , 'fp/ui/mouse.js'
       , 'fp/ui/editor.js'
       , 'fp/ui/general-ui.js'
        , 'fp/ui/level-gallery.js'
       , 'fp/ui/level-ui.js'
       , 'fp/ui/notice.js'
       , 'fp/ui/profile-ui.js'
       , 'fp/ui/resource-ui.js'
       , 'fp/ui/graph.js'
       , 'fp/ui/module-editor.js'
       , 'fp/ui/parameters.js'
       , 'fp/ui/console.js'
       , 'fp/ui/storyboard.js'
    , 'fp/ui/google-map.js'

       , 'fp/utils/fp-utils.js'
       // , 'fp/utils/comms.js'
       , 'fp/utils/log.js'
    , 'fp/utils/recording.js'
    , 'fp/utils/url-params.js'

       , 'fp/game.js'
   ])
    .wait()
    .script([
        'fp/modules/default/default-module.js'
        , 'fp/modules/default/levels/basic.js'
        , 'fp/modules/default/levels/additional.js'
        , 'fp/modules/default/resources/tbl.js'
        , 'fp/modules/default/resources/cos.js'
       , 'fp/modules/default/resources/resource_types.js'
       , 'fp/modules/default/agents/agent_types.js'
    ])
    .wait()
    .script([
    , 'fp/modules/pp/predator-prey-module.js' , 'fp/modules/pp/levels/pp-levels.js' , 'fp/modules/pp/agents/pp-agent-types.js'
])
    .script([
    , 'fp/modules/gol/game-of-life-module.js'
    , 'fp/modules/wolfram/wolfram-module.js'
//    , 'fp/modules/gol/levels/gol-levels.js'
//    , 'fp/modules/gol/agents/gol-agent-types.js'
])
    .wait(function() {
        var m = urlParams.module;
        if (typeof(m) != 'undefined') {
            if (m == 'pp') {
                PredatorPreyModule.init();
            }
            else if (m == 'gol') {
//                $('#moduleEditor').show();
                GameOfLifeModule.init();
            }
            else if (m == 'wolfram') {
//                $('#moduleEditor').show();
                WolframModule.init();
            }
            else if (m == 'rpg') {
//                $('#moduleEditor').show();
                GameOfLifeModule.init();
            }
            else if (m == 'default') {
                DefaultModule.init();
            }
        }
        else {
            DefaultModule.init();
        }
        FiercePlanet.Game.loadGame();
    })
    .script("paperjs-0.22/lib/paper.js")
    .wait(function() {
//        window.onload = function() {
//            var canvas = document.getElementById('scrollingCanvas');
//            // the global paper variable now points to this new PaperScope.
////			with (new paper.PaperScope(canvas)) {
//            // Make the paper scope objects global:
//            paper.install(window);
//            // Create a project and a view for the canvas for us:
//            paper.setup(canvas);
//
//            var layer = project.activeLayer;
//
//            var values = {
//                count: 34,
//                points: 32
//            };
//
//            for (var i = 0; i < values.count; i++) {
////                var offset = new Point(20 + 10 * i, 0);
////                var path = new Path();
//                //path.fillColor = i % 2 ? 'red' : 'black';
////                path.closed = true;
//
//                var path = new Path.Circle(new Point(0, 0), 5);
//                path.style = {
//                    fillColor: 'white',
//                    strokeColor: 'black'
//                };
//
//                var symbol = new Symbol(path);
//
//                // Place the instances of the symbol:
//                for (var i = 0; i < count; i++) {
//                    // The center position is a random point in the view:
//                    var center = Point.random() * view.size;
//                    var placed = symbol.place(center);
//                    placed.scale(i / count + 0.01);
//                    placed.data = {};
//                    placed.data.vector = new Point({
//                        angle: Math.random() * 360,
//                        length : (i / count) * Math.random() / 5
//                    });
//                }
//
//                /*
//                var l = offset.length;
//                for (var j = 0; j < values.points * 2; j++) {
//                    offset.angle += 360 / values.points;
//                    var vector = offset.normalize(l * (j % 2 ? 0.1 : -0.1));
//                    path.add(offset.add(vector));
//                }
//                */
//                path.smooth();
//                var placedSymbol = new PlacedSymbol(path);
//                layer.insertChild(0, placedSymbol);
//            }
//            layer.position = view.center;
//
//            view.onFrame = function(event) {
//                for (var i = 0, l = layer.children.length; i < l; i++) {
//                    var item = layer.children[i];
//                    var angle = (values.count - i) * Math.sin(event.count / 128) / 10;
//                    item.rotate(angle);
////                    moveStars();
//                }
//            };
//
//            // Reposition the paths whenever the window is resized:
//            view.onResize = function(event) {
//                layer.position = view.center;
//            };
//
//            var moveStars = new function() {
//                // The amount of symbol we want to place;
//                var count = 50;
//
//                // Create a symbol, which we will use to place instances of later:
//                var path = new Path.Circle(new Point(0, 0), 5);
//                path.style = {
//                    fillColor: 'white',
//                    strokeColor: 'black'
//                };
//
//                var symbol = new Symbol(path);
//
//                // Place the instances of the symbol:
//                for (var i = 0; i < count; i++) {
//                    // The center position is a random point in the view:
//                    var center = Point.random() * view.size;
//                    var placed = symbol.place(center);
//                    placed.scale(i / count + 0.01);
//                    placed.data = {};
//                    placed.data.vector = new Point({
//                        angle: Math.random() * 360,
//                        length : (i / count) * Math.random() / 5
//                    });
//                }
//
//                var vector = new Point({
//                    angle: 45,
//                    length: 0
//                });
//
//                function keepInView(item) {
//                    var position = item.position;
//                    var viewBounds = view.bounds;
//                    if (position.isInside(viewBounds))
//                        return;
//                    var itemBounds = item.bounds;
//                    if (position.x > viewBounds.width + 5) {
//                        position.x = -item.bounds.width;
//                    }
//
//                    if (position.x < -itemBounds.width - 5) {
//                        position.x = viewBounds.width;
//                    }
//
//                    if (position.y > viewBounds.height + 5) {
//                        position.y = -itemBounds.height;
//                    }
//
//                    if (position.y < -itemBounds.height - 5) {
//                        position.y = viewBounds.height
//                    }
//                }
//
//                return function(vector) {
//                    // Run through the active layer's children list and change
//                    // the position of the placed symbols:
//                    var layer = project.activeLayer;
//                    for (var i = 0; i < count; i++) {
//                        var item = layer.children[i];
//                        var size = item.bounds.size;
//                        var length = vector.length / 10 * size.width / 10;
//                        item.position += vector.normalize(length) + item.data.vector;
//                        keepInView(item);
//                    }
//                };
//            };
//
////			}
//        }
    })



// For RequireJS
/*
require([
    'fp/core/world.js'
    , 'fp/core/agent.js'
    , 'fp/core/catastrophe.js'
    , 'fp/core/culture.js'
    , 'fp/core/level.js'
    , 'fp/core/resource.js'
    , 'fp/core/species.js'
    , 'fp/core/terrain.js'
    , 'fp/core/tile.js'

    , 'fp/models/profile.js'
    , 'fp/models/profile_class.js'
    , 'fp/models/notice.js'
    , 'fp/models/event.js'

    , 'fp/data/resource_types.js'
    , 'fp/data/resourceset/tbl.js'
    , 'fp/data/resourceset/cos.js'
    , 'fp/data/player_classes.js'
    , 'fp/data/agent_types.js'

    , 'fp/db/fp-db.js'

    , 'fp/dev.js'

    , 'fp/data/levels.js'

    , 'fp/ui/dialogs.js'
    , 'fp/ui/drawing.js'
    , 'fp/ui/editor.js'
    , 'fp/ui/general-ui.js'
    , 'fp/ui/level-ui.js'
    , 'fp/ui/orientation.js'
    , 'fp/ui/profile-ui.js'
    , 'fp/ui/resource-ui.js'
    , 'fp/ui/google-map.js'
    , 'fp/ui/isometric.js'

    , 'fp/lifecycle.js'
    , 'fp/params.js'
    , 'fp/recording.js'
    , 'fp/utils/utils.js'
    , 'fp/utils/comms.js'
    , 'fp/utils/log.js'
    , 'fp/game.js'

], function() {
    //This function is called when all the scripts are loaded
        $('.thumbnail, .customLevel').click(FiercePlanet.GeneralUI.changePresetLevelDirectly);
        FiercePlanet.GeneralUI.highlightGalleryItem(Lifecycle.currentLevelNumber);
        $('#difficulty-input-' + FiercePlanet.levelOfDifficulty).attr('checked', 'checked');
        $(".difficultyInput").click(FiercePlanet.GeneralUI.changeDifficulty);


        Lifecycle.loadGame();

        FiercePlanet.Utils.bindVariables();


          // Remove text selection - TODO: needs to be more granular
          // document.onselectstart = function() {return false;} // ie
          // document.onmousedown = function() {return false;} // mozilla

          // Default to 3d
          World.settings.skewTiles = true;
          $('#3d')[0].innerHTML = 'View 2D';
          FiercePlanet.Drawing.drawGame();
          FiercePlanet.LevelUI.makeLevelFromJSON(!{JSON.stringify(serverLevel)});

});
*/